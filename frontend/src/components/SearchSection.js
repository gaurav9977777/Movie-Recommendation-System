import React, { useState, useRef, useCallback, useEffect } from 'react';

export default function SearchSection({ onSearch, isSearching, movies }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const updateSuggestions = useCallback((val) => {
    if (!val.trim() || val.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = movies
      .filter(m => m.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setActiveIdx(-1);
  }, [movies]);

  useEffect(() => {
    updateSuggestions(query);
  }, [query, updateSuggestions]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSubmit = (title) => {
    const toSearch = title || query;
    if (!toSearch.trim()) return;
    setQuery(toSearch);
    setShowSuggestions(false);
    onSearch(toSearch);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') handleSubmit();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) handleSubmit(suggestions[activeIdx]);
      else handleSubmit();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Featured movies for quick picks
  const featured = ['Inception', 'The Dark Knight', 'Interstellar', 'Pulp Fiction', 'Avatar'];

  return (
    <section id="search-section" style={{
      position: 'relative', zIndex: 10,
      padding: 'clamp(4rem,10vh,8rem) 1.5rem',
      maxWidth: '900px', margin: '0 auto',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '0.65rem',
          letterSpacing: '0.4em', color: 'var(--secondary)',
          marginBottom: '0.8rem'
        }}>
          NEURAL SEARCH INTERFACE
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 2.5rem)',
          fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1.2,
          background: 'linear-gradient(135deg, var(--text-primary), rgba(168,218,255,0.7))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          ENTER A FILM. RECEIVE THE UNIVERSE.
        </h2>
      </div>

      {/* Search container */}
      <div ref={containerRef} style={{ position: 'relative' }}>
        {/* Decorative lines */}
        <div style={{
          position: 'absolute', top: '-20px', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          opacity: 0.3
        }} />

        <div style={{
          display: 'flex', gap: '0',
          background: 'rgba(0,15,30,0.9)',
          border: '1px solid var(--border)',
          borderRadius: '6px', overflow: 'visible',
          boxShadow: showSuggestions || query
            ? '0 0 30px rgba(0,245,255,0.15), inset 0 0 30px rgba(0,245,255,0.02)'
            : '0 0 0 rgba(0,245,255,0)',
          transition: 'box-shadow 0.4s ease',
          position: 'relative',
        }}>
          {/* Icon */}
          <div style={{
            padding: '0 1.2rem', display: 'flex', alignItems: 'center',
            borderRight: '1px solid var(--border)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#00f5ff" strokeWidth="1.5" opacity="0.7" />
              <line x1="17" y1="17" x2="22" y2="22" stroke="#00f5ff" strokeWidth="1.5" opacity="0.7" />
              <circle cx="11" cy="11" r="3" fill="rgba(0,245,255,0.15)" />
            </svg>
          </div>

          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowSuggestions(suggestions.length > 0)}
            placeholder="Search any movie title..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none', outline: 'none',
              padding: '1.3rem 1.5rem',
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
            }}
          />

          {query && (
            <button onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false); }}
              style={{
                padding: '0 1rem', background: 'transparent',
                border: 'none', color: 'var(--text-muted)',
                cursor: 'none', fontSize: '1.2rem', transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >×</button>
          )}

          {/* Search button */}
          <button onClick={() => handleSubmit()} disabled={isSearching}
            style={{
              padding: '0.9rem 2rem',
              background: isSearching
                ? 'rgba(0,245,255,0.1)'
                : 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))',
              border: 'none',
              borderLeft: '1px solid var(--border)',
              color: 'var(--primary)',
              fontFamily: 'var(--font-display)', fontSize: '0.7rem',
              letterSpacing: '0.2em', cursor: 'none',
              transition: 'all 0.3s ease',
              minWidth: '130px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
            onMouseEnter={e => !isSearching && (e.currentTarget.style.background = 'rgba(0,245,255,0.2)')}
            onMouseLeave={e => !isSearching && (e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))')}
          >
            {isSearching ? (
              <>
                <span style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(0,245,255,0.3)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'rotate-slow 0.8s linear infinite'
                }} />
                SCANNING
              </>
            ) : 'ANALYZE'}
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(0,8,20,0.98)',
            border: '1px solid var(--border)',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            overflow: 'hidden', zIndex: 100,
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            animation: 'slide-in-up 0.2s ease',
          }}>
            {suggestions.map((movie, i) => (
              <div key={movie}
                onClick={() => handleSubmit(movie)}
                style={{
                  padding: '0.9rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  cursor: 'none',
                  background: i === activeIdx ? 'rgba(0,245,255,0.08)' : 'transparent',
                  borderBottom: i < suggestions.length - 1 ? '1px solid rgba(0,245,255,0.05)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(0,245,255,0.08)';
                  setActiveIdx(i);
                }}
                onMouseLeave={e => e.currentTarget.style.background = i === activeIdx ? 'rgba(0,245,255,0.08)' : 'transparent'}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <polygon points="6,1 11,3.8 11,8.2 6,11 1,8.2 1,3.8"
                    fill="rgba(0,245,255,0.2)" stroke="#00f5ff" strokeWidth="0.8" />
                </svg>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {movie}
                </span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  SELECT →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative bottom line */}
      <div style={{
        marginTop: '0',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        marginBottom: '2rem',
        borderRadius: '0 0 6px 6px',
        display: showSuggestions ? 'none' : 'block'
      }} />

      {/* Quick pick buttons */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.3em',
          color: 'var(--text-muted)', marginBottom: '1rem'
        }}>
          QUICK PICKS
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {featured.map(movie => (
            <button key={movie} onClick={() => { setQuery(movie); handleSubmit(movie); }}
              style={{
                padding: '0.4rem 1rem',
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.25)',
                color: 'rgba(168,148,255,0.8)',
                borderRadius: '100px', cursor: 'none',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(124,58,237,0.2)';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
                e.currentTarget.style.color = '#c4b5fd';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)';
                e.currentTarget.style.color = 'rgba(168,148,255,0.8)';
              }}
            >{movie}</button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{
        marginTop: '4rem', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px',
        border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden',
      }}>
        {[
          { icon: '⬡', step: '01', title: 'Input Movie', desc: 'Enter any title from our database of 5000+ films' },
          { icon: '◈', step: '02', title: 'Vectorize', desc: 'TF-IDF converts metadata into high-dimensional vectors' },
          { icon: '⊕', step: '03', title: 'Similarity', desc: 'Cosine similarity scores every movie in the space' },
          { icon: '◉', step: '04', title: 'Recommend', desc: 'Top 8 most similar films delivered instantly' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '1.8rem 1.5rem',
            background: 'rgba(0,10,25,0.6)',
            borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            transition: 'background 0.3s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,245,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,10,25,0.6)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{item.icon}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
                STEP {item.step}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
              {item.title}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
