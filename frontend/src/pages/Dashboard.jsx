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
  const [showTrendExplain, setShowTrendExplain] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeData, setWelcomeData] = useState(null);

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
        setTrends(tRes.data.history.map((h, i) => {
          const d = new Date(h.date);
          return {
            name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
            Physical: h.physical,
            Mental: h.mental,
            Emotional: h.emotional,
          };
        }));
        setRecommendations(rRes.data.recommendations || []);
        setStats(sRes.data);
        setHistory(hRes.data);

        // Check for motivational popup
        const streak = sRes.data?.currentStreak || 0;
        const lastPopup = localStorage.getItem('serenity_last_popup_date');
        const today = new Date().toDateString();
        const lastStreakCelebrated = parseInt(localStorage.getItem('serenity_streak_celebrated') || '0');

        if (lastPopup !== today) {
          // First visit today
          const milestones = [3, 7, 14, 21, 30, 50, 100];
          const currentMilestone = milestones.filter(m => streak >= m).pop();

          if (currentMilestone && currentMilestone > lastStreakCelebrated) {
            setWelcomeData({ type: 'streak', streak, milestone: currentMilestone });
            setShowWelcome(true);
            localStorage.setItem('serenity_streak_celebrated', String(currentMilestone));
          } else if (!localStorage.getItem('serenity_welcomed')) {
            setWelcomeData({ type: 'welcome' });
            setShowWelcome(true);
            localStorage.setItem('serenity_welcomed', 'true');
          } else {
            // Daily motivational greeting
            setWelcomeData({ type: 'daily', streak });
            setShowWelcome(true);
          }
          localStorage.setItem('serenity_last_popup_date', today);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const closeWelcome = () => setShowWelcome(false);

  const getMotivationalQuote = () => {
    const quotes = [
      { text: 'The greatest wealth is health.', author: 'Virgil' },
      { text: 'Take care of your body. It is the only place you have to live.', author: 'Jim Rohn' },
      { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
      { text: 'Happiness is the highest form of health.', author: 'Dalai Lama' },
      { text: 'Self-care is not selfish. You cannot serve from an empty vessel.', author: 'Eleanor Brownn' },
      { text: 'Your calm mind is the ultimate weapon against your challenges.', author: 'Bryant McGill' },
      { text: 'Small steps every day lead to big changes over time.', author: 'Unknown' },
      { text: 'Rest when you are tired. Refresh and renew yourself.', author: 'Ralph Waldo Emerson' },
    ];
    const idx = Math.floor(Date.now() / 86400000) % quotes.length;
    return quotes[idx];
  };

  const getStreakMessage = (milestone) => {
    const messages = {
      3: { title: 'Great Start!', message: 'You have maintained a 3-day streak. Consistency builds momentum.' },
      7: { title: 'One Week Strong!', message: 'A full week of wellness tracking. You are building a powerful habit.' },
      14: { title: 'Two Weeks!', message: '14 days of dedication. Your commitment to wellness is inspiring.' },
      21: { title: 'Habit Formed!', message: '21 days — they say that is all it takes to build a habit. Well done.' },
      30: { title: 'Monthly Milestone!', message: 'A full month of consistent wellness tracking. Remarkable discipline.' },
      50: { title: 'Fifty Days!', message: '50 days of showing up for yourself. You are truly dedicated.' },
      100: { title: 'Century Mark!', message: '100 days. You are a wellness champion. Keep going.' },
    };
    return messages[milestone] || { title: 'Keep Going!', message: `${milestone}-day streak! Your consistency is admirable.` };
  };

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-container" style={{ textAlign: 'center', paddingTop: 80 }}>
          <div className="loading-shimmer" style={{ width: 200, height: 24, margin: '0 auto 16px', borderRadius: 8 }} />
          <div className="loading-shimmer" style={{ width: 300, height: 16, margin: '0 auto', borderRadius: 8 }} />
        </div>
      </div>
    );
  }

  // Empty state
  if (!profile || profile.overallScore === 0) {
    return (
      <div className="dash-page">
        <div className="dash-container">
          <div className="dash-empty">
            <div className="empty-icon-circle">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 8c-3 4.5-9 9-9 15a9 9 0 0018 0c0-6-6-10.5-9-15z" fill="#7BC8A4" opacity="0.3"/><path d="M24 16c-1.5 2.5-5 5-5 8.5a5 5 0 0010 0c0-3.5-3.5-6-5-8.5z" fill="#7BC8A4"/></svg>
            </div>
            <h2>Your Wellness Journey Awaits</h2>
            <p>Take your first assessment to see your personalized wellness dashboard with scores, trends, and recommendations.</p>
            <Link to="/assessment"><button className="btn-primary">Start Assessment</button></Link>
          </div>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 75;
  const offset = circumference - (profile.overallScore / 100) * circumference;
  const quote = getMotivationalQuote();

  return (
    <div className="dash-page">
      {/* Motivational Popup */}
      {showWelcome && welcomeData && (
        <div className="welcome-overlay" onClick={closeWelcome}>
          <div className="welcome-modal" onClick={e => e.stopPropagation()}>
            <button className="welcome-close" onClick={closeWelcome}>&times;</button>
            {welcomeData.type === 'welcome' && (
              <>
                <div className="welcome-icon-wrap">
                  <svg width="56" height="56" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="23" fill="#E8F5EE"/><path d="M24 8c-3 4.5-9 9-9 15a9 9 0 0018 0c0-6-6-10.5-9-15z" fill="#7BC8A4"/><path d="M24 16v10M22 22h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <h2>Welcome to Serenity</h2>
                <p className="welcome-sub">Your wellness journey begins today. Track your physical, mental, and emotional well-being — one step at a time.</p>
                <div className="welcome-quote">
                  <p>"{quote.text}"</p>
                  <span>— {quote.author}</span>
                </div>
                <button className="btn-primary" onClick={closeWelcome}>Let's Begin</button>
              </>
            )}
            {welcomeData.type === 'streak' && (
              <>
                <div className="welcome-streak-badge">{welcomeData.milestone}</div>
                <h2>{getStreakMessage(welcomeData.milestone).title}</h2>
                <p className="welcome-sub">{getStreakMessage(welcomeData.milestone).message}</p>
                <div className="welcome-streak-visual">
                  <div className="streak-flame-row">
                    {Array.from({ length: Math.min(welcomeData.milestone, 7) }).map((_, i) => (
                      <div className="streak-day" key={i} style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <span className="streak-count">{welcomeData.streak} day streak</span>
                </div>
                <button className="btn-primary" onClick={closeWelcome}>Keep Going</button>
              </>
            )}
            {welcomeData.type === 'daily' && (
              <>
                <div className="welcome-icon-wrap">
                  <svg width="56" height="56" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="23" fill="#E6F0FA"/><path d="M16 28c0-2 2-3 4-3s4 1 4 3M24 28c0-2 2-3 4-3s4 1 4 3M18 34c2 2 6 3 6 3s4-1 6-3" stroke="#89B4E8" strokeWidth="2" strokeLinecap="round"/><circle cx="20" cy="20" r="2" fill="#89B4E8"/><circle cx="28" cy="20" r="2" fill="#89B4E8"/></svg>
                </div>
                <h2>Welcome Back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h2>
                <p className="welcome-sub">Another day, another opportunity to invest in yourself.</p>
                <div className="welcome-quote">
                  <p>"{quote.text}"</p>
                  <span>— {quote.author}</span>
                </div>
                {welcomeData.streak > 0 && <p className="welcome-streak-text">{welcomeData.streak} day streak — keep it up!</p>}
                <button className="btn-primary" onClick={closeWelcome}>Continue</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="dash-container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
            <p>Here is your wellness overview. Keep going — every step counts.</p>
          </div>
          <Link to="/assessment"><button className="btn-primary btn-sm">New Assessment</button></Link>
        </div>

        {/* Stats Row */}
        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-icon-circle green"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/><path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{profile.overallScore}</div>
            <div className="stat-label">Overall Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-circle blue"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="8" width="3" height="9" rx="1" fill="currentColor"/><rect x="8.5" y="5" width="3" height="12" rx="1" fill="currentColor"/><rect x="14" y="3" width="3" height="14" rx="1" fill="currentColor"/></svg></div>
            <div className="stat-value">{stats?.totalAssessments || 0}</div>
            <div className="stat-label">Assessments</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-circle peach"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v3M10 13v3M4 10h3M13 10h3M5.76 5.76l2.12 2.12M12.12 12.12l2.12 2.12M14.24 5.76l-2.12 2.12M7.88 12.12l-2.12 2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
            <div className="stat-value">{stats?.currentStreak || 0}</div>
            <div className="stat-label">Day Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-circle lavender"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="2"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
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
                { label: 'Physical', score: profile.physicalScore, color: 'var(--green)' },
                { label: 'Mental', score: profile.mentalScore, color: 'var(--blue)' },
                { label: 'Emotional', score: profile.emotionalScore, color: 'var(--lavender)' },
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
            <div className="chart-card-header">
              <h3>Wellness Trends</h3>
              {trends.length > 1 && (
                <button className="chart-explain-btn" onClick={() => setShowTrendExplain(!showTrendExplain)}>
                  {showTrendExplain ? 'Hide Explanation' : 'Explain Graph'}
                </button>
              )}
            </div>
            {showTrendExplain && (
              <div className="chart-explain-box">
                <p><strong>How to read this chart:</strong></p>
                <p>Each point on the graph represents a wellness score (0–100) from an assessment you completed on that date. The X-axis shows dates, and the Y-axis shows your score percentage.</p>
                <div className="chart-explain-legend">
                  <div className="cel-item"><span className="cel-dot" style={{ background: '#7BC8A4' }} /> <strong>Physical</strong> — Body health, sleep, activity, and nutrition</div>
                  <div className="cel-item"><span className="cel-dot" style={{ background: '#89B4E8' }} /> <strong>Mental</strong> — Focus, stress management, and clarity</div>
                  <div className="cel-item"><span className="cel-dot" style={{ background: '#B8A9C9' }} /> <strong>Emotional</strong> — Emotional resilience, connections, and gratitude</div>
                </div>
                <p style={{ marginTop: 8, fontSize: '0.85rem' }}>Upward trends indicate improvement. Flat lines mean you have not retaken that category. Take assessments regularly to see meaningful progress over time.</p>
              </div>
            )}
            {trends.length > 1 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A6B77' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#5A6B77' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #EDE9E3', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0 && payload[0].payload.fullDate) return payload[0].payload.fullDate;
                      return label;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Physical" stroke="#7BC8A4" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Mental" stroke="#89B4E8" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Emotional" stroke="#B8A9C9" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">Complete more assessments to see your trends</div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="reco-section">
            <h2>Your Personalized Suggestions</h2>
            <div className="reco-grid">
              {recommendations.slice(0, 6).map((r, i) => (
                <div className="reco-card" key={i}>
                  <div className="reco-dot" style={{ background: CAT_COLORS[r.category] || 'var(--green)' }} />
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
            <div className="history-section-header">
              <h2>Recent Assessments</h2>
              <span className="history-count">{history.length} total</span>
            </div>
            <div className="history-list">
              {history.map((h, i) => (
                <div className="history-item" key={i}>
                  <div className="history-dot" style={{ background: CAT_COLORS[h.category] || 'var(--green)' }} />
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
