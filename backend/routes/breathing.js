const express = require('express');
const auth = require('../middleware/auth');
const BreathingSession = require('../models/BreathingSession');
const router = express.Router();

// Save completed session
router.post('/', auth, async (req, res) => {
  try {
    const { technique, durationSeconds, cyclesCompleted } = req.body;
    if (!technique || !durationSeconds || !cyclesCompleted) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const session = await BreathingSession.create({
      userId: req.user.id, technique, durationSeconds, cyclesCompleted
    });
    res.status(201).json({ message: 'Session saved!', session });
  } catch (err) {
    console.error('Breathing session error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session history
router.get('/history', auth, async (req, res) => {
  try {
    const sessions = await BreathingSession.find({ userId: req.user.id })
      .sort({ date: -1 }).limit(20);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stats (total sessions, total minutes, favorite technique)
router.get('/stats', auth, async (req, res) => {
  try {
    const sessions = await BreathingSession.find({ userId: req.user.id });
    const totalSessions = sessions.length;
    const totalMinutes = Math.round(sessions.reduce((s, e) => s + e.durationSeconds, 0) / 60);
    
    // Find favorite technique
    const techCount = {};
    sessions.forEach(s => { techCount[s.technique] = (techCount[s.technique] || 0) + 1; });
    const favorite = Object.entries(techCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None yet';

    res.json({ totalSessions, totalMinutes, favorite });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
