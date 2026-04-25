import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();
  const fadeRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content fade-up" ref={addRef}>
            <div className="hero-badge">✦ Wellness Reimagined</div>
            <h1>Your Journey to <span>Holistic Wellness</span> Starts Here</h1>
            <p>Understand your physical, mental, and emotional well-being through gentle assessments and personalized insights — designed to help you feel your best, every day.</p>
            <div className="hero-btns">
              <Link to={user ? '/assessment' : '/register'}>
                <button className="btn-primary">Start Assessment →</button>
              </Link>
              <Link to={user ? '/dashboard' : '/login'}>
                <button className="btn-secondary">View Dashboard</button>
              </Link>
            </div>
          </div>
          <div className="hero-visual fade-up" ref={addRef}>
            <div className="hero-illustration">
              <div className="inner-circle">🧘</div>
              <div className="hero-float f1">
                <div className="icon-circle" style={{ background: 'var(--green-light)' }}>💚</div>
                <div className="float-text"><strong>Wellness Score</strong><span>85 / 100</span></div>
              </div>
              <div className="hero-float f2">
                <div className="icon-circle" style={{ background: 'var(--blue-light)' }}>😊</div>
                <div className="float-text"><strong>Mood Today</strong><span>Feeling Great</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header fade-up" ref={addRef}>
            <span className="section-label green">What We Track</span>
            <h2>Wellness, In Every Dimension</h2>
            <p>A complete picture of your health — from body to mind to heart.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '🏃', title: 'Physical Wellness', desc: 'Track activity levels, sleep quality, nutrition habits, and key health metrics to keep your body thriving.', color: 'var(--green-light)' },
              { icon: '🧠', title: 'Mental Wellness', desc: 'Monitor stress patterns, focus levels, cognitive load, and mindfulness habits with gentle self-check-ins.', color: 'var(--blue-light)' },
              { icon: '💜', title: 'Emotional Insights', desc: 'Understand your emotional patterns, relationship health, and inner resilience through compassionate assessments.', color: 'var(--lavender-light)' },
              { icon: '🌿', title: 'Personalized Guidance', desc: 'Receive thoughtful, tailored suggestions based on your unique wellness profile — updated as you grow.', color: 'var(--peach-light)' },
            ].map((f, i) => (
              <div className="feature-card fade-up" ref={addRef} key={i}>
                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI INSIGHTS */}
      <section className="section insights-section" id="insights">
        <div className="container">
          <div className="insights-grid">
            <div className="fade-up" ref={addRef}>
              <span className="section-label blue">Gentle Intelligence</span>
              <h2 style={{ fontSize: '2.2rem', marginBottom: 16 }}>Insights That Understand You</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '1.02rem', marginBottom: 36, lineHeight: 1.8 }}>
                Our approach combines thoughtful analysis with human empathy. Every recommendation feels like advice from a caring friend.
              </p>
              {[
                { icon: '🛡️', title: 'Pattern Recognition', desc: 'We gently identify trends in your wellness data to surface what matters most.', bg: 'var(--green-light)' },
                { icon: '⚙️', title: 'Adaptive Learning', desc: 'Your insights evolve with you — adjusting as your lifestyle and needs change.', bg: 'var(--blue-light)' },
                { icon: '🤝', title: 'Human-Centered', desc: 'Every suggestion is crafted with empathy — focused on your journey, not just numbers.', bg: 'var(--lavender-light)' },
              ].map((c, i) => (
                <div className="insight-card" key={i}>
                  <div className="insight-icon" style={{ background: c.bg }}>{c.icon}</div>
                  <div><h4>{c.title}</h4><p>{c.desc}</p></div>
                </div>
              ))}
            </div>
            <div className="fade-up" ref={addRef}>
              <div className="insights-visual-box">
                <div className="insights-visual-inner">
                  <h3 style={{ marginBottom: 8 }}>Your Wellness Snapshot</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Personalized for you</p>
                  <div className="insight-bars">
                    {[
                      { label: 'Physical', pct: 82, color: 'var(--green)' },
                      { label: 'Mental', pct: 76, color: 'var(--blue)' },
                      { label: 'Emotional', pct: 88, color: 'var(--lavender)' },
                    ].map((b, i) => (
                      <div className="insight-bar-item" key={i}>
                        <div className="insight-bar-label"><span>{b.label}</span><span style={{ color: b.color }}>{b.pct}%</span></div>
                        <div className="insight-bar"><div className="insight-bar-fill" style={{ width: b.pct + '%', background: b.color }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-section" id="how-it-works">
        <div className="container">
          <div className="section-header fade-up" ref={addRef}>
            <span className="section-label peach">Simple Steps</span>
            <h2>How It Works</h2>
            <p>Three gentle steps to a clearer understanding of your wellness.</p>
          </div>
          <div className="steps-grid">
            {[
              { num: 1, cls: 's1', icon: '📝', title: 'Take Your Assessment', desc: 'Answer thoughtful, non-invasive questions about your physical, mental, and emotional health.' },
              { num: 2, cls: 's2', icon: '✨', title: 'Receive Your Insights', desc: 'Get a personalized wellness profile with clear scores, trends, and areas to focus on.' },
              { num: 3, cls: 's3', icon: '🌱', title: 'Grow & Improve', desc: 'Follow tailored suggestions and track your progress over time.' },
            ].map((s, i) => (
              <div className="step-card fade-up" ref={addRef} key={i}>
                <div className={`step-num ${s.cls}`}>{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-header fade-up" ref={addRef}>
            <span className="section-label green">What People Say</span>
            <h2>Real Stories, Real Wellness</h2>
            <p>Hear from people who transformed their daily well-being.</p>
          </div>
          <div className="testimonials-grid">
            {[
              { quote: '"Serenity helped me understand that my afternoon crashes were linked to my sleep habits. I feel more balanced than ever."', name: 'Ananya S.', role: 'Yoga Instructor', color: 'var(--green)' },
              { quote: '"The dashboard doesn\'t overwhelm me. It\'s like having a calm friend who gently nudges you in the right direction."', name: 'Rohan M.', role: 'Software Engineer', color: 'var(--blue)' },
              { quote: '"The emotional wellness insights were eye-opening. This platform made self-care feel approachable and warm."', name: 'Priya K.', role: 'Content Creator', color: 'var(--lavender)' },
            ].map((t, i) => (
              <div className="testimonial-card fade-up" ref={addRef} key={i}>
                <div className="testimonial-stars">★★★★★</div>
                <blockquote>{t.quote}</blockquote>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>{t.name[0]}</div>
                  <div className="author-info"><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="cta-banner fade-up" ref={addRef}>
          <h2>Ready to Begin Your Wellness Journey?</h2>
          <p>Take your first assessment today and discover a calmer, more balanced version of yourself.</p>
          <div className="cta-btns">
            <Link to={user ? '/assessment' : '/register'}><button className="btn-primary">Start Free Assessment →</button></Link>
            <Link to={user ? '/dashboard' : '/login'}><button className="btn-secondary">Learn More</button></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-logo" style={{ marginBottom: 0 }}>
                <svg viewBox="0 0 32 32" fill="none" width="32" height="32"><circle cx="16" cy="16" r="15" fill="#E8F5EE"/><path d="M16 8c-2 3-6 6-6 10a6 6 0 0012 0c0-4-4-7-6-10z" fill="#7BC8A4"/><path d="M16 13v8M14 17h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Serenity
              </div>
              <p>A gentle approach to understanding your complete well-being. Built with care, designed for you.</p>
            </div>
            <div className="footer-col"><h4>Platform</h4><a href="#features">Features</a><a href="#how-it-works">How It Works</a><Link to="/assessment">Assessment</Link><Link to="/dashboard">Dashboard</Link></div>
            <div className="footer-col"><h4>Resources</h4><a href="#">Wellness Blog</a><a href="#">Guided Meditations</a><Link to="/guide">User Guide</Link><a href="#">Community</a></div>
            <div className="footer-col"><h4>Company</h4><a href="#">About Us</a><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Contact</a></div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Serenity. Made with 🤍 for your wellness.</p>
            <div className="footer-socials">
              <a href="#">𝕏</a><a href="#">📷</a><a href="#">in</a><a href="#">▶</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
