import React, { useState } from 'react';

const PLACEHOLDER_COLORS = [
  ['#00f5ff', '#7c3aed'],
  ['#ff006e', '#7c3aed'],
  ['#00f5ff', '#ff006e'],
  ['#ffd700', '#7c3aed'],
  ['#00ff88', '#00f5ff'],
];

export default function MovieCard({ movie, index, isHovered, onHover, onLeave }) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const colors = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];
  const similarityPct = Math.round((movie.similarity_score || 0) * 100);

  const hasPoster = movie.poster_path && !imgError;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={() => { onLeave(); setExpanded(false); }}
      style={{
        position: 'relative',
        border: `1px solid ${isHovered ? 'rgba(0,245,255,0.4)' : 'var(--border)'}`,
        borderRadius: '8px', overflow: 'hidden',
        background: 'var(--bg-card)',
        cursor: 'none',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: isHovered
          ? `0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(0,245,255,0.15), inset 0 1px 0 rgba(0,245,255,0.1)`
          : '0 4px 20px rgba(0,0,0,0.4)',
        animation: `slide-in-up 0.5s ease ${index * 0.07}s both`,
        zIndex: isHovered ? 10 : 1,
      }}
    >
      {/* Similarity score badge */}
      {movie.similarity_score > 0 && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 10,
          background: 'rgba(0,4,12,0.9)',
          border: `1px solid ${similarityPct > 70 ? '#00ff88' : similarityPct > 40 ? '#00f5ff' : 'rgba(0,245,255,0.3)'}`,
          borderRadius: '4px', padding: '0.2rem 0.5rem',
          fontFamily: 'var(--font-display)', fontSize: '0.6rem',
          color: similarityPct > 70 ? '#00ff88' : similarityPct > 40 ? '#00f5ff' : 'var(--text-muted)',
          letterSpacing: '0.1em',
        }}>
          {similarityPct}%
        </div>
      )}

      {/* Index number */}
      <div style={{
        position: 'absolute', top: '10px', left: '10px', zIndex: 10,
        fontFamily: 'var(--font-display)', fontSize: '0.5rem',
        letterSpacing: '0.1em', color: 'rgba(0,245,255,0.4)',
        background: 'rgba(0,4,12,0.7)',
        padding: '0.15rem 0.4rem', borderRadius: '2px',
      }}>
        #{String(index + 1).padStart(2, '0')}
      </div>

      {/* Poster */}
      <div style={{
        aspectRatio: '2/3', overflow: 'hidden',
        background: hasPoster ? 'transparent' : `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}22)`,
        position: 'relative',
      }}>
        {hasPoster ? (
          <img src={movie.poster_path} alt={movie.title}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '1rem', padding: '1rem',
          }}>
            {/* Decorative hexagon */}
            <svg width="60" height="60" viewBox="0 0 60 60">
              <polygon points="30,3 57,17 57,43 30,57 3,43 3,17"
                fill="none" stroke={colors[0]} strokeWidth="1"
                style={{ filter: `drop-shadow(0 0 6px ${colors[0]})` }} />
              <polygon points="30,12 48,22 48,38 30,48 12,38 12,22"
                fill="none" stroke={colors[1]} strokeWidth="0.5" opacity="0.5" />
              <text x="30" y="35" textAnchor="middle" fill={colors[0]}
                fontFamily="Orbitron" fontSize="12" opacity="0.8">
                {movie.title?.slice(0, 2).toUpperCase()}
              </text>
            </svg>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '0.5rem',
              letterSpacing: '0.15em', color: `${colors[0]}99`,
            }}>NO POSTER</div>
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,4,12,0.95) 0%, rgba(0,4,12,0.3) 50%, transparent 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1rem',
        }}>
          {movie.overview && (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: 'rgba(232,244,253,0.85)', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {movie.overview}
            </p>
          )}
          {movie.genres?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
              {movie.genres.slice(0, 3).map(g => (
                <span key={g} style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.55rem',
                  letterSpacing: '0.1em', color: colors[0],
                  border: `1px solid ${colors[0]}44`, borderRadius: '3px',
                  padding: '0.1rem 0.4rem',
                  background: `${colors[0]}11`,
                }}>{g}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div style={{
        padding: '0.9rem 1rem',
        background: isHovered ? 'rgba(0,245,255,0.04)' : 'rgba(0,8,20,0.8)',
        borderTop: '1px solid var(--border)',
        transition: 'background 0.3s',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-ui)', fontWeight: 600,
          fontSize: '0.9rem', letterSpacing: '0.03em',
          color: 'var(--text-primary)',
          lineHeight: 1.3, marginBottom: '0.4rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {movie.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          {movie.vote_average > 0 && (
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--gold)', letterSpacing: '0.05em'
            }}>
              ★ {movie.vote_average?.toFixed(1)}
            </span>
          )}
          {movie.release_date && (
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}>
              {movie.release_date?.slice(0, 4)}
            </span>
          )}

          {/* Similarity bar */}
          {movie.similarity_score > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: '40px', height: '3px',
                background: 'rgba(0,245,255,0.1)',
                borderRadius: '2px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${similarityPct}%`,
                  background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glow effect on hover */}
      {isHovered && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '8px',
          boxShadow: `inset 0 0 40px rgba(0,245,255,0.04)`,
          border: '1px solid rgba(0,245,255,0.4)',
        }} />
      )}
    </div>
  );
}
