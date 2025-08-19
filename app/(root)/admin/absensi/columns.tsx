"use client";

import { DataAbsensi } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Image } from "lucide-react";
import {
  CheckCircle,
  Clock,
  Info,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "tepat waktu":
      return {
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
      };
    case "terlambat":
      return {
        className: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4 mr-1" />,
      };
    case "izin":
      return {
        className: "bg-blue-100 text-blue-800",
        icon: <Info className="w-4 h-4 mr-1" />,
      };
    case "proses":
      return {
        className: "bg-orange-100 text-orange-800",
        icon: <AlertTriangle className="w-4 h-4 mr-1" />,
      };
    default:
      return {
        className: "bg-gray-100 text-gray-800",
        icon: <HelpCircle className="w-4 h-4 mr-1" />,
      };
  }
}

export const absensi = (
  handlePhotoClick: (fotoDatang: string, fotoPulang?: string) => void
): ColumnDef<DataAbsensi>[] => [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "clock_in_time",
    header: "Masuk",
  },
  {
    accessorKey: "clock_out_time",
    header: "Pulang",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { className, icon } = getStatusStyle(row.original.status);

      return (
        <span
          className={`flex items-center justify-center gap-1 min-w-[120px] px-3 py-1 rounded-md text-sm font-medium ${className}`}
        >
          {icon}
          {row.original.status
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ")}
        </span>
      );
    },
  },
  {
    accessorKey: "bukti_foto",
    header: "Foto",
    cell: ({ row }) => {
      const imageUrl = row.original.bukti_foto;
      const imageUrlPulang = row.original.foto_pulang || null;

      return imageUrl ? (
        <Image
          className="cursor-pointer w-4 h-4"
          onClick={() =>
            handlePhotoClick(imageUrl, imageUrlPulang ?? undefined)
          }
        />
      ) : (
        <span className="text-gray-400 italic text-xs">Kosong</span>
      );
    },
  },
];
