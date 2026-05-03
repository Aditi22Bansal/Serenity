import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import MoodCheckin from './pages/MoodCheckin';
import Journal from './pages/Journal';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Breathing from './pages/Breathing';
import Heatmap from './pages/Heatmap';
import UserGuide from './pages/UserGuide';
import MeetingRoom from './pages/MeetingRoom';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute><MoodCheckin /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/breathe" element={<ProtectedRoute><Breathing /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><Heatmap /></ProtectedRoute>} />
          <Route path="/meeting" element={<ProtectedRoute><MeetingRoom /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
