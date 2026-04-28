const express = require('express');
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');
const WellnessProfile = require('../models/WellnessProfile');
const { questions, scaleLabels } = require('../data/questions');
const { generateRecommendations } = require('../utils/recommendationEngine');
const router = express.Router();

// Get questions for a category
router.get('/questions/:category', (req, res) => {
  const { category } = req.params;
  if (!questions[category]) return res.status(400).json({ message: 'Invalid category. Use: physical, mental, emotional' });
  res.json({ category, questions: questions[category], scaleLabels });
});

// Get all question categories info
router.get('/categories', (req, res) => {
  res.json({
    categories: [
      { id: 'physical', name: 'Physical Wellness', icon: '🏃', color: '#7BC8A4', questionCount: questions.physical.length },
      { id: 'mental', name: 'Mental Wellness', icon: '🧠', color: '#89B4E8', questionCount: questions.mental.length },
      { id: 'emotional', name: 'Emotional Wellness', icon: '💜', color: '#B8A9C9', questionCount: questions.emotional.length },
    ],
    scaleLabels,
  });
});

// Submit assessment for a category
router.post('/submit', auth, async (req, res) => {
  try {
    const { category, answers } = req.body;
    if (!category || !answers || !answers.length) return res.status(400).json({ message: 'Category and answers are required' });
    if (!questions[category]) return res.status(400).json({ message: 'Invalid category' });

    // Calculate score: average of answers (1-5 scale) mapped to 0-100
    const totalScore = answers.reduce((sum, a) => sum + a.answer, 0);
    const maxPossible = answers.length * 5;
    const score = Math.round((totalScore / maxPossible) * 100);

    // Save assessment
    const assessment = await Assessment.create({
      userId: req.user.id,
      category,
      answers,
      score,
    });

    // Update wellness profile
    let profile = await WellnessProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await WellnessProfile.create({ userId: req.user.id });
    }

    // Update category score
    if (category === 'physical') profile.physicalScore = score;
    else if (category === 'mental') profile.mentalScore = score;
    else if (category === 'emotional') profile.emotionalScore = score;

    // Recalculate overall score (weighted average)
    const scores = [profile.physicalScore, profile.mentalScore, profile.emotionalScore];
    const validScores = scores.filter(s => s > 0);
    profile.overallScore = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;

    // Add to history
    profile.history.push({
      date: new Date(),
      overallScore: profile.overallScore,
      physical: profile.physicalScore,
      mental: profile.mentalScore,
      emotional: profile.emotionalScore,
    });

    // Keep last 30 history entries
    if (profile.history.length > 30) profile.history = profile.history.slice(-30);

    // Collect all recent answers for AI-driven recommendations
    const recentAssessments = await Assessment.find({ userId: req.user.id }).sort({ completedAt: -1 }).limit(3);
    const allAnswers = [];
    recentAssessments.forEach(a => {
      if (a.answers) a.answers.forEach(ans => allAnswers.push(ans));
    });

    // Generate new AI recommendations based on individual answers
    profile.recommendations = generateRecommendations(profile.physicalScore, profile.mentalScore, profile.emotionalScore, allAnswers);
    profile.lastUpdated = new Date();

    await profile.save();

    res.json({
      assessment: { id: assessment._id, category, score },
      profile: {
        overallScore: profile.overallScore,
        physicalScore: profile.physicalScore,
        mentalScore: profile.mentalScore,
        emotionalScore: profile.emotionalScore,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get assessment history
router.get('/history', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id }).sort({ completedAt: -1 }).limit(20);
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
