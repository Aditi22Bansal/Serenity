import { useState, useEffect } from 'react';
import { createMoodEntry, getMoodHistory, getTodayMood, getMoodStats } from '../utils/api';
import './MoodCheckin.css';

const MOOD_EMOJIS = [
  { value: 1, emoji: '😞', label: 'Awful' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];
const ENERGY_EMOJIS = [
  { value: 1, emoji: '😩', label: 'Drained' },
  { value: 2, emoji: '😴', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Moderate' },
  { value: 4, emoji: '💪', label: 'High' },
  { value: 5, emoji: '🔥', label: 'Superb' },
];
const STRESS_EMOJIS = [
  { value: 1, emoji: '😰', label: 'Very Stressed' },
  { value: 2, emoji: '😟', label: 'Stressed' },
  { value: 3, emoji: '😌', label: 'Moderate' },
  { value: 4, emoji: '🧘', label: 'Calm' },
  { value: 5, emoji: '😇', label: 'Peaceful' },
];
const SLEEP_EMOJIS = [
  { value: 1, emoji: '😵', label: 'Terrible' },
  { value: 2, emoji: '😪', label: 'Poor' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😴', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Amazing' },
];
const TAGS = ['Exercise', 'Meditation', 'Nature', 'Social', 'Work', 'Reading', 'Cooking', 'Music', 'Family', 'Rest'];

export default function MoodCheckin() {
  const [form, setForm] = useState({ mood: 0, energy: 0, stress: 0, sleep: 0, note: '', tags: [] });
  const [checkedIn, setCheckedIn] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todayRes, histRes, statsRes] = await Promise.all([
        getTodayMood(), getMoodHistory(), getMoodStats()
      ]);
      if (todayRes.data.checkedIn) {
        setCheckedIn(true);
        const e = todayRes.data.entry;
        setForm({ mood: e.mood, energy: e.energy, stress: e.stress, sleep: e.sleep, note: e.note, tags: e.tags });
      }
      setHistory(histRes.data);
      setStats(statsRes.data);
    } catch (err) { console.error(err); }
  };

  const toggleTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  const handleSubmit = async () => {
    if (!form.mood || !form.energy || !form.stress || !form.sleep) return;
    setLoading(true);
    try {
      await createMoodEntry(form);
      setSuccess(checkedIn ? 'Check-in updated successfully!' : 'Check-in saved successfully!');
      setCheckedIn(true);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const EmojiRow = ({ items, value, onChange }) => (
    <div className="mood-emoji-row">
      {items.map(item => (
        <button key={item.value} className={`mood-emoji-btn ${value === item.value ? 'selected' : ''}`} onClick={() => onChange(item.value)}>
          {item.emoji}
          <span className="emoji-label">{item.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="mood-page">
      <div className="mood-container">
        <div className="mood-header">
          <h1>Daily Check-in</h1>
          <p>How are you feeling today? Take 30 seconds to reflect.</p>
        </div>

        {success && <div className="mood-already"><p>{success}</p></div>}
        {checkedIn && !success && <div className="mood-already"><p>You have already checked in today. You can update it below.</p></div>}

        {stats && stats.totalEntries > 0 && (
          <div className="mood-stats-row">
            <div className="mood-stat-card"><div className="ms-val" style={{ color: 'var(--green)' }}>{stats.avgMood}</div><div className="ms-label">Avg Mood</div></div>
            <div className="mood-stat-card"><div className="ms-val" style={{ color: 'var(--peach)' }}>{stats.avgEnergy}</div><div className="ms-label">Avg Energy</div></div>
            <div className="mood-stat-card"><div className="ms-val" style={{ color: 'var(--blue)' }}>{stats.avgStress}</div><div className="ms-label">Avg Calm</div></div>
            <div className="mood-stat-card"><div className="ms-val" style={{ color: 'var(--lavender)' }}>{stats.avgSleep}</div><div className="ms-label">Avg Sleep</div></div>
          </div>
        )}

        <div className="mood-card">
          <div className="mood-slider-group">
            <div className="mood-slider-label">
              <span>How is your mood?</span>
              {form.mood > 0 && <span className="mood-val" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>{MOOD_EMOJIS[form.mood - 1]?.label}</span>}
            </div>
            <EmojiRow items={MOOD_EMOJIS} value={form.mood} onChange={v => setForm({ ...form, mood: v })} />
          </div>
          <div className="mood-slider-group">
            <div className="mood-slider-label">
              <span>Energy level?</span>
              {form.energy > 0 && <span className="mood-val" style={{ background: 'var(--peach-light)', color: 'var(--peach)' }}>{ENERGY_EMOJIS[form.energy - 1]?.label}</span>}
            </div>
            <EmojiRow items={ENERGY_EMOJIS} value={form.energy} onChange={v => setForm({ ...form, energy: v })} />
          </div>
          <div className="mood-slider-group">
            <div className="mood-slider-label">
              <span>Stress level?</span>
              {form.stress > 0 && <span className="mood-val" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>{STRESS_EMOJIS[form.stress - 1]?.label}</span>}
            </div>
            <EmojiRow items={STRESS_EMOJIS} value={form.stress} onChange={v => setForm({ ...form, stress: v })} />
          </div>
          <div className="mood-slider-group">
            <div className="mood-slider-label">
              <span>Sleep quality?</span>
              {form.sleep > 0 && <span className="mood-val" style={{ background: 'var(--lavender-light)', color: 'var(--lavender)' }}>{SLEEP_EMOJIS[form.sleep - 1]?.label}</span>}
            </div>
            <EmojiRow items={SLEEP_EMOJIS} value={form.sleep} onChange={v => setForm({ ...form, sleep: v })} />
          </div>

          <div className="mood-note">
            <label>Any thoughts? (optional)</label>
            <textarea placeholder="How is your day going? What is on your mind..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} maxLength={500} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, margin: '16px 0 10px', fontSize: '0.95rem' }}>What did you do today?</label>
            <div className="mood-tags">
              {TAGS.map(tag => (
                <button key={tag} className={`mood-tag ${form.tags.includes(tag) ? 'selected' : ''}`} onClick={() => toggleTag(tag)}>{tag}</button>
              ))}
            </div>
          </div>

          <div className="mood-submit">
            <button className="btn-primary" onClick={handleSubmit} disabled={loading || !form.mood || !form.energy || !form.stress || !form.sleep}>
              {loading ? 'Saving...' : checkedIn ? 'Update Check-in' : 'Save Check-in'}
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mood-history">
            <h2>Recent Check-ins</h2>
            <div className="mood-history-grid">
              {history.slice(0, 12).map((entry, i) => (
                <div className="mood-history-card" key={i}>
                  <div className="mh-date">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="mh-emoji">{MOOD_EMOJIS[entry.mood - 1]?.emoji}</div>
                  <div className="mh-stats">
                    <span className="mh-stat" style={{ background: 'var(--peach-light)', color: 'var(--peach)' }}>E:{entry.energy}</span>
                    <span className="mh-stat" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>S:{entry.stress}</span>
                    <span className="mh-stat" style={{ background: 'var(--lavender-light)', color: 'var(--lavender)' }}>Z:{entry.sleep}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
