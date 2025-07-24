"use client";

import { TableData } from "@/components/TableData";
import { dataKaryawan } from "./columns";
import { DataKaryawan } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [izinData, setIzinData] = useState<DataKaryawan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKaryawan = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/data/karyawan");
        const data = await res.json();
        setIzinData(data);
      } catch (error) {
        console.error("Gagal fetch karyawan data:", error);
        toast.error("Gagal mengambil data karyawan");
      } finally {
        setLoading(false);
      }
    };

    fetchKaryawan();
  }, []);

  return loading ? (
    <Skeleton className="h-full w-full rounded-3xl" />
  ) : (
    <div className="flex flex-col h-full">
      <div className="w-full h-full bg-[#CDF9EF] rounded-3xl">
        <TableData columns={dataKaryawan} data={izinData} />
      </div>
    </div>
  );
}
