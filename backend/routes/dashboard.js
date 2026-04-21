const express = require('express');
const auth = require('../middleware/auth');
const WellnessProfile = require('../models/WellnessProfile');
const Assessment = require('../models/Assessment');
const router = express.Router();

// Get wellness profile (scores + recommendations)
router.get('/profile', auth, async (req, res) => {
  try {
    let profile = await WellnessProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await WellnessProfile.create({ userId: req.user.id });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trend data for charts
router.get('/trends', auth, async (req, res) => {
  try {
    const profile = await WellnessProfile.findOne({ userId: req.user.id });
    if (!profile) return res.json({ history: [] });

    // Return last 7 entries for weekly view
    const history = profile.history.slice(-7).map(h => ({
      date: h.date,
      overall: h.overallScore,
      physical: h.physical,
      mental: h.mental,
      emotional: h.emotional,
    }));

    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const profile = await WellnessProfile.findOne({ userId: req.user.id });
    if (!profile) return res.json({ recommendations: [] });
    res.json({ recommendations: profile.recommendations });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get summary stats
router.get('/stats', auth, async (req, res) => {
  try {
    const totalAssessments = await Assessment.countDocuments({ userId: req.user.id });
    const profile = await WellnessProfile.findOne({ userId: req.user.id });
    
    let streak = 0;
    if (profile && profile.history.length > 0) {
      // Simple streak: count consecutive days with assessments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = profile.history.length - 1; i >= 0; i--) {
        const entryDate = new Date(profile.history[i].date);
        entryDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= streak + 1) streak++;
        else break;
      }
    }

    res.json({
      totalAssessments,
      currentStreak: streak,
      overallScore: profile ? profile.overallScore : 0,
      lastUpdated: profile ? profile.lastUpdated : null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
