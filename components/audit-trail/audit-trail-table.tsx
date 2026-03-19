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
  type FilterFn,
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
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Search, X, Download } from "lucide-react";
import {
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";
import { UserRole } from "@/lib/generated/prisma/enums";
import * as XLSX from "xlsx";

type AuditTrailEntry = {
  id: string;
  action: string;
  module: string;
  description: string | null;
  createdAt: Date;
  userId: string | null;
  user: {
    id: string | null;
    name: string | null;
    username: string;
    office: string | null;
    role: UserRole;
  } | null
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
    header: "Date & Time",
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap text-xs">
        {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy hh:mm a")}
      </span>
    ),
    filterFn: "dateRange" as unknown as FilterFn<AuditTrailEntry>,
  },
  {
    id: "user",
    header: "User",
    accessorFn: (row) => row.user?.name ?? row.user?.username,
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
              className={`px-1.5 py-0 text-[10px] font-semibold ${roleColors[user?.role ?? "STAFF"]}`}
            >
              {user?.role}
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
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
            moduleColors[moduleName] ?? "bg-gray-50 text-gray-600"
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
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const isDateFiltered = dateFrom !== "" || dateTo !== "";

  const filteredData = React.useMemo(() => {
    if (!isDateFiltered) return logs;

    const from = dateFrom ? startOfDay(parseISO(dateFrom)) : null;
    const to = dateTo ? endOfDay(parseISO(dateTo)) : null;

    return logs.filter((log) => {
      const date = new Date(log.createdAt);
      if (from && isBefore(date, from)) return false;
      if (to && isAfter(date, to)) return false;
      return true;
    });
  }, [logs, dateFrom, dateTo, isDateFiltered]);

  const table = useReactTable({
    data: filteredData,
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

  function clearDateFilter() {
    setDateFrom("");
    setDateTo("");
  }

  function exportToExcel() {
    const rows = table.getFilteredRowModel().rows.map((row) => {
      const log = row.original;
      return {
        "Date & Time": format(new Date(log.createdAt), "MMM dd, yyyy hh:mm a"),
        Name: log?.user?.name ?? log?.user?.username,
        Action: log.action,
        Module: log.module,
        Description: log.description ?? "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 22 },
      { wch: 22 },
      { wch: 10 },
      { wch: 22 },
      { wch: 40 },
    ];

    const userTotalsMap = new Map<
      string,
      {
        name: string;
        total: number;
        actions: Record<string, number>;
      }
    >();

    table.getFilteredRowModel().rows.forEach((row) => {
      const log = row.original;

      if (!log.user?.username) return;
      
      const key = log.user?.username;

      if (!userTotalsMap.has(key)) {
        userTotalsMap.set(key, {
          name: log.user.name ?? log.user.username,
          total: 0,
          actions: { CREATE: 0, UPDATE: 0, DELETE: 0 },
        });
      }

      const entry = userTotalsMap.get(key)!;
      entry.total += 1;
      if (log.action in entry.actions) {
        entry.actions[log.action] += 1;
      }
    });

    const summaryRows = Array.from(userTotalsMap.values())
      .sort((a, b) => b.total - a.total)
      .map((u) => ({
        Name: u.name,
        CREATE: u.actions.CREATE,
        UPDATE: u.actions.UPDATE,
        DELETE: u.actions.DELETE,
        "Total Logs": u.total,
      }));

    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    summarySheet["!cols"] = [
      { wch: 22 },
      { wch: 18 },
      { wch: 9 },
      { wch: 9 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Trail");
    XLSX.utils.book_append_sheet(workbook, summarySheet, "User Summary");

    const dateLabel =
      dateFrom && dateTo
        ? `_${dateFrom}_to_${dateTo}`
        : dateFrom
          ? `_from_${dateFrom}`
          : dateTo
            ? `_to_${dateTo}`
            : "";

    XLSX.writeFile(workbook, `audit_trail${dateLabel}.xlsx`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search user, action, module..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => {
                setDateFrom(e.target.value);
                table.setPageIndex(0);
              }}
              className="w-36 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => {
                setDateTo(e.target.value);
                table.setPageIndex(0);
              }}
              className="w-36 text-sm"
            />
          </div>
          {isDateFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDateFilter}
              className="text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={exportToExcel}
            disabled={totalFiltered === 0}
            className="gap-1.5 py-5"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Showing{" "}
          <strong>
            {totalFiltered === 0 ? 0 : pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, totalFiltered)}
          </strong>{" "}
          of <strong>{totalFiltered}</strong> logs
          {isDateFiltered && (
            <span className="ml-1 text-xs">
              (filtered from {logs.length} total)
            </span>
          )}
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
            Page {pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
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
