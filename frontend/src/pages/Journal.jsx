import { useState, useEffect } from 'react';
import { createJournalEntry, getJournalEntries, deleteJournalEntry } from '../utils/api';
import './Journal.css';

const MOODS = [
  { id: 'great', emoji: '😄' },
  { id: 'good', emoji: '😊' },
  { id: 'okay', emoji: '😐' },
  { id: 'low', emoji: '😕' },
  { id: 'bad', emoji: '😞' },
];
const TAGS = ['Gratitude', 'Reflection', 'Goals', 'Emotions', 'Growth', 'Challenges', 'Wins', 'Learning'];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', mood: 'okay', tags: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadEntries(); }, [page]);

  const loadEntries = async () => {
    try {
      const res = await getJournalEntries(page);
      setEntries(res.data.entries);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setLoading(true);
    try {
      await createJournalEntry(form);
      setForm({ title: '', content: '', mood: 'okay', tags: [] });
      setShowCompose(false);
      loadEntries();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this journal entry?')) return;
    try {
      await deleteJournalEntry(id);
      loadEntries();
    } catch (err) { console.error(err); }
  };

  const toggleTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  return (
    <div className="journal-page">
      <div className="container">
        <div className="journal-header">
          <div>
            <h1>📓 Wellness Journal</h1>
            <p style={{ color: 'var(--text-light)' }}>{total} {total === 1 ? 'entry' : 'entries'} · Your personal reflection space</p>
          </div>
          <button className="btn-primary btn-sm" onClick={() => setShowCompose(!showCompose)}>
            {showCompose ? '✕ Close' : '✏️ New Entry'}
          </button>
        </div>

        {showCompose && (
          <div className="journal-compose">
            <div className="jc-top">
              <input type="text" placeholder="Entry title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxLength={200} />
              <div className="journal-mood-select">
                {MOODS.map(m => (
                  <button key={m.id} className={`journal-mood-btn ${form.mood === m.id ? 'selected' : ''}`} onClick={() => setForm({ ...form, mood: m.id })} title={m.id}>
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
            <textarea placeholder="What's on your mind? How are you feeling today? Write freely..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} maxLength={5000} />
            <div className="journal-tags-input">
              {TAGS.map(tag => (
                <button key={tag} className={`journal-tag-btn ${form.tags.includes(tag) ? 'selected' : ''}`} onClick={() => toggleTag(tag)}>{tag}</button>
              ))}
            </div>
            <div className="jc-footer">
              <span className="jc-count">{form.content.length} / 5000</span>
              <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={loading || !form.title.trim() || !form.content.trim()}>
                {loading ? 'Saving...' : 'Save Entry'} 📝
              </button>
            </div>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="journal-empty">
            <div className="empty-icon">📓</div>
            <h3>No journal entries yet</h3>
            <p>Start writing to track your thoughts and emotional journey.</p>
          </div>
        ) : (
          <div className="journal-list">
            {entries.map(entry => (
              <div className="journal-entry" key={entry._id}>
                <div className="je-header">
                  <h3>{MOODS.find(m => m.id === entry.mood)?.emoji} {entry.title}</h3>
                  <div className="je-meta">
                    <span className="je-date">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <button className="je-delete" onClick={() => handleDelete(entry._id)}>🗑️</button>
                  </div>
                </div>
                <div className="je-content">{entry.content}</div>
                {entry.tags?.length > 0 && (
                  <div className="je-tags">
                    {entry.tags.map((tag, i) => <span className="je-tag" key={i}>{tag}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {total > 10 && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} disabled={entries.length < 10}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}
