const mongoose = require('mongoose');

const breathingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technique: { type: String, required: true }, // '4-7-8', 'box', 'calm', 'energize'
  durationSeconds: { type: Number, required: true },
  cyclesCompleted: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

breathingSessionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('BreathingSession', breathingSessionSchema);
