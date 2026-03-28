# radiuss.py
from rich.console import Console
import json
from transformers import pipeline
from collections import Counter
import math
import os
console = Console()

# Load models once
sentiment_pipeline = pipeline("sentiment-analysis")
issue_classifier = pipeline("zero-shot-classification")

# -----------------------------
# HELPER FUNCTIONS
# -----------------------------
def clean(text):
    return text.lower().strip()

def haversine(lat1, lon1, lat2, lon2):
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Earth radius in km
    return c * r

# -----------------------------
# MAIN ANALYSIS FUNCTION
# -----------------------------
def analyze_location(user_category, user_location, user_lat, user_lon, radius_km=10):
    # Load data
    

    BASE_DIR = os.path.dirname(__file__)
    JSON_FILE = os.path.join(BASE_DIR, "education_100_entities_clean.json")

    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # CATEGORY MAPPING
    category_map = {
        "food": ["restaurant", "cafe", "fast food", "bakery"],
        "education": ["school", "college", "university", "academy"],
        "health": ["hospital", "clinic", "medical"]
    }
    valid_categories = category_map.get(user_category, [user_category])

    # ISSUE LABELS
    category_issue_labels = {
        "food": ["food quality", "service", "hygiene", "price", "waiting time", "staff behavior"],
        "education": ["teaching quality", "management", "facilities", "discipline", "staff behavior", "curriculum"],
        "health": ["treatment quality", "waiting time", "staff behavior", "hygiene", "cost", "equipment"]
    }
    issue_labels = category_issue_labels.get(user_category, ["service", "quality", "price"])

    # -----------------------------
    # FILTER DATA
    # -----------------------------
    filtered_data = []

    for item in data:
        category = clean(item.get("category", ""))
        location = clean(item.get("location", ""))
        name = clean(item.get("name", ""))
        lat = item.get("latitude")
        lon = item.get("longitude")

        if lat is None or lon is None:
            continue

        # Check radius (inside loop)
        distance = haversine(user_lat, user_lon, lat, lon)
        if distance > radius_km:
            continue

        # Match category + location
        category_match = any(cat in category or cat in name for cat in valid_categories)
        location_match = any(word.lower() in location for word in user_location.split())

        if category_match and location_match:
            filtered_data.append(item)

    console.print(f"Filtered entities: {len(filtered_data)}")  # DEBUG

    if not filtered_data:
        return {
            "total_entities": 0,
            "total_comments": 0,
            "positive_comments": 0,
            "negative_comments": 0,
            "average_rating": 0,
            "overall_sentiment": "No data",
            "top_issues": [],
            "final_recommendation": "No data"
        }

    # -----------------------------
    # ANALYSIS
    # -----------------------------
    total_comments = 0
    positive_count = 0
    negative_count = 0
    ratings = []
    issue_counter = Counter()

    for item in filtered_data:
        comments = item.get("comments", [])
        rating = item.get("rating", 0)

        if rating:
            ratings.append(rating)

        if not comments:
            continue

        results = sentiment_pipeline(comments)

        for comment, result in zip(comments, results):
            total_comments += 1
            if result["label"] == "POSITIVE":
                positive_count += 1
            else:
                negative_count += 1
                classification = issue_classifier(comment, issue_labels)
                for label, score in zip(classification["labels"], classification["scores"]):
                    if score > 0.5:
                        issue_counter[label] += 1

    if total_comments == 0:
        avg_rating = round(sum(ratings)/len(ratings),2) if ratings else 0
        return {
            "total_entities": len(filtered_data),
            "total_comments": 0,
            "positive_comments": 0,
            "negative_comments": 0,
            "average_rating": avg_rating,
            "overall_sentiment": "No comments",
            "top_issues": [],
            "final_recommendation": "No comments"
        }

    # -----------------------------
    # FINAL CALCULATIONS
    # -----------------------------
    avg_rating = round(sum(ratings)/len(ratings),2) if ratings else 0
    positive_ratio = round(positive_count / total_comments, 2)

    if positive_ratio > 0.7:
        overall_sentiment = "Highly Positive"
    elif positive_ratio > 0.5:
        overall_sentiment = "Mostly Positive"
    elif positive_ratio > 0.3:
        overall_sentiment = "Neutral"
    else:
        overall_sentiment = "Negative"

    top_issues = [issue for issue, count in issue_counter.most_common(3)]

    if overall_sentiment == "Highly Positive":
        final_recommendation = "Maintain current high standards."
    elif overall_sentiment == "Mostly Positive":
        final_recommendation = "Improve key weak areas."
    elif overall_sentiment == "Neutral":
        final_recommendation = "Moderate improvements needed."
    else:
        final_recommendation = "Urgent improvements required."

    return {
        "total_entities": len(filtered_data),
        "total_comments": total_comments,
        "positive_comments": positive_count,
        "negative_comments": negative_count,
        "average_rating": avg_rating,
        "overall_sentiment": overall_sentiment,
        "top_issues": top_issues,
        "final_recommendation": final_recommendation
    }