# newfile.py
from radiuss import analyze_location

# Example input
input_data = {
    "category": "education",
    "location": "Mianwali",
    "latitude": 32.5800,
    "longitude": 71.5260
}

radius_data = analyze_location(
    input_data["category"],
    input_data["location"],
    input_data["latitude"],
    input_data["longitude"]
)

positive_comments = radius_data["positive_comments"]
negative_comments = radius_data["negative_comments"]
average_rating = radius_data["average_rating"]

print(f"Positive Comments: {positive_comments}")
print(f"Negative Comments: {negative_comments}")
print(f"Average Rating: {average_rating}")