
import { BirthRecordView } from "@/components/birth-certificate/birth-record-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewBirthRecordPage({ params }: ViewPageProps) {
  const { id } = await params;

  const record = await prisma.birthRecord.findUnique({
    where: { id },
    include: {
      supportingDocuments: true,
    }
  });


  if (!record) {
    notFound();
  }


  return <BirthRecordView record={record} />

}

