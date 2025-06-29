// Run this script to create admin user
// Usage: node scripts/createAdmin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Load environment variables
    const mongoURI = process.env.MONGODB_URI;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    // Validate environment variables
    if (!mongoURI || !adminEmail || !adminPassword || !adminName) {
      console.error('❌ MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_NAME is missing in .env');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      email: adminEmail,
      password: adminPassword, // Will be hashed by pre-save middleware
      name: adminName,
      role: 'super-admin',
      permissions: ['users', 'resumes', 'feedback', 'analytics', 'settings'],
      isActive: true
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('🔐 Role: super-admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
