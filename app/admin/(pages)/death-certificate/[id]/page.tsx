import { DeathRecordView } from "@/components/death-certificate/death-record-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewDeathRecordPage({ params }: ViewPageProps) {
  const { id } = await params;

  const record = await prisma.deathRecord.findUnique({
    where: { id },
    include: {
      supportingDocuments: true,
    }
  });

  if (!record) {
    notFound();
  }

  return <DeathRecordView record={record} />
}