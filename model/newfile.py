from fastapi import FastAPI
from pydantic import BaseModel
from app import business_decision, load_data, get_competitor_data
import joblib 
import numpy as np
import requests

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Startup Classifier API")

# -----------------------------
# Load models at startup
# -----------------------------
print("Loading XGBoost model...")
model = joblib.load("xgboost_tuned.pkl")

print("Loading Label Encoder...")
le = joblib.load("label_encoder.pkl")

print("All models loaded successfully!")

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


# -----------------------------------
# Prediction Function
# -----------------------------------
def predict_status(name, description, location, category, funding):

    text = f"{name} {description} {location} {category} funding_{funding}"

    # limit tokens
    text = " ".join(text.split()[:60])

    # ✅ TEMP embedding (ELMo removed)
    emb = np.random.rand(1, 1024)

    # model prediction
    pred = model.predict(emb)

    # decode label
    result = le.inverse_transform(pred)[0]

    return result


# -----------------------------
# Prediction Endpoint
# -----------------------------
@app.post("/predict")
def predict(input_data: StartupInput):

    # Debug check
    print("Latitude received:", input_data.latitude)
    print("Longitude received:", input_data.longitude)

    prediction = predict_status(
        input_data.name,
        input_data.description,
        input_data.location,
        input_data.category,
        input_data.funding
    )

  
    # Prepare payload for Flask API
    payload = {
        "business_name": input_data.name,
        "category": input_data.category,
        "location": input_data.location,
        "description": input_data.description
    }

    response = requests.post("http://127.0.0.1:5000/api/decision", json=payload)
    if response.status_code == 200:
        flask_result = response.json()
    else:
        flask_result = {
            "error": "Failed to get decision from Flask backend"
        }
    

    return {
    # "prediction": prediction,
    "prediction": flask_result.get("decision"),
    "viabilityScore": flask_result.get("success_probability"),
    "marketFit": flask_result.get("Market fit"),
    "positiveComments": flask_result.get("positive_comments"),
    "negativeComments": flask_result.get("negative_comments"),
    "averageRating": flask_result.get("average_rating"),
    "recommendations": flask_result.get("final_advice"),
    "risks": flask_result.get("Risks")
}
 


# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def root():
    return {"message": "Startup Classifier API Running"}

#py -3.11 -m uvicorn newfile:app --host 127.0.0.1 --port 8080