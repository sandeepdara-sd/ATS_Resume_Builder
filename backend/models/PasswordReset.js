import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + 3600000); // Exactly 1 hour from creation
    }
  },
  used: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete expired tokens after they expire
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster queries
passwordResetSchema.index({ email: 1, used: 1 });
passwordResetSchema.index({ token: 1, used: 1 });
passwordResetSchema.index({ createdAt: 1 });

// Add a method to check if token is expired
passwordResetSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Add a method to get remaining time
passwordResetSchema.methods.getRemainingTime = function() {
  const now = new Date();
  const remaining = this.expiresAt - now;
  return Math.max(0, Math.floor(remaining / 1000 / 60)); // Return minutes remaining
};

export default mongoose.model('PasswordReset', passwordResetSchema);