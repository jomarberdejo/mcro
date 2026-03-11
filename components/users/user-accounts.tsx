"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  UserPlus,
  ShieldCheck,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UserRow = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  office: string | null;
  role: "ADMIN" | "STAFF";
  createdAt: Date;
  _count: { auditTrails: number };
};

function CreateUserDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState<"STAFF" | "ADMIN">("STAFF");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email") || null,
      office: formData.get("office") || "MCRO",
      role,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success(`Account for ${data.user.name} created successfully.`);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(data.error ?? "Failed to create account.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          New Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create User Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Juan Dela Cruz"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="e.g. mcro_staff7"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="office">Office</Label>
              <Input id="office" name="office" defaultValue="MCRO" readOnly />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as "STAFF" | "ADMIN")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const columns: ColumnDef<UserRow>[] = [
  {
    id: "user",
    header: "User",
    cell: ({ row }) => {
      const { name, username, role } = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
            {role === "ADMIN" ? (
              <ShieldCheck className="h-4 w-4 text-amber-600" />
            ) : (
              <User className="h-4 w-4 text-sky-600" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name ?? "—"}</span>
            <span className="text-muted-foreground text-xs">{username}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("email") ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "office",
    header: "Office",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("office") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const roleValue: string = row.getValue("role");
      return (
        <Badge
          variant="outline"
          className={
            roleValue === "ADMIN"
              ? "border-amber-200 bg-amber-100 text-amber-700"
              : "border-sky-200 bg-sky-100 text-sky-700"
          }
        >
          {roleValue}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    id: "activity",
    header: "Activity",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original._count.auditTrails} logs
      </span>
    ),
  },
];

export function UserAccountsClient({ users }: { users: UserRow[] }) {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Showing{" "}
          <strong>
            {pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, users.length)}
          </strong>{" "}
          of <strong>{users.length}</strong> accounts
        </span>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-end">
            <CreateUserDialog />
          </div>
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
                  No user accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
