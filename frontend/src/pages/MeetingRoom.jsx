import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MeetingRoom.css';

/* ── SVG Icons ── */
const IconMic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" />
    <path d="M19 11a7 7 0 01-14 0" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const IconMicOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v2a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
    <path d="M17 16.95A7 7 0 015 12" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const IconVideo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="13" height="12" rx="2" />
    <path d="M15 10l5-3v10l-5-3" />
  </svg>
);
const IconVideoOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const IconScreen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default function MeetingRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [cameraError, setCameraError] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const elapsedRef = useRef(null);

  // Start camera preview
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access denied:', err);
        setCameraError(true);
      }
    }
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, []);

  // Toggle mic
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => (t.enabled = micOn));
    }
  }, [micOn]);

  // Toggle video
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => (t.enabled = videoOn));
    }
  }, [videoOn]);

  // Session timer
  useEffect(() => {
    if (joined) {
      elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => { if (elapsedRef.current) clearInterval(elapsedRef.current); };
  }, [joined]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleJoin = () => setJoined(true);

  const handleLeave = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    navigate('/assessment');
  };

  const handleSendMsg = () => {
    if (!msgInput.trim()) return;
    setMessages(prev => [...prev, { from: 'You', text: msgInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMsgInput('');
    // Simulate therapist reply
    setTimeout(() => {
      setMessages(prev => [...prev, { from: booking?.counsellor?.name || 'Counsellor', text: 'Thank you for sharing. Let\'s explore that further.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 2000);
  };

  const counsellorName = booking?.counsellor?.name || 'Your Counsellor';
  const counsellorInitials = booking?.counsellor?.initials || 'C';
  const counsellorColor = booking?.counsellor?.color || '#B8A9C9';
  const sessionType = booking?.sessionType || 'video';

  // ── Pre-Join Lobby ──
  if (!joined) {
    return (
      <div className="meeting-page">
        <div className="meeting-lobby">
          <button className="meeting-back" onClick={() => navigate('/assessment')}>
            <IconBack /> Back to Assessment
          </button>

          <div className="lobby-content">
            <div className="lobby-preview">
              <div className="preview-container">
                {videoOn && !cameraError ? (
                  <video ref={videoRef} autoPlay muted playsInline className="preview-video" />
                ) : (
                  <div className="preview-placeholder">
                    <div className="preview-avatar" style={{ background: '#B8A9C9' }}>
                      You
                    </div>
                    {cameraError && <p className="camera-error">Camera access denied</p>}
                  </div>
                )}

                <div className="preview-controls">
                  <button
                    className={`ctrl-btn ${!micOn ? 'off' : ''}`}
                    onClick={() => setMicOn(!micOn)}
                    title={micOn ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {micOn ? <IconMic /> : <IconMicOff />}
                  </button>
                  <button
                    className={`ctrl-btn ${!videoOn ? 'off' : ''}`}
                    onClick={() => setVideoOn(!videoOn)}
                    title={videoOn ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {videoOn ? <IconVideo /> : <IconVideoOff />}
                  </button>
                </div>
              </div>
            </div>

            <div className="lobby-info">
              <h1>Ready to join?</h1>
              <div className="lobby-session-info">
                <div className="lobby-counsellor">
                  <div className="lobby-avatar" style={{ background: counsellorColor }}>
                    {counsellorInitials}
                  </div>
                  <div>
                    <h3>{counsellorName}</h3>
                    <p>{booking?.counsellor?.specializations?.join(', ') || 'Wellness Counselling'}</p>
                  </div>
                </div>

                <div className="lobby-details">
                  <div className="lobby-detail">
                    <span className="detail-label">Session Type</span>
                    <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                      {sessionType === 'video' && <IconVideo />}
                      {sessionType === 'audio' && <IconMic />}
                      {sessionType === 'chat' && <IconChat />}
                      {sessionType} Call
                    </span>
                  </div>
                  <div className="lobby-detail">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{booking?.duration || 45} minutes</span>
                  </div>
                </div>
              </div>

              <div className="lobby-checklist">
                <div className="check-item">
                  <div className={`check-dot ${micOn ? 'good' : 'warn'}`} />
                  <span>Microphone {micOn ? 'connected' : 'muted'}</span>
                </div>
                <div className="check-item">
                  <div className={`check-dot ${videoOn && !cameraError ? 'good' : 'warn'}`} />
                  <span>Camera {videoOn && !cameraError ? 'connected' : cameraError ? 'unavailable' : 'off'}</span>
                </div>
                <div className="check-item">
                  <div className="check-dot good" />
                  <span>Connection stable</span>
                </div>
              </div>

              <button className="btn-join" onClick={handleJoin}>
                <IconPhone /> Join Session
              </button>
              <p className="lobby-note">Your session is private and encrypted end-to-end</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── In-Session View ──
  return (
    <div className="meeting-page in-session">
      <div className="session-layout">
        {/* Main video area */}
        <div className={`session-main ${chatOpen ? 'chat-open' : ''}`}>
          {/* Counsellor video (simulated) */}
          <div className="session-remote">
            <div className="remote-placeholder">
              <div className="remote-avatar" style={{ background: counsellorColor }}>
                {counsellorInitials}
              </div>
              <h3>{counsellorName}</h3>
              <p className="remote-status">Connected</p>
              <div className="audio-wave">
                <span /><span /><span /><span /><span />
              </div>
            </div>
          </div>

          {/* Self video pip */}
          <div className="session-self">
            {videoOn && !cameraError ? (
              <video ref={videoRef} autoPlay muted playsInline className="self-video" />
            ) : (
              <div className="self-placeholder">You</div>
            )}
          </div>

          {/* Top bar */}
          <div className="session-top-bar">
            <div className="session-timer">
              <div className="timer-dot" />
              {formatTime(elapsed)}
            </div>
            <div className="session-title">{counsellorName}</div>
          </div>

          {/* Controls */}
          <div className="session-controls">
            <button
              className={`session-ctrl ${!micOn ? 'off' : ''}`}
              onClick={() => setMicOn(!micOn)}
              title={micOn ? 'Mute' : 'Unmute'}
            >
              {micOn ? <IconMic /> : <IconMicOff />}
              <span className="ctrl-label">{micOn ? 'Mute' : 'Unmute'}</span>
            </button>
            <button
              className={`session-ctrl ${!videoOn ? 'off' : ''}`}
              onClick={() => setVideoOn(!videoOn)}
              title={videoOn ? 'Stop Video' : 'Start Video'}
            >
              {videoOn ? <IconVideo /> : <IconVideoOff />}
              <span className="ctrl-label">{videoOn ? 'Stop Video' : 'Start Video'}</span>
            </button>
            <button className="session-ctrl" title="Share Screen">
              <IconScreen />
              <span className="ctrl-label">Share</span>
            </button>
            <button
              className={`session-ctrl ${chatOpen ? 'active' : ''}`}
              onClick={() => setChatOpen(!chatOpen)}
              title="Chat"
            >
              <IconChat />
              <span className="ctrl-label">Chat</span>
            </button>
            <button className="session-ctrl leave" onClick={handleLeave} title="Leave Session">
              <IconPhone />
              <span className="ctrl-label">Leave</span>
            </button>
          </div>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="session-chat">
            <div className="chat-header">
              <h3>Session Chat</h3>
              <button className="chat-close" onClick={() => setChatOpen(false)}>×</button>
            </div>
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-empty">
                  <p>Messages will appear here</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.from === 'You' ? 'sent' : 'received'}`}>
                  <div className="msg-header">
                    <span className="msg-from">{msg.from}</span>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                  <div className="msg-text">{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMsg()}
              />
              <button className="send-btn" onClick={handleSendMsg}>
                <IconSend />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
