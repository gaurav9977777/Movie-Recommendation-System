# 🎬 CINEMATRIX AI — Neural Movie Recommendation Engine

> A full-stack AI-powered movie recommendation system with a futuristic cyberpunk UI.

![Stack](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square)
![Stack](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square)
![Stack](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?style=flat-square)
![Stack](https://img.shields.io/badge/Algorithm-Cosine%20Similarity-7C3AED?style=flat-square)

---

## 🏗️ Architecture

```
cinematrix-ai/
├── backend/
│   ├── main.py           # FastAPI server (REST API)
│   ├── train_model.py    # ML training script
│   ├── requirements.txt
│   └── model/            # Auto-created after training
│       └── movie_model.pkl
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   └── components/
│   │       ├── HeroSection.js
│   │       ├── SearchSection.js
│   │       ├── RecommendationGrid.js
│   │       ├── MovieCard.js
│   │       ├── LoadingScreen.js
│   │       ├── NavBar.js
│   │       ├── ParticleField.js
│   │       └── CustomCursor.js
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start

### Option A: Demo Mode (No dataset needed)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python train_model.py --demo   # trains on built-in 50 movie dataset
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000 🚀

---

### Option B: Full TMDB Dataset (5000+ movies)

**1. Get the dataset:**
- Go to: https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata
- Download `tmdb_5000_movies.csv` and `tmdb_5000_credits.csv`
- Place both files in `backend/data/`

**2. Get a TMDB API Key (for movie posters):**
- Sign up at https://www.themoviedb.org/
- Get your API key from Settings → API
- Set it: `export TMDB_API_KEY="your_key_here"`

**3. Train the model:**
```bash
cd backend
pip install -r requirements.txt
python train_model.py
```

**4. Start the backend:**
```bash
uvicorn main:app --reload --port 8000
```

**5. Start the frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 🧠 How It Works

### Machine Learning Pipeline

```
Raw Data (genres, keywords, cast, director)
         ↓
    Feature Engineering
    (combine into "tags" string)
         ↓
    CountVectorizer / TF-IDF
    (convert text to vectors)
         ↓
    Cosine Similarity Matrix
    (5000 × 5000 matrix)
         ↓
    Top-K Similar Movies
    (for any given movie)
```

### Why Cosine Similarity?

Cosine similarity measures the angle between two vectors in high-dimensional space.
- Score of 1.0 = identical taste profile
- Score of 0.0 = completely different

This works better than Euclidean distance for text because it's scale-invariant.

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | System status |
| `/movies/all` | GET | List all movies |
| `/movies/search?q=batman` | GET | Search movies |
| `/recommend` | POST | Get recommendations |

### Recommend Payload:
```json
{
  "movie_title": "Inception",
  "num_recommendations": 8
}
```

### Response:
```json
{
  "selected_movie": { "id": 27205, "title": "Inception", ... },
  "recommendations": [
    {
      "title": "Interstellar",
      "similarity_score": 0.847,
      "poster_path": "https://...",
      "vote_average": 8.6,
      "genres": ["Action", "Drama", "Sci-Fi"]
    },
    ...
  ]
}
```

---

## 🎨 UI Features

- **Neural particle field** — interactive canvas with 90 particles that react to cursor
- **Custom cursor** — glowing dot + lagging ring that tracks mouse
- **Boot sequence** — terminal-style loading screen on launch
- **Animated hero** — rotating orbital rings, cycling text, stats counter
- **Live search** — autocomplete with keyboard navigation
- **Movie cards** — flip/hover reveals overview and genres
- **Similarity bars** — visual match percentage indicators
- **Scanline effect** — subtle CRT-style animation across the viewport

---

## 🔧 Environment Variables

```bash
# Backend
TMDB_API_KEY=your_tmdb_api_key

# Frontend (create frontend/.env)
REACT_APP_API_URL=http://localhost:8000
```

---

## 📦 Dependencies

### Backend
- `fastapi` — async REST API framework
- `uvicorn` — ASGI server
- `scikit-learn` — TF-IDF + cosine similarity
- `pandas` / `numpy` — data processing
- `requests` — TMDB API calls

### Frontend
- `react` — UI framework
- `axios` — HTTP client (API calls)

---


## 💡 Extending the Engine

| Feature | How |
|---------|-----|
| Collaborative filtering | Add user ratings table + SVD matrix factorization |
| Hybrid model | Weight content + collaborative scores |
| User profiles | Store rating history in SQLite/Postgres |
| Better posters | TMDB API integration (key required) |
| Genre filters | Add filter chips to the UI |

---

Made with 🔮 by CineMatrix AI
