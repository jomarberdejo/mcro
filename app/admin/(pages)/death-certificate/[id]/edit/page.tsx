import { DeathRecordForm } from "@/components/death-certificate/death-record-form";
import { prisma } from "@/lib/prisma";
import { transformDeathRecord } from "@/lib/transform-record";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDeathRecordPage({ params }: EditPageProps) {
  const { id } = await params;

  const record = await prisma.deathRecord.findUnique({
    where: { id },
  });

  if (!record) {
    notFound();
  }

  return (
    <DeathRecordForm
      recordId={record.id}
      defaultValues={transformDeathRecord(record)}
      isEditing
    />
  );
}
