const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  links: [{
    type: String,
    trim: true
  }]
}, { _id: false });

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  education: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  projects: [projectSchema],
  work: [{
    type: String,
    trim: true
  }],
  links: {
    github: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    portfolio: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Index for text search
profileSchema.index({
  name: 'text',
  'projects.title': 'text',
  'projects.description': 'text',
  skills: 'text'
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
