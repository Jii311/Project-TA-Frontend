import api from "@/lib/axios";
import { NextResponse } from "next/server";

const endpoints = {
  agama_id: "agama",
  kelurahan_id: "kelurahan",
  pendidikan_id: "pendidikan",
  jenis_kelamin_id: "jenis_kelamin",
  pangkat_id: "pangkat",
  jabatan_id: "jabatan",
  pekerjaan_id: "pekerjaan",
  golongan_id: "golongan",
  divisi_id: "divisi",
  lokasi_kantor_id: "lokasi_kantor",
  lokasi_kerja_id: "lokasi_kerja",
  status_id: "status",
};

type EndpointKey = keyof typeof endpoints;

export async function GET() {
  try {
    const results: Record<string, { value: string; label: string }[]> = {};

    await Promise.all(
      Object.entries(endpoints).map(async ([key, endpoint]) => {
        try {
          const res = await api.get(endpoint);
          results[key] = res.data.map((item: any) => ({
            value: item.id?.toString() || "",
            label: item.name ?? "-",
          }));
        } catch (err) {
          console.error(`Gagal ambil data ${endpoint}:`, err);
          results[key] = [];
        }
      })
    );

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Gagal ambil semua select options:", error);
    return NextResponse.json(
      { error: "Gagal ambil select options" },
      { status: 500 }
    );
  }
}
