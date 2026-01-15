import { MarriageRecordForm } from "@/components/marriage-certificate/marriage-record-form";
import { prisma } from "@/lib/prisma";
import { transformMarriageRecord } from "@/lib/transform-record";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMarriageRecordPage({ params }: EditPageProps) {
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

  return (
    <MarriageRecordForm
      recordId={record.id}
      defaultValues={transformMarriageRecord(record)}
      isEditing
    />
  );
}
