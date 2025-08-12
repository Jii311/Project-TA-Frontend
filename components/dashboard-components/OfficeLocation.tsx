"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";

interface OfficeLocation {
  id: string;
  name: string;
  alamat: string;
}

export const OfficeLocationCards = () => {
  const [locations, setLocations] = useState<OfficeLocation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resLocations = await api.get("lokasi_kantor");
      const lokasiData: OfficeLocation[] = resLocations.data;
      setLocations(lokasiData);

      const counts: Record<string, number> = {};
      lokasiData.forEach((loc) => (counts[loc.id] = 0));
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-start p-3 rounded-lg w-full border shadow">
      <h2 className="mb-4 text-center font-bold">Lokasi Kantor</h2>
      {locations.map((loc) => (
        <div key={loc.id} className="flex flex-col items-start">
          <h3 className="font-semibold text-gray-700">{loc.name}</h3>
          <p className=" font-normal text-gray-600">{loc.alamat}</p>
        </div>
      ))}
    </div>
  );
};
