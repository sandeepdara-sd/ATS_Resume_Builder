import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  personalDetails: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String,
  },
  summary: String,
  education: [{
    degree: String,
    institution: String,
    location: String,
    startDate: String,
    endDate: String,
    gpa: String,
    achievements: String,
  }],
  experience: [{
    jobTitle: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    currentJob: Boolean,
    responsibilities: String,
  }],
  projects: [{
    name: String,
    description: String,
    technologies: String,
    link: String,
    duration: String,
  }],
  skills: [String],
  achievements: [{
    title: String,
    description: String,
    link: String,
    date: String,
    organization: String,
  }],
  hobbies: [String],
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

resumeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Resume', resumeSchema);