"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { lokasiKantorSchema, LokasiKantorSchema } from "@/lib/zod";
import { LokasiKantor } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { lokasiKantor } from "./columns";
import { TableData } from "@/components/TableData";
import MapPicker from "@/components/MapPicker";
import api from "@/lib/axios";

export default function LokasiKantorPage() {
  const [data, setData] = useState<LokasiKantor[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LokasiKantorSchema>({
    resolver: zodResolver(lokasiKantorSchema),
    defaultValues: {
      name: "",
      alamat: "",
      latitude: "",
      longitude: "",
      radius: "",
    },
    mode: "onChange",
  });

  const fetchData = async () => {
    try {
      const res = await api.get("lokasi_kantor");
      const json = await res.data;
      setData(json);
    } catch (err) {
      toast.error("Gagal fetch data lokasi kantor");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: LokasiKantorSchema) => {
    setIsSubmitting(true);
    const method = id ? "patch" : "post";
    const url = id ? `lokasi_kantor/${id}` : "lokasi_kantor";

    const payload = {
      name: formData.name,
      alamat: formData.alamat,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      radius: parseInt(formData.radius),
    };

    try {
      if (method === "patch") {
        await api.patch(url, payload);
      } else {
        await api.post(url, payload);
      }

      toast.success(
        `Lokasi kantor berhasil ${id ? "diperbarui" : "ditambahkan"}`
      );
      reset();
      await fetchData();
      setOpen(false);
      setid(null);
    } catch (err) {
      toast.error("Gagal simpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: LokasiKantor) => {
    setid(item.id);
    setValue("name", item.name);
    setValue("alamat", item.alamat);
    setValue("latitude", item.latitude?.toString() || "");
    setValue("longitude", item.longitude?.toString() || "");
    setCoords({
      lat: item.latitude || 0,
      lng: item.longitude || 0,
    });
    setValue("radius", item.radius?.toString() || "");
    setOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-full">
      <div className="flex justify-end px-5 pb-4 pt-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setid(null);
                reset();
                setCoords({ lat: -6.1754049, lng: 106.827168 });
              }}
              className="bg-[#17876E]"
            >
              Tambah data lokasi kantor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">
                {id ? "Edit lokasi kantor" : "Tambah lokasi kantor Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Daerah kantor</Label>
                <Input
                  id="name"
                  placeholder="Masukan daerah kantor"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="alamat">Alamat kantor</Label>
                <Input
                  id="alamat"
                  placeholder="Masukan alamat kantor"
                  {...register("alamat")}
                />
                {errors.alamat && (
                  <p className="text-sm text-red-500">
                    {errors.alamat.message}
                  </p>
                )}
              </div>

              <MapPicker
                onChange={(lat, lng) => {
                  setCoords({ lat, lng });
                  setValue("latitude", lat.toString());
                  setValue("longitude", lng.toString());
                }}
                initialPosition={coords ? [coords.lat, coords.lng] : undefined}
              />

              <div className="flex gap-4">
                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="-6.200000"
                    readOnly
                    {...register("latitude")}
                  />
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="106.816666"
                    readOnly
                    {...register("longitude")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="radius">Radius absensi</Label>
                <Input
                  id="radius"
                  placeholder="100 (dalam meter)"
                  {...register("radius")}
                />
                {errors.radius && (
                  <p className="text-sm text-red-500">
                    {errors.radius.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "bg-[#17876E] hover:bg-[#17876E]/90",
                    "h-11 text-md mt-5"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      {id ? "Memperbarui..." : "Menambahkan..."}
                    </span>
                  ) : id ? (
                    "Simpan Perubahan"
                  ) : (
                    "Tambah lokasi kantor"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-full">
        <TableData
          columns={lokasiKantor({ fetchData, handleEdit })}
          data={data}
        />
      </div>
    </div>
  );
}
