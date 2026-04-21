import { useState, useEffect } from 'react';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../utils/api';
import './Goals.css';

const CATEGORIES = [
  { id: 'physical', label: 'Physical', icon: '🏃', color: '#7BC8A4', bg: '#E8F5EE' },
  { id: 'mental', label: 'Mental', icon: '🧠', color: '#89B4E8', bg: '#E6F0FA' },
  { id: 'emotional', label: 'Emotional', icon: '💜', color: '#B8A9C9', bg: '#F0EBF5' },
  { id: 'general', label: 'General', icon: '🌿', color: '#7BC8A4', bg: '#E8F5EE' },
];

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('active');
  const [form, setForm] = useState({ category: 'physical', title: '', description: '', targetScore: 80, deadline: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadGoals(); }, []);

  const loadGoals = async () => {
    try { const res = await getGoals(); setGoals(res.data); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await createGoal(form);
      setForm({ category: 'physical', title: '', description: '', targetScore: 80, deadline: '' });
      setShowForm(false);
      loadGoals();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateGoal(id, { status }); loadGoals(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal?')) return;
    try { await deleteGoal(id); loadGoals(); }
    catch (err) { console.error(err); }
  };

  const filtered = goals.filter(g => tab === 'all' ? true : g.status === tab);
  const activeCount = goals.filter(g => g.status === 'active').length;
  const completedCount = goals.filter(g => g.status === 'completed').length;

  return (
    <div className="goals-page">
      <div className="container">
        <div className="goals-header">
          <div>
            <h1>🎯 Wellness Goals</h1>
            <p style={{ color: 'var(--text-light)' }}>Set goals, track progress, and celebrate wins</p>
          </div>
          <button className="btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ New Goal'}
          </button>
        </div>

        <div className="goals-stats">
          <div className="goals-stat"><div className="gs-val" style={{ color: 'var(--blue)' }}>{activeCount}</div><div className="gs-label">Active Goals</div></div>
          <div className="goals-stat"><div className="gs-val" style={{ color: 'var(--green)' }}>{completedCount}</div><div className="gs-label">Completed</div></div>
          <div className="goals-stat"><div className="gs-val" style={{ color: 'var(--lavender)' }}>{goals.length}</div><div className="gs-label">Total Goals</div></div>
        </div>

        {showForm && (
          <div className="goal-form">
            <h3 style={{ marginBottom: 20 }}>Create a New Goal</h3>
            <div className="goal-form-grid">
              <div className="goal-form-full">
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>Category</label>
                <div className="goal-cat-select">
                  {CATEGORIES.map(c => (
                    <button key={c.id} className={`goal-cat-btn ${form.category === c.id ? 'selected' : ''}`} onClick={() => setForm({ ...form, category: c.id })}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="goal-form-full">
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>Goal Title</label>
                <input className="form-input" type="text" placeholder="e.g., Improve sleep quality to 80%" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="goal-form-full">
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>Description (optional)</label>
                <input className="form-input" type="text" placeholder="What steps will you take?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>Target Score</label>
                <input className="form-input" type="number" min="10" max="100" value={form.targetScore} onChange={e => setForm({ ...form, targetScore: parseInt(e.target.value) || 80 })} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>Deadline (optional)</label>
                <input className="form-input" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={loading || !form.title.trim()}>
                {loading ? 'Creating...' : 'Create Goal'} 🎯
              </button>
            </div>
          </div>
        )}

        <div className="goals-tabs">
          {[{ id: 'active', label: 'Active' }, { id: 'completed', label: 'Completed' }, { id: 'all', label: 'All' }].map(t => (
            <button key={t.id} className={`goals-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="goals-empty">
            <div className="empty-icon">🎯</div>
            <h3>No {tab === 'all' ? '' : tab} goals yet</h3>
            <p>Create your first wellness goal to start tracking progress.</p>
          </div>
        ) : (
          <div className="goals-list">
            {filtered.map(goal => {
              const cat = CATEGORIES.find(c => c.id === goal.category) || CATEGORIES[3];
              const pct = goal.targetScore > 0 ? Math.min(Math.round((goal.currentProgress / goal.targetScore) * 100), 100) : 0;
              const exceeded = goal.currentProgress >= goal.targetScore;
              return (
                <div className={`goal-card ${goal.status === 'completed' ? 'goal-completed' : ''}`} key={goal._id}>
                  <div className="goal-card-header">
                    <h3>{cat.icon} {goal.title}</h3>
                    <span className="goal-cat-tag" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
                  </div>
                  {goal.description && <div className="goal-desc">{goal.description}</div>}
                  <div className="goal-progress">
                    <div className="goal-progress-top">
                      <span>{exceeded ? `${goal.targetScore} / ${goal.targetScore}` : `${goal.currentProgress} / ${goal.targetScore}`}</span>
                      <span style={{ color: exceeded ? 'var(--green)' : cat.color }}>
                        {exceeded ? '🎉 Goal Achieved!' : `${pct}%`}
                      </span>
                    </div>
                    <div className="goal-progress-bar">
                      <div className="goal-progress-fill" style={{ width: pct + '%', background: exceeded ? 'var(--green)' : cat.color }} />
                    </div>
                  </div>
                  <div className="goal-footer">
                    <div>
                      {goal.status === 'completed' && <span className="goal-completed-badge">✅ Completed</span>}
                      {goal.deadline && <span className="goal-deadline">📅 {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                    </div>
                    <div className="goal-actions">
                      {goal.status === 'active' && (
                        <button className="goal-action-btn" onClick={() => handleStatusChange(goal._id, 'completed')}>✓ Complete</button>
                      )}
                      {goal.status === 'completed' && (
                        <button className="goal-action-btn" onClick={() => handleStatusChange(goal._id, 'active')}>↩ Reopen</button>
                      )}
                      <button className="goal-action-btn danger" onClick={() => handleDelete(goal._id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
