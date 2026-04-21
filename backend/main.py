from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

access_points = [
    {"name": "SBI ATM Palayam", "type": "ATM", "area": "Thiruvananthapuram", "lat": 8.5097, "lng": 76.9490},
    {"name": "Federal ATM Pattom", "type": "ATM", "area": "Thiruvananthapuram", "lat": 8.5231, "lng": 76.9436},
    {"name": "Canara Bank Statue", "type": "Bank", "area": "Thiruvananthapuram", "lat": 8.4883, "lng": 76.9492},

    {"name": "SBI ATM Chinnakada", "type": "ATM", "area": "Kollam", "lat": 8.8932, "lng": 76.6141},
    {"name": "Axis ATM Kollam Town", "type": "ATM", "area": "Kollam", "lat": 8.8853, "lng": 76.5910},
    {"name": "South Indian Bank Kollam", "type": "Bank", "area": "Kollam", "lat": 8.8818, "lng": 76.5920},

    {"name": "SBI ATM Pathanamthitta", "type": "ATM", "area": "Pathanamthitta", "lat": 9.2648, "lng": 76.7870},
    {"name": "Union Bank Pathanamthitta", "type": "Bank", "area": "Pathanamthitta", "lat": 9.2660, "lng": 76.7835},

    {"name": "HDFC ATM Alappuzha", "type": "ATM", "area": "Alappuzha", "lat": 9.4981, "lng": 76.3388},
    {"name": "SBI Branch Alappuzha", "type": "Bank", "area": "Alappuzha", "lat": 9.5014, "lng": 76.3383},

    {"name": "Canara ATM Kottayam", "type": "ATM", "area": "Kottayam", "lat": 9.5916, "lng": 76.5222},
    {"name": "Federal Bank Kottayam", "type": "Bank", "area": "Kottayam", "lat": 9.5950, "lng": 76.5278},
    {"name": "SBI ATM Ettumanoor", "type": "ATM", "area": "Kottayam", "lat": 9.6727, "lng": 76.5633},

    {"name": "SBI ATM Thodupuzha", "type": "ATM", "area": "Idukki", "lat": 9.8944, "lng": 76.7221},
    {"name": "Kerala Gramin Bank Idukki", "type": "Bank", "area": "Idukki", "lat": 9.8940, "lng": 76.7180},

    {"name": "Federal ATM Ernakulam", "type": "ATM", "area": "Ernakulam", "lat": 9.9816, "lng": 76.2999},
    {"name": "SBI ATM Kochi", "type": "ATM", "area": "Ernakulam", "lat": 9.9312, "lng": 76.2673},
    {"name": "Canara Bank MG Road", "type": "Bank", "area": "Ernakulam", "lat": 9.9735, "lng": 76.2863},
    {"name": "HDFC ATM Kakkanad", "type": "ATM", "area": "Ernakulam", "lat": 10.0159, "lng": 76.3419},
    {"name": "Union Bank Aluva", "type": "Bank", "area": "Ernakulam", "lat": 10.1076, "lng": 76.3516},

    {"name": "HDFC ATM Thrissur", "type": "ATM", "area": "Thrissur", "lat": 10.5276, "lng": 76.2144},
    {"name": "SBI Branch Thrissur", "type": "Bank", "area": "Thrissur", "lat": 10.5247, "lng": 76.2130},
    {"name": "Federal ATM Guruvayur", "type": "ATM", "area": "Thrissur", "lat": 10.5943, "lng": 76.0411},

    {"name": "SBI ATM Palakkad", "type": "ATM", "area": "Palakkad", "lat": 10.7867, "lng": 76.6548},
    {"name": "Canara Bank Palakkad", "type": "Bank", "area": "Palakkad", "lat": 10.7732, "lng": 76.6510},
    {"name": "Axis ATM Ottapalam", "type": "ATM", "area": "Palakkad", "lat": 10.7737, "lng": 76.3776},

    {"name": "SBI ATM Malappuram", "type": "ATM", "area": "Malappuram", "lat": 11.0732, "lng": 76.0740},
    {"name": "Federal Bank Manjeri", "type": "Bank", "area": "Malappuram", "lat": 11.1203, "lng": 76.1196},

    {"name": "HDFC ATM Kozhikode", "type": "ATM", "area": "Kozhikode", "lat": 11.2588, "lng": 75.7804},
    {"name": "SBI Branch Kozhikode", "type": "Bank", "area": "Kozhikode", "lat": 11.2519, "lng": 75.7793},
    {"name": "Axis ATM Mavoor Road", "type": "ATM", "area": "Kozhikode", "lat": 11.2671, "lng": 75.7935},

    {"name": "SBI ATM Kalpetta", "type": "ATM", "area": "Wayanad", "lat": 11.6104, "lng": 76.0827},
    {"name": "South Indian Bank Sulthan Bathery", "type": "Bank", "area": "Wayanad", "lat": 11.6656, "lng": 76.2777},

    {"name": "Federal ATM Kannur", "type": "ATM", "area": "Kannur", "lat": 11.8745, "lng": 75.3704},
    {"name": "SBI Branch Taliparamba", "type": "Bank", "area": "Kannur", "lat": 12.0395, "lng": 75.3609},
    {"name": "Canara ATM Thalassery", "type": "ATM", "area": "Kannur", "lat": 11.7481, "lng": 75.4929},

    {"name": "SBI ATM Kasaragod", "type": "ATM", "area": "Kasaragod", "lat": 12.4996, "lng": 74.9869},
    {"name": "Federal Bank Kanhangad", "type": "Bank", "area": "Kasaragod", "lat": 12.3151, "lng": 75.0900},
]

areas = [
    {"area": "Thiruvananthapuram", "lat": 8.5241, "lng": 76.9366},
    {"area": "Kollam", "lat": 8.8932, "lng": 76.6141},
    {"area": "Pathanamthitta", "lat": 9.2648, "lng": 76.7870},
    {"area": "Alappuzha", "lat": 9.4981, "lng": 76.3388},
    {"area": "Kottayam", "lat": 9.5916, "lng": 76.5222},
    {"area": "Idukki", "lat": 9.8497, "lng": 76.9710},
    {"area": "Ernakulam", "lat": 9.9816, "lng": 76.2999},
    {"area": "Thrissur", "lat": 10.5276, "lng": 76.2144},
    {"area": "Palakkad", "lat": 10.7867, "lng": 76.6548},
    {"area": "Malappuram", "lat": 11.0510, "lng": 76.0711},
    {"area": "Kozhikode", "lat": 11.2588, "lng": 75.7804},
    {"area": "Wayanad", "lat": 11.6854, "lng": 76.1320},
    {"area": "Kannur", "lat": 11.8745, "lng": 75.3704},
    {"area": "Kasaragod", "lat": 12.4996, "lng": 74.9869},
]

@app.get("/")
def home():
    return {"message": "Cash Access Intelligence API Running"}

@app.get("/access-points")
def get_access_points():
    return access_points

@app.get("/areas")
def get_areas():
    return areas