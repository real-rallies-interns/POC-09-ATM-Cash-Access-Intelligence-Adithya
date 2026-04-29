// @ts-nocheck
"use client";

import { useEffect } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type AccessPoint = {
  name: string;
  type: "ATM" | "Bank";
  area: string;
  lat: number;
  lng: number;
};

type Props = {
  points: AccessPoint[];
  areaA: string;
  areaB: string;
  compared: boolean;
  areaAScore: number;
  areaBScore: number;
  showATM: boolean;
  showBank: boolean;
  showUnderserved: boolean;
  showDemographic: boolean;
  areaProfiles: Record<string, any>;
};

const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],
  [37.5, 98.5],
];

function getCenter(points: AccessPoint[]) {
  if (!points.length) return null;

  return {
    lat: points.reduce((sum, p) => sum + p.lat, 0) / points.length,
    lng: points.reduce((sum, p) => sum + p.lng, 0) / points.length,
  };
}

function FitMap({ points }: { points: AccessPoint[] }) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(INDIA_BOUNDS);

    if (points.length >= 2) {
      const bounds = points.map((p) => [p.lat, p.lng]) as [number, number][];
      map.fitBounds(bounds, {
        paddingTopLeft: [90, 180],
        paddingBottomRight: [90, 90],
        maxZoom: 7,
      });
    } else {
      map.fitBounds(INDIA_BOUNDS, { padding: [20, 20] });
    }
  }, [map, points]);

  return null;
}

function displayPosition(point: AccessPoint, index: number): [number, number] {
  const angle = (index % 12) * 30 * (Math.PI / 180);
  const offset = point.type === "Bank" ? 0.012 : 0.009;

  return [
    point.lat + Math.sin(angle) * offset,
    point.lng + Math.cos(angle) * offset,
  ];
}

export default function MapClient({
  points = [],
  areaA,
  areaB,
  compared,
  areaAScore,
  areaBScore,
  showATM,
  showBank,
  showUnderserved,
  showDemographic,
  areaProfiles,
}: Props) {
  const filteredByType = points.filter((point) => {
    if (point.type === "ATM" && !showATM) return false;
    if (point.type === "Bank" && !showBank) return false;
    return true;
  });

  const visiblePoints = compared
    ? filteredByType.filter((p) => p.area === areaA || p.area === areaB)
    : filteredByType;

  const areaAPoints = points.filter((p) => p.area === areaA);
  const areaBPoints = points.filter((p) => p.area === areaB);

  const centerA = getCenter(areaAPoints);
  const centerB = getCenter(areaBPoints);

  const isEqual = areaAScore === areaBScore;

  const weakerCenter = areaAScore <= areaBScore ? centerA : centerB;
  const strongerCenter = areaAScore > areaBScore ? centerA : centerB;

  const weakerArea = areaAScore <= areaBScore ? areaA : areaB;
  const weakerScore = Math.min(areaAScore, areaBScore);
  const strongerScore = Math.max(areaAScore, areaBScore);

  const weakRadius =
    weakerScore < 35 ? 70000 : weakerScore < 70 ? 54000 : 38000;

  const strongRadius =
    strongerScore < 35 ? 42000 : strongerScore < 70 ? 36000 : 30000;

  const demographicProfile = areaProfiles?.[weakerArea];

  return (
    <div className="relative h-full w-full bg-[#030712]">
      <div className="absolute bottom-5 left-5 z-[1000] rounded-xl border border-cyan-400/20 bg-[#030712]/90 px-4 py-3 text-xs text-slate-300 shadow-glow">
        <div className="mb-2 font-bold text-cyan-300">Map Legend</div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-cyan-400"></span>
          ATM
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-indigo-400"></span>
          Bank
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-red-400"></span>
          Underserved Zone
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-amber-400"></span>
          Demographic Pressure
        </div>
      </div>

      <MapContainer
        key={`${areaA}-${areaB}-${showATM}-${showBank}-${showUnderserved}-${showDemographic}`}
        center={[22.5, 79.0]}
        zoom={5}
        minZoom={4}
        maxZoom={13}
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        className="h-full w-full bg-[#030712]"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FitMap points={visiblePoints.length ? visiblePoints : points} />

        {centerA && centerB && (
          <Polyline
            positions={[
              [centerA.lat, centerA.lng],
              [centerB.lat, centerB.lng],
            ]}
            pathOptions={{
              color: "#94a3b8",
              weight: 1,
              opacity: 0.45,
              dashArray: "5 10",
            }}
          />
        )}

        {isEqual && centerA && (
          <Circle
            center={[centerA.lat, centerA.lng]}
            radius={strongRadius}
            pathOptions={{
              color: "#38bdf8",
              fillColor: "#38bdf8",
              fillOpacity: 0.08,
              weight: 3,
              dashArray: "6 8",
            }}
          />
        )}

        {isEqual && centerB && (
          <Circle
            center={[centerB.lat, centerB.lng]}
            radius={strongRadius}
            pathOptions={{
              color: "#38bdf8",
              fillColor: "#38bdf8",
              fillOpacity: 0.08,
              weight: 3,
              dashArray: "6 8",
            }}
          />
        )}

        {!isEqual && strongerCenter && (
          <Circle
            center={[strongerCenter.lat, strongerCenter.lng]}
            radius={strongRadius}
            pathOptions={{
              color: "#38bdf8",
              fillColor: "#38bdf8",
              fillOpacity: 0.08,
              weight: 3,
              dashArray: "6 8",
            }}
          />
        )}

        {showUnderserved && !isEqual && weakerCenter && (
          <>
            <Circle
              center={[weakerCenter.lat, weakerCenter.lng]}
              radius={weakRadius}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.14,
                weight: 4,
                dashArray: "10 8",
                className: "pulse-circle",
              }}
            />

            <Circle
              center={[weakerCenter.lat, weakerCenter.lng]}
              radius={weakRadius / 2.5}
              pathOptions={{
                color: "#fb7185",
                fillColor: "#ef4444",
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}

        {showDemographic && !isEqual && weakerCenter && demographicProfile && (
          <Circle
            center={[weakerCenter.lat, weakerCenter.lng]}
            radius={weakRadius * 1.25}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.045,
              weight: 2,
              dashArray: "3 10",
            }}
          />
        )}

        {visiblePoints.map((point, index) => {
          const isATM = point.type === "ATM";
          const position = displayPosition(point, index);

          return (
            <CircleMarker
              key={`${point.name}-${index}`}
              center={position}
              radius={isATM ? 7 : 10}
              pathOptions={{
                color: isATM ? "#38bdf8" : "#818cf8",
                fillColor: isATM ? "#38bdf8" : "#818cf8",
                fillOpacity: 0.95,
                weight: 2,
                className: isATM ? "atm-marker" : "bank-marker",
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                {point.name} • {point.type} • {point.area}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}