from fastapi import FastAPI
from pydantic import BaseModel
from radiuss import analyze_location
import joblib 
import numpy as np

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

    # Dummy analytics
    innovationScore = float(np.random.randint(60, 100))
    marketFit = float(np.random.randint(50, 100))
    viabilityScore = float(np.random.randint(40, 100))
    risks = "Low" if viabilityScore > 60 else "Medium"
    recommendations = "Go Ahead" if innovationScore > 70 else "Needs Review"

    # Call radius logic 
    radius_data = analyze_location(
    input_data.category,
    input_data.location,
    input_data.latitude,
    input_data.longitude
)

    positive_comments = radius_data["positive_comments"]
    negative_comments = radius_data["negative_comments"]
    average_rating = radius_data["average_rating"]

    print(f"Positive Comments: {positive_comments}")
    print(f"Negative Comments: {negative_comments}")
    print(f"Average Rating: {average_rating}")

    return {
        "prediction": prediction,
        "innovationScore": innovationScore,
        "marketFit": marketFit,
        "viabilityScore": viabilityScore,
        "risks": risks,
        "recommendations": recommendations,
        "positiveComments": positive_comments,
        "negativeComments": negative_comments,
        "averageRating": average_rating 
    }


# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def root():
    return {"message": "Startup Classifier API Running"}

#py -3.11 -m uvicorn newfile:app --host 127.0.0.1 --port 8080