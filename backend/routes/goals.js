const express = require('express');
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');
const WellnessProfile = require('../models/WellnessProfile');
const router = express.Router();

// Create goal
router.post('/', auth, async (req, res) => {
  try {
    const { category, title, description, targetScore, deadline } = req.body;
    if (!category || !title) return res.status(400).json({ message: 'Category and title are required' });

    // Set current progress from wellness profile
    const profile = await WellnessProfile.findOne({ userId: req.user.id });
    let currentProgress = 0;
    if (profile) {
      if (category === 'physical') currentProgress = profile.physicalScore;
      else if (category === 'mental') currentProgress = profile.mentalScore;
      else if (category === 'emotional') currentProgress = profile.emotionalScore;
      else currentProgress = profile.overallScore;
    }

    const goal = await Goal.create({
      userId: req.user.id, category, title,
      description: description || '',
      targetScore: targetScore || 80,
      currentProgress,
      deadline: deadline || null,
    });
    res.status(201).json(goal);
  } catch (err) {
    console.error('Goal error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all goals
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // Auto-update progress from wellness profile
    const profile = await WellnessProfile.findOne({ userId: req.user.id });
    if (profile) {
      for (const goal of goals) {
        if (goal.status === 'active') {
          let newProgress = 0;
          if (goal.category === 'physical') newProgress = profile.physicalScore;
          else if (goal.category === 'mental') newProgress = profile.mentalScore;
          else if (goal.category === 'emotional') newProgress = profile.emotionalScore;
          else newProgress = profile.overallScore;

          if (newProgress !== goal.currentProgress) {
            goal.currentProgress = newProgress;
            if (newProgress >= goal.targetScore) {
              goal.status = 'completed';
              goal.completedAt = new Date();
            }
            await goal.save();
          }
        }
      }
    }

    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update goal
router.put('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const { title, description, targetScore, status, deadline } = req.body;
    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetScore) goal.targetScore = targetScore;
    if (status) goal.status = status;
    if (deadline) goal.deadline = deadline;
    if (status === 'completed') goal.completedAt = new Date();

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
