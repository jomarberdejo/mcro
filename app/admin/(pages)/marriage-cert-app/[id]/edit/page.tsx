import { MarriageCertificateApplicationForm } from "@/components/marriage-cert-app/marriage-cert-app-form";
import { prisma } from "@/lib/prisma";
import { transformMarriageCertificateApplication } from "@/lib/transform-record";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMarriageCertificateApplicationPage({ params }: EditPageProps) {
  const { id } = await params;

  const application = await prisma.marriageCertificateApplication.findUnique({
    where: { id },
    include: {
      supportingDocuments: true,
    }
  });

  if (!application) {
    notFound();
  }

  return (
    <MarriageCertificateApplicationForm
      applicationId={application.id}
      defaultValues={transformMarriageCertificateApplication(application)}
      isEditing
    />
  );
}