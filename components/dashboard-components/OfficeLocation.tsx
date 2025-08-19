"use client";

import api from "@/lib/axios";
import { fetchWithRetry } from "@/lib/fetchWithRetry";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface OfficeLocation {
  id: string;
  name: string;
  alamat: string;
}

export const OfficeLocationCards = () => {
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resLocations = await api.get("lokasi_kantor");

        const lokasiData: OfficeLocation[] = resLocations.data;
        setLocations(lokasiData);
      } catch (err) {
        console.error("Gagal fetch lokasi kantor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-66 w-full rounded-lg" />;
  }

  if (!locations.length) {
    return (
      <div className="flex flex-col gap-2 items-start p-3 rounded-lg w-full border shadow">
        <h2 className="mb-4 text-center font-bold">Lokasi Kantor</h2>
        <p className="text-gray-500">Tidak ada data lokasi kantor</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-start p-3 rounded-lg w-full border shadow">
      <h2 className="mb-4 text-center font-bold">Lokasi Kantor</h2>
      {locations.map((loc) => (
        <div key={loc.id} className="flex flex-col items-start">
          <h3 className="font-semibold text-gray-700">{loc.name}</h3>
          <p className="font-normal text-gray-600">{loc.alamat}</p>
        </div>
      ))}
    </div>
  );
};
