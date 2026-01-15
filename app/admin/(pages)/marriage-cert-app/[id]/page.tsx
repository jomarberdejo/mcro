import { MarriageCertificateApplicationView } from "@/components/marriage-cert-app/marriage-cert-app-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewMarriageCertAppPage({ params }: ViewPageProps) {
  const { id } = await params;

  const record = await prisma.marriageCertificateApplication.findUnique({
    where: { id },
    include: {
      supportingDocuments: true,
    }

  });
  if (!record) {
    notFound();
  }

  return <MarriageCertificateApplicationView application={record} />
}