import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { UserAccountsClient } from "@/components/users/user-accounts";

export const revalidate = 0;

async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      office: true,
      role: true,
      createdAt: true,
      _count: {
        select: { auditTrails: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function UserAccountsPage() {
  const user = await getCurrentUser();

  if (user?.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const users = await getUsers();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Accounts</h1>
        <p className="text-muted-foreground text-sm">
          Manage staff and admin accounts for the MCRO system.
        </p>
      </div>

      <UserAccountsClient users={users} />
    </div>
  );
}