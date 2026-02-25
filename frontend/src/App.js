import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import SearchSection from './components/SearchSection';
import RecommendationGrid from './components/RecommendationGrid';
import LoadingScreen from './components/LoadingScreen';
import ParticleField from './components/ParticleField';
import CustomCursor from './components/CustomCursor';
import NavBar from './components/NavBar';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3200);
    checkApi();
    return () => clearTimeout(timer);
  }, []);

  const checkApi = async () => {
    try {
      const res = await axios.get(`${API_BASE}/health`);
      setApiOnline(res.data.status === 'online');
      if (res.data.status === 'online') {
        const moviesRes = await axios.get(`${API_BASE}/movies/all`);
        setMovies(moviesRes.data.movies || []);
      }
    } catch {
      setApiOnline(false);
      // Load demo movie list for UI display
      setMovies([
        "Avatar", "The Dark Knight", "Inception", "Interstellar", "The Avengers",
        "Pulp Fiction", "The Shawshank Redemption", "The Godfather", "Forrest Gump",
        "Spirited Away", "Your Name", "The Matrix", "Fight Club", "Gladiator",
        "Titanic", "Iron Man", "Thor", "Guardians of the Galaxy", "Star Wars: The Force Awakens",
        "Jurassic World", "Harry Potter and the Half-Blood Prince", "Toy Story", "Whiplash"
      ]);
    }
  };

  const handleSearch = useCallback(async (movieTitle) => {
    setIsSearching(true);
    setError(null);
    setRecommendations(null);

    try {
      const res = await axios.post(`${API_BASE}/recommend`, {
        movie_title: movieTitle,
        num_recommendations: 8
      });
      setSelectedMovie(res.data.selected_movie);
      setRecommendations(res.data.recommendations);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Movie "${movieTitle}" not found in database. Try another title.`);
      } else {
        setError('Backend API is offline. Start the FastAPI server to get real recommendations.');
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="noise" style={{ minHeight: '100vh', background: 'var(--bg-void)', position: 'relative', overflow: 'hidden' }}>
      <CustomCursor />
      <ParticleField />
      <NavBar apiOnline={apiOnline} />
      
      {/* Scanline effect */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)',
        animation: 'scanline 8s linear infinite',
        pointerEvents: 'none', zIndex: 9997
      }} />

      <HeroSection />
      
      <SearchSection
        onSearch={handleSearch}
        isSearching={isSearching}
        movies={movies}
      />

      {error && (
        <div style={{
          maxWidth: '700px', margin: '2rem auto', padding: '1.5rem 2rem',
          background: 'rgba(255, 0, 110, 0.1)', border: '1px solid rgba(255,0,110,0.4)',
          borderRadius: '8px', color: '#ff6b9d', fontFamily: 'var(--font-ui)',
          textAlign: 'center', animation: 'slide-in-up 0.5s ease'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚠</span>
          {error}
        </div>
      )}

      {(recommendations || isSearching) && (
        <div id="results">
          <RecommendationGrid
            movies={recommendations}
            selectedMovie={selectedMovie}
            isLoading={isSearching}
          />
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '3rem', marginTop: '4rem',
        borderTop: '1px solid var(--border)', fontFamily: 'var(--font-ui)',
        color: 'var(--text-muted)', letterSpacing: '0.1em', fontSize: '0.85rem'
      }}>
        <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          CINEMATRIX AI
        </div>
        NEURAL RECOMMENDATION ENGINE • POWERED BY COSINE SIMILARITY & TF-IDF
      </footer>
    </div>
  );
}
