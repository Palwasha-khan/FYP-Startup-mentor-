# -----------------------------
# IMPORTS
# -----------------------------
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import json
import re
import os

# -----------------------------
# APP INIT
# -----------------------------
app = FastAPI()

# -----------------------------
# CONFIGURE CLIENT
# -----------------------------
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"  # 🔐 Use environment variable
)

# -----------------------------
# BASE DIRECTORY
# -----------------------------
BASE_DIR = os.path.dirname(__file__)

# -----------------------------
# CATEGORY → FILE MAPPING
# -----------------------------
CATEGORY_FILES = {
    "education": "education_100_entities_enhanced (1).json",
    "food": "food_100_entities_enhanced.json",
    "health": "health_100_entities_clean.json",
    "technology": "technology_100_entities_enhanced.json",
    "e-commerce": "ecommerce_100_entities_enhanced.json",
    "finance": "finance_100_entities_enhanced.json"
    
 
}

# -----------------------------
# REQUEST SCHEMA
# -----------------------------
class StartupInput(BaseModel):
    name: str
    description: str
    location: str
    category: str
    funding: float
    latitude: float
    longitude: float

# -----------------------------
# JSON EXTRACTOR
# -----------------------------
def extract_json(text):
    try:
        json_part = re.search(r'\{.*\}', text, re.DOTALL).group()
        return json.loads(json_part)
    except:
        return {}

# -----------------------------
# LOAD DATA BASED ON CATEGORY
# -----------------------------
def load_businesses(category):
    filename = CATEGORY_FILES.get(category.lower())

    if not filename:
        return []

    file_path = os.path.join(BASE_DIR, filename)

    if not os.path.exists(file_path):
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

# -----------------------------
# FIND COMPETITORS
# -----------------------------
def find_competitors(category, location):
    businesses = load_businesses(category)

    filtered = []
    for b in businesses:
        if location.lower() in b.get("location", "").lower():
            filtered.append(b)

    return filtered

# -----------------------------
# ANALYZE COMPETITORS
# -----------------------------
def analyze_competitors(competitors):
    if not competitors:
        return 0, 0, "No competitors found."

    total_rating = sum(c.get("rating", 0) for c in competitors)
    total_reviews = sum(c.get("reviews", 0) for c in competitors)

    avg_rating = total_rating / len(competitors)

    comments = []
    for c in competitors:
        comments.extend(c.get("comments", []))

    comments_text = " ".join(comments[:100])

    return avg_rating, total_reviews, comments_text

# -----------------------------
# BUSINESS DECISION LOGIC
# -----------------------------
def business_decision(name, category, location, description):

    competitors = find_competitors(category, location)
    avg_rating, total_reviews, reviews_text = analyze_competitors(competitors)

    prompt = f"""
You are a startup analyst.

Analyze whether a business should be opened or not.

Business Name: {name}
Category: {category}
Location: {location}
Description: {description}

Market Data:
- Average competitor rating: {avg_rating}
- Total reviews: {total_reviews}

Customer Feedback Summary:
{reviews_text}

Decision Rules:
- If market is saturated or competitors are strong → "Do Not Open"
- If mixed signals → "Risky"
- If opportunity exists → "Open"

Output STRICT JSON ONLY:

{{
  "decision": "Open" or "Do Not Open" or "Risky",
  "success_probability": number (0-100),
  "marketFit": number (0-100),
  "innovationScore": number (0-100),
  "positiveComments": number (0-100),
  "negativeComments": number (0-100),
  "averageRating": number (0-5),
  "final_advice": ["...","..."],
  "risks": ["...", "..."]
}}
"""

    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-3-8b-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        ai_result = extract_json(response.choices[0].message.content)

    except Exception as e:
        return {
            "prediction": "Error",
            "error": str(e)
        }

    return {
        "prediction": ai_result.get("decision", "Unknown"),
        "viabilityScore": ai_result.get("success_probability", 0),
        "marketFit": ai_result.get("market_fit", 0),
        "innovationScore": ai_result.get("innovation_score", 0),
        "positiveComments": ai_result.get("positive_comments", 0),
        "negativeComments": ai_result.get("negative_comments", 0),
        "averageRating": ai_result.get("average_rating", avg_rating),

        "recommendations": ai_result.get("final_advice", []),
        "risks": ai_result.get("risks", []),

        "competitors_found": len(competitors),
        "avg_market_rating": avg_rating
    }

# -----------------------------
# API ENDPOINT
# -----------------------------
@app.post("/predict")
def predict(input_data: StartupInput):
    try:
        result = business_decision(
            input_data.name,
            input_data.category,
            input_data.location,
            input_data.description
        )
        return result

    except Exception as e:
        return {
            "error": str(e),
            "prediction": "Error"
        }

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/")
def root():
    return {"message": "Startup Mentor API Running 🚀"}
# -----------------------------
# uvicorn aiLogic:app --reload --port 8080