"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import List from "@/components/ui/list";
import { CustomPaginationLite } from "@/components/CustomPaginationLite";
import { DataIzin } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

export default function ResolvedIzinPage() {
  const [izinData, setIzinData] = useState<DataIzin[]>([]);
  const [selectedIzin, setSelectedIzin] = useState<DataIzin | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 8;

  useEffect(() => {
    const fetchIzin = async () => {
      setLoading(true);
      try {
        const res = await api.get("izin");
        const json = res.data;
        const resolved = json.resolved || [];
        setIzinData(resolved);
      } catch (error) {
        console.error("Gagal fetch izin data:", error);
        toast.error("Gagal mengambil data izin");
      } finally {
        setLoading(false);
      }
    };

    fetchIzin();
  }, []);

  const totalPages = Math.ceil(izinData.length / limit) || 1;
  const paginated = izinData.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return loading ? (
    <Skeleton className="h-full w-full rounded-3xl" />
  ) : (
    <div className="w-full h-full bg-[#CDF9EF] rounded-3xl p-6 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        {paginated.map((item) => (
          <button
            onClick={() => setSelectedIzin(item)}
            key={item.id}
            className="text-left"
          >
            <List
              nama={item.user_id.name}
              kepentingan={item.jenis_izin.name}
              tanggal={`${formatTanggal(item.tanggal)}${
                item.tanggal_akhir
                  ? ` - ${formatTanggal(item.tanggal_akhir)}`
                  : ""
              }`}
              terverifikasi={item.terverifikasi ?? "-"}
            />
          </button>
        ))}

        {paginated.length === 0 && (
          <div className="items-center p-5 bg-white rounded-lg">
            <p className="text-center text-black">
              Tidak ada izin yang sudah diverifikasi
            </p>
          </div>
        )}
      </div>

      <CustomPaginationLite
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Dialog open={!!selectedIzin} onOpenChange={() => setSelectedIzin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Izin</DialogTitle>
          </DialogHeader>

          {selectedIzin && (
            <div className="flex flex-col gap-2 p-4">
              <p>
                <strong>Nama:</strong> {selectedIzin.user_id.name}
              </p>
              <p>
                <strong>Alasan:</strong> {selectedIzin.jenis_izin.name}
              </p>
              <p>
                <strong>Tanggal:</strong>{" "}
                {`${formatTanggal(selectedIzin.tanggal)}${
                  selectedIzin.tanggal_akhir
                    ? ` - ${formatTanggal(selectedIzin.tanggal_akhir)}`
                    : ""
                }`}
              </p>
              <p>
                <strong>Keterangan:</strong> {selectedIzin.keterangan}
              </p>

              <p>
                <strong>Bukti Foto:</strong>
              </p>
              {selectedIzin.bukti_foto ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_PATH_URL}${selectedIzin.bukti_foto}`}
                  alt="Bukti Izin"
                  className="mt-2 w-full max-h-64 object-contain rounded-lg border"
                />
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Tidak ada foto bukti
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatTanggal(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
