import { useState, useEffect } from 'react';
import { getHeatmapData } from '../utils/api';
import './Heatmap.css';

const ACTIVITY_ICONS = { assessment: '📝', mood: '😊', journal: '📓', breathing: '🫁' };
const ACTIVITY_COLORS = { assessment: { bg: '#E8F5EE', color: '#7BC8A4' }, mood: { bg: '#FFF3E6', color: '#F5C7A9' }, journal: { bg: '#E6F0FA', color: '#89B4E8' }, breathing: { bg: '#F0EBF5', color: '#B8A9C9' } };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function Heatmap() {
  const [data, setData] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getHeatmapData();
        setData(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  // Build 52 weeks of cells
  const buildWeeks = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let current = new Date(startDate);
    let week = [];
    while (current <= today) {
      const key = current.toISOString().split('T')[0];
      const activity = data?.activityMap?.[key];
      const count = activity?.count || 0;
      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;

      week.push({ date: key, count, level, activities: activity?.activities || [], dateObj: new Date(current) });

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      current.setDate(current.getDate() + 1);
    }
    // Add remaining days
    if (week.length > 0) {
      while (week.length < 7) week.push({ date: '', count: 0, level: -1, activities: [], empty: true });
      weeks.push(week);
    }
    return weeks;
  };

  // Build month labels with positions
  const buildMonthLabels = (weeks) => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week.find(d => d.date);
      if (firstDay && !firstDay.empty) {
        const month = firstDay.dateObj.getMonth();
        if (month !== lastMonth) {
          labels.push({ label: MONTHS[month], pos: i });
          lastMonth = month;
        }
      }
    });
    return labels;
  };

  const handleHover = (e, day) => {
    if (day.empty || day.count === 0) { setTooltip(null); return; }
    setTooltip({ x: e.clientX + 12, y: e.clientY - 40, day });
  };

  if (loading) return <div className="heatmap-page"><div className="container" style={{ textAlign: 'center', paddingTop: 80 }}><p style={{ color: 'var(--text-muted)' }}>Loading activity data...</p></div></div>;

  const weeks = buildWeeks();
  const monthLabels = buildMonthLabels(weeks);
  const stats = data?.stats;

  return (
    <div className="heatmap-page">
      <div className="container">
        <div className="heatmap-header">
          <h1>📅 Activity Heatmap</h1>
          <p>Your wellness activity over the past year — every day counts</p>
        </div>

        {stats && (
          <div className="heatmap-stats">
            <div className="hs-card"><div className="hs-val" style={{ color: 'var(--green)' }}>{stats.totalActiveDays}</div><div className="hs-label">Active Days</div></div>
            <div className="hs-card"><div className="hs-val" style={{ color: 'var(--blue)' }}>{stats.currentStreak}</div><div className="hs-label">Current Streak</div></div>
            <div className="hs-card"><div className="hs-val" style={{ color: 'var(--lavender)' }}>{stats.longestStreak}</div><div className="hs-label">Longest Streak</div></div>
            <div className="hs-card"><div className="hs-val" style={{ color: 'var(--peach)' }}>{stats.totalActivities}</div><div className="hs-label">Total Activities</div></div>
          </div>
        )}

        <div className="heatmap-card">
          <h3>🗓️ Wellness Contributions</h3>

          {/* Month labels */}
          <div className="heatmap-labels">
            {monthLabels.map((m, i) => (
              <span key={i} className="heatmap-month-label" style={{ marginLeft: i === 0 ? m.pos * 17 : (m.pos - (monthLabels[i - 1]?.pos || 0)) * 17 - 24 }}>
                {m.label}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex' }}>
            {/* Day labels */}
            <div className="heatmap-day-labels">
              {DAYS.map((d, i) => <div className="heatmap-day-label" key={i}>{d}</div>)}
            </div>

            {/* Grid */}
            <div className="heatmap-grid">
              {weeks.map((week, wi) => (
                <div className="heatmap-week" key={wi}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={`heatmap-cell ${day.empty ? 'empty' : `level-${day.level}`}`}
                      onMouseEnter={e => handleHover(e, day)}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => day.count > 0 && setSelectedDay(day)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="heatmap-legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(l => <div key={l} className={`legend-cell level-${l}`} style={{ background: ['#EBEDF0', '#D4EDDA', '#A3D9B1', '#7BC8A4', '#4CAF7D'][l] }} />)}
            <span>More</span>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div className="heatmap-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            <div className="ht-date">{new Date(tooltip.day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div className="ht-count">{tooltip.day.count} activit{tooltip.day.count === 1 ? 'y' : 'ies'}</div>
            {tooltip.day.activities.slice(0, 4).map((a, i) => (
              <div className="ht-activity" key={i}>
                <span className="ht-activity-icon">{ACTIVITY_ICONS[a.type]}</span> {a.detail}
              </div>
            ))}
          </div>
        )}

        {/* Selected day detail */}
        {selectedDay && (
          <div className="day-detail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>📌 {new Date(selectedDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
              <button className="btn-secondary btn-sm" onClick={() => setSelectedDay(null)} style={{ padding: '6px 16px' }}>✕ Close</button>
            </div>
            <div className="day-activities">
              {selectedDay.activities.map((a, i) => {
                const ac = ACTIVITY_COLORS[a.type] || ACTIVITY_COLORS.assessment;
                return (
                  <div className="day-activity" key={i}>
                    <div className="da-icon">{ACTIVITY_ICONS[a.type]}</div>
                    <span className="da-type" style={{ background: ac.bg, color: ac.color }}>{a.type}</span>
                    <span>{a.detail}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
