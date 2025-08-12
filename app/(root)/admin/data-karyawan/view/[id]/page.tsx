"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { viewFieldGroups } from "@/lib/utils";
import { DataKaryawan, DataAnak, SelectOptionMap } from "@/types";
import api from "@/lib/axios";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [karyawan, setKaryawan] = useState<DataKaryawan | null>(null);
  const [anak, setAnak] = useState<DataAnak[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState<SelectOptionMap>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`karyawan/${id}`);
        console.log("RAW RESPONSE:", res.data);

        const json = res.data;

        if (!json.success && json.success !== undefined) {
          throw new Error(json.error || "Gagal ambil data");
        }

        setKaryawan(res.data);
        setAnak(res.data.anaks || []);
        setSelectOptions({});
      } catch (err) {
        console.error("Gagal ambil data:", err);
        toast.error("Gagal ambil data karyawan");
        router.push("/admin/data-karyawan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const getDisplayValue = (name: keyof DataKaryawan) => {
    const value = karyawan?.[name];

    if (value === null || value === undefined || value === "") return "-";

    if (name === "tanggal_lahir" || name === "mulai_tugas") {
      return new Date(value).toLocaleDateString("id-ID");
    }

    if (name.endsWith("_id")) {
      const relationName = name.replace("_id", "");
      const relation = (karyawan as Record<string, any>)[relationName];
      return relation && typeof relation === "object" && "name" in relation
        ? relation.name
        : "-";
    }

    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Skeleton className="max-w-3xl h-[80vh] rounded-xl m-10" />
      </div>
    );
  }

  if (!karyawan) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold pb-2">Detail Data Karyawan</h1>

      {viewFieldGroups.map(({ title, fields }) => (
        <section key={title} className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(({ label, name }) => (
              <div key={name}>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium mt-1">
                  {getDisplayValue(name as keyof DataKaryawan) || "-"}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {anak.length > 0 ? (
        <section className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Data Anak</h2>
          <div className="space-y-6">
            {anak.map((child, index) => (
              <div
                key={child.id ?? index}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <h3 className="font-medium mb-4">Anak {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Nama</p>
                    <p className="font-medium mt-1">{child.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NIK</p>
                    <p className="font-medium mt-1">{child.nik || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Jenis Kelamin
                    </p>
                    <p className="font-medium mt-1">
                      {selectOptions?.jenis_kelamin_id?.find(
                        (opt) => opt.value === child.jenis_kelamin_id
                      )?.label ||
                        child.jenis_kelamin_id ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tempat Lahir
                    </p>
                    <p className="font-medium mt-1">
                      {child.tempat_lahir || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tanggal Lahir
                    </p>
                    <p className="font-medium mt-1">
                      {child.tanggal_lahir || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Data Anak</h2>
          <p className="text-muted-foreground">Tidak ada data anak.</p>
        </section>
      )}

      <div className="flex justify-end">
        <Button
          className="bg-[#17876E]"
          onClick={() => router.push("/admin/data-karyawan")}
        >
          Kembali
        </Button>
      </div>
    </div>
  );
}
