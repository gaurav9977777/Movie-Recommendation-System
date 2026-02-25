import React, { useState } from 'react';
import MovieCard from './MovieCard';

export default function RecommendationGrid({ movies, selectedMovie, isLoading }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (isLoading) {
    return (
      <section style={{
        maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          textAlign: 'center', marginBottom: '3rem',
          fontFamily: 'var(--font-display)', color: 'var(--primary)',
          fontSize: '0.85rem', letterSpacing: '0.3em',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            {/* Neural loading animation */}
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ display: 'block', margin: '0 auto' }}>
              {/* Neural nodes */}
              {[
                { cx: 40, cy: 10, delay: 0 },
                { cx: 10, cy: 40, delay: 0.2 },
                { cx: 70, cy: 40, delay: 0.4 },
                { cx: 40, cy: 70, delay: 0.6 },
              ].map((node, i) => (
                <g key={i}>
                  <line x1="40" y1="40" x2={node.cx} y2={node.cy}
                    stroke="rgba(0,245,255,0.2)" strokeWidth="1" />
                  <circle cx={node.cx} cy={node.cy} r="4" fill="var(--primary)"
                    style={{
                      animation: `pulse-glow 1.5s ease-in-out ${node.delay}s infinite`
                    }} />
                </g>
              ))}
              <circle cx="40" cy="40" r="8" fill="none" stroke="var(--primary)" strokeWidth="2"
                style={{ animation: 'rotate-ring 2s linear infinite' }} />
              <circle cx="40" cy="40" r="3" fill="var(--secondary)" />
            </svg>
          </div>
          ANALYZING NEURAL PATHWAYS...
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            color: 'var(--text-muted)', letterSpacing: 'normal', marginTop: '0.5rem'
          }}>
            Computing cosine similarity across 5000+ movies
          </div>
        </div>

        {/* Skeleton grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              borderRadius: '8px', overflow: 'hidden',
              border: '1px solid var(--border)',
              animation: `slide-in-up 0.4s ease ${i * 0.06}s both`,
            }}>
              <div style={{
                aspectRatio: '2/3',
                background: 'linear-gradient(135deg, rgba(0,20,40,0.8), rgba(0,10,20,0.8))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }} />
              <div style={{ padding: '1rem', background: 'rgba(0,10,25,0.8)' }}>
                <div style={{
                  height: '14px', borderRadius: '3px', marginBottom: '0.6rem',
                  background: 'linear-gradient(90deg, rgba(0,245,255,0.08), rgba(0,245,255,0.04))',
                  backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
                  width: '70%'
                }} />
                <div style={{
                  height: '10px', borderRadius: '3px',
                  background: 'linear-gradient(90deg, rgba(0,245,255,0.05), rgba(0,245,255,0.02))',
                  backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
                  width: '40%'
                }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <section style={{
      maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem',
      position: 'relative', zIndex: 1,
    }}>
      {/* Selected movie banner */}
      {selectedMovie && (
        <div style={{
          marginBottom: '3rem', padding: '1.5rem 2rem',
          background: 'rgba(0,15,35,0.8)',
          border: '1px solid rgba(0,245,255,0.2)',
          borderRadius: '8px',
          display: 'flex', gap: '1.5rem', alignItems: 'center',
          animation: 'slide-in-up 0.5s ease',
          boxShadow: '0 0 40px rgba(0,245,255,0.08)',
          flexWrap: 'wrap',
        }}>
          {selectedMovie.poster_path ? (
            <img src={selectedMovie.poster_path} alt={selectedMovie.title}
              style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: '60px', height: '90px', borderRadius: '4px',
              background: 'rgba(0,245,255,0.1)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', flexShrink: 0
            }}>🎬</div>
          )}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--primary)', marginBottom: '0.3rem' }}>
              ANALYZING FILM
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              {selectedMovie.title}
            </h3>
            {selectedMovie.vote_average > 0 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--gold)' }}>
                  ★ {selectedMovie.vote_average?.toFixed(1)}/10
                </span>
                {selectedMovie.release_date && (
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {selectedMovie.release_date?.slice(0, 4)}
                  </span>
                )}
              </div>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '0.15em',
            color: 'var(--primary)', textAlign: 'right',
          }}>
            NEURAL ANALYSIS<br />
            <span style={{ fontSize: '1.5rem', display: 'block', marginTop: '0.2rem' }}>↓</span>
          </div>
        </div>
      )}

      {/* Results header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '0.6rem',
            letterSpacing: '0.35em', color: 'var(--secondary)', marginBottom: '0.4rem'
          }}>
            SIMILARITY RESULTS
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)'
          }}>
            RECOMMENDED FOR YOU
          </h2>
        </div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.8rem',
          color: 'var(--text-muted)', letterSpacing: '0.05em'
        }}>
          {movies.length} matches found
        </div>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
        gap: '1.5rem',
      }}>
        {movies.map((movie, i) => (
          <MovieCard
            key={movie.id || movie.title}
            movie={movie}
            index={i}
            isHovered={hoveredIdx === i}
            onHover={() => setHoveredIdx(i)}
            onLeave={() => setHoveredIdx(null)}
          />
        ))}
      </div>
    </section>
  );
}
