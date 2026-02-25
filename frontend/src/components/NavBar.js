import React, { useState, useEffect } from 'react';

export default function NavBar({ apiOnline }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2.5rem',
      background: scrolled ? 'rgba(0,4,8,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <svg width="28" height="28" viewBox="0 0 100 100">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="none" stroke="#00f5ff" strokeWidth="3"
            style={{ filter: 'drop-shadow(0 0 8px #00f5ff)' }} />
          <text x="50" y="58" textAnchor="middle" fill="#00f5ff"
            fontFamily="Orbitron" fontSize="28" fontWeight="700">C</text>
        </svg>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '1rem',
          letterSpacing: '0.3em', color: 'var(--primary)',
          textShadow: 'var(--glow-cyan)'
        }}>CINEMATRIX</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '0.55rem',
          letterSpacing: '0.15em', color: 'var(--text-muted)',
          marginLeft: '-0.3rem'
        }}>AI</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {['ENGINE', 'ABOUT', 'GITHUB'].map(item => (
          <a key={item} href="#" style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.75rem',
            letterSpacing: '0.2em', color: 'var(--text-muted)',
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >{item}</a>
        ))}

        {/* API Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.15em',
          color: apiOnline ? '#00ff88' : '#ff4466',
          padding: '0.3rem 0.8rem',
          border: `1px solid ${apiOnline ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,102,0.3)'}`,
          borderRadius: '4px',
          background: apiOnline ? 'rgba(0,255,136,0.05)' : 'rgba(255,68,102,0.05)',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: apiOnline ? '#00ff88' : '#ff4466',
            display: 'inline-block',
            boxShadow: apiOnline ? '0 0 6px #00ff88' : '0 0 6px #ff4466',
            animation: apiOnline ? 'pulse-glow 1.5s infinite' : 'none'
          }} />
          {apiOnline ? 'ONLINE' : 'DEMO'}
        </div>
      </div>
    </nav>
  );
}
