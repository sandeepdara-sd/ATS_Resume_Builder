import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Admin access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (!decoded.adminId) {
      return res.status(403).json({ error: 'Invalid admin token' });
    }

    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(403).json({ error: 'Admin not found or inactive' });
    }

    req.admin = {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    };

    next();
  } catch (error) {
    console.error('❌ Admin authentication failed:', error.message);
    return res.status(403).json({ error: 'Invalid admin token' });
  }
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    if (req.admin.role === 'super-admin' || req.admin.permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({ error: `Permission '${permission}' required` });
  };
};