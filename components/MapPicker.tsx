"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, 16);
    }
  }, [coords, map]);

  return coords;
}

export default function MapPicker({
  onChange,
  initialPosition,
}: {
  onChange: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}) {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) return [];
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=5`
    );
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    if (initialPosition) {
      setMarkerPos(initialPosition);
    }
  }, [initialPosition]);

  return (
    <div className="space-y-4">
      <MapContainer
        center={initialPosition || [-6.2, 106.8]}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={onChange} />
        <FlyToLocation coords={markerPos} />
      </MapContainer>
      <div className="w-full">
        <Input
          placeholder="Cari lokasi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const res = await handleSearch(); // ubah biar return data
              if (res && res.length > 0) {
                const place = res[0]; // ambil hasil pertama
                const lat = parseFloat(place.lat);
                const lon = parseFloat(place.lon);
                setMarkerPos([lat, lon]);
                onChange(lat, lon);
                setQuery(place.display_name); // isi input biar sesuai alamat
              } else {
                alert("Lokasi tidak ditemukan");
              }
            }
          }}
        />
      </div>
    </div>
  );
}
