"""
CineMatrix AI - Model Training Script
=====================================
This script processes the TMDB dataset and trains the recommendation model.

Instructions:
1. Download TMDB 5000 Movie Dataset from Kaggle:
   https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata
2. Place tmdb_5000_movies.csv and tmdb_5000_credits.csv in the data/ folder
3. Run: python train_model.py

OR use the demo mode (no dataset required):
   python train_model.py --demo
"""

import pandas as pd
import numpy as np
import ast
import pickle
import os
import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def parse_json_col(val):
    """Parse JSON-like string columns from TMDB dataset"""
    try:
        lst = ast.literal_eval(val)
        if isinstance(lst, list):
            return [i.get("name", "") for i in lst]
    except:
        pass
    return []

def get_director(crew_str):
    """Extract director from crew data"""
    try:
        crew = ast.literal_eval(crew_str)
        for member in crew:
            if member.get("job") == "Director":
                return member.get("name", "")
    except:
        pass
    return ""

def clean_text(lst):
    return [str(i).replace(" ", "").lower() for i in lst if i]

def build_tags(row):
    tags = []
    tags += clean_text(row.get("genres", []))
    tags += clean_text(row.get("keywords", []))[:5]
    tags += clean_text(row.get("cast", []))[:3]
    director = row.get("director", "")
    if director:
        tags.append(director.replace(" ", "").lower())
    return " ".join(tags)

def train_from_tmdb(data_dir="data"):
    print("📂 Loading TMDB dataset...")
    movies_path = os.path.join(data_dir, "tmdb_5000_movies.csv")
    credits_path = os.path.join(data_dir, "tmdb_5000_credits.csv")
    
    if not os.path.exists(movies_path) or not os.path.exists(credits_path):
        print("❌ Dataset files not found!")
        print("Download from: https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata")
        return False

    movies = pd.read_csv(movies_path)
    credits = pd.read_csv(credits_path)

    print("🔀 Merging datasets...")
    movies = movies.merge(credits, on="title")

    print("🧹 Cleaning data...")
    movies = movies[["movie_id", "title", "overview", "genres", "keywords", "cast", "crew"]]
    movies.dropna(inplace=True)

    movies["genres"] = movies["genres"].apply(parse_json_col)
    movies["keywords"] = movies["keywords"].apply(parse_json_col)
    movies["cast"] = movies["cast"].apply(parse_json_col)
    movies["director"] = movies["crew"].apply(get_director)
    movies["tags"] = movies.apply(build_tags, axis=1)

    movies.rename(columns={"movie_id": "id"}, inplace=True)
    final = movies[["id", "title", "tags"]].copy()
    final.drop_duplicates(subset=["title"], inplace=True)
    final.reset_index(drop=True, inplace=True)

    print(f"✅ Processed {len(final)} movies")
    return final

def train_demo():
    """Train on built-in demo data"""
    print("🎬 Using built-in demo dataset (50 movies)...")
    demo_data = [
        {"id": 19995, "title": "Avatar", "tags": "action adventure scifi alien planet war futuristic Cameron"},
        {"id": 285, "title": "Pirates of the Caribbean: At World's End", "tags": "adventure fantasy pirates ocean treasure Verbinski"},
        {"id": 206647, "title": "Spectre", "tags": "action thriller spy bond secret agent Mendes"},
        {"id": 49026, "title": "The Dark Knight Rises", "tags": "action thriller batman superhero bane Nolan"},
        {"id": 10764, "title": "The Dark Knight", "tags": "action crime thriller batman joker Nolan"},
        {"id": 99861, "title": "Avengers: Age of Ultron", "tags": "action adventure scifi superhero marvel avengers Whedon"},
        {"id": 24428, "title": "The Avengers", "tags": "action adventure scifi superhero marvel team Whedon"},
        {"id": 271110, "title": "Captain America: Civil War", "tags": "action adventure superhero conflict marvel Russo"},
        {"id": 140607, "title": "Star Wars: The Force Awakens", "tags": "action adventure scifi space jedi force Abrams"},
        {"id": 135397, "title": "Jurassic World", "tags": "action adventure scifi dinosaurs thriller Trevorrow"},
        {"id": 168259, "title": "Furious 7", "tags": "action thriller cars racing family Wan"},
        {"id": 597, "title": "Titanic", "tags": "drama romance disaster historical ship tragedy Cameron"},
        {"id": 76338, "title": "Thor: The Dark World", "tags": "action adventure fantasy superhero marvel asgard Taylor"},
        {"id": 118340, "title": "Guardians of the Galaxy", "tags": "action adventure comedy scifi superhero marvel space Gunn"},
        {"id": 299536, "title": "Avengers: Infinity War", "tags": "action adventure scifi superhero marvel thanos Russo"},
        {"id": 278, "title": "The Shawshank Redemption", "tags": "drama crime prison hope friendship Darabont"},
        {"id": 238, "title": "The Godfather", "tags": "crime drama mafia family power Coppola"},
        {"id": 240, "title": "The Godfather: Part II", "tags": "crime drama mafia family corruption Coppola"},
        {"id": 155, "title": "The Dark Knight", "tags": "action crime thriller batman joker gotham Nolan"},
        {"id": 424, "title": "Schindler's List", "tags": "drama history war holocaust world war Spielberg"},
        {"id": 389, "title": "12 Angry Men", "tags": "drama crime jury justice deliberation Lumet"},
        {"id": 680, "title": "Pulp Fiction", "tags": "crime thriller drama violence gangster nonlinear Tarantino"},
        {"id": 13, "title": "Forrest Gump", "tags": "drama comedy romance history american life Zemeckis"},
        {"id": 129, "title": "Spirited Away", "tags": "animation fantasy adventure family spirit world Miyazaki"},
        {"id": 372058, "title": "Your Name", "tags": "animation romance drama fantasy time swap japanese Shinkai"},
        {"id": 637, "title": "Life is Beautiful", "tags": "comedy drama romance war holocaust italy Benigni"},
        {"id": 289, "title": "Casablanca", "tags": "drama romance war classic mystery love Curtiz"},
        {"id": 550, "title": "Fight Club", "tags": "drama thriller psychology identity underground Fincher"},
        {"id": 13, "title": "Inception", "tags": "action scifi thriller dream mind heist Nolan"},
        {"id": 157336, "title": "Interstellar", "tags": "adventure drama scifi space time relativity Nolan"},
        {"id": 603, "title": "The Matrix", "tags": "action scifi cyberpunk simulation hacker revolution Wachowski"},
        {"id": 604, "title": "The Matrix Reloaded", "tags": "action scifi cyberpunk simulation hacker Wachowski"},
        {"id": 1726, "title": "Iron Man", "tags": "action adventure scifi superhero marvel tony stark Favreau"},
        {"id": 10195, "title": "Thor", "tags": "action adventure fantasy superhero marvel asgard Branagh"},
        {"id": 1771, "title": "Captain America: The First Avenger", "tags": "action adventure war superhero marvel history Johnston"},
        {"id": 102899, "title": "Ant-Man", "tags": "action adventure comedy superhero marvel Reed"},
        {"id": 302699, "title": "Sisters", "tags": "comedy family reunion party sisters Fey Poehler"},
        {"id": 282035, "title": "The Revenant", "tags": "adventure drama thriller survival wilderness Inarritu"},
        {"id": 259316, "title": "The Hunger Games: Mockingjay Part 2", "tags": "action adventure dystopia war rebellion Lawrence"},
        {"id": 131631, "title": "The Hunger Games: Catching Fire", "tags": "action adventure dystopia games survival Lawrence"},
        {"id": 767, "title": "Harry Potter and the Half-Blood Prince", "tags": "adventure fantasy magic hogwarts wizards Yates"},
        {"id": 566, "title": "Gladiator", "tags": "action drama history rome empire war Scott"},
        {"id": 539, "title": "Psycho", "tags": "thriller horror mystery classic murder Hitchcock"},
        {"id": 105, "title": "Back to the Future", "tags": "adventure comedy scifi time travel family Zemeckis"},
        {"id": 862, "title": "Toy Story", "tags": "animation adventure comedy family toys friendship Lasseter"},
        {"id": 585, "title": "Monsters, Inc.", "tags": "animation adventure comedy family monsters Docter"},
        {"id": 920, "title": "Cars", "tags": "animation adventure comedy family racing Lasseter"},
        {"id": 127585, "title": "X-Men: Days of Future Past", "tags": "action adventure scifi superhero mutants xmen Singer"},
        {"id": 166424, "title": "Whiplash", "tags": "drama music ambition obsession jazz Chazelle"},
        {"id": 314365, "title": "Spotlight", "tags": "drama biography crime journalism investigation McCarthy"},
    ]
    return pd.DataFrame(demo_data)

def compute_similarity(df):
    print("🔢 Computing TF-IDF vectors...")
    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(df["tags"]).toarray()
    
    print("📐 Computing cosine similarity matrix...")
    similarity = cosine_similarity(vectors)
    return similarity

def save_model(df, similarity, output_dir="model"):
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "movie_model.pkl")
    with open(output_path, "wb") as f:
        pickle.dump({"movies": df, "similarity": similarity}, f)
    print(f"💾 Model saved to {output_path}")
    print(f"📊 Total movies: {len(df)}")

if __name__ == "__main__":
    demo_mode = "--demo" in sys.argv

    if demo_mode:
        df = train_demo()
    else:
        df = train_from_tmdb()
        if df is False:
            print("\n🔄 Falling back to demo mode...")
            df = train_demo()

    similarity = compute_similarity(df)
    save_model(df, similarity)
    print("\n🚀 Model training complete! Start the server with:")
    print("   uvicorn main:app --reload --port 8000")
