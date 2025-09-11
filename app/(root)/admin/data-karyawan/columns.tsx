"use client";

import { DataKaryawan } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownNarrowWide, Ellipsis, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const karyawan: ColumnDef<DataKaryawan>[] = [
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
            <Button variant="ghost" className="w-fit justify-start">
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telephone",
    header: "Telepon",
  },
  {
    accessorKey: "alamat",
    header: "Alamat",
  },
  {
    accessorKey: "edit",
    header: "Edit",
    cell: ({ row }) => {
      const router = useRouter();
      const handleViewData = () => {
        const data = row.original;
        router.push(`/admin/data-karyawan/view/${data.id}`);
      };

      const handleEdit = async () => {
        const data = row.original;
        router.push(`/admin/data-karyawan/edit/${data.id}`);
      };

      return (
        <div className="flex flex-row gap-2">
          {/* <UserMinus className="cursor-pointer" onClick={() => {}} /> */}
          <UserPen className="cursor-pointer" onClick={handleEdit} />
          <Ellipsis className="cursor-pointer" onClick={handleViewData} />
        </div>
      );
    },
  },
];
