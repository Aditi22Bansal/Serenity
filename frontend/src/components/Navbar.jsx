import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#E8F5EE"/><path d="M16 8c-2 3-6 6-6 10a6 6 0 0012 0c0-4-4-7-6-10z" fill="#7BC8A4"/><path d="M16 13v8M14 17h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Serenity
        </Link>

        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          <Link to="/" className={isActive('/')}>Home</Link>
          {user && <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>}
          {user && <Link to="/assessment" className={isActive('/assessment')}>Assessment</Link>}
          {user && <Link to="/mood" className={isActive('/mood')}>Mood</Link>}
          {user && <Link to="/breathe" className={isActive('/breathe')}>Breathe</Link>}
          {user && <Link to="/journal" className={isActive('/journal')}>Journal</Link>}
          {user && <Link to="/goals" className={isActive('/goals')}>Goals</Link>}
          {user && <Link to="/activity" className={isActive('/activity')}>Activity</Link>}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/profile" className="nav-user">
                <span className="nav-user-avatar">{user.name?.[0]?.toUpperCase()}</span>
                {user.name?.split(' ')[0]}
              </Link>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="nav-cta btn-sm">Login</button></Link>
              <Link to="/register"><button className="btn-secondary btn-sm" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>Sign Up</button></Link>
            </>
          )}
        </div>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
