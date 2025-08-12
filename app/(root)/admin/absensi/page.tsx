"use client";
import { useEffect, useState } from "react";
import { TableData } from "@/components/TableData";
import { absensi } from "./columns";
import { DataAbsensi } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoDialog } from "@/components/PhotoDialog";
import api from "@/lib/axios";

function formatTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AbsensiPage() {
  const [data, setData] = useState<DataAbsensi[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const filteredData = data
    .filter((item: any) => {
      if (!selectedDate) return true;
      return (
        new Date(item.originalDate).toDateString() ===
        new Date(selectedDate).toDateString()
      );
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.originalDate).getTime() - new Date(a.originalDate).getTime()
    );

  const handlebukti_fotoClick = (imageUrl: string) => {
    console.log("🖼️ Klik Foto:", imageUrl);
    setSelectedImage(imageUrl);
    setShowDialog(true);
  };

  useEffect(() => {
    const fetchAbsensi = async () => {
      try {
        const res = await api.get("absensi");
        if (!res.data) throw new Error("Gagal ambil data absensi");

        const rawData = await res.data;
        const mappedData = rawData.map((item: any) => ({
          id: item.id,
          name: item.user_id?.name || "-",
          originalDate: item.tanggal,
          tanggal: formatDateTime(item.tanggal),
          clock_in_time: item.clock_in_time
            ? formatTime(item.clock_in_time)
            : "--:--",
          clock_out_time: item.clock_out_time
            ? formatTime(item.clock_out_time)
            : "--:--",
          status: item.status_absensi?.name || "",
          bukti_foto: `${process.env.NEXT_PUBLIC_PATH_URL}${item.bukti_foto}`,
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Gagal fetch absensi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsensi();
  }, []);

  return (
    <>
      {loading ? (
        <Skeleton className="h-full w-full rounded-3xl" />
      ) : (
        <div className="w-full h-full bg-[#CDF9EF] rounded-3xl">
          <TableData
            columns={absensi(handlebukti_fotoClick)}
            data={filteredData}
          />
        </div>
      )}

      <PhotoDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        imageUrl={selectedImage}
      />
    </>
  );
}
