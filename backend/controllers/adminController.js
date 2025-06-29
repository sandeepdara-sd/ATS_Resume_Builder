import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Feedback from '../models/Feedback.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Create Initial Admin (for free tier deployment)
export const createInitialAdmin = async (req, res) => {
  try {
    const { secretKey } = req.body;
    
    // Use a secret key to prevent unauthorized admin creation
    const expectedSecret = process.env.ADMIN_CREATION_SECRET || 'create-admin-2024';
    
    if (secretKey !== expectedSecret) {
      return res.status(403).json({ error: 'Invalid secret key' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@resumebuilder.com' });
    if (existingAdmin) {
      return res.status(400).json({ 
        error: 'Admin already exists',
        message: 'Admin user already created. Use email: admin@resumebuilder.com, password: admin123'
      });
    }

    // Create admin user
    const admin = new Admin({
      email: 'admin@resumebuilder.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      name: 'Super Admin',
      role: 'super-admin',
      permissions: ['users', 'resumes', 'feedback', 'analytics', 'settings'],
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@resumebuilder.com');
    console.log('🔑 Password: admin123');

    res.status(201).json({
      message: 'Admin user created successfully',
      credentials: {
        email: 'admin@resumebuilder.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
};

// Admin Authentication
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        email: admin.email, 
        role: admin.role,
        permissions: admin.permissions 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '8h' }
    );

    console.log('✅ Admin logged in successfully:', admin.email);

    res.json({
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Dashboard Analytics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalResumes,
      totalFeedback,
      activeUsers,
      recentUsers,
      recentResumes,
      feedbackStats
    ] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Feedback.countDocuments(),
      User.countDocuments({ 
        updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('email displayName createdAt photoURL'),
      Resume.find()
        .populate('userId', 'email displayName')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title personalDetails score createdAt userId'),
      Feedback.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        }
      ])
    ]);

    // Calculate growth rates
    const lastMonthUsers = await User.countDocuments({
      createdAt: { 
        $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    });

    const thisMonthUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const userGrowthRate = lastMonthUsers > 0 
      ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1)
      : 100;

    res.json({
      stats: {
        totalUsers,
        totalResumes,
        totalFeedback,
        activeUsers,
        userGrowthRate: parseFloat(userGrowthRate)
      },
      recentActivity: {
        users: recentUsers,
        resumes: recentResumes
      },
      feedbackStats
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = search 
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { displayName: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-password')
      .lean();

    const totalUsers = await User.countDocuments(query);

    // Get resume counts for each user
    const userIds = users.map(user => user._id);
    const resumeCounts = await Resume.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);

    const resumeCountMap = resumeCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const usersWithStats = users.map(user => ({
      ...user,
      resumeCount: resumeCountMap[user._id.toString()] || 0
    }));

    res.json({
      users: usersWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page < Math.ceil(totalUsers / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [resumes, feedback] = await Promise.all([
      Resume.find({ userId }).sort({ createdAt: -1 }),
      Feedback.find({ firebaseUid: user.firebaseUid }).sort({ createdAt: -1 })
    ]);

    res.json({
      user,
      resumes,
      feedback,
      stats: {
        totalResumes: resumes.length,
        totalFeedback: feedback.length,
        avgResumeScore: resumes.length > 0 
          ? (resumes.reduce((sum, r) => sum + (r.score || 0), 0) / resumes.length).toFixed(1)
          : 0
      }
    });
  } catch (error) {
    console.error('❌ Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user's resumes and feedback
    await Promise.all([
      Resume.deleteMany({ userId }),
      Feedback.deleteMany({ firebaseUid: user.firebaseUid }),
      User.findByIdAndDelete(userId)
    ]);

    console.log('✅ User deleted successfully:', user.email);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Resume Management
export const getAllResumes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = search 
      ? {
          $or: [
            { 'personalDetails.fullName': { $regex: search, $options: 'i' } },
            { 'personalDetails.email': { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const resumes = await Resume.find(query)
      .populate('userId', 'email displayName photoURL')
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalResumes = await Resume.countDocuments(query);

    res.json({
      resumes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalResumes / limit),
        totalResumes,
        hasNext: page < Math.ceil(totalResumes / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findByIdAndDelete(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    console.log('✅ Resume deleted successfully:', resumeId);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('❌ Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};

// Feedback Management
export const getAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = type ? { type } : {};

    const feedback = await Feedback.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalFeedback = await Feedback.countDocuments(query);

    // Get user details for each feedback
    const feedbackWithUsers = await Promise.all(
      feedback.map(async (fb) => {
        const user = await User.findOne({ firebaseUid: fb.firebaseUid })
          .select('email displayName photoURL');
        return {
          ...fb.toObject(),
          user
        };
      })
    );

    res.json({
      feedback: feedbackWithUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalFeedback / limit),
        totalFeedback,
        hasNext: page < Math.ceil(totalFeedback / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Get feedback error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { resolved } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { resolved },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback status updated', feedback });
  } catch (error) {
    console.error('❌ Update feedback error:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    console.log('✅ Feedback deleted successfully:', feedbackId);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('❌ Delete feedback error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};