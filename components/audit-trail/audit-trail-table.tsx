"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react";
import { format } from "date-fns";
import { UserRole } from "@/lib/generated/prisma/enums";

type AuditTrailEntry = {
  id: string;
  action: string;
  module: string;
  description: string | null;
  createdAt: Date;
  userId: string | null;
  user: {
    id: string;
    name: string | null;
    username: string;
    office: string | null;
    role: UserRole;
  } | null;
};

const actionColors: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700 border-green-200",
  UPDATE: "bg-blue-100 text-blue-700 border-blue-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  VIEW: "bg-gray-100 text-gray-700 border-gray-200",
  LOGIN: "bg-violet-100 text-violet-700 border-violet-200",
  LOGOUT: "bg-orange-100 text-orange-700 border-orange-200",
};

const moduleColors: Record<string, string> = {
  "Birth Certificate": "bg-emerald-50 text-emerald-700",
  "Death Certificate": "bg-slate-100 text-slate-700",
  "Marriage Certificate": "bg-rose-50 text-rose-700",
  AML: "bg-violet-50 text-violet-700",
  Auth: "bg-amber-50 text-amber-700",
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-amber-100 text-amber-700 border-amber-200",
  STAFF: "bg-sky-100 text-sky-700 border-sky-200",
};

const columns: ColumnDef<AuditTrailEntry>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
      // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date & Time
        {/* <ArrowUpDown className="ml-2 h-3.5 w-3.5" /> */}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap text-xs">
        {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy hh:mm a")}
      </span>
    ),
  },
  {
    id: "user",
    header: "User",
    accessorFn: (row) => row?.user?.name ?? row?.user?.username,
    cell: ({ row }) => {
      const { user } = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            {user?.name ?? user?.username}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">
              {user?.username}
            </span>
            <Badge
              variant="outline"
              className={`px-1.5 py-0 text-[10px] font-semibold ${user ? roleColors[user.role] ?? "" : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
            >
              {user?.role ?? "DELETED"}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action: string = row.getValue("action");
      return (
        <Badge
          variant="outline"
          className={`text-xs font-semibold ${actionColors[action] ?? "bg-gray-100 text-gray-700"}`}
        >
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => {
      const moduleName: string = row.getValue("module");
      return (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${moduleColors[moduleName] ?? "bg-gray-50 text-gray-600"
            }`}
        >
          {moduleName}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("description") ?? "—"}
      </span>
    ),
  },
];

export function AuditTrailTable({ logs }: { logs: AuditTrailEntry[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: logs,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalFiltered = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Showing{" "}
          <strong>
            {pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, totalFiltered)}
          </strong>{" "}
          of <strong>{totalFiltered}</strong> logs
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground">
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/50">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold uppercase tracking-wide"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-32 text-center"
                >
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
