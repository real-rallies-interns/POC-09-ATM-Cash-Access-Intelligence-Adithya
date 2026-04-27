# 🏦 ATM Access Intelligence System  
**Geospatial Cash Access Analysis & Underserved Region Detection**

---

## 📌 Overview

The ATM Access Intelligence System is an interactive geospatial intelligence platform designed to analyze physical cash access infrastructure across regions.

It visualizes ATM and bank distribution, compares regions, identifies underserved areas, and generates actionable insights such as:

- Coverage score  
- Underserved risk  
- Travel burden  
- Infrastructure imbalance  

This system follows a **70/30 Visualization-to-Intelligence architecture**, where the map provides spatial context and the dashboard delivers insights.

---

## 🎯 Objective

To build a system that goes beyond simple mapping and answers:

> "Which areas lack sufficient cash access, and why does it matter?"

---

## 🧠 Key Features

### 🌍 Interactive Map
- Dark-themed geospatial visualization  
- ATM and Bank markers  
- South India bounded map  

### 📊 Region Comparison
- Compare two regions (Area A vs Area B)  
- Real-time infrastructure comparison  
- Dynamic priority detection  

### 🔴 Underserved Area Detection
- Automatically identifies weaker region  
- Highlights with pulsing red zone  
- Smart visualization (no clutter)  

### 🟡 Demographic Friction Layer
- Optional overlay for infrastructure stress  
- Shows areas with demand-supply imbalance  

### 📈 Intelligence Dashboard
Provides insights like:
- Coverage score  
- Underserved percentage  
- ATM vs Bank ratio  
- Average travel distance  
- Area classification (Financial Desert)  

### 🧾 Insight Panels
- Why This Matters  
- Underserved Area Scoring  
- Demographic Overlay Explanation  
- Proximity Modeling  

---

## 🏗️ Tech Stack

### Frontend
- Next.js (App Router)  
- TypeScript  
- Tailwind CSS  
- React Leaflet  

### Backend
- FastAPI (Python)  
- REST API (`/access-points`)  
- Structured + mock data  

### Data Sources
- OpenStreetMap (conceptual base)  
- Synthetic ATM/Bank dataset  

---

## 🧩 Architecture

Frontend (Next.js)  
↓  
API Call (/access-points)  
↓  
Backend (FastAPI)  
↓  
Processed Data → Map + Dashboard Insights  

---

## 🚀 How to Run

### 1. Clone Project
git clone <your-repo-link>  
cd ATM-FINAL  

---

### 2. Start Backend
cd backend  
uvicorn main:app --reload  

Runs at: http://127.0.0.1:8000  

---

### 3. Start Frontend
cd frontend  
npm install  
npm run dev  

Runs at: http://localhost:3000  

---

## 🧪 How to Use

1. Select **Area A** and **Area B**  
2. Click **Compare Areas**  
3. Observe:  
   - 🔴 Red pulsing circle → underserved region  
   - 🟡 Orange overlay → demographic friction  
4. Read insights in dashboard  

---

## 🧠 Intelligence Logic

- Coverage = Number of access points per area  
- Lower score = Higher underserved risk  
- System compares both areas and highlights the weaker one  
- If both are similar → neutral visualization  

---

## 🎨 Design Principles

- Dark theme: #030712  
- Minimal clutter  
- 70% Map → 30% Insights  
- Focus on storytelling, not just data  

---

## 📌 Use Cases

- Financial inclusion analysis  
- ATM placement strategy  
- Disaster preparedness (cash fallback zones)  
- Banking infrastructure planning  

---

## 🏁 Conclusion

This project demonstrates how **geospatial data + intelligent visualization** can transform raw infrastructure data into actionable insights.

> Not just *where ATMs are*, but *where they should be*.

---

## 👨‍💻 Author

**Adithya Rajagopal**  
BCA Honours  
Mar Augusthinose College (MG University)  