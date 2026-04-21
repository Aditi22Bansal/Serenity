const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: Number, required: true, min: 1, max: 5 }, // 1=awful, 5=great
  energy: { type: Number, required: true, min: 1, max: 5 },
  stress: { type: Number, required: true, min: 1, max: 5 }, // 1=very stressed, 5=calm
  sleep: { type: Number, required: true, min: 1, max: 5 },
  note: { type: String, maxlength: 500, default: '' },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// One entry per day per user
moodEntrySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
