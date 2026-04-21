const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessments');
const dashboardRoutes = require('./routes/dashboard');
const moodRoutes = require('./routes/mood');
const journalRoutes = require('./routes/journal');
const goalRoutes = require('./routes/goals');
const profileRoutes = require('./routes/profile');
const breathingRoutes = require('./routes/breathing');
const heatmapRoutes = require('./routes/heatmap');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Serenity API is running 🌿' }));
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/breathing', breathingRoutes);
app.use('/api/heatmap', heatmapRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack || err.message || err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Connect to MongoDB & Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🌿 Serenity API running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
