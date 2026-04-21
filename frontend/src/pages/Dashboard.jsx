import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getWellnessProfile, getTrends, getRecommendations, getStats, getAssessmentHistory } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const CAT_COLORS = { physical: '#7BC8A4', mental: '#89B4E8', emotional: '#B8A9C9' };
const CAT_BG = { physical: '#E8F5EE', mental: '#E6F0FA', emotional: '#F0EBF5' };

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [trends, setTrends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [pRes, tRes, rRes, sRes, hRes] = await Promise.all([
          getWellnessProfile(),
          getTrends(),
          getRecommendations(),
          getStats(),
          getAssessmentHistory(),
        ]);
        setProfile(pRes.data);
        setTrends(tRes.data.history.map((h, i) => ({
          name: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }),
          Physical: h.physical,
          Mental: h.mental,
          Emotional: h.emotional,
        })));
        setRecommendations(rRes.data.recommendations || []);
        setStats(sRes.data);
        setHistory(hRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="dash-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: 80 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!profile || profile.overallScore === 0) {
    return (
      <div className="dash-page">
        <div className="container">
          <div className="dash-empty">
            <div className="empty-icon">🌱</div>
            <h2>Your Wellness Journey Awaits</h2>
            <p>Take your first assessment to see your personalized wellness dashboard with scores, trends, and recommendations.</p>
            <Link to="/assessment"><button className="btn-primary">Start Assessment →</button></Link>
          </div>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 75;
  const offset = circumference - (profile.overallScore / 100) * circumference;

  return (
    <div className="dash-page">
      <div className="container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0]} 🌿</h1>
            <p>Here's your wellness overview. Keep going — every step counts.</p>
          </div>
          <Link to="/assessment"><button className="btn-primary btn-sm">New Assessment →</button></Link>
        </div>

        {/* Stats Row */}
        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{profile.overallScore}</div>
            <div className="stat-label">Overall Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats?.totalAssessments || 0}</div>
            <div className="stat-label">Assessments</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{stats?.currentStreak || 0}</div>
            <div className="stat-label">Day Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💡</div>
            <div className="stat-value">{recommendations.length}</div>
            <div className="stat-label">Suggestions</div>
          </div>
        </div>

        {/* Main Grid: Score Ring + Chart */}
        <div className="dash-grid">
          <div className="score-ring-card">
            <h3>Wellness Score</h3>
            <div className="ring-container">
              <svg viewBox="0 0 170 170">
                <circle className="ring-bg" cx="85" cy="85" r="75" />
                <circle
                  className="ring-fg"
                  cx="85" cy="85" r="75"
                  stroke="var(--green)"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="ring-score-label">
                <div className="big" style={{ color: 'var(--green)' }}>{profile.overallScore}</div>
                <div className="small">out of 100</div>
              </div>
            </div>
            <div className="cat-bars">
              {[
                { label: '🏃 Physical', score: profile.physicalScore, color: 'var(--green)' },
                { label: '🧠 Mental', score: profile.mentalScore, color: 'var(--blue)' },
                { label: '💜 Emotional', score: profile.emotionalScore, color: 'var(--lavender)' },
              ].map((c, i) => (
                <div className="cat-bar-item" key={i}>
                  <div className="cat-bar-top">
                    <span>{c.label}</span>
                    <span style={{ color: c.color }}>{c.score}%</span>
                  </div>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: c.score + '%', background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>Wellness Trends</h3>
            {trends.length > 1 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A8B5BF' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#A8B5BF' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #EDE9E3', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Physical" stroke="#7BC8A4" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Mental" stroke="#89B4E8" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Emotional" stroke="#B8A9C9" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">Complete more assessments to see your trends 📈</div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="reco-section">
            <h2>💡 Your Personalized Suggestions</h2>
            <div className="reco-grid">
              {recommendations.slice(0, 6).map((r, i) => (
                <div className="reco-card" key={i}>
                  <div className="reco-icon">{r.icon}</div>
                  <div>
                    <h4>{r.title}</h4>
                    <p>{r.description}</p>
                    <span className="reco-tag" style={{ background: CAT_BG[r.category] || 'var(--green-light)', color: CAT_COLORS[r.category] || 'var(--green)' }}>
                      {r.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="history-section">
            <h2>📋 Recent Assessments</h2>
            <div className="history-list">
              {history.slice(0, 8).map((h, i) => (
                <div className="history-item" key={i}>
                  <div className="history-icon">
                    {h.category === 'physical' ? '🏃' : h.category === 'mental' ? '🧠' : '💜'}
                  </div>
                  <div className="history-info">
                    <strong>{h.category.charAt(0).toUpperCase() + h.category.slice(1)} Wellness</strong>
                    <span>{new Date(h.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="history-score" style={{ color: CAT_COLORS[h.category] }}>{h.score}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
