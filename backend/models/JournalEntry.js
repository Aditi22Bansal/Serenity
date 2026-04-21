const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 5000 },
  mood: { type: String, enum: ['great', 'good', 'okay', 'low', 'bad'], default: 'okay' },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

journalEntrySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
