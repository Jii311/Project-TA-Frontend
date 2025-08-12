"use client";

import api from "@/lib/axios";
import { DataMaster } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const jenisIzin = ({
  fetchData,
  handleEdit,
}: {
  fetchData: () => Promise<void>;
  handleEdit: (item: DataMaster) => void;
}): ColumnDef<DataMaster>[] => [
  {
    accessorKey: "name",
    header: "Jenis Izin",
  },
  {
    accessorKey: "edit",
    header: "Edit",
    cell: ({ row }) => {
      const router = useRouter();
      const data = row.original;

      const handleDelete = async () => {
        try {
          const res = await api.delete(`jenis_izin/${data.id}`);

          if (!res.data) throw new Error("Failed to delete");

          toast.success("Jenis Izin deleted successfully");
          await fetchData();
          router.refresh();
        } catch (error) {
          toast.error("Failed to delete jenis_izin");
          console.error(error);
        }
      };

      return (
        <div className="flex gap-3">
          <Trash2 className="icon cursor-pointer" onClick={handleDelete} />
          <Edit
            className="icon cursor-pointer"
            onClick={() => handleEdit(data)}
          />
        </div>
      );
    },
  },
];
