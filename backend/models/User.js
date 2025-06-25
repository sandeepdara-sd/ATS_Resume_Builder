import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: String,
  firebaseUid: { type: String, unique: true, sparse: true },
  photoURL: String,
  phone: String,
  location: String,
  bio: String,
  skills: [String],
  experience: String,
  education: String,
  resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('User', userSchema);