const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['physical', 'mental', 'emotional', 'general'], required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 500, default: '' },
  targetScore: { type: Number, min: 0, max: 100, default: 80 },
  currentProgress: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  deadline: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

goalSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Goal', goalSchema);
