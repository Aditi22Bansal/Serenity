const mongoose = require('mongoose');

const historyEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  overallScore: Number,
  physical: Number,
  mental: Number,
  emotional: Number,
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  category: { type: String, enum: ['physical', 'mental', 'emotional', 'general'] },
  title: String,
  description: String,
  icon: String,
  priority: { type: Number, default: 1 },
}, { _id: false });

const wellnessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  overallScore: { type: Number, default: 0 },
  physicalScore: { type: Number, default: 0 },
  mentalScore: { type: Number, default: 0 },
  emotionalScore: { type: Number, default: 0 },
  history: [historyEntrySchema],
  recommendations: [recommendationSchema],
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('WellnessProfile', wellnessProfileSchema);
