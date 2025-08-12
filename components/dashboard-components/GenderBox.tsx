"use client";

import { useEffect, useState } from "react";
import { GenderChart } from "./GenderChart";
import api from "@/lib/axios";

export const GenderBox = () => {
  const [genderData, setGenderData] = useState<number[]>([0, 0]);

  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const res = await api.get("karyawan");
        if (!res.data) throw new Error("Gagal fetch data karyawan");

        const data = await res.data;

        const pria = data.filter(
          (k: any) => k.jenis_kelamin?.name?.toLowerCase() === "pria"
        ).length;

        const wanita = data.filter(
          (k: any) => k.jenis_kelamin?.name?.toLowerCase() === "wanita"
        ).length;

        setGenderData([pria, wanita]);
        setTotalEmployees(data.length);
      } catch (error) {
        console.error("❌ Gagal ambil data karyawan:", error);
      }
    };

    fetchKaryawan();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center p-3 rounded-lg w-full border shadow">
      <h2 className="mb-4 text-center font-bold">Data Karyawan</h2>
      <div className="flex items-center gap-4">
        <GenderChart gender={genderData} />
        <div className="flex flex-col">
          <p className="font-normal text-gray-600 whitespace-nowrap">
            Jumlah Karyawan:
          </p>
          <h2 className="font-bold text-4xl">{totalEmployees}</h2>
        </div>
      </div>
    </div>
  );
};
