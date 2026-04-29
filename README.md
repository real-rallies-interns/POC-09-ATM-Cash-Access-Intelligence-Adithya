# 🏦 ATM Access Intelligence System

A geospatial intelligence dashboard that analyzes and visualizes ATM and bank access across regions, identifies underserved areas, and provides actionable financial infrastructure insights.

---

## 🚀 Overview

The **ATM Access Intelligence System** is an interactive mapping platform that evaluates cash access infrastructure using key real-world indicators:

* ATM & bank density
* Population pressure
* Travel burden
* Income friction

It transforms raw geographic data into **decision-ready intelligence**, helping identify financial deserts and underserved zones.

---

## 🎯 Key Features

### 🗺️ Interactive Geospatial Map

* Visualizes ATM and bank locations dynamically
* Smart marker separation for clarity
* Auto-fit map based on selected areas

### ⚖️ Area Comparison Engine

* Compare two regions (Area A vs Area B)
* Coverage scoring system
* Automatic intervention priority detection

### 🔴 Underserved Area Detection

* Red-zone highlighting for weak access regions
* Radius adjusts based on severity

### 🟡 Demographic Pressure Overlay

* Highlights population and economic stress
* Shows mismatch between demand and infrastructure

### 📊 Intelligence Dashboard

* Coverage score & access gap
* Risk classification (High / Moderate / Low)
* ATM vs Bank distribution
* Nearest ATM distance

### 📍 Proximity Modeling

* Calculates realistic distance to nearest ATM

### 🧠 Insight Generation

* Classifies regions into:

  * Financial Desert
  * Underserved
  * Stable Access
* Generates recommendations

---

## 🧪 Technology Stack

**Frontend**

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* React Leaflet

**Backend**

* FastAPI (Python)

**Data**

* Structured mock + API fallback

---

## 🏗️ System Architecture

```text
Frontend (Next.js + Leaflet)
        ↓
FastAPI Backend
        ↓
Access Points Data
        ↓
Scoring Engine
        ↓
Visualization + Insights
```

---

## 📈 Scoring Model

* Infrastructure (ATM + Bank count)
* Population pressure penalty
* Travel burden penalty
* Income friction penalty

**Output:**

* Coverage Score (0–100)
* Access Gap = 100 - Coverage

---

## 🧭 Classification Logic

| Coverage | Classification   |
| -------- | ---------------- |
| < 35%    | Financial Desert |
| 35–70%   | Underserved      |
| > 70%    | Stable Access    |

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/atm-access-intelligence.git
cd atm-access-intelligence
```

### 2. Start Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Open Application

```text
http://localhost:3000
```

---

## 🧩 Features in Action

* Toggle ATM / Bank visibility
* Show underserved zones
* Enable demographic pressure layer
* Compare regions dynamically

---

## 📊 Use Cases

* Financial inclusion analysis
* ATM placement strategy
* Urban planning
* Policy decision support

---

## ⚠️ Limitations

* Uses mock / limited dataset
* No real-time external API integration
* Heuristic scoring model

---

## 🔮 Future Improvements

* Live OpenStreetMap integration
* Heatmap visualization
* ML-based scoring
* Advanced analytics

---

## 👨‍💻 Author

**Adithya Rajagopal**
BCA Honours Student

---

## 💡 Final Note

This project demonstrates how raw infrastructure data can be transformed into **actionable intelligence** for better financial accessibility planning.
