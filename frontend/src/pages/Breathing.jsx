import { useState, useEffect, useRef, useCallback } from 'react';
import { saveBreathingSession, getBreathingHistory, getBreathingStats } from '../utils/api';
import './Breathing.css';

const TECHNIQUES = [
  {
    id: '4-7-8', name: '4-7-8 Relaxing', desc: 'Deep calm & sleep aid',
    inhale: 4, hold: 7, exhale: 8, color: '#B8A9C9',
    fullDesc: 'Developed by Dr. Andrew Weil, the 4-7-8 technique is a natural tranquilizer for the nervous system. The extended exhale (8 seconds) activates your parasympathetic nervous system, slowing heart rate and promoting deep relaxation. The long hold phase (7 seconds) allows maximum oxygen absorption.',
    bestFor: 'Falling asleep faster, calming anxiety attacks, reducing pre-event nerves',
    science: 'The extended exhale stimulates the vagus nerve, triggering a relaxation response. Regular practice lowers resting heart rate and cortisol levels over time.',
  },
  {
    id: 'box', name: 'Box Breathing', desc: 'Focus & balance',
    inhale: 4, hold: 4, exhale: 4, hold2: 4, color: '#89B4E8',
    fullDesc: 'Used by Navy SEALs and elite athletes, Box Breathing creates equal phases of inhale, hold, exhale, and hold — forming a "box" pattern. This symmetry brings the autonomic nervous system into balance, equally engaging both stimulation and relaxation.',
    bestFor: 'Sharpening focus before tasks, managing acute stress, regaining composure in high-pressure situations',
    science: 'The equal 4-phase pattern balances CO2 and O2 levels in the blood, optimizing brain function. The two hold phases train breath control and mental discipline.',
  },
  {
    id: 'calm', name: 'Calm Breath', desc: 'Gentle relaxation',
    inhale: 4, hold: 2, exhale: 6, color: '#7BC8A4',
    fullDesc: 'Calm Breath is the gentlest technique — ideal for beginners or daily maintenance. The shorter hold (2 seconds) makes it feel effortless, while the extended exhale (6 seconds) still activates relaxation. It is sustainable for longer sessions without feeling strained.',
    bestFor: 'Daily stress relief, gentle wind-down after work, maintaining calm throughout the day',
    science: 'The 2:3 inhale-to-exhale ratio gently shifts the nervous system toward rest-and-digest mode without the intensity of deeper techniques. Safe and effective for all experience levels.',
  },
  {
    id: 'energize', name: 'Energize', desc: 'Wake up & focus',
    inhale: 3, hold: 0, exhale: 3, color: '#F5C7A9',
    fullDesc: 'The Energize technique uses rapid, equal-length breaths with no hold phase. This creates a rhythmic, invigorating breathing pattern that increases oxygen flow to the brain and body. Unlike the other techniques, this one is designed to stimulate rather than calm.',
    bestFor: 'Morning wake-up, mid-afternoon energy slumps, pre-workout preparation, overcoming grogginess',
    science: 'The fast 1:1 ratio without holds increases respiratory rate, boosting blood oxygen saturation. This activates the sympathetic nervous system for alertness — the opposite of relaxation techniques.',
  },
];

export default function Breathing() {
  const [technique, setTechnique] = useState(TECHNIQUES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('ready');
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const intervalRef = useRef(null);
  const phaseRef = useRef('ready');
  const phaseTimeRef = useRef(0);
  const cycleRef = useRef(0);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [hRes, sRes] = await Promise.all([getBreathingHistory(), getBreathingStats()]);
      setHistory(hRes.data);
      setStats(sRes.data);
    } catch (err) { console.error(err); }
  };

  const getPhaseLength = useCallback((p) => {
    if (p === 'inhale') return technique.inhale;
    if (p === 'hold') return technique.hold;
    if (p === 'exhale') return technique.exhale;
    if (p === 'hold2') return technique.hold2 || 0;
    return 0;
  }, [technique]);

  const getNextPhase = useCallback((currentPhase) => {
    if (currentPhase === 'inhale') return technique.hold > 0 ? 'hold' : 'exhale';
    if (currentPhase === 'hold') return 'exhale';
    if (currentPhase === 'exhale') return technique.hold2 ? 'hold2' : 'inhale';
    if (currentPhase === 'hold2') return 'inhale';
    return 'inhale';
  }, [technique]);

  const startSession = () => {
    setIsRunning(true);
    setPhase('inhale');
    phaseRef.current = 'inhale';
    setPhaseTime(technique.inhale);
    phaseTimeRef.current = technique.inhale;
    setCycle(1);
    cycleRef.current = 1;
    setElapsed(0);

    intervalRef.current = setInterval(() => {
      setElapsed(e => e + 1);
      phaseTimeRef.current -= 1;
      setPhaseTime(phaseTimeRef.current);

      if (phaseTimeRef.current <= 0) {
        const next = getNextPhase(phaseRef.current);

        if (next === 'inhale') {
          cycleRef.current += 1;
          setCycle(cycleRef.current);
          if (cycleRef.current > totalCycles) {
            finishSession();
            return;
          }
        }

        phaseRef.current = next;
        setPhase(next);
        const len = getPhaseLength(next);
        phaseTimeRef.current = len;
        setPhaseTime(len);
      }
    }, 1000);
  };

  const stopSession = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setPhase('ready');
    phaseRef.current = 'ready';
    setPhaseTime(0);
    setCycle(0);
    setElapsed(0);
  };

  const finishSession = async () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setPhase('done');
    try {
      await saveBreathingSession({
        technique: technique.id,
        durationSeconds: elapsed,
        cyclesCompleted: totalCycles,
      });
      loadData();
    } catch (err) { console.error(err); }
  };

  useEffect(() => { return () => clearInterval(intervalRef.current); }, []);

  const phaseLabel = phase === 'inhale' ? 'Breathe In' : phase === 'hold' || phase === 'hold2' ? 'Hold' : phase === 'exhale' ? 'Breathe Out' : phase === 'done' ? 'Complete' : 'Ready';
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="breathe-page">
      <div className="breathe-container">
        <div className="breathe-header">
          <h1>Breathing Studio</h1>
          <p>Guided breathing exercises to calm your mind and restore balance</p>
        </div>

        {stats && (
          <div className="breathe-stats-row">
            <div className="breathe-stat"><div className="bs-val" style={{ color: 'var(--green)' }}>{stats.totalSessions}</div><div className="bs-label">Total Sessions</div></div>
            <div className="breathe-stat"><div className="bs-val" style={{ color: 'var(--blue)' }}>{stats.totalMinutes}</div><div className="bs-label">Minutes Breathed</div></div>
            <div className="breathe-stat"><div className="bs-val" style={{ color: 'var(--lavender)' }}>{stats.favorite}</div><div className="bs-label">Favorite Technique</div></div>
          </div>
        )}

        {!isRunning && phase !== 'done' && (
          <>
            <div className="technique-select">
              {TECHNIQUES.map(t => (
                <div key={t.id} className={`tech-card ${technique.id === t.id ? 'selected' : ''}`} onClick={() => setTechnique(t)}>
                  <div className="tech-icon-bar" style={{ background: t.color }} />
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                  <div className="tech-timing">{t.inhale}-{t.hold}-{t.exhale}{t.hold2 ? `-${t.hold2}` : ''}</div>
                </div>
              ))}
            </div>

            {/* Selected technique detail */}
            <div className="tech-detail-card">
              <div className="tech-detail-header">
                <div className="tech-detail-bar" style={{ background: technique.color }} />
                <div>
                  <h3>{technique.name}</h3>
                  <span className="tech-pattern-label">Pattern: {technique.inhale}s inhale → {technique.hold > 0 ? `${technique.hold}s hold → ` : ''}{technique.exhale}s exhale{technique.hold2 ? ` → ${technique.hold2}s hold` : ''}</span>
                </div>
              </div>
              <p className="tech-full-desc">{technique.fullDesc}</p>
              <div className="tech-detail-grid">
                <div className="tech-detail-item">
                  <h4>Best For</h4>
                  <p>{technique.bestFor}</p>
                </div>
                <div className="tech-detail-item">
                  <h4>How It Works</h4>
                  <p>{technique.science}</p>
                </div>
              </div>
            </div>

            {/* Comparison toggle */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <button className="btn-secondary btn-sm" onClick={() => setShowComparison(!showComparison)}>
                {showComparison ? 'Hide Comparison' : 'Compare All Techniques'}
              </button>
            </div>

            {showComparison && (
              <div className="tech-comparison-card">
                <h3>Technique Comparison</h3>
                <div className="tech-comparison-table-wrap">
                  <table className="tech-comparison-table">
                    <thead>
                      <tr>
                        <th>Technique</th>
                        <th>Pattern</th>
                        <th>Cycle Duration</th>
                        <th>Effect</th>
                        <th>Intensity</th>
                        <th>Best Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="tc-dot" style={{ background: '#B8A9C9' }} /> 4-7-8 Relaxing</td>
                        <td>4s-7s-8s</td>
                        <td>19 seconds</td>
                        <td>Deep relaxation</td>
                        <td>
                          <div className="intensity-bar"><div className="intensity-fill" style={{ width: '90%', background: '#B8A9C9' }} /></div>
                        </td>
                        <td>Before sleep</td>
                      </tr>
                      <tr>
                        <td><span className="tc-dot" style={{ background: '#89B4E8' }} /> Box Breathing</td>
                        <td>4s-4s-4s-4s</td>
                        <td>16 seconds</td>
                        <td>Focus & balance</td>
                        <td>
                          <div className="intensity-bar"><div className="intensity-fill" style={{ width: '70%', background: '#89B4E8' }} /></div>
                        </td>
                        <td>During stress</td>
                      </tr>
                      <tr>
                        <td><span className="tc-dot" style={{ background: '#7BC8A4' }} /> Calm Breath</td>
                        <td>4s-2s-6s</td>
                        <td>12 seconds</td>
                        <td>Gentle calm</td>
                        <td>
                          <div className="intensity-bar"><div className="intensity-fill" style={{ width: '45%', background: '#7BC8A4' }} /></div>
                        </td>
                        <td>Anytime</td>
                      </tr>
                      <tr>
                        <td><span className="tc-dot" style={{ background: '#F5C7A9' }} /> Energize</td>
                        <td>3s-3s</td>
                        <td>6 seconds</td>
                        <td>Stimulation</td>
                        <td>
                          <div className="intensity-bar"><div className="intensity-fill" style={{ width: '30%', background: '#F5C7A9' }} /></div>
                        </td>
                        <td>Morning / Pre-task</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="tech-key-diff">
                  <h4>Key Differences</h4>
                  <ul>
                    <li><strong>Exhale length determines calming effect</strong> — 4-7-8 has the longest exhale (8s) making it the most deeply calming. Energize has equal inhale/exhale for stimulation instead.</li>
                    <li><strong>Hold phases build control</strong> — Box Breathing has two holds (after inhale and exhale), training breath discipline. Calm Breath has a short hold. Energize skips holds entirely.</li>
                    <li><strong>Cycle duration matters</strong> — Longer cycles (4-7-8 at 19s) slow your breathing rate more dramatically. Shorter cycles (Energize at 6s) maintain a faster, energizing rhythm.</li>
                    <li><strong>Nervous system activation</strong> — 4-7-8, Box, and Calm activate the parasympathetic (rest) system. Energize uniquely activates the sympathetic (alert) system.</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}

        <div className="breathe-studio">
          <div className="breathe-circle-wrap">
            <div className={`breathe-circle-outer ${isRunning ? 'active' : ''}`} />
            <div className={`breathe-ring-pulse ${isRunning ? 'active' : ''}`} />
            <div className={`breathe-circle ${phase}`}>
              {isRunning ? phaseTime : ''}
            </div>
          </div>

          <div className={`breathe-phase ${phase}`}>{phaseLabel}</div>

          {isRunning && (
            <>
              <div className="breathe-timer">{formatTime(elapsed)}</div>
              <div className="breathe-cycle-info">Cycle {Math.min(cycle, totalCycles)} of {totalCycles} — {technique.name}</div>
            </>
          )}

          {phase === 'done' && (
            <>
              <div className="breathe-timer" style={{ color: 'var(--green)' }}>Done</div>
              <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>
                You completed {totalCycles} cycles of {technique.name} in {formatTime(elapsed)}.
              </p>
            </>
          )}

          <div className="breathe-controls">
            {!isRunning && phase !== 'done' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cycles:</label>
                  <select value={totalCycles} onChange={e => setTotalCycles(parseInt(e.target.value))} className="form-input" style={{ width: 70, padding: '8px 12px' }}>
                    {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <button className="btn-primary" onClick={startSession}>Start Breathing</button>
              </>
            )}
            {isRunning && (
              <button className="btn-secondary" onClick={stopSession}>Stop</button>
            )}
            {phase === 'done' && (
              <button className="btn-primary" onClick={() => { setPhase('ready'); setElapsed(0); }}>New Session</button>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="breathe-history">
            <h2>Recent Sessions</h2>
            <div className="bh-grid">
              {history.map((s, i) => {
                const t = TECHNIQUES.find(t => t.id === s.technique);
                return (
                  <div className="bh-card" key={i}>
                    <div className="bh-dot" style={{ background: t?.color || 'var(--green)' }} />
                    <div className="bh-info">
                      <strong>{t?.name || s.technique}</strong>
                      <span>{s.cyclesCompleted} cycles — {Math.round(s.durationSeconds / 60)}min — {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
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
