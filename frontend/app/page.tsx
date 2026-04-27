"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

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

const POPULATION_PROXY: Record<string, number> = {
  Thiruvananthapuram: 957000,
  Kollam: 397000,
  Alappuzha: 240000,
  Kottayam: 136000,
  Idukki: 110000,
  Ernakulam: 3270000,
  Thrissur: 315000,
  Palakkad: 280000,
  Malappuram: 4110000,
  Kozhikode: 609000,
  Wayanad: 817000,
  Kannur: 252000,
  Kasaragod: 1300000,
};

function getStats(points: AccessPoint[], area: string) {
  const areaPoints = points.filter((p) => p.area === area);
  const atms = areaPoints.filter((p) => p.type === "ATM").length;
  const banks = areaPoints.filter((p) => p.type === "Bank").length;
  const population = POPULATION_PROXY[area] || 500000;

  const weightedAccess = atms + banks * 1.6;
  const accessPerLakh = (weightedAccess / population) * 100000;
  const coverage = Math.min(100, Math.round(accessPerLakh * 22));
  const underserved = Math.max(0, 100 - coverage);

  const travelKm =
    underserved > 70 ? 7.8 : underserved > 40 ? 4.6 : 2.1;

  const classification =
    underserved > 70
      ? "Financial Desert"
      : underserved > 40
      ? "Underserved"
      : "Served";

  return {
    area,
    atms,
    banks,
    population,
    accessPerLakh: accessPerLakh.toFixed(2),
    coverage,
    underserved,
    travelKm,
    classification,
  };
}

export default function Home() {
  const [points, setPoints] = useState<AccessPoint[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [areaA, setAreaA] = useState("");
  const [areaB, setAreaB] = useState("");
  const [compared, setCompared] = useState(false);
  const [demoOverlay, setDemoOverlay] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/access-points")
      .then((res) => res.json())
      .then((data: AccessPoint[]) => {
        setPoints(data);
        const unique = Array.from(new Set(data.map((p) => p.area)));
        setAreas(unique);
        setAreaA(unique[0] || "");
        setAreaB(unique[1] || unique[0] || "");
      });
  }, []);

  const statsA = useMemo(() => getStats(points, areaA), [points, areaA]);
  const statsB = useMemo(() => getStats(points, areaB), [points, areaB]);

  const diff = Math.abs(statsA.coverage - statsB.coverage);
  const isSimilar = compared && diff <= 5;

  const priority =
    statsA.coverage <= statsB.coverage ? statsA : statsB;

  const stronger =
    statsA.coverage > statsB.coverage ? statsA : statsB;

  return (
    <main className="h-screen grid grid-cols-[280px_1fr_380px] overflow-hidden bg-[#030712] text-white">
      {/* LEFT CONTROL PANEL */}
      <aside className="real-panel border-r border-cyan-400/15 p-5">
        <p className="text-[11px] font-bold tracking-[0.22em] text-cyan-400">
          REAL RAILS / POC 09
        </p>

        <h1 className="mt-3 text-2xl font-black leading-tight">
          Cash Access Intelligence
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Equity monitor for ATM, bank access, underserved zones, and physical
          cash infrastructure risk.
        </p>

        <div className="mt-7 rounded-2xl border border-cyan-400/15 bg-[#081421]/90 p-4 shadow-glow">
          <h2 className="text-lg font-bold text-cyan-400">Region Compare</h2>

          <label className="mt-4 block text-xs text-slate-400">Area A</label>
          <select
            value={areaA}
            onChange={(e) => {
              setAreaA(e.target.value);
              setCompared(false);
            }}
            className="mt-2 w-full rounded-lg border border-cyan-400/20 bg-[#030712] p-3 outline-none"
          >
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <label className="mt-4 block text-xs text-slate-400">Area B</label>
          <select
            value={areaB}
            onChange={(e) => {
              setAreaB(e.target.value);
              setCompared(false);
            }}
            className="mt-2 w-full rounded-lg border border-cyan-400/20 bg-[#030712] p-3 outline-none"
          >
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <button
            onClick={() => setCompared(true)}
            className="mt-5 w-full rounded-lg border border-cyan-400 py-3 font-bold text-cyan-400 transition hover:bg-cyan-400 hover:text-black"
          >
            Compare Areas
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-[#081421]/90 p-4">
          <h2 className="font-bold text-cyan-400">Layers</h2>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={demoOverlay}
              onChange={(e) => setDemoOverlay(e.target.checked)}
            />
            Demographic friction overlay
          </label>
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-[#081421]/90 p-4 text-sm leading-7">
          <h2 className="font-bold text-cyan-400">Legend</h2>
          <p><span className="text-cyan-400">●</span> ATM</p>
          <p><span className="text-indigo-400">●</span> Bank</p>
          <p><span className="text-red-400">●</span> Underserved Area</p>
          <p><span className="text-amber-400">●</span> Structural Friction</p>
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-[#081421]/80 p-4 text-sm text-slate-300">
          Click markers to inspect ATM/bank metadata. Compare areas to reveal
          priority cash-access gaps.
        </div>
      </aside>

      {/* CENTER MAP */}
      <section className="relative h-full bg-black">
        <MapClient
          points={points}
          areaA={areaA}
          areaB={areaB}
          compared={compared}
          areaAScore={statsA.coverage}
          areaBScore={statsB.coverage}
          demoOverlay={demoOverlay}
        />

        <div className="absolute left-6 top-6 z-[500] rounded-2xl border border-cyan-400/20 bg-[#030712]/90 p-5 backdrop-blur shadow-glow">
          <p className="text-xs font-bold tracking-[0.25em] text-cyan-400">
            CASH ACCESS RAIL
          </p>
          <h2 className="mt-2 text-3xl font-black">Branch Density Map</h2>
          <p className="mt-2 text-sm text-slate-400">
            ATM + bank points, underserved scoring, demographic friction.
          </p>
        </div>
      </section>

      {/* RIGHT DASHBOARD */}
      <aside className="real-panel border-l border-cyan-400/15 p-5 overflow-y-auto">
        <h2 className="text-xl font-black text-cyan-400">
          Intelligence Dashboard
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="metric-card">
            <p className="text-xs text-slate-400">Coverage</p>
            <h3 className="text-3xl font-black text-green-400">
              {statsA.coverage}%
            </h3>
            <p className="text-xs text-slate-400">{statsA.area}</p>
          </div>

          <div className="metric-card border-red-400/30">
            <p className="text-xs text-slate-400">Underserved</p>
            <h3 className="text-3xl font-black text-red-400">
              {statsA.underserved}%
            </h3>
          </div>

          <div className="metric-card">
            <p className="text-xs text-slate-400">ATM / Bank</p>
            <h3 className="mt-2 text-lg font-bold">
              {statsA.atms} / {statsA.banks}
            </h3>
          </div>

          <div className="metric-card">
            <p className="text-xs text-slate-400">Avg Travel</p>
            <h3 className="mt-2 text-lg font-bold">{statsA.travelKm} km</h3>
          </div>
        </div>

        <div className="info-card mt-4">
          <p className="font-bold text-cyan-400">Area Classification</p>
          <h3 className="mt-2 text-2xl font-black">{statsA.classification}</h3>
          <p className="mt-2 text-sm text-slate-400">
            Access density: {statsA.accessPerLakh} weighted access points per
            lakh people.
          </p>
        </div>

        {compared && (
          <div className="info-card mt-4">
            <p className="font-bold text-cyan-400">Region Compare</p>
            <p className="mt-3 text-sm">
              {statsA.area}: {statsA.coverage}% coverage
            </p>
            <p className="text-sm">
              {statsB.area}: {statsB.coverage}% coverage
            </p>

            {isSimilar ? (
              <p className="mt-3 font-bold text-amber-300">
                Similar access quality. Both regions require monitoring.
              </p>
            ) : (
              <>
                <p className="mt-3 font-bold text-red-400">
                  Priority Area: {priority.area}
                </p>
                <p className="text-sm text-slate-400">
                  Stronger reference: {stronger.area}
                </p>
              </>
            )}
          </div>
        )}

        <div className="info-card danger mt-4">
          <p className="font-bold text-red-300">Underserved Area Scoring</p>
          <p className="mt-3 text-sm text-slate-300">
            {priority.area} is flagged when its physical cash access density is
            weaker than the comparison area. This signals banking desert risk.
          </p>
        </div>

        <div className="info-card warning mt-4">
          <p className="font-bold text-amber-300">Demographic Overlay</p>
          <p className="mt-3 text-sm text-slate-300">
            Synthetic demographic pressure highlights places where population
            need may be higher than available ATM and branch infrastructure.
          </p>
        </div>

        <div className="info-card mt-4">
          <p className="font-bold text-cyan-400">Proximity Modeling</p>
          <p className="mt-3 text-sm text-slate-300">
            Estimated travel burden: {priority.travelKm} km to reliable cash
            access in the priority area.
          </p>
        </div>

        <div className="info-card mt-4">
          <p className="font-bold text-cyan-400">Why This Matters</p>
          <p className="mt-3 text-sm text-slate-300">
            Cash remains a fallback rail during payment outages, disasters, and
            financial exclusion. Weak access reduces emergency financial
            resilience.
          </p>
        </div>

        <div className="info-card mt-4">
          <p className="font-bold text-cyan-400">Who Controls the Rail</p>
          <p className="mt-3 text-sm text-slate-300">
            Commercial banks, independent ATM deployers, regulators, and local
            planners shape physical cash access.
          </p>
        </div>

        <div className="info-card success mt-4">
          <p className="font-bold text-green-300">Recommended Action</p>
          <p className="mt-3 text-sm text-slate-300">
            Prioritize new ATM or banking touchpoints in {priority.area}, then
            re-run the comparison to verify reduced travel burden.
          </p>
        </div>
      </aside>
    </main>
  );
}