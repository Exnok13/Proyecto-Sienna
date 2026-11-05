from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import os
import json
import requests

app = FastAPI(title="Sienna AI Service - Generative Gemini", version="2.0")

class ReviewRequest(BaseModel):
    movie_title: str
    reviews: List[str]

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ai-service",
        "gemini_configured": bool(GEMINI_API_KEY)
    }

def fallback_analysis(movie_title: str, reviews: List[str]):
    pos = sum(1 for r in reviews if any(w in r.lower() for w in ["buena", "excelente", "joya", "increible", "bien", "obra", "recomiendo", "impecable"]))
    neg = sum(1 for r in reviews if any(w in r.lower() for w in ["mala", "pesima", "aburrida", "lenta", "decepcion", "terrible", "floja"]))
    
    if abs(pos - neg) <= 1:
        return {
            "movie_title": movie_title,
            "summary": f"[Respaldo] Las opiniones sobre {movie_title} se encuentran divididas entre el público.",
            "sentiment": "Mixto",
            "total_reviews_analyzed": len(reviews)
        }
    elif pos > neg:
        return {
            "movie_title": movie_title,
            "summary": f"[Respaldo] La recepción de {movie_title} es predominantemente positiva.",
            "sentiment": "Positivo",
            "total_reviews_analyzed": len(reviews)
        }
    else:
        return {
            "movie_title": movie_title,
            "summary": f"[Respaldo] La crítica y audiencia expresan disconformidad con {movie_title}.",
            "sentiment": "Negativo",
            "total_reviews_analyzed": len(reviews)
        }

@app.post("/analyze")
def analyze(data: ReviewRequest):
    print(f"\n[AI-Service] Procesando '{data.movie_title}' ({len(data.reviews)} reseñas)...", flush=True)

    if not data.reviews:
        return {
            "movie_title": data.movie_title,
            "summary": "Sin reseñas registradas.",
            "sentiment": "Neutro",
            "total_reviews_analyzed": 0
        }

    if not GEMINI_API_KEY:
        print("[AI-Service] GEMINI_API_KEY no detectada. Usando fallback.", flush=True)
        return fallback_analysis(data.movie_title, data.reviews)

    reviews_text = "\n".join([f"- {r}" for r in data.reviews])

    prompt = f"""
Actúa como un crítico de cine experto del festival Premios Pedro Sienna.
Analiza las siguientes opiniones de usuarios sobre la película '{data.movie_title}':

{reviews_text}

Responde ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin formato Markdown, sin comillas adicionales):
{{
  "summary": "Resumen claro y elocuente de 2 oraciones sintetizando el consenso del público.",
  "sentiment": "Positivo" | "Negativo" | "Mixto"
}}
"""

    models_to_try = [
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
        "gemini-3.1-pro-preview"
    ]

    host = "generativelanguage.googleapis.com"
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    for model_name in models_to_try:
        url = f"https://{host}/v1/models/{model_name}:generateContent?key={GEMINI_API_KEY}"
        try:
            print(f"[AI-Service] Probando modelo: {model_name}...", flush=True)
            response = requests.post(url, json=payload, timeout=25)
            print(f"[Gemini API - {model_name}] Código HTTP: {response.status_code}", flush=True)

            if response.status_code == 200:
                result = response.json()
                raw_text = result["candidates"][0]["content"]["parts"][0]["text"]
                parsed_json = json.loads(raw_text)
                return {
                    "movie_title": data.movie_title,
                    "summary": parsed_json.get("summary", "Sin resumen disponible."),
                    "sentiment": parsed_json.get("sentiment", "Mixto"),
                    "total_reviews_analyzed": len(data.reviews)
                }
            else:
                print(f"[Gemini Error {model_name}] {response.text[:200]}", flush=True)
        except Exception as e:
            print(f"[Gemini Exception {model_name}] {e}", flush=True)

    print("[AI-Service] Todos los modelos fallaron. Usando fallback.", flush=True)
    return fallback_analysis(data.movie_title, data.reviews)
