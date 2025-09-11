"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { TableDataProps } from "@/types";
import { CustomPagination } from "./CustomPagination";

export function TableData<TData, TValue>({
  columns,
  data,
  pageSize = 9,
  isLoading = false,
  onRowClick,
}: TableDataProps<TData, TValue> & { searchColumn?: string }) {
  const [dynamicPageSize, setDynamicPageSize] = useState(pageSize);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: dynamicPageSize,
      },
    },
  });

  useEffect(() => {
    setIsMounted(true);
    const page =
      typeof window !== "undefined"
        ? Number(new URLSearchParams(window.location.search).get("page"))
        : 1;
    setCurrentPage(Math.min(Math.max(page, 1), table.getPageCount() || 1));
  }, [table]);

  useEffect(() => {
    function calculatePageSize() {
      const screenHeight = window.innerHeight;

      const reservedSpace = 320;
      const rowHeight = 52;

      const availableHeight = screenHeight - reservedSpace;
      const rowsPerPage = Math.max(3, Math.floor(availableHeight / rowHeight));

      setDynamicPageSize(rowsPerPage);
      table.setPageSize(rowsPerPage);
    }

    calculatePageSize();
    window.addEventListener("resize", calculatePageSize);
    return () => window.removeEventListener("resize", calculatePageSize);
  }, [table]);

  if (!isMounted || isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: dynamicPageSize }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-3xl p-5 bg-[#CDF9EF]">
      <div className="rounded-md flex flex-col h-full justify-between">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-13.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <CustomPagination table={table} />
      </div>
    </div>
  );
}
