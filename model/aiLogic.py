from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import json
import re
import numpy as np

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Startup Classifier API")

# -----------------------------
# Configure OpenAI Client
# -----------------------------
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"   # move to env for safety
)

# -----------------------------
# Request Schema
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
# JSON Extractor (safely)
# -----------------------------
def extract_json(text):
    try:
        json_part = re.search(r'\{.*\}', text, re.DOTALL).group()
        return json.loads(json_part)
    except:
        return {}

# -----------------------------
# Business Decision Logic
# -----------------------------
def business_decision(name, category, location, description):
    # Placeholder: Replace this with your competitor data if needed
    reviews_text = "Good product. Average demand. Needs marketing."  
    avg_rating = 4.0
    total_reviews = 100

    prompt = f"""
    Your task is to analyze a startup idea based on the given location, category, and description.
    Output STRICT JSON only.

    Business Name: {name}
    Category: {category}
    Location: {location}
    Description: {description}

    Market Insights:
    - Average competitor rating: {avg_rating}
    - Total reviews in market: {total_reviews}

    Competitor Comments:
    {reviews_text}

    Output:
    {{
        "decision": "Open / Do Not Open / Risky",
        "success_probability": 0-100,
        "Market fit": 0-100,
        "innovationScore": 0-100,
        "positive_comments": 0-100,
        "negative_comments": 0-100,
        "average_rating": 0-5,
        "final_advice": ["...", "..."],
        "Risks": ["...", "..."]
    }}
    """

    response = client.chat.completions.create(
        model="meta-llama/llama-3-8b-instruct",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    ai_result = extract_json(response.choices[0].message.content)

    # Ensure all fields exist with default values
    return {
        "prediction": ai_result.get("decision", "Unknown"),
        "viabilityScore": ai_result.get("success_probability", 0),
        "marketFit": ai_result.get("Market fit", 0),
        "innovationScore": ai_result.get("innovationScore", 0),
        "positiveComments": ai_result.get("positive_comments", 0),
        "negativeComments": ai_result.get("negative_comments", 0),
        "averageRating": ai_result.get("average_rating", 0),
        "recommendations": ai_result.get("final_advice", []),
        "risks": ai_result.get("Risks", [])
    }

# -----------------------------
# Prediction Endpoint
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

        print("Prediction result:", result)
        return result
    except Exception as e:
        # Log the real error for debugging
        print("Error in /predict:", str(e))
        # Return proper JSON so Node/Axios doesn't break
        return {
            "prediction": "Error",
            "viabilityScore": 0,
            "marketFit": 0,
            "innovationScore": 0,
            "positiveComments": 0,
            "negativeComments": 0,
            "averageRating": 0,
            "recommendations": [],
            "risks": [],
            "error": str(e)
        }

# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def root():
    return {"message": "Startup Classifier API Running"}
# uvicorn aiLogic:app --reload --port 8080