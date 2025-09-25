import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  used: {
    type: Boolean,
    default: false,
    index: true
  },
  usedAt: {
    type: Date,
    default: null
  },
  expired: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound indexes for better query performance
passwordResetSchema.index({ token: 1, email: 1 });
passwordResetSchema.index({ email: 1, used: 1 });
passwordResetSchema.index({ userId: 1, used: 1 });
passwordResetSchema.index({ expiresAt: 1, used: 1 });

// TTL index to automatically delete expired tokens after 24 hours
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 }); // 24 hours

// Pre-save middleware to ensure consistency
passwordResetSchema.pre('save', function(next) {
  // If marked as used, ensure usedAt is set
  if (this.used && !this.usedAt) {
    this.usedAt = new Date();
  }
  
  // If past expiry time, mark as expired
  if (this.expiresAt <= new Date()) {
    this.expired = true;
  }
  
  next();
});

// Static method to clean up expired tokens
passwordResetSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lte: new Date() }
  });
  console.log(`🧹 Cleaned up ${result.deletedCount} expired password reset tokens`);
  return result;
};

// Static method to clean up used tokens older than 1 hour
passwordResetSchema.statics.cleanupUsed = async function() {
  const oneHourAgo = new Date(Date.now() - 3600000);
  const result = await this.deleteMany({
    used: true,
    usedAt: { $lte: oneHourAgo }
  });
  console.log(`🧹 Cleaned up ${result.deletedCount} old used password reset tokens`);
  return result;
};

// Instance method to check if token is valid
passwordResetSchema.methods.isValid = function() {
  const now = new Date();
  return !this.used && !this.expired && this.expiresAt > now;
};

// Instance method to mark as used
passwordResetSchema.methods.markAsUsed = async function() {
  this.used = true;
  this.usedAt = new Date();
  return await this.save();
};

export default mongoose.model('PasswordReset', passwordResetSchema);