import { DashboardCards } from "@/components/dashboard/dashboard-card";
import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  const [
    birthRecordsCount,
    deathRecordsCount,
    marriageRecordsCount,
    marriageApplicationsCount,
    birthRecords,
    deathRecords,
    marriageRecords,
    marriageApplications,
  ] = await Promise.all([
    prisma.birthRecord.count(),
    prisma.deathRecord.count(),
    prisma.marriageRecord.count(),
    prisma.marriageCertificateApplication.count(),
    
    prisma.birthRecord.findMany({
      select: {
        id: true,
        childFirstName: true,
        childMiddleName: true,
        childLastName: true,
        registryNo: true,
        dateOfBirth: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.deathRecord.findMany({
      select: {
        id: true,
        deceasedFirstName: true,
        deceasedMiddleName: true,
        deceasedLastName: true,
        registryNo: true,
        dateOfDeath: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.marriageRecord.findMany({
      select: {
        id: true,
        husbandFirstName: true,
        husbandMiddleName: true,
        husbandLastName: true,
        wifeFirstName: true,
        wifeMiddleName: true,
        wifeLastName: true,
        registryNo: true,
        dateOfMarriage: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.marriageCertificateApplication.findMany({
      select: {
        id: true,
        groomFirstName: true,
        groomMiddleName: true,
        groomLastName: true,
        brideFirstName: true,
        brideMiddleName: true,
        brideLastName: true,
        registryNo: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    stats: [
      {
        title: "Birth Certificates",
        count: birthRecordsCount,
        icon: "FileText",
        description: "Total birth records",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        records: birthRecords,
        type: "birth" as const,
      },
      {
        title: "Death Certificates",
        count: deathRecordsCount,
        icon: "Cross",
        description: "Total death records",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        records: deathRecords,
        type: "death" as const,
      },
      {
        title: "Marriage Certificates",
        count: marriageRecordsCount,
        icon: "Heart",
        description: "Total marriage records",
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        records: marriageRecords,
        type: "marriage" as const,
      },
      {
        title: "Marriage Applications",
        count: marriageApplicationsCount,
        icon: "ClipboardList",
        description: "Total applications",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        records: marriageApplications,
        type: "application" as const,
      },
    ],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  console.log("SERVER")

  return (
    <div className="space-y-6 p-6">
      <DashboardCards stats={data.stats} />
    </div>
  );
}