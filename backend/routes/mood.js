const express = require('express');
const auth = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');
const router = express.Router();

// Create mood entry
router.post('/', auth, async (req, res) => {
  try {
    const { mood, energy, stress, sleep, note, tags } = req.body;
    if (!mood || !energy || !stress || !sleep) {
      return res.status(400).json({ message: 'Mood, energy, stress, and sleep are required' });
    }

    // Check if already logged today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await MoodEntry.findOne({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existing) {
      // Update today's entry
      existing.mood = mood;
      existing.energy = energy;
      existing.stress = stress;
      existing.sleep = sleep;
      existing.note = note || '';
      existing.tags = tags || [];
      await existing.save();
      return res.json({ message: 'Today\'s check-in updated', entry: existing });
    }

    const entry = await MoodEntry.create({
      userId: req.user.id, mood, energy, stress, sleep,
      note: note || '', tags: tags || []
    });
    res.status(201).json({ message: 'Check-in saved!', entry });
  } catch (err) {
    console.error('Mood entry error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get mood history (last 30 days)
router.get('/history', auth, async (req, res) => {
  try {
    const entries = await MoodEntry.find({ userId: req.user.id })
      .sort({ date: -1 }).limit(30);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get today's entry
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const entry = await MoodEntry.findOne({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });
    res.json({ entry: entry || null, checkedIn: !!entry });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mood stats (averages)
router.get('/stats', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const entries = await MoodEntry.find({
      userId: req.user.id,
      date: { $gte: thirtyDaysAgo }
    });

    if (entries.length === 0) return res.json({ avgMood: 0, avgEnergy: 0, avgStress: 0, avgSleep: 0, totalEntries: 0 });

    const avg = (arr, key) => Math.round((arr.reduce((s, e) => s + e[key], 0) / arr.length) * 10) / 10;
    res.json({
      avgMood: avg(entries, 'mood'),
      avgEnergy: avg(entries, 'energy'),
      avgStress: avg(entries, 'stress'),
      avgSleep: avg(entries, 'sleep'),
      totalEntries: entries.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
