import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('serenity_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Assessments
export const getCategories = () => api.get('/assessments/categories');
export const getQuestions = (category) => api.get(`/assessments/questions/${category}`);
export const submitAssessment = (data) => api.post('/assessments/submit', data);
export const getAssessmentHistory = () => api.get('/assessments/history');

// Dashboard
export const getWellnessProfile = () => api.get('/dashboard/profile');
export const getTrends = () => api.get('/dashboard/trends');
export const getRecommendations = () => api.get('/dashboard/recommendations');
export const getStats = () => api.get('/dashboard/stats');

// Mood Check-in
export const createMoodEntry = (data) => api.post('/mood', data);
export const getMoodHistory = () => api.get('/mood/history');
export const getTodayMood = () => api.get('/mood/today');
export const getMoodStats = () => api.get('/mood/stats');

// Journal
export const createJournalEntry = (data) => api.post('/journal', data);
export const getJournalEntries = (page = 1) => api.get(`/journal?page=${page}`);
export const deleteJournalEntry = (id) => api.delete(`/journal/${id}`);

// Goals
export const createGoal = (data) => api.post('/goals', data);
export const getGoals = () => api.get('/goals');
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);
export const changePassword = (data) => api.put('/profile/password', data);
export const getReportData = () => api.get('/profile/report');

// Breathing
export const saveBreathingSession = (data) => api.post('/breathing', data);
export const getBreathingHistory = () => api.get('/breathing/history');
export const getBreathingStats = () => api.get('/breathing/stats');

// Heatmap
export const getHeatmapData = () => api.get('/heatmap');

export default api;
