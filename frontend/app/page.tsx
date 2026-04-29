"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
});

type AccessPoint = {
  name: string;
  type: "ATM" | "Bank";
  area: string;
  lat: number;
  lng: number;
};

type AreaProfile = {
  state: string;
  populationPressure: number;
  travelBurden: number;
  incomeFriction: number;
};

const fallbackPoints: AccessPoint[] = [
  { name: "SBI ATM Delhi", type: "ATM", area: "Delhi", lat: 28.6315, lng: 77.2167 },
  { name: "HDFC Bank Delhi", type: "Bank", area: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "SBI ATM Patna", type: "ATM", area: "Patna", lat: 25.5941, lng: 85.1376 },
  { name: "PNB Patna", type: "Bank", area: "Patna", lat: 25.61, lng: 85.141 },
];

const areaProfiles: Record<string, AreaProfile> = {
  Delhi: { state: "Delhi", populationPressure: 91, travelBurden: 4.8, incomeFriction: 42 },
  Mumbai: { state: "Maharashtra", populationPressure: 94, travelBurden: 5.2, incomeFriction: 48 },
  Bengaluru: { state: "Karnataka", populationPressure: 82, travelBurden: 4.1, incomeFriction: 36 },
  Chennai: { state: "Tamil Nadu", populationPressure: 78, travelBurden: 5.8, incomeFriction: 44 },
  Hyderabad: { state: "Telangana", populationPressure: 76, travelBurden: 5.4, incomeFriction: 41 },
  Kolkata: { state: "West Bengal", populationPressure: 84, travelBurden: 6.2, incomeFriction: 52 },
  Kochi: { state: "Kerala", populationPressure: 58, travelBurden: 3.8, incomeFriction: 28 },
  Ahmedabad: { state: "Gujarat", populationPressure: 72, travelBurden: 5.6, incomeFriction: 39 },
  Jaipur: { state: "Rajasthan", populationPressure: 68, travelBurden: 6.7, incomeFriction: 46 },
  Lucknow: { state: "Uttar Pradesh", populationPressure: 81, travelBurden: 7.2, incomeFriction: 55 },
  Guwahati: { state: "Assam", populationPressure: 73, travelBurden: 8.4, incomeFriction: 61 },
  Patna: { state: "Bihar", populationPressure: 89, travelBurden: 8.8, incomeFriction: 64 },
  Bhopal: { state: "Madhya Pradesh", populationPressure: 66, travelBurden: 7.4, incomeFriction: 49 },
  Bhubaneswar: { state: "Odisha", populationPressure: 63, travelBurden: 7.9, incomeFriction: 54 },
};

const areas = Object.keys(areaProfiles);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function distanceKm(a: AccessPoint, b: AccessPoint) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export default function Home() {
  const [points, setPoints] = useState<AccessPoint[]>(fallbackPoints);
  const [dataMode, setDataMode] = useState("Fallback Data");

  const [areaA, setAreaA] = useState("Delhi");
  const [areaB, setAreaB] = useState("Patna");

  const [showATM, setShowATM] = useState(true);
  const [showBank, setShowBank] = useState(true);
  const [showUnderserved, setShowUnderserved] = useState(true);
  const [showDemographic, setShowDemographic] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/access-points")
      .then((res) => {
        if (!res.ok) throw new Error("Backend failed");
        return res.json();
      })
      .then((data: AccessPoint[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setPoints(data);
          setDataMode("FastAPI Live Data");
        }
      })
      .catch(() => {
        setPoints(fallbackPoints);
        setDataMode("Fallback Data");
      });
  }, []);

  const getAreaPoints = (area: string) => points.filter((p) => p.area === area);

  const calculateNearestATMDistance = (area: string) => {
    const areaPoints = getAreaPoints(area);
    const atms = areaPoints.filter((p) => p.type === "ATM");
    const banks = areaPoints.filter((p) => p.type === "Bank");
    const profile = areaProfiles[area];

    if (!atms.length || !banks.length) {
      return Number(clamp(profile.travelBurden, 3.5, 13.5).toFixed(1));
    }

    const distances = banks.map((bank) =>
      Math.min(...atms.map((atm) => distanceKm(bank, atm)))
    );

    const realDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const blendedDistance = realDistance * 0.35 + profile.travelBurden * 0.65;

    return Number(clamp(blendedDistance, 2.2, 14.5).toFixed(1));
  };

  const analyzeArea = (area: string) => {
    const areaPoints = getAreaPoints(area);
    const profile = areaProfiles[area];

    const atmCount = areaPoints.filter((p) => p.type === "ATM").length;
    const bankCount = areaPoints.filter((p) => p.type === "Bank").length;

    const infrastructureSignal = atmCount * 0.25 + bankCount * 0.45;
    const infrastructureScore = clamp(
      Math.round((1 - Math.exp(-infrastructureSignal)) * 75),
      8,
      75
    );

    const demandPenalty = profile.populationPressure * 0.25;
    const travelPenalty = profile.travelBurden * 2.6;
    const frictionPenalty = profile.incomeFriction * 0.22;

    const rawScore =
      50 + infrastructureScore - demandPenalty - travelPenalty - frictionPenalty;

    const coverage = clamp(Math.round(rawScore), 20, 92);
    const accessGap = 100 - coverage;

    const riskLevel =
      coverage < 35 ? "High Risk" : coverage < 70 ? "Moderate Risk" : "Low Risk";

    const classification =
      coverage < 35
        ? "Financial Desert"
        : coverage < 70
        ? "Underserved"
        : "Stable Access";

    return {
      area,
      state: profile.state,
      atmCount,
      bankCount,
      totalPoints: areaPoints.length,
      coverage,
      accessGap,
      riskLevel,
      classification,
      travelBurden: profile.travelBurden,
      proximityDistance: calculateNearestATMDistance(area),
      populationPressure: profile.populationPressure,
      incomeFriction: profile.incomeFriction,
    };
  };

  const areaAReport = useMemo(() => analyzeArea(areaA), [areaA, points]);
  const areaBReport = useMemo(() => analyzeArea(areaB), [areaB, points]);

  const isEqual = areaAReport.coverage === areaBReport.coverage;

  const weakerArea = isEqual
    ? areaAReport
    : areaAReport.coverage < areaBReport.coverage
    ? areaAReport
    : areaBReport;

  const strongerArea = isEqual
    ? areaAReport
    : areaAReport.coverage > areaBReport.coverage
    ? areaAReport
    : areaBReport;

  const priorityLabel = isEqual ? "Balanced Access" : weakerArea.area;
  const coverageDifference = Math.abs(areaAReport.coverage - areaBReport.coverage);

  const recommendedAction =
    isEqual
      ? "Both areas show balanced access. Continue monitoring ATM reliability and demand growth."
      : weakerArea.coverage < 35
      ? `Urgently expand ATM access and banking correspondent coverage in ${weakerArea.area}.`
      : weakerArea.coverage < 70
      ? `Improve cash access density in ${weakerArea.area} through targeted ATM placement.`
      : `Maintain monitoring in ${weakerArea.area}; access is currently acceptable.`;

  return (
    <main className="h-screen bg-[#030712] text-white grid grid-cols-[1fr_390px] overflow-hidden">
      <section className="relative border-r border-cyan-400/10">
        <div className="absolute left-6 right-6 top-5 z-[999]">
          <div className="rounded-2xl border border-cyan-400/20 bg-[#030712]/95 p-4 shadow-glow backdrop-blur">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.28em] text-cyan-400">
                  REAL RAILS / CASH ACCESS INTELLIGENCE
                </p>
                <h1 className="mt-1 text-2xl font-black">India ATM & Bank Access Map</h1>
                <p className="mt-1 text-xs text-slate-400">
                  Source: {dataMode} • {points.length} access points loaded
                </p>
              </div>

              <div className="ml-auto grid grid-cols-2 gap-3">
                <label className="text-xs text-slate-300">
                  Area A
                  <select
                    value={areaA}
                    onChange={(e) => setAreaA(e.target.value)}
                    className="mt-1 block w-44 rounded-xl border border-cyan-400/20 bg-[#06101d] p-2 text-white"
                  >
                    {areas.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>

                <label className="text-xs text-slate-300">
                  Compare With
                  <select
                    value={areaB}
                    onChange={(e) => setAreaB(e.target.value)}
                    className="mt-1 block w-44 rounded-xl border border-cyan-400/20 bg-[#06101d] p-2 text-white"
                  >
                    {areas.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-300">
              <label className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">
                <input type="checkbox" checked={showATM} onChange={(e) => setShowATM(e.target.checked)} className="mr-2" />
                Show ATM
              </label>

              <label className="rounded-full bg-indigo-400/10 px-3 py-1 text-indigo-300">
                <input type="checkbox" checked={showBank} onChange={(e) => setShowBank(e.target.checked)} className="mr-2" />
                Show Bank
              </label>

              <label className="rounded-full bg-red-400/10 px-3 py-1 text-red-300">
                <input type="checkbox" checked={showUnderserved} onChange={(e) => setShowUnderserved(e.target.checked)} className="mr-2" />
                Show Underserved
              </label>

              <label className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-300">
                <input type="checkbox" checked={showDemographic} onChange={(e) => setShowDemographic(e.target.checked)} className="mr-2" />
                Demographic Pressure
              </label>
            </div>
          </div>
        </div>

        <MapClient
          points={points}
          areaA={areaA}
          areaB={areaB}
          compared={true}
          areaAScore={areaAReport.coverage}
          areaBScore={areaBReport.coverage}
          showATM={showATM}
          showBank={showBank}
          showUnderserved={showUnderserved}
          showDemographic={showDemographic}
          areaProfiles={areaProfiles}
        />
      </section>

      <aside className="real-panel overflow-y-auto p-6">
        <p className="text-xs font-bold tracking-[0.28em] text-cyan-400">INTELLIGENCE DASHBOARD</p>
        <h2 className="mt-2 text-3xl font-black">Access Risk Summary</h2>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="metric-card">
            <p className="text-sm text-slate-300">Priority Coverage</p>
            <h3 className="mt-1 text-4xl font-black text-cyan-300">{weakerArea.coverage}%</h3>
            <p className="text-xs text-slate-400">{priorityLabel}</p>
          </div>

          <div className="metric-card danger">
            <p className="text-sm text-slate-300">Access Gap</p>
            <h3 className="mt-1 text-4xl font-black text-red-400">{weakerArea.accessGap}%</h3>
            <p className="text-xs text-slate-400">{weakerArea.riskLevel}</p>
          </div>

          <div className="metric-card">
            <p className="text-sm text-slate-300">ATM / Bank</p>
            <h3 className="mt-1 text-2xl font-black">
              {weakerArea.atmCount} / {weakerArea.bankCount}
            </h3>
          </div>

          <div className="metric-card">
            <p className="text-sm text-slate-300">Nearest ATM</p>
            <h3 className="mt-1 text-2xl font-black">{weakerArea.proximityDistance} km</h3>
          </div>
        </div>

        <section className="info-card mt-5">
          <h3 className="text-lg font-bold text-cyan-300">Area Comparison</h3>
          <div className="mt-4 space-y-3">
            <p><b>{areaAReport.area}</b>: {areaAReport.coverage}% coverage</p>
            <p><b>{areaBReport.area}</b>: {areaBReport.coverage}% coverage</p>
            <p className="text-red-300">Intervention Priority: <b>{priorityLabel}</b></p>
            <p className="text-sm text-slate-400">
              {isEqual
                ? "Both areas have equal coverage scores."
                : `${strongerArea.area} outperforms by ${coverageDifference} coverage points.`}
            </p>
          </div>
        </section>

        <section className="info-card danger mt-5">
          <h3 className="text-lg font-bold text-red-300">Access Classification Insight</h3>
          <p className="mt-3 leading-7 text-slate-300">
            {priorityLabel} is classified as <b>{weakerArea.classification}</b> after considering
            ATM density, bank availability, population pressure, travel burden, and income friction.
          </p>
        </section>

        <section className="info-card warning mt-5">
          <h3 className="text-lg font-bold text-amber-300">Demographic Overlay</h3>
          <p className="mt-3 leading-7 text-slate-300">
            Population pressure is <b>{weakerArea.populationPressure}%</b> and income friction is{" "}
            <b>{weakerArea.incomeFriction}%</b>. This highlights where weak cash access becomes a
            social infrastructure risk.
          </p>
        </section>

        <section className="info-card mt-5">
          <h3 className="text-lg font-bold text-cyan-300">Proximity Modeling</h3>
          <p className="mt-3 leading-7 text-slate-300">
            Estimated average distance to the nearest ATM in {weakerArea.area} is{" "}
            <b>{weakerArea.proximityDistance} km</b>. This represents the physical effort required
            to access cash.
          </p>
        </section>

        <section className="info-card mt-5">
          <h3 className="text-lg font-bold text-cyan-300">Recommended Action</h3>
          <p className="mt-3 leading-7 text-slate-300">{recommendedAction}</p>
        </section>

        <section className="info-card mt-5">
          <h3 className="text-lg font-bold text-cyan-300">Why This Matters</h3>
          <p className="mt-3 leading-7 text-slate-300">
            Cash is still a fallback payment rail during outages, emergencies, and exclusion from
            digital payment systems. Weak physical access can reduce financial resilience.
          </p>
        </section>

        <section className="info-card mt-5">
          <h3 className="text-lg font-bold text-cyan-300">Who Controls the Rail</h3>
          <p className="mt-3 leading-7 text-slate-300">
            Banks, ATM deployers, regulators, and local planners shape the physical cash access
            network. This dashboard helps identify where that rail is failing.
          </p>
        </section>
      </aside>
    </main>
  );
}