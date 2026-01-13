import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  marriageCertificateApplicationSchema,
  MarriageCertificateApplicationFormInput,
} from "@/lib/validations/marriage-cert-app.schema";

interface UseMarriageCertificateApplicationFormProps {
  applicationId?: string;
  defaultValues?: Partial<MarriageCertificateApplicationFormInput>;
  isEditing?: boolean;
}

export function useMarriageCertificateApplicationForm({
  applicationId,
  defaultValues,
  isEditing = false,
}: UseMarriageCertificateApplicationFormProps) {
  const router = useRouter();
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<MarriageCertificateApplicationFormInput>({
    resolver: zodResolver(marriageCertificateApplicationSchema),
    defaultValues: defaultValues || {
      registryNo: "",
      bookNo: "",
      pageNo: "",
      dateOfRegistration: "",
      groomFirstName: "",
      groomMiddleName: "",
      groomLastName: "",
      groomDateOfBirth: "",
      brideFirstName: "",
      brideMiddleName: "",
      brideLastName: "",
      brideDateOfBirth: "",
    },
  });

  const onSubmit = async (data: MarriageCertificateApplicationFormInput) => {
    try {
      const url = isEditing
        ? `/api/marriage-certificate-application/${applicationId}`
        : "/api/marriage-certificate-application";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save application");
      }

      toast.success(
        isEditing
          ? "Application updated successfully"
          : "Application submitted successfully"
      );
      router.push("/admin/marriage-certificate-application");
      router.refresh();
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save application"
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    form,
    documentPreview,
    setDocumentPreview,
    isProcessing,
    setIsProcessing,
    onSubmit,
    handleCancel,
  };
}
