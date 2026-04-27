"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

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
  demoOverlay: boolean;
};

const SOUTH_INDIA_BOUNDS: L.LatLngBoundsExpression = [
  [6.5, 72.5],
  [15.5, 82.5],
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
    map.setMaxBounds(SOUTH_INDIA_BOUNDS);

    if (points.length >= 2) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 9 });
    } else {
      map.fitBounds(SOUTH_INDIA_BOUNDS, { padding: [8, 8] });
    }
  }, [map, points]);

  return null;
}

function UnderservedLabel({ lat, lng }: { lat: number; lng: number }) {
  const icon = L.divIcon({
    className: "",
    html: `<div class="underserved-label">UNDERSERVED<br/>AREA</div>`,
  });

  return <Marker position={[lat, lng]} icon={icon} interactive={false} />;
}

export default function MapClient({
  points = [],
  areaA,
  areaB,
  compared,
  areaAScore,
  areaBScore,
  demoOverlay,
}: Props) {
  const visiblePoints = compared
    ? points.filter((p) => p.area === areaA || p.area === areaB)
    : points;

  const areaAPoints = points.filter((p) => p.area === areaA);
  const areaBPoints = points.filter((p) => p.area === areaB);

  const centerA = getCenter(areaAPoints);
  const centerB = getCenter(areaBPoints);

  const diff = Math.abs(areaAScore - areaBScore);
  const similar = compared && diff <= 5;

  const underservedCenter =
    !compared || similar
      ? null
      : areaAScore < areaBScore
      ? centerA
      : centerB;

  const frictionCenter =
    !compared || similar
      ? null
      : areaAScore > areaBScore
      ? centerA
      : centerB;

  return (
    <div className="h-full w-full bg-black">
      <MapContainer
        center={[10.5, 76.8]}
        zoom={7}
        minZoom={6}
        maxZoom={12}
        maxBounds={SOUTH_INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        className="h-full w-full bg-black"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FitMap points={visiblePoints} />

        {similar && centerA && (
          <Circle
            center={[centerA.lat, centerA.lng]}
            radius={26000}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.08,
              weight: 2,
            }}
          />
        )}

        {similar && centerB && (
          <Circle
            center={[centerB.lat, centerB.lng]}
            radius={26000}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.08,
              weight: 2,
            }}
          />
        )}

        {demoOverlay && frictionCenter && (
          <Circle
            center={[frictionCenter.lat, frictionCenter.lng]}
            radius={28000}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.04,
              weight: 2,
            }}
          />
        )}

        {underservedCenter && (
          <>
            <Circle
              center={[underservedCenter.lat, underservedCenter.lng]}
              radius={30000}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.14,
                weight: 3,
                dashArray: "9 8",
                className: "pulse-circle",
              }}
            />

            <Circle
              center={[underservedCenter.lat, underservedCenter.lng]}
              radius={12000}
              pathOptions={{
                color: "#fb7185",
                fillColor: "#ef4444",
                fillOpacity: 0.1,
                weight: 2,
              }}
            />

            <UnderservedLabel
              lat={underservedCenter.lat + 0.28}
              lng={underservedCenter.lng}
            />
          </>
        )}

        {visiblePoints.map((point, index) => (
          <CircleMarker
            key={`${point.name}-${index}`}
            center={[point.lat, point.lng]}
            radius={point.type === "ATM" ? 7 : 8}
            pathOptions={{
              color: point.type === "ATM" ? "#38bdf8" : "#818cf8",
              fillColor: point.type === "ATM" ? "#38bdf8" : "#818cf8",
              fillOpacity: 0.95,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{point.name}</strong>
              <br />
              Type: {point.type}
              <br />
              Area: {point.area}
              <br />
              Role: {point.type === "ATM" ? "Cash access point" : "Bank branch"}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}