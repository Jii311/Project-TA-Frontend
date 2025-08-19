"use client";

import { DataRegisterUser } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const dataRegisterUser: ColumnDef<DataRegisterUser>[] = [
  {
    accessorFn: (row) => row.karyawan_id.name,
    id: "name",
    header: "Nama",
  },
  {
    accessorFn: (row) => row.karyawan_id.email,
    id: "email",
    header: "Akun",
  },
  // {
  //   id: "actions",
  //   header: "Edit",
  //   cell: ActionCell,
  // },
];
