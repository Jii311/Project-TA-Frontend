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
import { dataMasterSchema, DataMasterSchema } from "@/lib/zod";
import { DataMaster } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { statusAbsensi } from "./columns";
import { TableData } from "@/components/TableData";
import api from "@/lib/axios";

export default function StatusAbsensiPage() {
  const [data, setData] = useState<DataMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DataMasterSchema>({
    resolver: zodResolver(dataMasterSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  });

  const fetchData = async () => {
    try {
      const res = await api.get("status_absensi");
      const json = await res.data;
      setData(json);
    } catch (err) {
      toast.error("Gagal fetch data status absensi");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: DataMasterSchema) => {
    setIsSubmitting(true);
    const method = id ? "patch" : "post";
    const url = id ? `status_absensi/${id}` : "status_absensi";

    try {
      if (method === "patch") {
        await api.patch(url, formData);
      } else {
        await api.post(url, formData);
      }

      toast.success(
        `Status absensi berhasil ${id ? "diperbarui" : "ditambahkan"}`
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

  const handleEdit = (item: DataMaster) => {
    setid(item.id);
    setValue("name", item.name);
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
              }}
              className="bg-[#17876E]"
            >
              Tambah data status absensi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">
                {id ? "Edit status absensi" : "Tambah status absensi Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Nama status absensi</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama status absensi"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
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
                    "Tambah status absensi"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-full">
        <TableData
          columns={statusAbsensi({ fetchData, handleEdit })}
          data={data}
        />
      </div>
    </div>
  );
}
