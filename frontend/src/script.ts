declare const L: any;

interface AccessPoint {
  name: string;
  type: "ATM" | "Bank";
  area: string;
  lat: number;
  lng: number;
}

interface Area {
  area: string;
  lat: number;
  lng: number;
}

interface AreaRisk {
  risk: "Low" | "Moderate" | "High";
}

const API_BASE = "http://127.0.0.1:8000";

const fallbackAreas: Area[] = [
  { area: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { area: "Kollam", lat: 8.8932, lng: 76.6141 },
  { area: "Pathanamthitta", lat: 9.2648, lng: 76.7870 },
  { area: "Alappuzha", lat: 9.4981, lng: 76.3388 },
  { area: "Kottayam", lat: 9.5916, lng: 76.5222 },
  { area: "Idukki", lat: 9.8497, lng: 76.9710 },
  { area: "Ernakulam", lat: 9.9816, lng: 76.2999 },
  { area: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { area: "Palakkad", lat: 10.7867, lng: 76.6548 },
  { area: "Malappuram", lat: 11.0510, lng: 76.0711 },
  { area: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { area: "Wayanad", lat: 11.6854, lng: 76.1320 },
  { area: "Kannur", lat: 11.8745, lng: 75.3704 },
  { area: "Kasaragod", lat: 12.4996, lng: 74.9869 }
];

const fallbackAccessPoints: AccessPoint[] = [
  { name: "SBI ATM Palayam", type: "ATM", area: "Thiruvananthapuram", lat: 8.5097, lng: 76.9490 },
  { name: "Federal ATM Pattom", type: "ATM", area: "Thiruvananthapuram", lat: 8.5231, lng: 76.9436 },
  { name: "Canara Bank Statue", type: "Bank", area: "Thiruvananthapuram", lat: 8.4883, lng: 76.9492 },

  { name: "SBI ATM Chinnakada", type: "ATM", area: "Kollam", lat: 8.8932, lng: 76.6141 },
  { name: "Axis ATM Kollam Town", type: "ATM", area: "Kollam", lat: 8.8853, lng: 76.5913 },
  { name: "South Indian Bank Kollam", type: "Bank", area: "Kollam", lat: 8.8818, lng: 76.5920 },

  { name: "Union Bank Pathanamthitta", type: "Bank", area: "Pathanamthitta", lat: 9.2660, lng: 76.7835 },

  { name: "HDFC ATM Alappuzha", type: "ATM", area: "Alappuzha", lat: 9.4981, lng: 76.3388 },
  { name: "SBI Branch Alappuzha", type: "Bank", area: "Alappuzha", lat: 9.5014, lng: 76.3383 },

  { name: "Federal ATM Ettumanoor", type: "ATM", area: "Kottayam", lat: 9.6727, lng: 76.5633 },
  { name: "Federal Bank Kottayam", type: "Bank", area: "Kottayam", lat: 9.5950, lng: 76.5278 },

  { name: "SBI ATM Thodupuzha", type: "ATM", area: "Idukki", lat: 9.8944, lng: 76.7221 },
  { name: "Kerala Gramin Bank Idukki", type: "Bank", area: "Idukki", lat: 9.8940, lng: 76.7180 },

  { name: "Federal ATM Ernakulam", type: "ATM", area: "Ernakulam", lat: 9.9816, lng: 76.2999 },
  { name: "Canara Bank MG Road", type: "Bank", area: "Ernakulam", lat: 9.9735, lng: 76.2863 },
  { name: "HDFC ATM Kakkanad", type: "ATM", area: "Ernakulam", lat: 10.0159, lng: 76.3419 },

  { name: "SBI ATM Thrissur", type: "ATM", area: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { name: "Federal ATM Guruvayur", type: "ATM", area: "Thrissur", lat: 10.5943, lng: 76.0411 },
  { name: "SBI Branch Thrissur", type: "Bank", area: "Thrissur", lat: 10.5247, lng: 76.2130 },

  { name: "SBI ATM Palakkad", type: "ATM", area: "Palakkad", lat: 10.7867, lng: 76.6548 },
  { name: "Axis ATM Ottapalam", type: "ATM", area: "Palakkad", lat: 10.7737, lng: 76.3776 },
  { name: "Canara Bank Palakkad", type: "Bank", area: "Palakkad", lat: 10.7732, lng: 76.6510 },

  { name: "Federal Bank Manjeri", type: "Bank", area: "Malappuram", lat: 11.1203, lng: 76.1196 },
  { name: "HDFC ATM Malappuram", type: "ATM", area: "Malappuram", lat: 11.0732, lng: 76.0740 },

  { name: "HDFC ATM Kozhikode", type: "ATM", area: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { name: "SBI Branch Kozhikode", type: "Bank", area: "Kozhikode", lat: 11.2519, lng: 75.7793 },

  { name: "SBI ATM Kalpetta", type: "ATM", area: "Wayanad", lat: 11.6104, lng: 76.0827 },
  { name: "South Indian Bank Sulthan Bathery", type: "Bank", area: "Wayanad", lat: 11.6656, lng: 76.2777 },

  { name: "Federal ATM Kannur", type: "ATM", area: "Kannur", lat: 11.8745, lng: 75.3704 },
  { name: "Canara ATM Thalassery", type: "ATM", area: "Kannur", lat: 11.7481, lng: 75.4929 },
  { name: "SBI Branch Taliparamba", type: "Bank", area: "Kannur", lat: 12.0395, lng: 75.3609 },

  { name: "SBI ATM Kasaragod", type: "ATM", area: "Kasaragod", lat: 12.4996, lng: 74.9869 },
  { name: "Federal Bank Kanhangad", type: "Bank", area: "Kasaragod", lat: 12.3151, lng: 75.0900 }
];

const areaDemographics: Record<string, AreaRisk> = {
  Thiruvananthapuram: { risk: "Moderate" },
  Kollam: { risk: "Moderate" },
  Pathanamthitta: { risk: "High" },
  Alappuzha: { risk: "Moderate" },
  Kottayam: { risk: "Moderate" },
  Idukki: { risk: "High" },
  Ernakulam: { risk: "Low" },
  Thrissur: { risk: "Moderate" },
  Palakkad: { risk: "Moderate" },
  Malappuram: { risk: "Moderate" },
  Kozhikode: { risk: "Low" },
  Wayanad: { risk: "High" },
  Kannur: { risk: "Moderate" },
  Kasaragod: { risk: "High" }
};

const map = L.map("map").setView([10.2, 76.3], 8);

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: "&copy; OpenStreetMap & CARTO"
}).addTo(map);

const pointLayerGroup = L.layerGroup().addTo(map);
const compareLayerGroup = L.layerGroup().addTo(map);

let accessPoints: AccessPoint[] = [];
let areas: Area[] = [];

const els = {
  areaA: document.getElementById("area-a") as HTMLSelectElement | null,
  areaB: document.getElementById("area-b") as HTMLSelectElement | null,
  compareBtn: document.getElementById("compare-btn") as HTMLButtonElement | null,

  areaAResult: document.getElementById("area-a-result") as HTMLElement | null,
  areaBResult: document.getElementById("area-b-result") as HTMLElement | null,
  coverageScore: document.getElementById("coverage-score") as HTMLElement | null,
  areaScore: document.getElementById("area-score") as HTMLElement | null,
  underservedArea: document.getElementById("underserved-area") as HTMLElement | null,
  compareResult: document.getElementById("compare-result") as HTMLElement | null,
  comparisonVerdict: document.getElementById("comparison-verdict") as HTMLElement | null,
  travelBurden: document.getElementById("travel-burden") as HTMLElement | null,
  demographicRisk: document.getElementById("demographic-risk") as HTMLElement | null,
  nearestAtm: document.getElementById("nearest-atm") as HTMLElement | null,
  userLocation: document.getElementById("user-location") as HTMLElement | null,
  infraInsight: document.getElementById("infra-insight") as HTMLElement | null
};

function setText(el: HTMLElement | null, value: string): void {
  if (el) el.textContent = value;
}

function getPointsByArea(areaName: string): AccessPoint[] {
  return accessPoints.filter((p) => p.area === areaName);
}

function getAreaByName(areaName: string): Area | undefined {
  return areas.find((a) => a.area === areaName);
}

function getCoverageScore(points: AccessPoint[]): number {
  return Math.min(points.length * 20, 100);
}

function getCoverageClass(score: number): string {
  if (score >= 70) return "HIGH";
  if (score >= 50) return "MODERATE";
  return "LOW";
}

function getTravelBurden(score: number): string {
  if (score >= 70) return "5-10 min";
  if (score >= 50) return "10-15 min";
  return "15-25 min";
}

function renderAccessPoints(): void {
  pointLayerGroup.clearLayers();

  accessPoints.forEach((point) => {
    const color = point.type === "ATM" ? "#38bdf8" : "#818cf8";

    L.circleMarker([point.lat, point.lng], {
      radius: 8,
      color,
      fillColor: color,
      fillOpacity: 0.95,
      weight: 2
    })
      .bindPopup(`<b>${point.name}</b><br>${point.type}<br>${point.area}`)
      .addTo(pointLayerGroup);
  });
}

function populateAreaDropdowns(): void {
  const areaAEl = els.areaA;
  const areaBEl = els.areaB;

  if (!areaAEl || !areaBEl) return;

  areaAEl.innerHTML = "";
  areaBEl.innerHTML = "";

  areas.forEach((area, index) => {
    const optA = document.createElement("option");
    optA.value = area.area;
    optA.textContent = area.area;
    areaAEl.appendChild(optA);

    const optB = document.createElement("option");
    optB.value = area.area;
    optB.textContent = area.area;
    areaBEl.appendChild(optB);

    if (index === 0) areaAEl.value = area.area;
    if (index === 1) areaBEl.value = area.area;
  });
}

function highlightArea(area: Area, color: string, label: string): void {
  L.circle([area.lat, area.lng], {
    radius: 16000,
    color,
    fillColor: color,
    fillOpacity: 0.14,
    weight: 3
  })
    .bindPopup(label)
    .addTo(compareLayerGroup);
}

function renderUnderservedZone(area: Area): void {
  L.circle([area.lat, area.lng], {
    radius: 22000,
    color: "#ef4444",
    fillColor: "#ef4444",
    fillOpacity: 0.18,
    weight: 4
  })
    .bindPopup("Underserved Area")
    .addTo(compareLayerGroup);

  L.marker([area.lat, area.lng], {
    icon: L.divIcon({
      className: "underserved-label",
      html: `<div class="underserved-pill">Underserved Area</div>`,
      iconSize: [150, 34],
      iconAnchor: [75, -8]
    })
  }).addTo(compareLayerGroup);
}

function compareAreas(): void {
  const areaAEl = els.areaA;
  const areaBEl = els.areaB;

  if (!areaAEl || !areaBEl) return;

  compareLayerGroup.clearLayers();

  const areaAName = areaAEl.value;
  const areaBName = areaBEl.value;

  const pointsA = getPointsByArea(areaAName);
  const pointsB = getPointsByArea(areaBName);

  const scoreA = getCoverageScore(pointsA);
  const scoreB = getCoverageScore(pointsB);

  const areaA = getAreaByName(areaAName);
  const areaB = getAreaByName(areaBName);

  if (!areaA || !areaB) return;

  const scoreDiff = Math.abs(scoreA - scoreB);
  const lowerArea = scoreA <= scoreB ? areaA : areaB;
  const lowerAreaName = scoreA <= scoreB ? areaAName : areaBName;
  const higherArea = scoreA > scoreB ? areaA : areaB;
  const higherAreaName = scoreA > scoreB ? areaAName : areaBName;
  const lowerScore = Math.min(scoreA, scoreB);

  if (scoreDiff <= 10) {
    highlightArea(areaA, "#f59e0b", `Balanced: ${areaAName}`);
    highlightArea(areaB, "#f59e0b", `Balanced: ${areaBName}`);
  } else {
    highlightArea(higherArea, "#22c55e", `Better Coverage: ${higherAreaName}`);
  }

  renderUnderservedZone(lowerArea);

  setText(els.areaAResult, `${areaAName}: ${pointsA.length} points`);
  setText(els.areaBResult, `${areaBName}: ${pointsB.length} points`);
  setText(els.coverageScore, `${lowerScore}%`);
  setText(els.areaScore, getCoverageClass(lowerScore));
  setText(els.underservedArea, lowerAreaName);

  if (scoreDiff <= 10) {
    setText(
      els.compareResult,
      `${areaAName} and ${areaBName} show balanced access coverage.`
    );
    setText(els.comparisonVerdict, "Balanced Comparison");
  } else {
    setText(
      els.compareResult,
      `${lowerAreaName} has lower access coverage compared to ${higherAreaName}.`
    );
    setText(els.comparisonVerdict, `Coverage Advantage: ${higherAreaName}`);
  }

  setText(els.travelBurden, getTravelBurden(lowerScore));
  setText(
    els.demographicRisk,
    areaDemographics[lowerAreaName]?.risk ?? "Moderate"
  );

  setText(
    els.infraInsight,
    `${lowerAreaName} requires stronger ATM/bank distribution to improve regional cash accessibility.`
  );

  map.setView([lowerArea.lat, lowerArea.lng], 9);
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadius = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function updateUserNearestPoint(userLat: number, userLng: number): void {
  let nearestPoint: AccessPoint | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const point of accessPoints) {
    const km = distanceKm(userLat, userLng, point.lat, point.lng);
    if (km < nearestDistance) {
      nearestDistance = km;
      nearestPoint = point;
    }
  }

  if (!nearestPoint) {
    setText(els.nearestAtm, "Unavailable");
    return;
  }

  setText(els.nearestAtm, `${nearestPoint.name} (${nearestPoint.type})`);

  L.marker([nearestPoint.lat, nearestPoint.lng])
    .addTo(compareLayerGroup)
    .bindPopup(
      `<b>Nearest Cash Point</b><br>${nearestPoint.name}<br>${nearestPoint.type}`
    );
}

async function init(): Promise<void> {
  try {
    const [pointsRes, areasRes] = await Promise.all([
      fetch(`${API_BASE}/access-points`),
      fetch(`${API_BASE}/areas`)
    ]);

    if (!pointsRes.ok || !areasRes.ok) {
      throw new Error("Backend unavailable");
    }

    accessPoints = (await pointsRes.json()) as AccessPoint[];
    areas = (await areasRes.json()) as Area[];
  } catch {
    accessPoints = fallbackAccessPoints;
    areas = fallbackAreas;
    setText(els.compareResult, "Running in fallback mode");
  }

  renderAccessPoints();
  populateAreaDropdowns();
  compareAreas();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setText(els.userLocation, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);

      L.marker([lat, lng])
        .addTo(compareLayerGroup)
        .bindPopup("You are here");

      updateUserNearestPoint(lat, lng);
    },
    () => {
      setText(els.userLocation, "Location denied");
      setText(els.nearestAtm, "Unavailable");
    }
  );
}

els.compareBtn?.addEventListener("click", compareAreas);

init();