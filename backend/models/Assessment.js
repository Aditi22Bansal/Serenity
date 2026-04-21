const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  answer: { type: Number, required: true, min: 1, max: 5 },
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['physical', 'mental', 'emotional'], required: true },
  answers: [answerSchema],
  score: { type: Number, required: true, min: 0, max: 100 },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
