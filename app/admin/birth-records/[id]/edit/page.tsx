

import { BirthRecordForm } from "@/components/birth-certificate/birth-record-form";
import { prisma } from "@/lib/prisma";
import { transformBirthRecord } from "@/lib/transform-record";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBirthRecordPage({ params }: EditPageProps) {
  const { id } = await params;
  
  const record = await prisma.birthRecord.findUnique({
    where: { id },
  });

  if (!record) {
    notFound();
  }

  return (
    <BirthRecordForm
      recordId={record.id}
      defaultValues={transformBirthRecord(record)}
      isEditing
    />
  );
}