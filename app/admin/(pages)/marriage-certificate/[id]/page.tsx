import { MarriageRecordView } from "@/components/marriage-certificate/marriage-record-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewMarriageRecordPage({ params }: ViewPageProps) {
  const { id } = await params;

  const record = await prisma.marriageRecord.findUnique({
    where: { id },
    include: {
      supportingDocuments: true,
    }
  });

  if (!record) {
    notFound();
  }

  return <MarriageRecordView record={record} />
}