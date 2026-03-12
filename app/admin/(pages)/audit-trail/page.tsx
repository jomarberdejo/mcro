import { redirect } from "next/navigation";
import { AuditTrailTable } from "@/components/audit-trail/audit-trail-table";
import { getAllAuditTrails } from "@/lib/audit";
import { getCurrentUser } from "@/lib/user";

export const revalidate = 30;

export default async function AuditTrailPage() {
  const user = await getCurrentUser();
  console.log("USER", user)

 
  if (user?.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const logs = await getAllAuditTrails();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground text-sm">
          A log of all actions performed by users in the system.
        </p>
      </div>

      <AuditTrailTable logs={logs} />
    </div>
  );
}
