import { useState, useEffect, useRef, useCallback } from 'react';
import { saveBreathingSession, getBreathingHistory, getBreathingStats } from '../utils/api';
import './Breathing.css';

const TECHNIQUES = [
  { id: '4-7-8', name: '4-7-8 Relaxing', icon: '🌙', desc: 'Deep calm & sleep aid', inhale: 4, hold: 7, exhale: 8 },
  { id: 'box', name: 'Box Breathing', icon: '📦', desc: 'Focus & balance', inhale: 4, hold: 4, exhale: 4, hold2: 4 },
  { id: 'calm', name: 'Calm Breath', icon: '🕊️', desc: 'Gentle relaxation', inhale: 4, hold: 2, exhale: 6 },
  { id: 'energize', name: 'Energize', icon: '⚡', desc: 'Wake up & focus', inhale: 3, hold: 0, exhale: 3 },
];

export default function Breathing() {
  const [technique, setTechnique] = useState(TECHNIQUES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale, hold2, done
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
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
        
        // If going back to inhale, we completed a cycle
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
      <div className="container">
        <div className="breathe-header">
          <h1>🫁 Breathing Studio</h1>
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
          <div className="technique-select">
            {TECHNIQUES.map(t => (
              <div key={t.id} className={`tech-card ${technique.id === t.id ? 'selected' : ''}`} onClick={() => setTechnique(t)}>
                <div className="tech-icon">{t.icon}</div>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
                <div className="tech-timing">{t.inhale}-{t.hold}-{t.exhale}{t.hold2 ? `-${t.hold2}` : ''}</div>
              </div>
            ))}
          </div>
        )}

        <div className="breathe-studio">
          <div className="breathe-circle-wrap">
            <div className={`breathe-circle-outer ${isRunning ? 'active' : ''}`} />
            <div className={`breathe-ring-pulse ${isRunning ? 'active' : ''}`} />
            <div className={`breathe-circle ${phase}`}>
              {isRunning ? phaseTime : '🌿'}
            </div>
          </div>

          <div className={`breathe-phase ${phase}`}>{phaseLabel}</div>
          
          {isRunning && (
            <>
              <div className="breathe-timer">{formatTime(elapsed)}</div>
              <div className="breathe-cycle-info">Cycle {Math.min(cycle, totalCycles)} of {totalCycles} · {technique.name}</div>
            </>
          )}

          {phase === 'done' && (
            <>
              <div className="breathe-timer" style={{ color: 'var(--green)' }}>🎉</div>
              <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>
                Beautiful! You completed {totalCycles} cycles of {technique.name} in {formatTime(elapsed)}.
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
                <button className="btn-primary" onClick={startSession}>▶ Start Breathing</button>
              </>
            )}
            {isRunning && (
              <button className="btn-secondary" onClick={stopSession}>⏹ Stop</button>
            )}
            {phase === 'done' && (
              <button className="btn-primary" onClick={() => { setPhase('ready'); setElapsed(0); }}>🔄 New Session</button>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="breathe-history">
            <h2>🕐 Recent Sessions</h2>
            <div className="bh-grid">
              {history.map((s, i) => {
                const t = TECHNIQUES.find(t => t.id === s.technique);
                return (
                  <div className="bh-card" key={i}>
                    <div className="bh-icon">{t?.icon || '🫁'}</div>
                    <div className="bh-info">
                      <strong>{t?.name || s.technique}</strong>
                      <span>{s.cyclesCompleted} cycles · {Math.round(s.durationSeconds / 60)}min · {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
