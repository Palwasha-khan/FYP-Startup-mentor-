import os
from dotenv import load_dotenv
from pathlib import Path
import re
import json
import pickle
import numpy as np
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI()

# -----------------------------
# CONFIGURE CLIENTS
# -----------------------------
# client = OpenAI(
#     base_url="https://openrouter.ai/api/v1",
#     api_key="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"  # 🔐 Use environment variable
# )

## 1. Get the directory where your script is located
current_dir = Path(__file__).resolve().parent

# 2. Path to config.env
env_path = current_dir.parent / "backend" / "config" / "config.env"

# 3. Load the env
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    print(f"❌ ERROR: Could not find config.env at {env_path}")

# 4. Access the key (Double check the spelling/case in your .env file!)
model_api_key = os.getenv("MODEL_API_KEY")

if not model_api_key:
    print("❌ ERROR: MODEL_API_KEY not found in environment variables!")

client = OpenAI( 
    base_url="https://openrouter.ai/api/v1",
    api_key=model_api_key
) 
  

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "startup_model.pkl")

# Load the trained model
with open(MODEL_PATH, "rb") as f:
    trained_model = pickle.load(f)

# -----------------------------
# REQUEST SCHEMA
# -----------------------------
class StartupInput(BaseModel):
    title: str
    category: str  # One of: EdTech, FinTech, GreenTech, HealthTech
    locationName: str
    description: str
    teamSize: int
    avgTeamExperience: float
    fundingAmount: float
    mentorshipSupport: bool
    incubationSupport: bool
    marketReadinessLevel: int

# -----------------------------
# HELPERS
# -----------------------------
def get_prediction(data: StartupInput):
    # One-hot encode category for the model's expected 10 features
    domains = ["edtech", "fintech", "greentech", "healthtech"]
    domain_vector = [1 if data.category.lower() == d else 0 for d in domains]

    # Map features to model expected order:
    # team_size, avg_team_experience, funding_amount_usd, market_readiness_level, 
    # mentorship_support, incubation_support, + 4 domain columns
    features = np.array([[
        data.teamSize,
        data.avgTeamExperience,
        data.fundingAmount,
        data.marketReadinessLevel,
        int(data.mentorshipSupport),
        int(data.incubationSupport),
        *domain_vector
    ]])

    prediction = trained_model.predict(features)[0]
    # Assuming 1 = Operating (Open), 0 = Close
    return "Operating" if prediction == 1 else "Close"

# -----------------------------
# MAIN LOGIC
# -----------------------------


@app.post("/predict")
def predict(input_data: StartupInput):
    # 1. Get prediction from trained XGBoost model
    model_prediction = get_prediction(input_data)

    # 2. Use LLM for suggestions based on model result
    
    
    prompt = f"""
You are an expert Startup Venture Capital (VC) Advisor. 

### CONTEXT:
A predictive model has classified this startup as: {model_prediction}.
Your task is to validate this idea, check for category-description alignment, and provide a sentiment-driven score.

### STARTUP DATA:
- Name: {input_data.title}
- Primary Category: {input_data.category}
- Description: {input_data.description}
- Team: {input_data.teamSize} members, {input_data.avgTeamExperience} years avg exp.
- Funding: ${input_data.fundingAmount}
- Mentorship: {input_data.mentorshipSupport}

### TASK INSTRUCTIONS:
1. **Category Alignment:** Analyze if the 'Description' actually matches the 'Category'. If the description is vague, nonsensical, or belongs to a different industry, set "alignment_status" to "unclear_idea".
2. **Sub-category Extraction:** Identify the specific niche (e.g., if Category is 'Education', Sub-category might be 'Test Prep' or 'EdTech SaaS').
3. **Sentiment Simulation:** Based on the description and market viability, simulate how many "Positive" vs "Negative" expert comments this idea would receive out of a pool of 100 experts.
4. **Rating:** Calculate an 'Average Rating' (1-5) based on the synergy between Team Experience, Funding, and Market Readiness.

### OUTPUT FORMAT (STRICT JSON ONLY):
{{
  "decision": "{model_prediction}",
#   "alignment_status": "matched" | "unclear_idea",
  "identified_subcategory": "string",
  "success_probability": 1-100,
  "positiveComments": number,
  "negativeComments": number,
  "averageRating": 1-5,
#   "analysis": "A brief explanation of why the idea is clear or unclear.",
  "suggestions": ["suggestion 1", "suggestion 2", "..."],
  "risks": ["risk 1", "risk 2"]
}}
"""

    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-3-8b-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        ai_result = json.loads(re.search(r'\{.*\}', response.choices[0].message.content, re.DOTALL).group())
        return ai_result
    except Exception as e:
        return {"error": str(e), "model_status": model_prediction}
  






# @app.post("/predict")
# def predict(input_data: StartupInput):
#     print(">>> [DEBUG 1] Route hit. Starting ML Prediction...") # Check terminal
    
#     try:
#         # 1. Get prediction from trained model
#         model_prediction = get_prediction(input_data)
#         print(f">>> [DEBUG 2] ML Model Result: {model_prediction}")
#     except Exception as ml_err:
#         print(f">>> [DEBUG ERROR] ML Model Failed: {ml_err}")
#         return {"error": "ML Model Crash", "details": str(ml_err)}

#     # 2. Prepare Prompt
#     prompt = f""" ... your prompt here ... """

#     try:
#         print(">>> [DEBUG 3] Calling OpenRouter API...")
#         response = client.chat.completions.create(
#             model="meta-llama/llama-3-8b-instruct",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.3
#         )
        
#         raw_content = response.choices[0].message.content
#         print(">>> [DEBUG 4] API Response Received!")
#         print(f">>> [RAW CONTENT]: {raw_content}") # See if limit is hit or JSON is bad

#         # 3. Extract JSON
#         match = re.search(r'\{.*\}', raw_content, re.DOTALL)
#         if match:
#             ai_result = json.loads(match.group())
#             return ai_result
#         else:
#             print(">>> [DEBUG ERROR] No JSON found in response.")
#             return {"error": "Invalid LLM format", "raw": raw_content}

#     except Exception as e:
#         # IMPORTANT: This will tell you if the API key is invalid or limit is full
#         print(f">>> [DEBUG ERROR] API or JSON Logic Failed: {str(e)}")
#         return {
#             "error": "LLM/Connection Error", 
#             "message": str(e), 
#             "model_status": model_prediction
#         }

  
    # uvicorn aiLogic:app --reload --port 8080
