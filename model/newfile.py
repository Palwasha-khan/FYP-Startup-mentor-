from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import tensorflow as tf
import tensorflow_hub as hub
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

print("Loading ELMo model from TF Hub...")
elmo = hub.load("https://tfhub.dev/google/elmo/3")

print("All models loaded successfully!")

# -----------------------------
# Request Schema
# -----------------------------
class StartupInput(BaseModel):
    name: str
    description: str
    location: str
    category: str
    funding: str


# -----------------------------
# Embedding Function
# -----------------------------
def get_elmo_embeddings(sentences):
    
    if isinstance(sentences, str):
        sentences = [sentences]

    embeddings = elmo.signatures["default"](tf.constant(sentences))["default"]

    return embeddings.numpy()

# -----------------------------------
# Prediction Function
# -----------------------------------
def predict_status(name, description, location, category, funding):

    text = f"{name} {description} {location} {category} funding_{funding}"

    # limit tokens
    text = " ".join(text.split()[:60])

    # generate embeddings
    emb = get_elmo_embeddings([text])

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

    prediction = predict_status(
        input_data.name,
        input_data.description,
        input_data.location,
        input_data.category,
        input_data.funding
    )

    innovationScore = float(np.random.randint(60, 100))
    marketFit = float(np.random.randint(50, 100))
    viabilityScore = float(np.random.randint(40, 100))
    risks = "Low" if viabilityScore > 60 else "Medium"
    recommendations = "Go Ahead" if innovationScore > 70 else "Needs Review"

    return {
        "prediction": prediction,
        "innovationScore": innovationScore,
        "marketFit": marketFit,
        "viabilityScore": viabilityScore,
        "risks": risks,
        "recommendations": recommendations
    }
# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def root():
    return {"message": "Startup Classifier API Running"}

#py -3.11 -m uvicorn newfile:app --host 127.0.0.1 --port 8080