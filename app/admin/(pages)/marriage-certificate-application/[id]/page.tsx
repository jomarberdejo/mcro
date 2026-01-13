import { MarriageCertificateApplicationView } from "@/components/marriage-certificate-application/marriage-certificate-application-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewMarriageCertAppPage({ params }: ViewPageProps) {
  const { id } = await params;

  const record = await prisma.marriageCertificateApplication.findUnique({
    where: { id },
  });

  if (!record) {
    notFound();
  }

  return <MarriageCertificateApplicationView application={record} />
}