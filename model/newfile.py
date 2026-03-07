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
class TextInput(BaseModel):
    text: str


# -----------------------------
# Embedding Function
# -----------------------------
def get_elmo_embeddings(sentences):
    
    if isinstance(sentences, str):
        sentences = [sentences]

    embeddings = elmo.signatures["default"](tf.constant(sentences))["default"]

    return embeddings.numpy()


# -----------------------------
# Prediction Endpoint
# -----------------------------
@app.post("/predict")
def predict(input_data: TextInput):

    text = input_data.text

    # Get embeddings
    X = get_elmo_embeddings(text)

    # Predict
    pred = model.predict(X)

    # Convert label
    label = le.inverse_transform(pred)[0]

    return {
        "input": text,
        "prediction": label
    }


# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def root():
    return {"message": "Startup Classifier API Running"}