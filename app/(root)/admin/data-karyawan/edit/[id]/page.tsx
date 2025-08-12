"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DataKaryawan, DataAnak } from "@/types";
import { Loader2 } from "lucide-react";
import { editFieldGroups } from "@/lib/utils";
import toast from "react-hot-toast";
import api from "@/lib/axios";

const defaultData = (id: string): DataKaryawan => ({
  id,
  name: "",
  email: "",
  nip: "",
  nik: "",
  telephone: "",
  alamat: "",
  agama_id: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  provinsi: "",
  kabupaten: "",
  kecamatan: "",
  kelurahan: "",
  pendidikan_id: "",
  npwp: "",
  jenis_kelamin_id: "",
  mulai_tugas: "",
  pangkat_id: "",
  jabatan_id: "",
  pekerjaan_id: "",
  golongan_id: "",
  divisi_id: "",
  lokasi_kantor_id: "",
  lokasi_kerja_id: "",
  status_id: "",
  nama_pasangan: "",
  tempat_lahir_pasangan: "",
  pekerjaan_id_pasangan: "",
  telephone_pasangan: "",
  nama_ayah: "",
  nama_ibu: "",
  alamat_ayah: "",
  alamat_ibu: "",
});

export default function EditKaryawanPage() {
  const { id } = useParams();
  const router = useRouter();

  const [karyawan, setKaryawan] = useState<DataKaryawan | null>(null);
  const [anak, setAnak] = useState<DataAnak[]>([]);
  const [options, setOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [provinsiList, setProvinsiList] = useState<
    { id: string; name: string }[]
  >([]);
  const [kabupatenList, setKabupatenList] = useState<
    { id: string; name: string }[]
  >([]);
  const [kecamatanList, setKecamatanList] = useState<
    { id: string; name: string }[]
  >([]);
  const [kelurahanList, setKelurahanList] = useState<
    { id: string; name: string }[]
  >([]);

  const [karyawanData, setKaryawanData] = useState<DataKaryawan | null>(null);
  const [childrenData, setChildrenData] = useState<DataAnak[]>([]);

  useEffect(() => {
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

    const fetchOptions = async () => {
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
      setOptions(results);
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`karyawan/${id}`);
        console.log("Response API:", data);

        setKaryawan(data);
        setAnak(Array.isArray(data.anaks) ? data.anaks : []);
      } catch (err: any) {
        console.error("Error ambil data:", err);
        toast.error("Gagal ambil data");
        router.push("/admin/data-karyawan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Inisialisasi data form
  useEffect(() => {
    if (karyawan) {
      setKaryawanData({ ...defaultData(id as string), ...karyawan });
      setChildrenData(anak);
    }
  }, [karyawan, anak, id]);

  // Fetch provinsi dari Emsifa
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((data) =>
        setProvinsiList(
          data.map((d: any) => ({ id: d.id.toString(), name: d.name }))
        )
      );
  }, []);

  // Fetch kabupaten berdasarkan provinsi
  useEffect(() => {
    if (!karyawanData?.provinsi) return;
    const prov = provinsiList.find((p) => p.name === karyawanData.provinsi);
    if (!prov) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov.id}.json`
    )
      .then((res) => res.json())
      .then((data) =>
        setKabupatenList(
          data.map((d: any) => ({ id: d.id.toString(), name: d.name }))
        )
      );
  }, [karyawanData?.provinsi, provinsiList]);

  // Fetch kecamatan
  useEffect(() => {
    if (!karyawanData?.kabupaten) return;
    const kab = kabupatenList.find((k) => k.name === karyawanData.kabupaten);
    if (!kab) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kab.id}.json`
    )
      .then((res) => res.json())
      .then((data) =>
        setKecamatanList(
          data.map((d: any) => ({ id: d.id.toString(), name: d.name }))
        )
      );
  }, [karyawanData?.kabupaten, kabupatenList]);

  // Fetch kelurahan
  useEffect(() => {
    if (!karyawanData?.kecamatan) return;
    const kec = kecamatanList.find((k) => k.name === karyawanData.kecamatan);
    if (!kec) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kec.id}.json`
    )
      .then((res) => res.json())
      .then((data) =>
        setKelurahanList(
          data.map((d: any) => ({ id: d.id.toString(), name: d.name }))
        )
      );
  }, [karyawanData?.kecamatan, kecamatanList]);

  const handleChange = useCallback(
    (name: keyof DataKaryawan, value: any) => {
      if (!karyawanData) return;
      setKaryawanData((prev) => ({ ...prev!, [name]: value }));
    },
    [karyawanData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!karyawanData) return;
    setIsSubmitting(true);
    try {
      const res = await api.patch(`karyawan/${id}`, {
        ...karyawanData,
        anak: childrenData,
      });
      if (!res.data) throw new Error("Gagal update data");
      toast.success("Data berhasil diperbarui");
      router.push("/admin/data-karyawan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal update data");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !karyawanData) {
    return <Skeleton className="w-full h-full rounded-xl m-10" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold pb-6">Edit Data Karyawan</h1>

      {editFieldGroups.map(({ title, fields }) => (
        <section
          key={title}
          className="flex flex-col gap-4 border rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ label, name, type, required }) => {
              if (name === "provinsi") {
                return (
                  <div key={name} className="space-y-2">
                    <Label>{label}</Label>
                    <Select
                      value={karyawanData.provinsi || ""}
                      onValueChange={(val) => handleChange("provinsi", val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinsiList.map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              if (name === "kabupaten") {
                return (
                  <div key={name} className="space-y-2">
                    <Label>{label}</Label>
                    <Select
                      value={karyawanData.kabupaten || ""}
                      onValueChange={(val) => handleChange("kabupaten", val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Kabupaten" />
                      </SelectTrigger>
                      <SelectContent>
                        {kabupatenList.map((k) => (
                          <SelectItem key={k.id} value={k.name}>
                            {k.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              if (name === "kecamatan") {
                return (
                  <div key={name} className="space-y-2">
                    <Label>{label}</Label>
                    <Select
                      value={karyawanData.kecamatan || ""}
                      onValueChange={(val) => handleChange("kecamatan", val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Kecamatan" />
                      </SelectTrigger>
                      <SelectContent>
                        {kecamatanList.map((k) => (
                          <SelectItem key={k.id} value={k.name}>
                            {k.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              if (name === "kelurahan") {
                return (
                  <div key={name} className="space-y-2">
                    <Label>{label}</Label>
                    <Select
                      value={karyawanData.kelurahan?.toString() || ""}
                      onValueChange={(val) => handleChange("kelurahan", val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Kelurahan" />
                      </SelectTrigger>
                      <SelectContent>
                        {kelurahanList.map((kel) => (
                          <SelectItem key={kel.id} value={kel.name}>
                            {kel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              return (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </Label>
                  {type === "select" ? (
                    <Select
                      value={karyawanData[name]?.toString() || ""}
                      onValueChange={(value) => handleChange(name, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Pilih ${label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {options[name]?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={name}
                      type={type}
                      value={karyawanData[name]?.toString() || ""}
                      onChange={(e) => handleChange(name, e.target.value)}
                      autoComplete="off"
                      required={required}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {childrenData.length > 0 && (
        <section className="flex flex-col gap-4 border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Data Anak</h2>
          {childrenData.map((child, index) => (
            <div
              key={child.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4"
            >
              <div className="space-y-2">
                <Label htmlFor={`child-nama-${index}`}>Nama Anak</Label>
                <Input
                  id={`child-nama-${index}`}
                  value={child.name}
                  onChange={(e) => {
                    const newData = [...childrenData];
                    newData[index].name = e.target.value;
                    setChildrenData(newData);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`child-jk-${index}`}>Jenis Kelamin</Label>
                <Select
                  value={child.jenis_kelamin_id}
                  onValueChange={(value) => {
                    const newData = [...childrenData];
                    newData[index].jenis_kelamin_id = value;
                    setChildrenData(newData);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    {options["jenis_kelamin_id"]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/data-karyawan")}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-24 bg-[#17876E]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" /> Menyimpan...
            </span>
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </form>
  );
}
