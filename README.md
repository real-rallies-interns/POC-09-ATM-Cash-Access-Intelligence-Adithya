# ATM & Cash Access Intelligence System (PoC 09)

An interactive geospatial intelligence platform designed to visualize ATM and banking infrastructure, compare regions, detect underserved areas, and generate actionable insights for decision-making.

---

## 🚀 Overview

This system transforms raw location data into **intelligence-driven insights** using a map-first interface combined with a real-time analytical sidebar.

Users can explore cash access availability, evaluate service distribution, and identify gaps in infrastructure across selected areas.

---

## 🧠 How It Works

The system operates through a **map-to-intelligence pipeline**:

1. **Data Loading**

   * ATM and bank locations are fetched from backend APIs (or fallback mock dataset)
   * Area-level metadata is initialized for comparison

2. **Map Visualization**

   * All access points are plotted using Leaflet
   * Different markers represent ATMs and banks

3. **User Interaction (The Handshake)**

   * User selects areas from the left sidebar
   * Selection triggers recalculation of metrics

4. **Intelligence Generation**

   * Coverage Score is calculated based on density
   * Travel Burden is estimated from nearest access points
   * Demographic Risk is simulated based on service imbalance

5. **Comparison Engine**

   * Two selected areas are evaluated side-by-side
   * System highlights:

     * Better coverage
     * Lower travel burden
     * Lower risk

6. **Underserved Detection**

   * Areas with poor coverage are flagged
   * Red visual indicator + animated label shown on map

7. **Decision Support Output**

   * Sidebar updates instantly with insights
   * Helps users identify which area performs better

---

## 🧩 Key Features

* 📍 Interactive Map (Leaflet.js)
* 🎯 Area Selection & Comparison
* 🔴 Underserved Area Detection (with animation)
* 📊 Coverage Score & Classification
* 🚶 Travel Burden Estimation
* 👥 Demographic Risk Analysis
* 📌 Nearest ATM/Bank Detection
* 📥 Download Sample Dataset (JSON)
* ⚡ Real-time Sidebar Intelligence Updates

---

## 🎨 UI & Design Protocol

* Dark theme: `#030712` (Obsidian Black)
* 70/30 Layout:

  * 70% Map (Visualization)
  * 30% Sidebar (Intelligence)
* Real Rails Design Language:

  * Cyan accents
  * Minimal, high-contrast cards
  * Clean professional typography

---

## 🧱 Architecture

### Frontend

* HTML, CSS, TypeScript
* Leaflet.js (map rendering)
* Real-time UI updates based on interaction

### Backend

* Python FastAPI
* Provides endpoints:

  * `/access-points`
  * `/areas`

### Fallback Mode

If backend is unavailable:

* System automatically switches to mock dataset
* Ensures UI always loads without failure

---

## 📂 Project Structure

```
ATM Map Project/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── src/script.ts
│   ├── dist/script.js
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
├── VAR_Results.md
├── UAT_Results.md
└── .gitignore
```

---

## ⚙️ Setup & Run

### 1️⃣ Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

---

### 2️⃣ Frontend

```bash
cd frontend
npx.cmd tsc
```

Then open:

```
index.html → Open with Live Server
```

---

## 📊 Intelligence Model

| Metric           | Description                          |
| ---------------- | ------------------------------------ |
| Coverage Score   | Access point density in area         |
| Travel Burden    | Estimated time to nearest ATM/bank   |
| Demographic Risk | Simulated service accessibility risk |

### Visual Indicators

* 🟢 Green → Better performing area
* 🟠 Orange → Balanced areas
* 🔴 Red → Underserved area (highlighted on map)

---

## 📁 Data Sources

* OpenStreetMap (Overpass API)
* Structured mock dataset for simulation

---

## 🧪 Testing & Validation

* VAR (Visualization Audit Report) ✔
* UAT (User Acceptance Testing) ✔
* Requirement Match ✔

---

## 👨‍💻 Author

Adithya Rajagopal
BCA Honours
Mar Augusthinose College, Ramapuram
Mahatma Gandhi University

---

## 📌 Status

✅ PoC Completed
✅ Frontend aligned with document
✅ TypeScript integrated
✅ Intelligence features implemented
✅ Ready for review & submission
