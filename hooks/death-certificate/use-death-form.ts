import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeathRecordFormInput, deathRecordSchema } from "@/lib/validations/death-record.schema";


interface UseDeathRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<DeathRecordFormInput>;
  isEditing?: boolean;
}

export function useDeathRecordForm({
  recordId,
  defaultValues,
  isEditing = false,
}: UseDeathRecordFormProps) {
  const router = useRouter();
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    defaultValues?.signatureImagePath || null
  );
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  const form = useForm<DeathRecordFormInput>({
    resolver: zodResolver(deathRecordSchema),
    defaultValues: defaultValues || {
      registryNo: "",
      pageNo: "",
      bookNo: "",
      deceasedLastName: "",
      deceasedFirstName: "",
      deceasedMiddleName: "",
      sex: "" as "Male" | "Female",
      age: 0,
      civilStatus: "" as "Single" | "Married" | "Widowed" | "Divorced",
      citizenship: "",
      dateOfDeath: "",
      placeOfDeath: "",
      causeOfDeath: "",
      dateOfRegistration: "",
      requestorName: "",
      requestPurpose: "",
      registrarName: "",
      verifiedBy: "",
      verifierPosition: "",
      certifyingOfficerName: "",
      certifyingOfficerPosition: "",
      processFeeInfo: "",
      remarks: "",
      signatureImagePath: "",
    },
  });

  const onSubmit = async (data: DeathRecordFormInput) => {
    try {
      const url = isEditing
        ? `/api/death-certificate/${recordId}`
        : "/api/death-certificate";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save record");
      }

      toast.success(
        isEditing
          ? "Death record updated successfully"
          : "Death record created successfully"
      );
      router.push("/admin/death-certificate");
      router.refresh();
    } catch (error) {
      console.error("Error saving death record:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save death record"
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    form,
    signaturePreview,
    setSignaturePreview,
    documentPreview,
    setDocumentPreview,
    isProcessing,
    setIsProcessing,
    isUploadingSignature,
    setIsUploadingSignature,
    onSubmit,
    handleCancel,
  };
}