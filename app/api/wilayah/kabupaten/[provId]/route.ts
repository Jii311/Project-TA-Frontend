import { NextResponse } from "next/server";
import axios from "axios";

interface Params {
  params: { provId: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { provId } = params;
    const res = await axios.get(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("🔥 Gagal ambil kabupaten:", error.message);
    return NextResponse.json(
      { error: "Gagal ambil kabupaten" },
      { status: 500 }
    );
  }
}
