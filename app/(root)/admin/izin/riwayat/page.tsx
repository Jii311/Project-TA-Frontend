"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import List from "@/components/ui/list";
import { CustomPaginationLite } from "@/components/CustomPaginationLite";
import { Skeleton } from "@/components/ui/skeleton";

interface Izin {
  id: string;
  user_id: { name: string; id: string; email: string };
  jenis_izin: { name: string; id: string };
  tanggal: string;
  tanggal_akhir?: string;
  keterangan?: string;
  bukti_foto?: string;
  terverifikasi: "setuju" | "tolak" | null;
  created_at: string;
  updated_at: string;
}

type FilterOption = "all" | "setuju" | "tolak" | "pending";

export default function RiwayatIzinPage() {
  const [riwayat, setRiwayat] = useState<Izin[]>([]);
  const [selectedIzin, setSelectedIzin] = useState<Izin | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [error, setError] = useState<string>("");

  const limit = 8;

  useEffect(() => {
    const fetchRiwayat = async () => {
      const token =
        localStorage.getItem("auth_token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("auth_token") ||
        sessionStorage.getItem("access_token") ||
        sessionStorage.getItem("token");

      try {
        setLoading(true);
        setError("");

        console.log("🚀 Memulai fetch data dari API v2...");

        console.log(
          "🔑 Auth token found:",
          token ? "Yes (hidden for security)" : "No"
        );

        const headers: any = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        console.log("📡 Request headers:", {
          ...headers,
          Authorization: headers.Authorization ? "Bearer [HIDDEN]" : "No Auth",
        });

        const response = await axios.get("https://tg.rplrus.com/api/v2/izin", {
          headers,
          timeout: 15000,
          validateStatus: (status) => status < 500,
          withCredentials: true,
        });

        console.log("✅ Response received:", {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });

        if (response.status !== 200) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Handle v2 API structure with pending and resolved
        let allData: Izin[] = [];

        console.log("📊 Raw response from v2 API:", response.data);

        if (response.data && typeof response.data === "object") {
          const { pending = [], resolved = [] } = response.data;

          console.log("📂 API v2 Structure:", {
            pending: Array.isArray(pending) ? pending.length : "Not array",
            resolved: Array.isArray(resolved) ? resolved.length : "Not array",
            pendingSample: Array.isArray(pending)
              ? pending.slice(0, 1)
              : pending,
            resolvedSample: Array.isArray(resolved)
              ? resolved.slice(0, 1)
              : resolved,
          });

          // Combine pending and resolved data
          if (Array.isArray(pending)) {
            allData = [...allData, ...pending];
          }
          if (Array.isArray(resolved)) {
            allData = [...allData, ...resolved];
          }

          // If no pending/resolved structure, try fallback structures
          if (allData.length === 0) {
            if (Array.isArray(response.data)) {
              allData = response.data;
            } else if (
              response.data.data &&
              Array.isArray(response.data.data)
            ) {
              allData = response.data.data;
            } else if (
              response.data.izin &&
              Array.isArray(response.data.izin)
            ) {
              allData = response.data.izin;
            } else if (
              response.data.result &&
              Array.isArray(response.data.result)
            ) {
              allData = response.data.result;
            }
          }
        }

        console.log("📊 Combined data from v2 API:", {
          total: allData.length,
          sample: allData.slice(0, 2),
        });

        if (!Array.isArray(allData)) {
          console.warn("⚠️ Data bukan array:", allData);
          allData = [];
        }

        // Validate data structure
        const validData = allData.filter((item) => {
          const isValid =
            item &&
            typeof item === "object" &&
            item.id !== undefined &&
            item.user_id?.name &&
            item.jenis_izin?.name &&
            item.tanggal;

          if (!isValid) {
            console.warn("⚠️ Invalid item found:", item);
          }
          return isValid;
        });

        // For riwayat (history), show ALL data (pending, approved, rejected)
        console.log("✨ Processed data from v2:", {
          total: allData.length,
          valid: validData.length,
          pending: validData.filter((item) => item.terverifikasi === null)
            .length,
          approved: validData.filter((item) => item.terverifikasi === "setuju")
            .length,
          rejected: validData.filter((item) => item.terverifikasi === "tolak")
            .length,
        });

        setRiwayat(validData); // Show ALL valid data, including pending

        if (validData.length > 0) {
          const pendingCount = validData.filter(
            (item) => item.terverifikasi === null
          ).length;
          const approvedCount = validData.filter(
            (item) => item.terverifikasi === "setuju"
          ).length;
          const rejectedCount = validData.filter(
            (item) => item.terverifikasi === "tolak"
          ).length;

          toast.success(
            `Berhasil memuat ${validData.length}(${pendingCount}${approvedCount}${rejectedCount}`
          );
        } else {
          toast("Belum ada data izin di API v2");
        }
      } catch (err: any) {
        console.error("❌ Error fetching data from v2 API:", err);
        console.error("Error details:", {
          message: err?.message || "No message",
          name: err?.name || "No name",
          code: err?.code || "No code",
          response: {
            data: err?.response?.data || "No response data",
            status: err?.response?.status || "No status",
            statusText: err?.response?.statusText || "No status text",
            headers: err?.response?.headers || "No headers",
          },
          request: err?.request ? "Request made" : "No request",
          config: {
            url: err?.config?.url || "No URL",
            method: err?.config?.method || "No method",
            timeout: err?.config?.timeout || "No timeout",
          },
        });

        let errorMessage = "Gagal mengambil data riwayat izin dari API v2";

        if (err?.response) {
          const status = err.response.status;
          const responseData = err.response.data;

          console.log("📄 Response data detail:", responseData);

          switch (status) {
            case 400:
              errorMessage = `Bad Request: ${
                responseData?.message || "Permintaan tidak valid"
              }`;
              break;
            case 401:
              errorMessage = `Unauthorized: ${
                responseData?.message || "Tidak memiliki akses - silakan login"
              }`;
              break;
            case 403:
              errorMessage = `Forbidden: ${
                responseData?.message || "Akses ditolak"
              }`;
              break;
            case 404:
              errorMessage = `Not Found: API v2 endpoint tidak ditemukan`;
              break;
            case 422:
              errorMessage = `Validation Error: ${
                responseData?.message || "Data tidak valid"
              }`;
              break;
            case 429:
              errorMessage = "Terlalu banyak permintaan, coba lagi nanti";
              break;
            case 500:
              errorMessage = `Internal Server Error: ${
                responseData?.message || "Server API v2 sedang bermasalah"
              }`;
              break;
            case 502:
              errorMessage = "Bad Gateway: Server tidak dapat dijangkau";
              break;
            case 503:
              errorMessage =
                "Service Unavailable: Layanan sedang tidak tersedia";
              break;
            default:
              errorMessage = `HTTP ${status}: ${
                err.response.statusText ||
                responseData?.message ||
                "Unknown error"
              }`;
          }
        } else if (err?.request) {
          console.log("📡 Request was made but no response received");

          if (
            err.code === "NETWORK_ERROR" ||
            err.message?.includes("Network Error")
          ) {
            errorMessage = "Network Error: Cek koneksi internet Anda";
          } else if (err.code === "ECONNABORTED") {
            errorMessage =
              "Timeout: Server API v2 tidak merespons dalam waktu yang ditentukan";
          } else if (err.code === "ERR_NETWORK") {
            errorMessage = "Network Error: Tidak dapat terhubung ke server";
          } else if (err.code === "ERR_INTERNET_DISCONNECTED") {
            errorMessage = "Tidak ada koneksi internet";
          } else {
            errorMessage = `Connection Error: ${
              err.message || "Tidak dapat terhubung ke server API v2"
            }`;
          }
        } else {
          console.log("⚙️ Error in request setup");
          errorMessage = `Request Setup Error: ${
            err?.message || "Terjadi kesalahan dalam setup request"
          }`;
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  // Filter logic
  const filtered = riwayat.filter((item) => {
    if (filter === "all") return true;
    if (filter === "setuju") return item.terverifikasi === "setuju";
    if (filter === "tolak") return item.terverifikasi === "tolak";
    if (filter === "pending") return item.terverifikasi === null;
    return false;
  });

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full bg-[#CDF9EF] rounded-3xl p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Skeleton className="h-8 w-48 mb-4 mx-auto rounded-xl" />
            <p className="text-[#17876E] font-medium">Memuat data</p>
          </div>
        </div>
      </div>
    );
  }

  function formatTanggal(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.warn("Invalid date:", dateString);
      return dateString;
    }
  }

  return (
    <div className="w-full h-full bg-[#CDF9EF] rounded-3xl p-6 flex flex-col justify-between">
      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium">❌ {error}</p>
          {error.includes("401") && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-xs font-medium mb-2">
                💡 Tips untuk mengatasi error 401:
              </p>
              <ul className="text-yellow-700 text-xs space-y-1">
                <li>• Pastikan Anda sudah login ke sistem</li>
                <li>• Cek apakah token autentikasi masih valid</li>
                <li>• Mungkin perlu login ulang jika session expired</li>
                <li>• Hubungi admin jika masalah berlanjut</li>
              </ul>
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </Button>
            {error.includes("401") && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Login Ulang
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/70 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-white/50 flex-wrap gap-1">
          {/* Semua */}
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === "all"
                ? "bg-[#17876E] text-white shadow-md hover:bg-[#17876E]/90"
                : "text-[#17876E] hover:bg-white/50"
            }`}
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
          >
            📋 Semua
            <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
              {riwayat.length}
            </span>
          </Button>

          {/* Pending */}
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === "pending"
                ? "bg-orange-500 text-white shadow-md hover:bg-orange-600"
                : "text-orange-600 hover:bg-orange-50"
            }`}
            onClick={() => {
              setFilter("pending");
              setCurrentPage(1);
            }}
          >
            ⏳ Pending
            <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
              {riwayat.filter((item) => item.terverifikasi === null).length}
            </span>
          </Button>

          {/* Disetujui */}
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === "setuju"
                ? "bg-green-500 text-white shadow-md hover:bg-green-600"
                : "text-green-600 hover:bg-green-50"
            }`}
            onClick={() => {
              setFilter("setuju");
              setCurrentPage(1);
            }}
          >
            ✅ Disetujui
            <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
              {riwayat.filter((item) => item.terverifikasi === "setuju").length}
            </span>
          </Button>

          {/* Ditolak */}
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === "tolak"
                ? "bg-red-500 text-white shadow-md hover:bg-red-600"
                : "text-red-600 hover:bg-red-50"
            }`}
            onClick={() => {
              setFilter("tolak");
              setCurrentPage(1);
            }}
          >
            ❌ Ditolak
            <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
              {riwayat.filter((item) => item.terverifikasi === "tolak").length}
            </span>
          </Button>
        </div>
      </div>

      {/* List Riwayat Izin */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {paginated.length === 0 && !loading && (
          <div className="flex items-center justify-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50">
            <div className="text-center">
              <div className="mb-4">
                {filter === "all" && <span className="text-4xl">📋</span>}
                {filter === "pending" && <span className="text-4xl">⏳</span>}
                {filter === "setuju" && <span className="text-4xl">✅</span>}
                {filter === "tolak" && <span className="text-4xl">❌</span>}
              </div>
              <p className="text-[#17876E] font-medium mb-2">
                {filter === "all"
                  ? "Belum ada data riwayat izin"
                  : filter === "pending"
                  ? "Belum ada izin yang masih pending"
                  : filter === "setuju"
                  ? "Belum ada izin yang disetujui"
                  : "Belum ada izin yang ditolak"}
              </p>
              <p className="text-[#17876E]/60 text-sm">
                {filter === "pending"
                  ? "Izin yang belum diverifikasi akan muncul di sini"
                  : filter === "setuju"
                  ? "Izin yang sudah disetujui akan muncul di sini"
                  : filter === "tolak"
                  ? "Izin yang ditolak akan muncul di sini"
                  : "Semua data izin akan muncul di sini"}
              </p>
              {error && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-3"
                >
                  🔄 Refresh Halaman
                </Button>
              )}
            </div>
          </div>
        )}

        {paginated.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedIzin(item)}
            className="text-left hover:scale-[1.02] transition-transform duration-200"
            title={`Lihat detail izin untuk ${item.user_id?.name || "Unknown"}`}
          >
            <List
              nama={item.user_id?.name || "Nama tidak tersedia"}
              kepentingan={item.jenis_izin?.name || "Jenis izin tidak tersedia"}
              tanggal={`${formatTanggal(item.tanggal)}${
                item.tanggal_akhir
                  ? ` - ${formatTanggal(item.tanggal_akhir)}`
                  : ""
              }`}
              terverifikasi={
                item.terverifikasi === "setuju"
                  ? "Disetujui"
                  : item.terverifikasi === "tolak"
                  ? "Ditolak"
                  : "Pending"
              }
            />
          </button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPaginationLite
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Dialog Detail */}
      <Dialog open={!!selectedIzin} onOpenChange={() => setSelectedIzin(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#17876E]">
              Detail Izin
            </DialogTitle>
          </DialogHeader>

          {selectedIzin && (
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Nama:</p>
                  <p className="text-gray-900">
                    {selectedIzin.user_id?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email:</p>
                  <p className="text-gray-900">
                    {selectedIzin.user_id?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Jenis Izin:
                  </p>
                  <p className="text-gray-900">
                    {selectedIzin.jenis_izin?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Tanggal:</p>
                  <p className="text-gray-900">
                    {`${formatTanggal(selectedIzin.tanggal)}${
                      selectedIzin.tanggal_akhir
                        ? ` - ${formatTanggal(selectedIzin.tanggal_akhir)}`
                        : ""
                    }`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Status:</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedIzin.terverifikasi === "setuju"
                        ? "bg-green-100 text-green-800"
                        : selectedIzin.terverifikasi === "tolak"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedIzin.terverifikasi === "setuju"
                      ? "Disetujui"
                      : selectedIzin.terverifikasi === "tolak"
                      ? "Ditolak"
                      : "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Dibuat:</p>
                  <p className="text-gray-900">
                    {formatTanggal(selectedIzin.created_at)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Keterangan:</p>
                <p className="text-gray-900 mt-1">
                  {selectedIzin.keterangan || "Tidak ada keterangan"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium mb-2">
                  Bukti Foto:
                </p>
                {selectedIzin.bukti_foto ? (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={selectedIzin.bukti_foto}
                      alt="Bukti foto izin"
                      className="w-full h-auto max-h-64 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML =
                            '<div class="p-4 bg-gray-50 text-center text-gray-500">Foto tidak dapat dimuat</div>';
                        }
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Tidak ada foto bukti
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedIzin(null)}
              className="bg-white hover:bg-gray-50"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
