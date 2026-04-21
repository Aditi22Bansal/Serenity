const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const WellnessProfile = require('../models/WellnessProfile');
const MoodEntry = require('../models/MoodEntry');
const JournalEntry = require('../models/JournalEntry');
const Goal = require('../models/Goal');
const router = express.Router();

// Get full profile with stats
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const profile = await WellnessProfile.findOne({ userId: req.user.id });
    const totalAssessments = await Assessment.countDocuments({ userId: req.user.id });
    const totalJournals = await JournalEntry.countDocuments({ userId: req.user.id });
    const totalMoodEntries = await MoodEntry.countDocuments({ userId: req.user.id });
    const activeGoals = await Goal.countDocuments({ userId: req.user.id, status: 'active' });
    const completedGoals = await Goal.countDocuments({ userId: req.user.id, status: 'completed' });

    // Calculate member since
    const memberDays = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    res.json({
      user,
      wellness: profile ? {
        overallScore: profile.overallScore,
        physicalScore: profile.physicalScore,
        mentalScore: profile.mentalScore,
        emotionalScore: profile.emotionalScore,
      } : null,
      stats: {
        totalAssessments,
        totalJournals,
        totalMoodEntries,
        activeGoals,
        completedGoals,
        memberDays,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile (name)
router.put('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both passwords required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get report data for PDF export
router.get('/report', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const profile = await WellnessProfile.findOne({ userId: req.user.id });
    const recentAssessments = await Assessment.find({ userId: req.user.id }).sort({ completedAt: -1 }).limit(10);
    const recentMoods = await MoodEntry.find({ userId: req.user.id }).sort({ date: -1 }).limit(14);
    const goals = await Goal.find({ userId: req.user.id });

    res.json({
      user: { name: user.name, email: user.email, memberSince: user.createdAt },
      wellness: profile,
      recentAssessments,
      recentMoods,
      goals,
      generatedAt: new Date(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
