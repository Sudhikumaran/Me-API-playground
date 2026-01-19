const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// GET /profile - Fetch profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
});

// POST /profile - Create profile
router.post('/profile', async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await Profile.findOne();
    
    if (existingProfile) {
      return res.status(400).json({ 
        success: false,
        message: 'Profile already exists. Use PUT to update.' 
      });
    }
    
    const profile = new Profile(req.body);
    await profile.save();
    
    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating profile',
      error: error.message
    });
  }
});

// PUT /profile - Update profile
router.put('/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found. Use POST to create.' 
      });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      profile[key] = req.body[key];
    });
    
    await profile.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating profile',
      error: error.message
    });
  }
});

// GET /projects?skill=python - Query projects by skill
router.get('/projects', async (req, res) => {
  try {
    const { skill } = req.query;
    
    if (!skill) {
      return res.status(400).json({ 
        success: false,
        message: 'Skill query parameter is required' 
      });
    }
    
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found' 
      });
    }
    
    // Filter projects that mention the skill in title or description
    const filteredProjects = profile.projects.filter(project => {
      const searchText = `${project.title} ${project.description}`.toLowerCase();
      return searchText.includes(skill.toLowerCase());
    });
    
    // Also check if skill exists in profile skills
    const hasSkill = profile.skills.some(s => 
      s.toLowerCase().includes(skill.toLowerCase())
    );
    
    res.status(200).json({
      success: true,
      skill: skill,
      hasSkill: hasSkill,
      count: filteredProjects.length,
      data: filteredProjects
    });
  } catch (error) {
    console.error('Error querying projects:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while querying projects',
      error: error.message
    });
  }
});

// GET /skills/top - Get top skills (sorted by frequency/priority)
router.get('/skills/top', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found' 
      });
    }
    
    const limit = parseInt(req.query.limit) || profile.skills.length;
    const topSkills = profile.skills.slice(0, limit);
    
    res.status(200).json({
      success: true,
      total: profile.skills.length,
      count: topSkills.length,
      data: topSkills
    });
  } catch (error) {
    console.error('Error fetching top skills:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching skills',
      error: error.message
    });
  }
});

// GET /search?q=react - Full text search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false,
        message: 'Search query parameter (q) is required' 
      });
    }
    
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found' 
      });
    }
    
    const searchTerm = q.toLowerCase();
    const results = {
      skills: [],
      projects: [],
      education: [],
      work: []
    };
    
    // Search in skills
    results.skills = profile.skills.filter(skill => 
      skill.toLowerCase().includes(searchTerm)
    );
    
    // Search in projects
    results.projects = profile.projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm)
    );
    
    // Search in education
    results.education = profile.education.filter(edu =>
      edu.toLowerCase().includes(searchTerm)
    );
    
    // Search in work
    results.work = profile.work.filter(w =>
      w.toLowerCase().includes(searchTerm)
    );
    
    const totalMatches = 
      results.skills.length + 
      results.projects.length + 
      results.education.length + 
      results.work.length;
    
    res.status(200).json({
      success: true,
      query: q,
      totalMatches,
      data: results
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while searching',
      error: error.message
    });
  }
});

module.exports = router;
