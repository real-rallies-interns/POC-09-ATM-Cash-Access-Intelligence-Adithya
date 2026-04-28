"use client";

import { useEffect, useState } from "react";
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

const fallbackPoints: AccessPoint[] = [
  { name: "SBI ATM Thiruvananthapuram", type: "ATM", area: "Thiruvananthapuram", lat: 8.5097, lng: 76.949 },
  { name: "Federal Bank Thiruvananthapuram", type: "Bank", area: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },

  { name: "SBI ATM Kollam", type: "ATM", area: "Kollam", lat: 8.8932, lng: 76.6141 },
  { name: "South Indian Bank Kollam", type: "Bank", area: "Kollam", lat: 8.8818, lng: 76.592 },
  { name: "Axis ATM Kollam Town", type: "ATM", area: "Kollam", lat: 8.8853, lng: 76.591 },

  { name: "SBI ATM Kottayam", type: "ATM", area: "Kottayam", lat: 9.5916, lng: 76.5222 },
  { name: "Federal Bank Kottayam", type: "Bank", area: "Kottayam", lat: 9.595, lng: 76.5278 },
  { name: "Canara ATM Kottayam", type: "ATM", area: "Kottayam", lat: 9.6727, lng: 76.5633 },

  { name: "HDFC ATM Alappuzha", type: "ATM", area: "Alappuzha", lat: 9.4981, lng: 76.3388 },

  { name: "SBI ATM Ernakulam", type: "ATM", area: "Ernakulam", lat: 9.9816, lng: 76.2999 },
  { name: "Canara Bank Ernakulam", type: "Bank", area: "Ernakulam", lat: 9.9735, lng: 76.2863 },
  { name: "HDFC ATM Kochi", type: "ATM", area: "Ernakulam", lat: 9.9312, lng: 76.2673 },
  { name: "Union Bank Aluva", type: "Bank", area: "Ernakulam", lat: 10.1076, lng: 76.3516 },

  { name: "SBI ATM Thrissur", type: "ATM", area: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { name: "SBI Branch Thrissur", type: "Bank", area: "Thrissur", lat: 10.5247, lng: 76.213 },
  { name: "Federal ATM Guruvayur", type: "ATM", area: "Thrissur", lat: 10.5943, lng: 76.0411 },

  { name: "SBI ATM Palakkad", type: "ATM", area: "Palakkad", lat: 10.7867, lng: 76.6548 },
  { name: "Federal Bank Palakkad", type: "Bank", area: "Palakkad", lat: 10.7732, lng: 76.651 },

  { name: "SBI ATM Malappuram", type: "ATM", area: "Malappuram", lat: 11.0732, lng: 76.0744 },

  { name: "HDFC ATM Kozhikode", type: "ATM", area: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { name: "SBI Branch Kozhikode", type: "Bank", area: "Kozhikode", lat: 11.2519, lng: 75.7793 },
  { name: "Axis ATM Mavoor Road", type: "ATM", area: "Kozhikode", lat: 11.2671, lng: 75.7935 },

  { name: "SBI ATM Kalpetta", type: "ATM", area: "Wayanad", lat: 11.606, lng: 76.0827 },

  { name: "Federal ATM Kannur", type: "ATM", area: "Kannur", lat: 11.8745, lng: 75.3704 },
  { name: "SBI Branch Kannur", type: "Bank", area: "Kannur", lat: 11.7481, lng: 75.4929 },
];

const areaProfiles: Record<string, { populationPressure: number; travelBurden: number }> = {
  Thiruvananthapuram: { populationPressure: 88, travelBurden: 7.8 },
  Kollam: { populationPressure: 72, travelBurden: 5.4 },
  Kottayam: { populationPressure: 48, travelBurden: 4.6 },
  Alappuzha: { populationPressure: 82, travelBurden: 8.4 },
  Ernakulam: { populationPressure: 68, travelBurden: 3.2 },
  Thrissur: { populationPressure: 58, travelBurden: 4.1 },
  Palakkad: { populationPressure: 64, travelBurden: 6.2 },
  Malappuram: { populationPressure: 92, travelBurden: 9.1 },
  Kozhikode: { populationPressure: 62, travelBurden: 4.5 },
  Wayanad: { populationPressure: 78, travelBurden: 10.2 },
  Kannur: { populationPressure: 52, travelBurden: 5.6 },
};

const areas = Object.keys(areaProfiles);

export default function Home() {
  const [points, setPoints] = useState<AccessPoint[]>(fallbackPoints);
  const [areaA, setAreaA] = useState("Thiruvananthapuram");
  const [areaB, setAreaB] = useState("Kollam");
  const [compared, setCompared] = useState(true);
  const [demoOverlay, setDemoOverlay] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/access-points")
      .then((res) => {
        if (!res.ok) throw new Error("Backend response failed");
        return res.json();
      })
      .then((data: AccessPoint[]) => {
        if (Array.isArray(data) && data.length > 0) setPoints(data);
      })
      .catch(() => {
        setPoints(fallbackPoints);
      });
  }, []);

  const getAreaPoints = (area: string) => points.filter((p) => p.area === area);

  const calculateCoverage = (area: string) => {
    const areaPoints = getAreaPoints(area);
    const atm = areaPoints.filter((p) => p.type === "ATM").length;
    const bank = areaPoints.filter((p) => p.type === "Bank").length;
    const profile = areaProfiles[area];

    const infrastructureScore = atm * 18 + bank * 26;
    const pressurePenalty = profile.populationPressure * 0.32;
    const travelPenalty = profile.travelBurden * 2.2;

    return Math.max(
      8,
      Math.min(96, Math.round(infrastructureScore - pressurePenalty - travelPenalty + 45))
    );
  };

  const areaAScore = calculateCoverage(areaA);
  const areaBScore = calculateCoverage(areaB);

  const priorityArea =
    Math.abs(areaAScore - areaBScore) <= 5
      ? "Both regions require monitoring"
      : areaAScore < areaBScore
      ? areaA
      : areaB;

  const strongerArea =
    Math.abs(areaAScore - areaBScore) <= 5
      ? "Balanced"
      : areaAScore > areaBScore
      ? areaA
      : areaB;

  const activeArea =
    priorityArea === "Both regions require monitoring" ? areaA : priorityArea;

  const activeScore =
    priorityArea === "Both regions require monitoring"
      ? Math.round((areaAScore + areaBScore) / 2)
      : Math.min(areaAScore, areaBScore);

  const underservedScore = Math.max(0, 100 - activeScore);

  const activePoints = getAreaPoints(activeArea);
  const atmCount = activePoints.filter((p) => p.type === "ATM").length;
  const bankCount = activePoints.filter((p) => p.type === "Bank").length;
  const activeProfile = areaProfiles[activeArea] ?? areaProfiles[areaA];

  const classification =
    activeScore < 35
      ? "Financial Desert"
      : activeScore < 65
      ? "Underserved"
      : "Stable Access";

  const riskLevel =
    activeScore < 35 ? "High Risk" : activeScore < 65 ? "Moderate Risk" : "Low Risk";

  const recommendedAction =
    activeScore < 35
      ? "Prioritize ATM deployment and bank agent coverage immediately."
      : activeScore < 65
      ? "Improve access density through targeted ATM and branch support."
      : "Maintain monitoring and expand only if demand increases.";

  return (
    <main className="h-screen bg-[#030712] text-white grid grid-cols-[300px_1fr_400px] overflow-hidden">
      <aside className="real-panel border-r border-cyan-400/10 p-6 overflow-y-auto">
        <p className="text-xs tracking-[0.28em] text-cyan-400 font-bold">
          REAL RAILS / POC 09
        </p>

        <h1 className="mt-4 text-3xl font-black leading-tight">
          Cash Access <br /> Intelligence
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-300">
          Equity monitor for ATM, bank access, underserved zones, and physical cash infrastructure risk.
        </p>

        <section className="info-card mt-8">
          <h2 className="text-xl font-bold text-cyan-400">Region Compare</h2>

          <label className="mt-6 block text-sm text-slate-300">Area A</label>
          <select
            value={areaA}
            onChange={(e) => setAreaA(e.target.value)}
            className="mt-2 w-full rounded-xl border border-cyan-400/20 bg-[#030712] p-3 text-white"
          >
            {areas.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>

          <label className="mt-5 block text-sm text-slate-300">Area B</label>
          <select
            value={areaB}
            onChange={(e) => setAreaB(e.target.value)}
            className="mt-2 w-full rounded-xl border border-cyan-400/20 bg-[#030712] p-3 text-white"
          >
            {areas.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>

          <button
            onClick={() => setCompared(true)}
            className="mt-6 w-full rounded-xl border border-cyan-400 bg-cyan-950/40 p-3 font-bold text-cyan-300 hover:bg-cyan-400 hover:text-black"
          >
            Compare Areas
          </button>
        </section>

        <section className="info-card mt-6">
          <h2 className="text-xl font-bold text-cyan-400">Layers</h2>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={demoOverlay}
              onChange={(e) => setDemoOverlay(e.target.checked)}
            />
            Demographic friction overlay
          </label>
        </section>

        <section className="info-card mt-6">
          <h2 className="text-xl font-bold text-cyan-400">Legend</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="text-cyan-400">●</span> ATM</p>
            <p><span className="text-indigo-400">●</span> Bank</p>
            <p><span className="text-red-400">●</span> Underserved Area</p>
            <p><span className="text-amber-400">●</span> Structural Friction</p>
          </div>
        </section>
      </aside>

      <section className="relative border-x border-cyan-400/10">
        <div className="absolute left-8 top-8 z-[999] rounded-2xl border border-cyan-400/20 bg-[#030712]/95 p-6 shadow-glow">
          <p className="text-xs tracking-[0.35em] text-cyan-400 font-bold">
            CASH ACCESS RAIL
          </p>
          <h2 className="mt-3 text-3xl font-black">Branch Density Map</h2>
          <p className="mt-2 text-slate-300">
            ATM + bank points, underserved scoring, demographic friction.
          </p>
        </div>

        <MapClient
          points={points}
          areaA={areaA}
          areaB={areaB}
          compared={compared}
          areaAScore={areaAScore}
          areaBScore={areaBScore}
          demoOverlay={demoOverlay}
        />
      </section>

      <aside className="real-panel p-6 overflow-y-auto">
        <h2 className="text-2xl font-black text-cyan-400">Intelligence Dashboard</h2>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="metric-card">
            <p className="text-sm text-slate-300">Priority Coverage</p>
            <h3 className="text-3xl font-black text-emerald-400">{activeScore}%</h3>
            <p className="text-xs text-slate-400">{activeArea}</p>
          </div>

          <div className="metric-card danger">
            <p className="text-sm text-slate-300">Underserved</p>
            <h3 className="text-3xl font-black text-red-400">{underservedScore}%</h3>
            <p className="text-xs text-slate-400">{riskLevel}</p>
          </div>

          <div className="metric-card">
            <p className="text-sm text-slate-300">ATM / Bank</p>
            <h3 className="text-2xl font-black">{atmCount} / {bankCount}</h3>
          </div>

          <div className="metric-card">
            <p className="text-sm text-slate-300">Avg Travel</p>
            <h3 className="text-2xl font-black">{activeProfile.travelBurden} km</h3>
          </div>
        </div>

        <section className="info-card mt-5">
          <h3 className="text-xl font-bold text-cyan-400">Area Classification</h3>
          <h2 className="mt-4 text-3xl font-black">{classification}</h2>
          <p className="mt-3 text-slate-300">
            {activeArea} has {activeScore}% access coverage with {activeProfile.populationPressure}% synthetic demand pressure.
          </p>
        </section>

        <section className="info-card mt-5">
          <h3 className="text-xl font-bold text-cyan-400">Region Compare</h3>
          <p className="mt-4 font-semibold">{areaA}: {areaAScore}% coverage</p>
          <p className="font-semibold">{areaB}: {areaBScore}% coverage</p>
          <p className="mt-4 text-lg font-bold text-red-400">Priority Area: {priorityArea}</p>
          <p className="text-sm text-slate-400">Stronger reference: {strongerArea}</p>
        </section>

        <section className="info-card danger mt-5">
          <h3 className="text-xl font-bold text-red-300">Underserved Area Scoring</h3>
          <p className="mt-4 leading-7">
            {activeArea} is flagged because its cash access coverage is weaker after considering ATM density,
            bank branch support, travel burden, and demographic demand pressure.
          </p>
        </section>

        <section className="info-card warning mt-5">
          <h3 className="text-xl font-bold text-yellow-300">Demographic Overlay</h3>
          <p className="mt-4 leading-7">
            The friction layer highlights areas where population need may be higher than available ATM and branch infrastructure.
          </p>
        </section>

        <section className="info-card mt-5">
          <h3 className="text-xl font-bold text-cyan-400">Recommended Action</h3>
          <p className="mt-4 leading-7">{recommendedAction}</p>
        </section>

        <section className="info-card mt-5">
          <h3 className="text-xl font-bold text-cyan-400">Why This Matters</h3>
          <p className="mt-4 leading-7">
            Cash remains a fallback rail during payment outages, disasters, and financial exclusion.
            Weak access reduces emergency financial resilience.
          </p>
        </section>

        <section className="info-card mt-5">
          <h3 className="text-xl font-bold text-cyan-400">Who Controls the Rail</h3>
          <p className="mt-4 leading-7">
            Commercial banks, independent ATM deployers, regulators, and local planners shape physical cash access.
          </p>
        </section>
      </aside>
    </main>
  );
}