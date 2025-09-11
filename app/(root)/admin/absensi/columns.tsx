"use client";

import { Button } from "@/components/ui/button";
import { DataAbsensi } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownNarrowWide, Image } from "lucide-react";
import {
  CheckCircle,
  Clock,
  Info,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function formatTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function mapAbsensiData(data: any[]): DataAbsensi[] {
  return data.map((item) => ({
    id: item.id,
    name: item.user_id?.name || "-",
    originalDate: item.tanggal,
    tanggal: formatDateTime(item.tanggal),
    clock_in_time: item.clock_in_time
      ? formatTime(item.clock_in_time)
      : "--:--",
    clock_out_time: item.clock_out_time
      ? formatTime(item.clock_out_time)
      : "--:--",
    status: item.status_absensi?.name || "",
    bukti_foto: `${process.env.NEXT_PUBLIC_PATH_URL}${item.bukti_foto}`,
    foto_pulang: item.foto_pulang
      ? `${process.env.NEXT_PUBLIC_PATH_URL}${item.foto_pulang}`
      : null,
  }));
}

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
    header: ({ table }) => {
      const [open, setOpen] = useState(false);
      const [search, setSearch] = useState("");

      const uniqueNames = Array.from(
        new Set(table.getRowModel().rows.map((row) => row.original.name))
      );

      const filteredNames = uniqueNames.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      );

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-fit p-0 justify-start">
              Nama
              <ArrowDownNarrowWide className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command className="border ml-1 w-50">
              <CommandInput
                placeholder="Cari Karyawan..."
                value={search}
                onValueChange={(val) => {
                  setSearch(val);
                  table.getColumn("name")?.setFilterValue(val);
                }}
              />
              <CommandList className="max-h-48 overflow-y-auto">
                <CommandEmpty>Nama tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {filteredNames.map((name) => (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={(val) => {
                        table.getColumn("name")?.setFilterValue(val);
                        setSearch(val);
                        setOpen(false);
                      }}
                    >
                      {name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      return filterValue
        ? row
            .getValue(columnId)
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ?? false
        : true;
    },
  },

  {
    accessorKey: "tanggal",
    header: ({ table }) => {
      const [open, setOpen] = useState(false);
      const [selectedMonth, setSelectedMonth] = useState<string>("");

      const months = [
        { label: "Semua", value: "" },
        { label: "Januari", value: "0" },
        { label: "Februari", value: "1" },
        { label: "Maret", value: "2" },
        { label: "April", value: "3" },
        { label: "Mei", value: "4" },
        { label: "Juni", value: "5" },
        { label: "Juli", value: "6" },
        { label: "Agustus", value: "7" },
        { label: "September", value: "8" },
        { label: "Oktober", value: "9" },
        { label: "November", value: "10" },
        { label: "Desember", value: "11" },
      ];

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-30 p-0">
              Tanggal
              <ArrowDownNarrowWide className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-30 p-0">
            <Command className="border ml-1 w-50">
              <CommandList className="max-h-48 overflow-y-auto">
                <CommandEmpty>Nama tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {months.map((m) => (
                    <CommandItem
                      key={m.value}
                      value={m.value}
                      onSelect={(val) => {
                        table.getColumn("tanggal")?.setFilterValue(val);
                        setSelectedMonth(val);
                        setOpen(false);
                      }}
                    >
                      {m.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const date = new Date(row.original.originalDate);
      return date.getMonth().toString() === filterValue;
    },
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
