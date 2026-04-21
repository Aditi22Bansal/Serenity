const express = require('express');
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');
const MoodEntry = require('../models/MoodEntry');
const JournalEntry = require('../models/JournalEntry');
const BreathingSession = require('../models/BreathingSession');
const router = express.Router();

// Get activity data for heatmap (last 365 days)
router.get('/', auth, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);

    // Fetch all activity types in parallel
    const [assessments, moods, journals, breathing] = await Promise.all([
      Assessment.find({ userId: req.user.id, completedAt: { $gte: startDate } }).select('completedAt category score'),
      MoodEntry.find({ userId: req.user.id, date: { $gte: startDate } }).select('date mood energy'),
      JournalEntry.find({ userId: req.user.id, date: { $gte: startDate } }).select('date title mood'),
      BreathingSession.find({ userId: req.user.id, date: { $gte: startDate } }).select('date technique durationSeconds'),
    ]);

    // Build day-by-day activity map
    const activityMap = {};

    assessments.forEach(a => {
      const day = new Date(a.completedAt).toISOString().split('T')[0];
      if (!activityMap[day]) activityMap[day] = { count: 0, activities: [] };
      activityMap[day].count++;
      activityMap[day].activities.push({ type: 'assessment', detail: `${a.category} (${a.score}%)` });
    });

    moods.forEach(m => {
      const day = new Date(m.date).toISOString().split('T')[0];
      if (!activityMap[day]) activityMap[day] = { count: 0, activities: [] };
      activityMap[day].count++;
      activityMap[day].activities.push({ type: 'mood', detail: `Mood: ${m.mood}/5, Energy: ${m.energy}/5` });
    });

    journals.forEach(j => {
      const day = new Date(j.date).toISOString().split('T')[0];
      if (!activityMap[day]) activityMap[day] = { count: 0, activities: [] };
      activityMap[day].count++;
      activityMap[day].activities.push({ type: 'journal', detail: j.title });
    });

    breathing.forEach(b => {
      const day = new Date(b.date).toISOString().split('T')[0];
      if (!activityMap[day]) activityMap[day] = { count: 0, activities: [] };
      activityMap[day].count++;
      activityMap[day].activities.push({ type: 'breathing', detail: `${b.technique} (${Math.round(b.durationSeconds / 60)}min)` });
    });

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (activityMap[key]) {
        tempStreak++;
        if (i === currentStreak) currentStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    res.json({
      activityMap,
      stats: {
        totalActiveDays: Object.keys(activityMap).length,
        currentStreak,
        longestStreak,
        totalActivities: Object.values(activityMap).reduce((s, d) => s + d.count, 0),
      }
    });
  } catch (err) {
    console.error('Heatmap error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
