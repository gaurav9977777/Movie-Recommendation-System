import React, { useState, useEffect } from 'react';

const BOOT_LINES = [
  '> INITIALIZING CINEMATRIX NEURAL ENGINE...',
  '> LOADING COSINE SIMILARITY MATRIX...',
  '> CALIBRATING TF-IDF VECTORIZER...',
  '> ESTABLISHING TMDB API LINK...',
  '> WARMING UP RECOMMENDATION CORES...',
  '> SYNCING MOVIE DATABASE [████████████] 100%',
  '> ALL SYSTEMS OPERATIONAL',
  '> WELCOME TO CINEMATRIX AI ⬡',
];

export default function LoadingScreen() {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[lineIdx]]);
        setProgress(Math.round(((lineIdx + 1) / BOOT_LINES.length) * 100));
        lineIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-void)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 99999,
      opacity: done ? 0 : 1,
      transition: 'opacity 0.6s ease',
      pointerEvents: done ? 'none' : 'all',
    }}>
      {/* Rotating hexagon */}
      <div style={{
        width: 120, height: 120, marginBottom: '2rem', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg viewBox="0 0 100 100" style={{
          width: '100%', height: '100%', position: 'absolute',
          animation: 'rotate-slow 4s linear infinite',
          filter: 'drop-shadow(0 0 10px #00f5ff)'
        }}>
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="none" stroke="#00f5ff" strokeWidth="1.5" opacity="0.6" />
        </svg>
        <svg viewBox="0 0 100 100" style={{
          width: '70%', height: '70%', position: 'absolute',
          animation: 'rotate-slow 3s linear infinite reverse',
          filter: 'drop-shadow(0 0 6px #ff006e)'
        }}>
          <polygon points="50,10 87,32 87,68 50,90 13,68 13,32"
            fill="none" stroke="#ff006e" strokeWidth="1" opacity="0.5" />
        </svg>
        <div style={{
          color: 'var(--primary)', fontFamily: 'var(--font-display)',
          fontSize: '0.6rem', letterSpacing: '0.1em', zIndex: 1,
          textShadow: 'var(--glow-cyan)'
        }}>AI</div>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
        letterSpacing: '0.3em', color: 'var(--primary)',
        textShadow: 'var(--glow-cyan)', marginBottom: '2rem',
        animation: 'flicker 4s infinite'
      }}>
        CINEMATRIX
      </h1>

      {/* Boot terminal */}
      <div style={{
        width: 'min(580px, 90vw)',
        background: 'rgba(0,10,20,0.95)',
        border: '1px solid rgba(0,245,255,0.2)',
        borderRadius: '8px', padding: '1.5rem',
        fontFamily: 'monospace', fontSize: '0.75rem',
        color: 'rgba(0,245,255,0.8)',
        minHeight: '180px',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            marginBottom: '0.3rem',
            color: i === lines.length - 1 ? '#00f5ff' : 'rgba(0,245,255,0.6)',
            animation: 'slide-in-up 0.3s ease'
          }}>
            {line}
          </div>
        ))}
        {lines.length < BOOT_LINES.length && (
          <span style={{
            display: 'inline-block', width: '8px', height: '14px',
            background: 'var(--primary)', marginLeft: '2px',
            animation: 'blink 0.7s step-end infinite',
            verticalAlign: 'middle'
          }} />
        )}
      </div>

      {/* Progress bar */}
      <div style={{
        width: 'min(580px, 90vw)', marginTop: '1rem',
        height: '2px', background: 'rgba(0,245,255,0.1)',
        borderRadius: '2px', overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          width: `${progress}%`, transition: 'width 0.3s ease',
          boxShadow: 'var(--glow-cyan)'
        }} />
      </div>
      <div style={{
        color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem', marginTop: '0.5rem', letterSpacing: '0.2em'
      }}>
        {progress}% LOADED
      </div>
    </div>
  );
}
