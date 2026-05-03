import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Counselling.css';

const STORAGE_KEY = 'serenity_booking';

/* ── Mock Counsellor Data ── */
const COUNSELLORS = [
  {
    id: 1,
    name: 'Dr. Ananya Sharma',
    initials: 'AS',
    color: '#B8A9C9',
    specializations: ['Anxiety', 'Stress', 'Mindfulness'],
    rating: 4.9,
    reviews: 124,
    language: 'English',
    bio: 'A compassionate therapist with 8+ years of experience helping individuals navigate anxiety and build resilience through evidence-based approaches.',
  },
  {
    id: 2,
    name: 'Dr. Rohan Mehta',
    initials: 'RM',
    color: '#89B4E8',
    specializations: ['Career', 'Relationships', 'Self-Esteem'],
    rating: 4.8,
    reviews: 97,
    language: 'Hindi',
    bio: 'Specializing in career-related stress and relationship dynamics, Rohan creates a safe space for clients to explore their goals and overcome blocks.',
  },
  {
    id: 3,
    name: 'Dr. Priya Nair',
    initials: 'PN',
    color: '#7BC8A4',
    specializations: ['Stress', 'Emotional Wellness', 'Grief'],
    rating: 4.7,
    reviews: 86,
    language: 'English',
    bio: 'With a warm, non-judgmental approach, Priya guides clients through emotional challenges including grief, burnout, and life transitions.',
  },
];

const LANGUAGES = ['All', 'English', 'Hindi'];
const EXPERTISE = ['All', 'Anxiety', 'Stress', 'Career', 'Relationships', 'Mindfulness', 'Emotional Wellness', 'Self-Esteem', 'Grief'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const UNAVAILABLE = [2, 5, 7];

function getNext7Days() {
  const days = [];
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({ dayName: names[d.getDay()], dayNum: d.getDate(), month: months[d.getMonth()], full: d.toDateString() });
  }
  return days;
}

function parseBookingDate(dateStr, timeStr) {
  const d = new Date(dateStr);
  const [time, period] = timeStr.split(' ');
  let [hours, mins] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  d.setHours(hours, mins, 0, 0);
  return d;
}

/* ── SVG Icons ── */
const IconHeart = () => (
  <svg viewBox="0 0 120 120" width="120" height="120" fill="none">
    <circle cx="60" cy="60" r="58" fill="#E8F5EE" />
    <circle cx="60" cy="60" r="42" fill="#F0EBF5" opacity="0.6" />
    <path d="M60 88S32 72 32 54a14 14 0 0128 0 14 14 0 0128 0c0 18-28 34-28 34z" fill="#B8A9C9" opacity="0.85" />
    <path d="M60 82S38 68 38 54a10 10 0 0122 0 10 10 0 0122 0c0 14-22 28-22 28z" fill="#7BC8A4" />
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IconVideo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="13" height="12" rx="2" /><path d="M15 10l5-3v10l-5-3" />
  </svg>
);
const IconAudio = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" /><path d="M19 11a7 7 0 01-14 0" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#7BC8A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconStar = () => <span className="star">★</span>;

/* ── Countdown Timer Hook ── */
function useCountdown(targetDate, durationMins = 45) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0, status: 'upcoming' });
  // status: 'upcoming' | 'joinable' | 'missed'
  const interval = useRef(null);

  useEffect(() => {
    if (!targetDate) return;
    const calc = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const sessionEnd = target + durationMins * 60 * 1000;
      const joinWindowStart = target - 5 * 60 * 1000; // 5 mins before
      const diff = target - now;

      if (now >= sessionEnd) {
        // Session duration has passed — missed
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0, status: 'missed' });
        clearInterval(interval.current);
        return;
      }
      if (now >= joinWindowStart && now < sessionEnd) {
        // Within join window (5 mins before to session end)
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0, status: 'joinable' });
        return;
      }
      // Still upcoming
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
        status: 'upcoming',
      });
    };
    calc();
    interval.current = setInterval(calc, 1000);
    return () => clearInterval(interval.current);
  }, [targetDate, durationMins]);

  return timeLeft;
}

export default function Counselling() {
  const navigate = useNavigate();

  // Check for existing booking
  const [booking, setBooking] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [step, setStep] = useState(1);
  const [rescheduling, setRescheduling] = useState(false);
  const [langFilter, setLangFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [sessionType, setSessionType] = useState('video');
  const [duration, setDuration] = useState(45);
  const [payMethod, setPayMethod] = useState('upi');
  const [paying, setPaying] = useState(false);
  const [reminder, setReminder] = useState(true);

  const dates = useMemo(() => getNext7Days(), []);
  const price = duration === 45 ? 499 : 699;

  const filtered = COUNSELLORS.filter(c => {
    if (langFilter !== 'All' && c.language !== langFilter) return false;
    if (expFilter !== 'All' && !c.specializations.includes(expFilter)) return false;
    return true;
  });

  const handleBook = (c) => {
    setSelectedCounsellor(c);
    setStep(3);
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      const sessionDate = parseBookingDate(selectedDate, selectedTime);
      const newBooking = {
        counsellor: selectedCounsellor,
        date: selectedDate,
        time: selectedTime,
        sessionType,
        duration,
        price,
        reminder: true,
        sessionDateTime: sessionDate.toISOString(),
        bookedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooking));
      setPaying(false);
      setStep(5);
      setBooking(newBooking);
    }, 2000);
  };

  const handleCancel = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBooking(null);
    setSelectedCounsellor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSessionType('video');
    setDuration(45);
    setStep(1);
  };

  const handleReschedule = () => {
    const counsellor = booking?.counsellor || selectedCounsellor;
    // Keep booking in localStorage — user already paid
    setSelectedDate(null);
    setSelectedTime(null);
    setSessionType(booking?.sessionType || 'video');
    setDuration(booking?.duration || 45);
    setRescheduling(true);
    setSelectedCounsellor(counsellor);
    setStep(3);
  };

  const handleConfirmReschedule = () => {
    const sessionDate = parseBookingDate(selectedDate, selectedTime);
    const updatedBooking = {
      ...booking,
      date: selectedDate,
      time: selectedTime,
      sessionType,
      duration,
      price: duration === 45 ? 499 : 699,
      sessionDateTime: sessionDate.toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooking));
    setBooking(updatedBooking);
    setRescheduling(false);
    setStep(5);
  };

  const handleCancelReschedule = () => {
    setRescheduling(false);
    setStep(1); // will show booked view via the early return
  };

  // Timer for existing booking
  const timerTarget = booking?.sessionDateTime || null;
  const timeLeft = useCountdown(timerTarget, booking?.duration || 45);

  const stepLabels = ['cta', 'browse', 'config', 'payment', 'confirm'];

  // ── If a booking exists and not rescheduling, show the booked session view ──
  if (booking && step !== 5 && !rescheduling) {
    const bc = booking.counsellor;
    const sessionStatus = timeLeft.status; // 'upcoming' | 'joinable' | 'missed'

    const handleJoinSession = () => {
      navigate('/meeting', { state: { booking } });
    };

    return (
      <div className="counsel-section">
        <div className="counsel-container">
          <div className="counsel-step-enter">
            <div className="booked-card">
              {sessionStatus === 'missed' ? (
                <>
                  <div className="booked-badge missed-badge">
                    <IconClock />
                    <span>Session Missed</span>
                  </div>
                  <h2>Session Has Ended</h2>
                  <p className="booked-sub">It looks like the scheduled time for your session has passed. You can reschedule or book a new session.</p>
                </>
              ) : sessionStatus === 'joinable' ? (
                <>
                  <div className="booked-badge live-badge">
                    <IconClock />
                    <span>Session Live</span>
                  </div>
                  <h2>Your Session is Ready</h2>
                  <p className="booked-sub">Your counsellor is waiting for you. Join the session now.</p>
                </>
              ) : (
                <>
                  <div className="booked-badge">
                    <IconClock />
                    <span>Upcoming Session</span>
                  </div>
                  <h2>Your Session is Booked</h2>
                  <p className="booked-sub">You&apos;ve taken a wonderful step for your well-being. Your session is coming up soon.</p>
                </>
              )}

              {/* Countdown Timer — only for upcoming */}
              {sessionStatus === 'upcoming' && (
                <div className="countdown-grid">
                  <div className="countdown-unit">
                    <span className="countdown-num">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="countdown-label">Days</span>
                  </div>
                  <div className="countdown-sep">:</div>
                  <div className="countdown-unit">
                    <span className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="countdown-label">Hours</span>
                  </div>
                  <div className="countdown-sep">:</div>
                  <div className="countdown-unit">
                    <span className="countdown-num">{String(timeLeft.mins).padStart(2, '0')}</span>
                    <span className="countdown-label">Minutes</span>
                  </div>
                  <div className="countdown-sep">:</div>
                  <div className="countdown-unit">
                    <span className="countdown-num">{String(timeLeft.secs).padStart(2, '0')}</span>
                    <span className="countdown-label">Seconds</span>
                  </div>
                </div>
              )}

              {/* Join Now Button — only when joinable */}
              {sessionStatus === 'joinable' && (
                <button className="session-join-btn" onClick={handleJoinSession}>
                  <IconVideo /> Join Session Now
                </button>
              )}

              {/* Missed Status */}
              {sessionStatus === 'missed' && (
                <div className="session-missed-badge">This session&apos;s scheduled time has passed</div>
              )}

              {/* Booking Details */}
              <div className="booked-details">
                <div className="booked-counsellor">
                  <div className="counsellor-avatar" style={{ background: bc?.color }}>{bc?.initials}</div>
                  <div>
                    <h4>{bc?.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{bc?.specializations?.join(', ')}</p>
                  </div>
                </div>
                <div className="booked-info-grid">
                  <div className="booked-info-item">
                    <span className="label">Date</span>
                    <span className="value">{booking.date}</span>
                  </div>
                  <div className="booked-info-item">
                    <span className="label">Time</span>
                    <span className="value">{booking.time}</span>
                  </div>
                  <div className="booked-info-item">
                    <span className="label">Type</span>
                    <span className="value" style={{ textTransform: 'capitalize' }}>{booking.sessionType} Call</span>
                  </div>
                  <div className="booked-info-item">
                    <span className="label">Duration</span>
                    <span className="value">{booking.duration} min</span>
                  </div>
                  <div className="booked-info-item">
                    <span className="label">Paid</span>
                    <span className="value" style={{ color: 'var(--green-dark)', fontFamily: 'Quicksand', fontWeight: 800 }}>₹{booking.price}</span>
                  </div>
                </div>
              </div>

              {/* Actions based on status */}
              {sessionStatus === 'missed' ? (
                <div className="booked-actions">
                  <button className="btn-primary btn-sm" onClick={handleReschedule}>Reschedule Session</button>
                  <button className="btn-secondary btn-sm" onClick={handleCancel}>Book New Session</button>
                </div>
              ) : sessionStatus === 'upcoming' ? (
                <div className="booked-actions">
                  <button className="btn-secondary btn-sm" onClick={handleReschedule}>Reschedule</button>
                  <button className="btn-secondary btn-sm" style={{ borderColor: '#E57373', color: '#E57373' }} onClick={handleCancel}>Cancel Booking</button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Booking Flow (5 steps) ──
  return (
    <div className="counsel-section">
      <div className="counsel-container">
        {/* Progress */}
        <div className="counsel-steps">
          {stepLabels.map((s, i) => (
            <div key={s} className={`c-step ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : ''}`} />
          ))}
        </div>

        {/* Step 1: CTA */}
        {step === 1 && (
          <div className="counsel-step-enter">
            <div className="cta-card">
              <div className="cta-illustration"><IconHeart /></div>
              <h2>You Deserve Support</h2>
              <p className="cta-message">
                Based on your results, talking to a professional could help you feel better and more balanced. Taking this step shows incredible strength.
              </p>
              <p className="cta-question">Would you like to connect with a certified counsellor?</p>
              <div className="cta-buttons">
                <button className="btn-primary" onClick={() => setStep(2)}>Yes, Book a Session</button>
                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Maybe Later</button>
              </div>
              <div className="cta-privacy">
                <IconLock />
                Your information is kept private and confidential
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Browse */}
        {step === 2 && (
          <div className="counsel-step-enter">
            <button className="counsel-back" onClick={() => setStep(1)}><IconBack /> Back</button>
            <div className="counsel-header">
              <span className="section-label green">Find Your Counsellor</span>
              <h2>Certified Professionals</h2>
              <p>Choose someone you feel comfortable with — every session is completely confidential.</p>
            </div>
            <div className="counsel-filters">
              <select value={langFilter} onChange={e => setLangFilter(e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>)}
              </select>
              <select value={expFilter} onChange={e => setExpFilter(e.target.value)}>
                {EXPERTISE.map(e => <option key={e} value={e}>{e === 'All' ? 'All Specializations' : e}</option>)}
              </select>
            </div>
            <div className="counsellor-grid">
              {filtered.map(c => (
                <div className="counsellor-card" key={c.id}>
                  <div className="counsellor-top">
                    <div className="counsellor-avatar" style={{ background: c.color }}>{c.initials}</div>
                    <div className="counsellor-info">
                      <h3>{c.name}</h3>
                      <div className="counsellor-rating">
                        <IconStar /> {c.rating} <span style={{ marginLeft: 4 }}>({c.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="counsellor-tags">
                    {c.specializations.map(s => <span className="counsellor-tag" key={s}>{s}</span>)}
                  </div>
                  <p className="counsellor-bio">{c.bio}</p>
                  <button className="btn-primary btn-sm" onClick={() => handleBook(c)}>Book Session</button>
                </div>
              ))}
              {filtered.length === 0 && (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                  No counsellors match your filters. Try adjusting them.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Session Config */}
        {step === 3 && selectedCounsellor && (
          <div className="counsel-step-enter">
            <button className="counsel-back" onClick={() => rescheduling ? handleCancelReschedule() : setStep(2)}><IconBack /> {rescheduling ? 'Cancel Reschedule' : 'Back to Counsellors'}</button>
            <div className="config-card">
              {rescheduling && (
                <div style={{ background: 'var(--blue-light)', borderRadius: 'var(--radius-sm)', padding: '12px 18px', marginBottom: 24, textAlign: 'center', fontSize: '0.88rem', fontWeight: 600, color: 'var(--blue)' }}>
                  Rescheduling — pick a new date & time. No additional payment needed.
                </div>
              )}
              <div className="config-selected">
                <div className="counsellor-avatar" style={{ background: selectedCounsellor.color }}>{selectedCounsellor.initials}</div>
                <div>
                  <h4>{selectedCounsellor.name}</h4>
                  <p>{selectedCounsellor.specializations.join(', ')}</p>
                </div>
              </div>

              <div className="config-section">
                <h3>Select Date</h3>
                <div className="date-picker">
                  {dates.map(d => (
                    <div key={d.full} className={`date-chip ${selectedDate === d.full ? 'selected' : ''}`} onClick={() => setSelectedDate(d.full)}>
                      <div className="day-name">{d.dayName}</div>
                      <div className="day-num">{d.dayNum}</div>
                      <div className="day-month">{d.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="config-section">
                <h3>Select Time</h3>
                <div className="time-grid">
                  {TIME_SLOTS.map((t, i) => (
                    <div
                      key={t}
                      className={`time-chip ${selectedTime === t ? 'selected' : ''} ${UNAVAILABLE.includes(i) ? 'unavailable' : ''}`}
                      onClick={() => !UNAVAILABLE.includes(i) && setSelectedTime(t)}
                    >{t}</div>
                  ))}
                </div>
              </div>

              <div className="config-section">
                <h3>Session Type</h3>
                <div className="type-toggle">
                  <button className={`type-btn ${sessionType === 'video' ? 'selected' : ''}`} onClick={() => setSessionType('video')}><IconVideo /> Video Call</button>
                  <button className={`type-btn ${sessionType === 'audio' ? 'selected' : ''}`} onClick={() => setSessionType('audio')}><IconAudio /> Audio Call</button>
                  <button className={`type-btn ${sessionType === 'chat' ? 'selected' : ''}`} onClick={() => setSessionType('chat')}><IconChat /> Chat</button>
                </div>
              </div>

              <div className="config-section">
                <h3>Session Duration</h3>
                <div className="duration-toggle">
                  <button className={`dur-btn ${duration === 45 ? 'selected' : ''}`} onClick={() => setDuration(45)}>45 Minutes</button>
                  <button className={`dur-btn ${duration === 60 ? 'selected' : ''}`} onClick={() => setDuration(60)}>1 Hour</button>
                </div>
              </div>

              <div className="config-price">
                <span className="price-label">Session Price</span>
                <span className="price-value">₹{price}</span>
              </div>

              <div className="config-nav">
                <button className="btn-secondary btn-sm" onClick={() => rescheduling ? handleCancelReschedule() : setStep(2)}>{rescheduling ? 'Cancel' : 'Back'}</button>
                {rescheduling ? (
                  <button className="btn-primary btn-sm" onClick={handleConfirmReschedule} disabled={!selectedDate || !selectedTime}>Confirm Reschedule</button>
                ) : (
                  <button className="btn-primary btn-sm" onClick={() => setStep(4)} disabled={!selectedDate || !selectedTime}>Continue to Payment</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="counsel-step-enter">
            <button className="counsel-back" onClick={() => setStep(3)}><IconBack /> Back</button>
            <div className="payment-card">
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="order-row"><span className="label">Counsellor</span><span className="value">{selectedCounsellor?.name}</span></div>
                <div className="order-row"><span className="label">Date</span><span className="value">{selectedDate}</span></div>
                <div className="order-row"><span className="label">Time</span><span className="value">{selectedTime}</span></div>
                <div className="order-row"><span className="label">Type</span><span className="value" style={{ textTransform: 'capitalize' }}>{sessionType} Call</span></div>
                <div className="order-row"><span className="label">Duration</span><span className="value">{duration} Minutes</span></div>
                <div className="order-row total"><span className="label">Total</span><span className="value">₹{price}</span></div>
              </div>

              <div className="payment-methods">
                <h3>Payment Method</h3>
                <div className={`pay-option ${payMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPayMethod('upi')}>
                  <div className="pay-radio" />
                  <div className="pay-icon" style={{ background: '#E8F5EE' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="#7BC8A4" strokeWidth="2"/><path d="M7 15l3-6 3 6M17 9v6" stroke="#7BC8A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div className="pay-label">UPI — Google Pay</div>
                    <div className="pay-sublabel">Pay securely with Google Pay</div>
                  </div>
                </div>
                <div className={`pay-option ${payMethod === 'card' ? 'selected' : ''}`} onClick={() => setPayMethod('card')}>
                  <div className="pay-radio" />
                  <div className="pay-icon" style={{ background: '#E6F0FA' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="#89B4E8" strokeWidth="2"/><line x1="2" y1="10" x2="22" y2="10" stroke="#89B4E8" strokeWidth="2"/></svg>
                  </div>
                  <div>
                    <div className="pay-label">Debit / Credit Card</div>
                    <div className="pay-sublabel">Visa, Mastercard, RuPay</div>
                  </div>
                </div>
              </div>

              {payMethod === 'card' && (
                <div className="card-fields">
                  <input className="form-input" placeholder="Card Number" maxLength={19} />
                  <div className="card-row">
                    <input className="form-input" placeholder="MM / YY" maxLength={5} />
                    <input className="form-input" placeholder="CVV" maxLength={4} type="password" />
                  </div>
                  <input className="form-input" placeholder="Cardholder Name" />
                </div>
              )}

              <div className="secure-badge">
                <IconLock />
                Your payment is safe and encrypted
              </div>

              <div className="pay-actions">
                <button className="btn-secondary btn-sm" onClick={() => setStep(3)}>Back</button>
                <button className="btn-primary" onClick={handlePay} disabled={paying}>
                  {paying ? <><span className="pay-spinner" /> Processing...</> : `Pay ₹${price}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="counsel-step-enter">
            <div className="confirm-card">
              <div className="confirm-check"><IconCheck /></div>
              <h2>Booking Confirmed!</h2>
              <p className="confirm-sub">You&apos;ve taken a wonderful step for your well-being.</p>

              <div className="confirm-details">
                <div className="order-row"><span className="label">Counsellor</span><span className="value">{selectedCounsellor?.name || booking?.counsellor?.name}</span></div>
                <div className="order-row"><span className="label">Date</span><span className="value">{selectedDate || booking?.date}</span></div>
                <div className="order-row"><span className="label">Time</span><span className="value">{selectedTime || booking?.time}</span></div>
                <div className="order-row"><span className="label">Type</span><span className="value" style={{ textTransform: 'capitalize' }}>{(sessionType || booking?.sessionType)} Call</span></div>
                <div className="order-row"><span className="label">Duration</span><span className="value">{(duration || booking?.duration)} min</span></div>
                <div className="order-row total"><span className="label">Paid</span><span className="value">₹{price || booking?.price}</span></div>
              </div>

              <div className="reminder-toggle">
                <span>Email & SMS Reminders</span>
                <div className={`toggle-switch ${reminder ? 'on' : ''}`} onClick={() => setReminder(!reminder)} />
              </div>

              <div className="confirm-actions">
                <Link to="/dashboard"><button className="btn-primary">View Dashboard</button></Link>
                <button className="btn-secondary" onClick={handleReschedule}>Reschedule / Cancel</button>
              </div>

              <p className="confirm-closing">Remember — seeking help is a sign of strength, not weakness.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
