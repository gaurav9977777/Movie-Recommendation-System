import React, { useState, useEffect } from 'react';

const WORDS = ['MOVIES', 'STORIES', 'WORLDS', 'EMOTIONS', 'UNIVERSES'];

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(cycle);
  }, []);

  return (
    <section style={{
      position: 'relative', zIndex: 1,
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)'
      }} />

      {/* Corner decorations */}
      {[
        { top: '12%', left: '8%', rotate: '0deg' },
        { top: '12%', right: '8%', rotate: '90deg' },
        { bottom: '12%', left: '8%', rotate: '270deg' },
        { bottom: '12%', right: '8%', rotate: '180deg' },
      ].map((style, i) => (
        <svg key={i} width="40" height="40" style={{ position: 'absolute', ...style, opacity: 0.4 }}>
          <path d="M0,40 L0,0 L40,0" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
        </svg>
      ))}

      {/* Orbital rings */}
      <div style={{
        position: 'absolute', width: 'min(700px,90vw)', height: 'min(700px,90vw)',
        border: '1px solid rgba(0,245,255,0.06)',
        borderRadius: '50%', animation: 'rotate-slow 30s linear infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 'min(500px,70vw)', height: 'min(500px,70vw)',
        border: '1px solid rgba(255,0,110,0.06)',
        borderRadius: '50%', animation: 'rotate-slow 20s linear infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 'min(300px,50vw)', height: 'min(300px,50vw)',
        border: '1px solid rgba(124,58,237,0.08)',
        borderRadius: '50%', animation: 'rotate-slow 12s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.4rem 1.2rem',
        border: '1px solid rgba(0,245,255,0.3)',
        borderRadius: '100px',
        background: 'rgba(0,245,255,0.05)',
        fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
        letterSpacing: '0.2em', color: 'var(--primary)',
        marginBottom: '2rem',
        animation: 'slide-in-up 0.8s ease 0.2s both'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
        NEURAL ENGINE v3.0 ACTIVE
      </div>

      {/* Main title */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 8vw, 6rem)',
        fontWeight: 900, lineHeight: 1.05,
        marginBottom: '1rem',
        animation: 'slide-in-up 0.8s ease 0.4s both',
        letterSpacing: '0.05em'
      }}>
        <span style={{ display: 'block', color: 'var(--text-primary)', animat: 'glitch' }}>
          DISCOVER
        </span>
        <span style={{
          display: 'block',
          background: 'linear-gradient(135deg, #00f5ff 0%, #7c3aed 50%, #ff006e 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 20px rgba(0,245,255,0.3))',
          transition: 'opacity 0.3s ease',
          opacity: visible ? 1 : 0,
        }}>
          {WORDS[wordIdx]}
        </span>
        <span style={{ display: 'block', color: 'var(--text-primary)' }}>
          YOU LOVE
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily: 'var(--font-body)', fontWeight: 300,
        fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
        color: 'var(--text-muted)', maxWidth: '560px', lineHeight: 1.7,
        marginBottom: '3rem',
        animation: 'slide-in-up 0.8s ease 0.6s both',
        letterSpacing: '0.02em'
      }}>
        AI-powered recommendations using cosine similarity and TF-IDF vectorization.
        Tell us one movie you love — we'll map your taste to the cosmos.
      </p>

      {/* CTA buttons */}
      <div style={{
        display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
        animation: 'slide-in-up 0.8s ease 0.8s both'
      }}>
        <button onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            padding: '0.9rem 2.4rem',
            background: 'transparent',
            border: '2px solid var(--primary)',
            color: 'var(--primary)', borderRadius: '4px',
            fontFamily: 'var(--font-display)', fontSize: '0.75rem',
            letterSpacing: '0.2em', cursor: 'none',
            position: 'relative', overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--glow-cyan)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.color = 'var(--bg-void)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--primary)';
          }}
        >
          START EXPLORING
        </button>
        <button
          style={{
            padding: '0.9rem 2.4rem',
            background: 'rgba(255,0,110,0.1)',
            border: '1px solid rgba(255,0,110,0.3)',
            color: '#ff6b9d', borderRadius: '4px',
            fontFamily: 'var(--font-display)', fontSize: '0.75rem',
            letterSpacing: '0.2em', cursor: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,0,110,0.2)';
            e.currentTarget.style.borderColor = 'var(--secondary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,0,110,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,0,110,0.3)';
          }}
        >
          HOW IT WORKS
        </button>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        animation: 'float 2s ease-in-out infinite',
        opacity: 0.5
      }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          SCROLL
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="#00f5ff" strokeWidth="1" opacity="0.5" />
          <circle cx="8" cy="8" r="2.5" fill="#00f5ff" style={{ animation: 'data-flow 2s ease-in-out infinite' }} />
        </svg>
      </div>

      {/* Stats row */}
      <div style={{
        position: 'absolute', bottom: '4rem', left: '0', right: '0',
        display: 'flex', justifyContent: 'center', gap: '3rem',
        animation: 'slide-in-up 0.8s ease 1s both',
        pointerEvents: 'none',
      }}>
        {[
          { val: '5000+', label: 'MOVIES' },
          { val: 'TF-IDF', label: 'ALGORITHM' },
          { val: '99%', label: 'ACCURACY' },
          { val: '<50ms', label: 'RESPONSE' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.1rem',
              color: 'var(--primary)', letterSpacing: '0.05em'
            }}>{stat.val}</div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.6rem',
              color: 'var(--text-muted)', letterSpacing: '0.2em', marginTop: '0.2rem'
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
