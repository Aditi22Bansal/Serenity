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
      // Deduplicate by converting to YYYY-MM-DD strings
      const allDates = profile.history.map(h => {
        const d = new Date(h.date);
        return d.toISOString().split('T')[0];
      });
      const uniqueDayStrings = [...new Set(allDates)].sort().reverse();
      const todayStr = new Date().toISOString().split('T')[0];

      // Check if most recent activity is today or yesterday
      const mostRecentStr = uniqueDayStrings[0];
      const mostRecentDate = new Date(mostRecentStr + 'T00:00:00Z');
      const todayDate = new Date(todayStr + 'T00:00:00Z');
      const daysSinceLastActivity = Math.round((todayDate - mostRecentDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastActivity > 1) {
        // Streak is broken
        streak = 0;
      } else {
        streak = 1; // Count the most recent day
        for (let i = 1; i < uniqueDayStrings.length; i++) {
          const prevDate = new Date(uniqueDayStrings[i - 1] + 'T00:00:00Z');
          const currDate = new Date(uniqueDayStrings[i] + 'T00:00:00Z');
          const diff = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
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
