from flask import Flask, request, render_template, jsonify
from openai import OpenAI
import json
import re
import os

app = Flask(__name__)

# -----------------------------
# CONFIGURE CLIENT
# -----------------------------
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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" # Set your key as environment variable
)

# -----------------------------
# LOAD DATASET
# -----------------------------
def load_data(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

# -----------------------------
# FILTER COMPETITOR DATA
# -----------------------------
def get_competitor_data(data, category, location):
    reviews = []
    ratings = []
    review_counts = []

    for business in data:
        if (business["category"].lower() == category.lower() and
            location.lower() in business["location"].lower()):
            reviews.extend(business.get("comments", []))
            ratings.append(business.get("rating", 0))
            review_counts.append(business.get("reviews", 0))

    return reviews, ratings, review_counts

# -----------------------------
# JSON EXTRACTOR
# -----------------------------
def extract_json(text):
    try:
        json_part = re.search(r'\{.*\}', text, re.DOTALL).group()
        return json.loads(json_part)
    except:
        return {"error": "Invalid JSON", "raw_output": text}

# -----------------------------
# AI DECISION SYSTEM
# -----------------------------
def business_decision(business_name, category, location, description, reviews, ratings, review_counts):
    reviews_text = "\n".join(reviews[:50])
    avg_rating = sum(ratings) / len(ratings) if ratings else 0
    total_reviews = sum(review_counts)

    prompt = f"""

    Your task is to analyze a startup idea based on the given location, category, and idea description.

    Keep the response concise, realistic, and helpful.
    
    You are an AI business advisor.

    A user wants to open a business.
    Tell me the risk and potential of this business based on competitor reviews and comments.
      Consider real-world factors such as:
    - market demand in the given location
    - competition level
    - investment requirements
    - target audience
    - local awareness and trends
    
    Calculate possivite and negative comments.
    Also calculate average rating.
    
    Final advice should be practical and actionable with two or three key points.

    Business Name: {business_name}
    Category: {category}
    Location: {location}
    Description: {description}

    Market Insights:
    - Average competitor rating: {avg_rating}
    - Total reviews in market: {total_reviews}

    Competitor Comments:
    {reviews_text}

   # Analyze market demand, competition, market fit and gaps.

    STRICT RULES:
    - Return ONLY valid JSON
    - No explanation outside JSON

    Output:
    {{
      "decision": "Open / Do Not Open / Risky",
      "success_probability": 0-100,
      "Market fit": 0-100,
      "possivite_comments": 0-100,
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

    result = response.choices[0].message.content
    return extract_json(result)

# -----------------------------
# ROUTES
# -----------------------------
# Home page with form
@app.route("/", methods=["GET", "POST"])
def index():
    decision = None
    if request.method == "POST":
        business_name = request.form.get("business_name")
        category = request.form.get("category")
        location = request.form.get("location")
        description = request.form.get("description")

        # Load dataset (update path to your JSON file)
        data = load_data(r"education_100_entities_clean.json")

        # Filter competitor data
        reviews, ratings, review_counts = get_competitor_data(data, category, location)

        if not reviews:
            decision = {"error": "No competitor data found for this category/location."}
        else:
            # AI business decision
            decision = business_decision(
                business_name,
                category,
                location,
                description,
                reviews,
                ratings,
                review_counts
            )
    return render_template("index.html", decision=decision)

# API endpoint (optional)
@app.route("/api/decision", methods=["POST"])
def api_decision():
    data = request.json
    business_name = data.get("business_name")
    category = data.get("category")
    location = data.get("location")
    description = data.get("description")

    dataset = load_data(r"education_100_entities_clean.json")
    reviews, ratings, review_counts = get_competitor_data(dataset, category, location)

    if not reviews:
        return jsonify({"error": "No competitor data found"}), 400

    result = business_decision(
        business_name,
        category,
        location,
        description,
        reviews,
        ratings,
        review_counts
    )
    return jsonify(result)

# -----------------------------
# RUN APP
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)