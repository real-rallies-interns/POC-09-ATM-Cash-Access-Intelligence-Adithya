from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(title="ATM Access Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AREA_PROFILES = {
    "Delhi": {"state": "Delhi", "populationPressure": 91, "travelBurden": 4.8, "incomeFriction": 42},
    "Mumbai": {"state": "Maharashtra", "populationPressure": 94, "travelBurden": 5.2, "incomeFriction": 48},
    "Bengaluru": {"state": "Karnataka", "populationPressure": 82, "travelBurden": 4.1, "incomeFriction": 36},
    "Chennai": {"state": "Tamil Nadu", "populationPressure": 78, "travelBurden": 5.8, "incomeFriction": 44},
    "Hyderabad": {"state": "Telangana", "populationPressure": 76, "travelBurden": 5.4, "incomeFriction": 41},
    "Kolkata": {"state": "West Bengal", "populationPressure": 84, "travelBurden": 6.2, "incomeFriction": 52},
    "Kochi": {"state": "Kerala", "populationPressure": 58, "travelBurden": 3.8, "incomeFriction": 28},
    "Ahmedabad": {"state": "Gujarat", "populationPressure": 72, "travelBurden": 5.6, "incomeFriction": 39},
    "Jaipur": {"state": "Rajasthan", "populationPressure": 68, "travelBurden": 6.7, "incomeFriction": 46},
    "Lucknow": {"state": "Uttar Pradesh", "populationPressure": 81, "travelBurden": 7.2, "incomeFriction": 55},
    "Guwahati": {"state": "Assam", "populationPressure": 73, "travelBurden": 8.4, "incomeFriction": 61},
    "Patna": {"state": "Bihar", "populationPressure": 89, "travelBurden": 8.8, "incomeFriction": 64},
    "Bhopal": {"state": "Madhya Pradesh", "populationPressure": 66, "travelBurden": 7.4, "incomeFriction": 49},
    "Bhubaneswar": {"state": "Odisha", "populationPressure": 63, "travelBurden": 7.9, "incomeFriction": 54},
}

AREA_CENTERS = {
    "Delhi": (28.6139, 77.2090),
    "Mumbai": (19.0760, 72.8777),
    "Bengaluru": (12.9716, 77.5946),
    "Chennai": (13.0827, 80.2707),
    "Hyderabad": (17.3850, 78.4867),
    "Kolkata": (22.5726, 88.3639),
    "Kochi": (9.9312, 76.2673),
    "Ahmedabad": (23.0225, 72.5714),
    "Jaipur": (26.9124, 75.7873),
    "Lucknow": (26.8467, 80.9462),
    "Guwahati": (26.1445, 91.7362),
    "Patna": (25.5941, 85.1376),
    "Bhopal": (23.2599, 77.4126),
    "Bhubaneswar": (20.2961, 85.8245),
}

AREA_COUNTS = {
    "Delhi": {"ATM": 10, "Bank": 5},
    "Mumbai": {"ATM": 10, "Bank": 5},
    "Bengaluru": {"ATM": 8, "Bank": 4},
    "Chennai": {"ATM": 7, "Bank": 4},
    "Hyderabad": {"ATM": 7, "Bank": 4},
    "Kolkata": {"ATM": 7, "Bank": 4},
    "Kochi": {"ATM": 6, "Bank": 4},
    "Ahmedabad": {"ATM": 5, "Bank": 3},
    "Jaipur": {"ATM": 5, "Bank": 3},
    "Lucknow": {"ATM": 4, "Bank": 2},
    "Guwahati": {"ATM": 3, "Bank": 1},
    "Patna": {"ATM": 3, "Bank": 1},
    "Bhopal": {"ATM": 3, "Bank": 2},
    "Bhubaneswar": {"ATM": 4, "Bank": 2},
}

BANK_NAMES = ["SBI", "HDFC", "ICICI", "Federal Bank", "Canara Bank", "Axis Bank"]


def generate_access_points():
    random.seed(9)
    data = []

    for area, center in AREA_CENTERS.items():
        lat, lng = center
        counts = AREA_COUNTS[area]

        for i in range(counts["ATM"]):
            bank = random.choice(BANK_NAMES)
            data.append({
                "name": f"{bank} ATM {area} Zone {i + 1}",
                "type": "ATM",
                "area": area,
                "lat": round(lat + random.uniform(-0.09, 0.09), 6),
                "lng": round(lng + random.uniform(-0.09, 0.09), 6),
                "data_label": "synthetic_mock_data"
            })

        for i in range(counts["Bank"]):
            bank = random.choice(BANK_NAMES)
            data.append({
                "name": f"{bank} {area} Branch {i + 1}",
                "type": "Bank",
                "area": area,
                "lat": round(lat + random.uniform(-0.08, 0.08), 6),
                "lng": round(lng + random.uniform(-0.08, 0.08), 6),
                "data_label": "synthetic_mock_data"
            })

    return data


ACCESS_POINTS = generate_access_points()


@app.get("/")
def root():
    return {
        "project": "ATM Access Intelligence System",
        "status": "running",
        "data_note": "Synthetic mock data package for demonstration and intelligence modeling"
    }


@app.get("/access-points")
def get_access_points():
    return ACCESS_POINTS


@app.get("/areas")
def get_areas():
    return list(AREA_PROFILES.keys())


@app.get("/area-profiles")
def get_area_profiles():
    return AREA_PROFILES


@app.get("/mock-data-dictionary")
def get_data_dictionary():
    return {
        "dataset": "Synthetic ATM and Bank Access Data",
        "entities": {
            "AccessPoint": {
                "name": "Name of ATM or bank branch",
                "type": "ATM or Bank",
                "area": "City / region name",
                "lat": "Latitude coordinate",
                "lng": "Longitude coordinate",
                "data_label": "Marks record as synthetic mock data"
            },
            "AreaProfile": {
                "state": "Indian state or region",
                "populationPressure": "Demand pressure score",
                "travelBurden": "Estimated travel difficulty",
                "incomeFriction": "Economic access friction"
            }
        },
        "note": "All records are synthetic and created for academic PoC demonstration."
    }