import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    
    const mongoURI = process.env.MONGODB_URI;
    
    console.log('🔄 Attempting to connect to MongoDB...');
    // console.log('📍 Database URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI);

    //  {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   serverSelectionTimeoutMS: 10000, 
    //   socketTimeoutMS: 45000,
    //   maxPoolSize: 10, 
    //   heartbeatFrequencyMS: 10000, 
    // }

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔄 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    // Always continue in development mode, even without MongoDB
    console.log('⚠️ Continuing without MongoDB - some features may not work');
    console.log('⚠️ Please check your MongoDB connection string and network access');
    
    // Don't exit the process - let the server start without MongoDB
    return null;
  }
};

// Test MongoDB connection
export const testConnection = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      console.log('✅ MongoDB ping successful');
      return true;
    } else {
      console.log('⚠️ MongoDB not connected');
      return false;
    }
  } catch (error) {
    console.error('❌ MongoDB ping failed:', error);
    return false;
  }
};

export default connectDB;