const express = require('express');
const auth = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');
const router = express.Router();

// Create journal entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

    const entry = await JournalEntry.create({
      userId: req.user.id, title, content,
      mood: mood || 'okay', tags: tags || []
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Journal error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all journal entries
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const entries = await JournalEntry.find({ userId: req.user.id })
      .sort({ date: -1 }).skip((page - 1) * limit).limit(limit);
    const total = await JournalEntry.countDocuments({ userId: req.user.id });
    res.json({ entries, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single entry
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
