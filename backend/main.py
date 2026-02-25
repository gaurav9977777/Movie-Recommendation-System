from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
import os
import requests
from typing import List, Optional

app = FastAPI(title="CineMatrix AI Recommendation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model data
movies_df = None
similarity_matrix = None
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "YOUR_TMDB_API_KEY_HERE")

class RecommendRequest(BaseModel):
    movie_title: str
    num_recommendations: int = 8

class Movie(BaseModel):
    id: int
    title: str
    poster_path: Optional[str]
    overview: Optional[str]
    vote_average: Optional[float]
    release_date: Optional[str]
    genres: Optional[List[str]]
    similarity_score: Optional[float]

def load_model():
    global movies_df, similarity_matrix
    model_path = "model/movie_model.pkl"
    if os.path.exists(model_path):
        with open(model_path, "rb") as f:
            data = pickle.load(f)
            movies_df = data["movies"]
            similarity_matrix = data["similarity"]
        print("✅ Model loaded successfully")
    else:
        print("⚠️  Model not found. Run train_model.py first.")
        # Load demo data if model not found
        load_demo_data()

def load_demo_data():
    """Load a small demo dataset for testing without training"""
    global movies_df, similarity_matrix
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    demo_movies = [
        {"id": 19995, "title": "Avatar", "tags": "action adventure fantasy scifi alien planet war futuristic"},
        {"id": 285, "title": "Pirates of the Caribbean: At World's End", "tags": "adventure action fantasy pirates ocean treasure"},
        {"id": 206647, "title": "Spectre", "tags": "action thriller spy james bond secret agent"},
        {"id": 49026, "title": "The Dark Knight Rises", "tags": "action thriller batman superhero gotham bane"},
        {"id": 49529, "title": "John Carter", "tags": "action adventure fantasy scifi mars alien"},
        {"id": 559, "title": "Spider-Man 3", "tags": "action adventure superhero spider-man venom"},
        {"id": 38757, "title": "Tangled", "tags": "animation adventure comedy family romance fairy tale"},
        {"id": 99861, "title": "Avengers: Age of Ultron", "tags": "action adventure scifi superhero marvel avengers"},
        {"id": 767, "title": "Harry Potter and the Half-Blood Prince", "tags": "adventure fantasy magic hogwarts wizards"},
        {"id": 209112, "title": "Batman v Superman: Dawn of Justice", "tags": "action adventure superhero dc comics batman superman"},
        {"id": 597, "title": "Titanic", "tags": "drama romance disaster historical ship tragedy"},
        {"id": 24428, "title": "The Avengers", "tags": "action adventure scifi superhero marvel team"},
        {"id": 1452, "title": "Superman Returns", "tags": "action adventure superhero dc comics superman"},
        {"id": 1367, "title": "Pirates of the Caribbean: Dead Man's Chest", "tags": "adventure action fantasy pirates ocean"},
        {"id": 10764, "title": "The Dark Knight", "tags": "action crime thriller batman superhero joker gotham"},
        {"id": 8358, "title": "The Incredible Hulk", "tags": "action scifi superhero marvel hulk"},
        {"id": 1452, "title": "Iron Man", "tags": "action adventure scifi superhero marvel tony stark"},
        {"id": 68721, "title": "Iron Man 3", "tags": "action adventure scifi superhero marvel tony stark"},
        {"id": 76338, "title": "Thor: The Dark World", "tags": "action adventure fantasy superhero marvel thor asgard"},
        {"id": 102382, "title": "The Amazing Spider-Man 2", "tags": "action adventure superhero spider-man marvel"},
        {"id": 127585, "title": "X-Men: Days of Future Past", "tags": "action adventure scifi superhero xmen mutants"},
        {"id": 102899, "title": "Ant-Man", "tags": "action adventure comedy superhero marvel ant-man"},
        {"id": 135397, "title": "Jurassic World", "tags": "action adventure scifi dinosaurs thriller"},
        {"id": 76757, "title": "Guardians of the Galaxy", "tags": "action adventure comedy scifi superhero marvel space"},
        {"id": 158852, "title": "Tomorrowland", "tags": "adventure scifi family futuristic utopia"},
        {"id": 99861, "title": "Captain America: Civil War", "tags": "action adventure superhero marvel team conflict"},
        {"id": 315011, "title": "SPECTRE", "tags": "action thriller spy secret agent bond"},
        {"id": 140607, "title": "Star Wars: The Force Awakens", "tags": "action adventure scifi space jedi force"},
        {"id": 168259, "title": "Furious 7", "tags": "action thriller cars racing family"},
        {"id": 257344, "title": "Pan", "tags": "adventure fantasy family peter pan neverland"},
        {"id": 259316, "title": "The Hunger Games: Mockingjay - Part 2", "tags": "action adventure dystopia war rebellion"},
        {"id": 131631, "title": "The Hunger Games: Catching Fire", "tags": "action adventure dystopia games survival"},
        {"id": 118340, "title": "Guardians of the Galaxy Vol. 2", "tags": "action adventure comedy scifi superhero marvel space family"},
        {"id": 283995, "title": "Guardians of the Galaxy Vol. 2", "tags": "action adventure comedy scifi space superhero"},
        {"id": 1771, "title": "Captain America: The First Avenger", "tags": "action adventure war superhero marvel history"},
        {"id": 271110, "title": "Captain America: Civil War", "tags": "action adventure superhero conflict team"},
        {"id": 314365, "title": "Spotlight", "tags": "drama biography crime journalism investigation"},
        {"id": 381288, "title": "Bridge of Spies", "tags": "drama thriller history cold war spy"},
        {"id": 13, "title": "Forrest Gump", "tags": "drama comedy romance history american life"},
        {"id": 155, "title": "The Dark Knight", "tags": "action crime thriller batman joker"},
        {"id": 680, "title": "Pulp Fiction", "tags": "crime thriller drama nonlinear violence gangster"},
        {"id": 278, "title": "The Shawshank Redemption", "tags": "drama crime prison hope friendship"},
        {"id": 238, "title": "The Godfather", "tags": "crime drama mafia family power"},
        {"id": 240, "title": "The Godfather: Part II", "tags": "crime drama mafia family corruption"},
        {"id": 424, "title": "Schindler's List", "tags": "drama history war holocaust world war"},
        {"id": 389, "title": "12 Angry Men", "tags": "drama crime jury justice deliberation"},
        {"id": 129, "title": "Spirited Away", "tags": "animation fantasy adventure family japanese spirit world"},
        {"id": 372058, "title": "Your Name", "tags": "animation romance drama japanese fantasy time swap"},
        {"id": 637, "title": "Life is Beautiful", "tags": "comedy drama romance war holocaust italy"},
        {"id": 289, "title": "Casablanca", "tags": "drama romance war classic mystery love"},
    ]

    movies_df = pd.DataFrame(demo_movies)
    movies_df = movies_df.drop_duplicates(subset=['title'])
    movies_df = movies_df.reset_index(drop=True)

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(movies_df['tags'])
    similarity_matrix = cosine_similarity(tfidf_matrix)
    print("✅ Demo data loaded")

def fetch_movie_details(movie_id: int) -> dict:
    """Fetch movie details from TMDB API"""
    if TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        # Return placeholder data
        return {
            "poster_path": None,
            "overview": "Connect your TMDB API key to see movie details.",
            "vote_average": 0.0,
            "release_date": "N/A",
            "genres": []
        }
    
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=en-US"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return {
                "poster_path": f"https://image.tmdb.org/t/p/w500{data.get('poster_path', '')}" if data.get('poster_path') else None,
                "overview": data.get("overview", ""),
                "vote_average": data.get("vote_average", 0),
                "release_date": data.get("release_date", ""),
                "genres": [g["name"] for g in data.get("genres", [])]
            }
    except:
        pass
    return {"poster_path": None, "overview": "", "vote_average": 0, "release_date": "", "genres": []}

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def root():
    return {"message": "CineMatrix AI Engine Online", "status": "operational"}

@app.get("/movies/search")
def search_movies(q: str = ""):
    if movies_df is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not q:
        return {"movies": movies_df["title"].head(20).tolist()}
    
    mask = movies_df["title"].str.lower().str.contains(q.lower(), na=False)
    results = movies_df[mask]["title"].head(10).tolist()
    return {"movies": results}

@app.get("/movies/all")
def get_all_movies():
    if movies_df is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"movies": movies_df["title"].tolist()}

@app.post("/recommend")
def recommend(request: RecommendRequest):
    if movies_df is None or similarity_matrix is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # Find the movie
    matches = movies_df[movies_df["title"].str.lower() == request.movie_title.lower()]
    if matches.empty:
        # Try partial match
        matches = movies_df[movies_df["title"].str.lower().str.contains(request.movie_title.lower())]
    
    if matches.empty:
        raise HTTPException(status_code=404, detail=f"Movie '{request.movie_title}' not found")

    movie_idx = matches.index[0]
    sim_scores = list(enumerate(similarity_matrix[movie_idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = [s for s in sim_scores if s[0] != movie_idx]
    sim_scores = sim_scores[:request.num_recommendations]

    recommendations = []
    for idx, score in sim_scores:
        movie = movies_df.iloc[idx]
        details = fetch_movie_details(int(movie["id"]))
        recommendations.append({
            "id": int(movie["id"]),
            "title": movie["title"],
            "similarity_score": round(float(score), 3),
            **details
        })

    # Also return selected movie details
    selected_movie = movies_df.iloc[movie_idx]
    selected_details = fetch_movie_details(int(selected_movie["id"]))

    return {
        "selected_movie": {
            "id": int(selected_movie["id"]),
            "title": selected_movie["title"],
            **selected_details
        },
        "recommendations": recommendations
    }

@app.get("/health")
def health():
    return {
        "status": "online",
        "model_loaded": movies_df is not None,
        "total_movies": len(movies_df) if movies_df is not None else 0
    }
