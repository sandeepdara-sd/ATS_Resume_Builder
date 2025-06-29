// Run this script to create admin user
// Usage: node scripts/createAdmin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@resumebuilder.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email: admin@resumebuilder.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      email: 'admin@resumebuilder.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      name: 'Super Admin',
      role: 'super-admin',
      permissions: ['users', 'resumes', 'feedback', 'analytics', 'settings'],
      isActive: true
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@resumebuilder.com');
    console.log('🔑 Password: admin123');
    console.log('🔐 Role: super-admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();