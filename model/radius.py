from rich.console import Console
from rich.table import Table
from rich import box
import json
from transformers import pipeline
from collections import Counter
import math

# -----------------------------
# INITIAL SETUP
# -----------------------------
console = Console()

# Load models
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

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of Earth in km
    return c * r

# -----------------------------
# LOAD DATA
# -----------------------------
with open("education_100_entities_clean.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# -----------------------------
# USER INPUT
# -----------------------------
user_category = input("Enter category (food, education, health): ").lower().strip()
user_location = input("Enter location (e.g., Mianwali): ").lower().strip()
user_lat = float(input("Enter your latitude (e.g., 32.5800): "))
user_lon = float(input("Enter your longitude (e.g., 71.5260): "))
radius_km = 10  # 10 km radius filter

# -----------------------------
# CATEGORY MAPPING
# -----------------------------
category_map = {
    "food": ["restaurant", "cafe", "fast food", "bakery"],
    "education": ["school", "college", "university", "academy"],
    "health": ["hospital", "clinic", "medical"]
}
valid_categories = category_map.get(user_category, [user_category])

# -----------------------------
# ISSUE LABELS
# -----------------------------
category_issue_labels = {
    "food": [
        "food quality", "service", "hygiene",
        "price", "waiting time", "staff behavior"
    ],
    "education": [
        "teaching quality", "management", "facilities",
        "discipline", "staff behavior", "curriculum"
    ],
    "health": [
        "treatment quality", "waiting time", "staff behavior",
        "hygiene", "cost", "equipment"
    ]
}
issue_labels = category_issue_labels.get(
    user_category,
    ["service", "quality", "price"]
)

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

    # Check radius
    distance = haversine(user_lat, user_lon, lat, lon)
    if distance > radius_km:
        continue

    # Match category + location
    category_match = (
        user_category in category or
        any(cat in name for cat in valid_categories)
    )
    location_match = any(word in location for word in user_location.split())

    if category_match and location_match:
        filtered_data.append(item)

if not filtered_data:
    console.print("[bold red]❌ No data found for given category, location, or within radius[/bold red]")
    exit()

# -----------------------------
# ANALYSIS VARIABLES
# -----------------------------
total_comments = 0
positive_count = 0
negative_count = 0
ratings = []
issue_counter = Counter()

# -----------------------------
# PROCESS DATA
# -----------------------------
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

            # AI ISSUE DETECTION
            classification = issue_classifier(comment, issue_labels)
            for label, score in zip(classification["labels"], classification["scores"]):
                if score > 0.5:
                    issue_counter[label] += 1

# -----------------------------
# HANDLE NO COMMENTS
# -----------------------------
if total_comments == 0:
    console.print("[bold red]❌ No comments available[/bold red]")
    exit()

# -----------------------------
# FINAL CALCULATIONS
# -----------------------------
avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0
positive_ratio = round(positive_count / total_comments, 2)

# Sentiment logic
if positive_ratio > 0.7:
    overall_sentiment = "Highly Positive"
elif positive_ratio > 0.5:
    overall_sentiment = "Mostly Positive"
elif positive_ratio > 0.3:
    overall_sentiment = "Neutral"
else:
    overall_sentiment = "Negative"

top_issues = [issue for issue, count in issue_counter.most_common(3)]

# Recommendation
if overall_sentiment == "Highly Positive":
    final_recommendation = "Maintain current high standards."
elif overall_sentiment == "Mostly Positive":
    final_recommendation = "Improve key weak areas."
elif overall_sentiment == "Neutral":
    final_recommendation = "Moderate improvements needed."
else:
    final_recommendation = "Urgent improvements required."

# -----------------------------
# FINAL OUTPUT
# -----------------------------
final_output = {
    "selected_category": user_category,
    "selected_location": user_location,
    "total_entities": len(filtered_data),
    "total_comments": total_comments,
    "positive_comments": positive_count,
    "negative_comments": negative_count,
    "positive_ratio": positive_ratio,
    "average_rating": avg_rating,
    "overall_sentiment": overall_sentiment,
    "top_issues": top_issues,
    "final_recommendation": final_recommendation
}

# -----------------------------
# DISPLAY TABLE
# -----------------------------
table = Table(title="📊 AI Sentiment & Issue Analysis", box=box.ROUNDED, show_lines=True)
table.add_column("Metric", style="bold cyan")
table.add_column("Value", style="magenta")

for key, value in final_output.items():
    if isinstance(value, list):
        value = ", ".join(value)
    elif isinstance(value, float):
        value = f"{value:.2f}"
    table.add_row(key.replace("_", " ").title(), str(value))

console.print(table)

# -----------------------------
# SAVE JSON
# -----------------------------
with open("overall_analysis.json", "w") as f:
    json.dump(final_output, f, indent=4)

console.print("✅ Analysis saved to overall_analysis.json")