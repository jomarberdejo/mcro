import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MarriageRecordFormInput, marriageRecordSchema } from "@/lib/validations/marriage-record.schema";

interface UseMarriageRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<MarriageRecordFormInput>;
  isEditing?: boolean;
}

export function useMarriageRecordForm({
  recordId,
  defaultValues,
  isEditing = false,
}: UseMarriageRecordFormProps) {
  const router = useRouter();
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    defaultValues?.signatureImagePath || null
  );
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  const form = useForm<MarriageRecordFormInput>({
    resolver: zodResolver(marriageRecordSchema),
    defaultValues: defaultValues || {
      registryNo: "",
      bookNo: "",
      pageNo: "",
      dateOfMarriage: "",
      placeOfMarriage: "",
      dateOfRegistration: "",
      husbandLastName: "",
      husbandFirstName: "",
      husbandMiddleName: "",
      husbandAge: 0,
      husbandNationality: "",
      husbandCivilStatus: "" as "Single" | "Married" | "Widowed" | "Divorced",
      husbandMotherName: "",
      husbandFatherName: "",
      wifeLastName: "",
      wifeFirstName: "",
      wifeMiddleName: "",
      wifeAge: 0,
      wifeNationality: "",
      wifeCivilStatus: "" as "Single" | "Married" | "Widowed" | "Divorced",
      wifeMotherName: "",
      wifeFatherName: "",
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

  const onSubmit = async (data: MarriageRecordFormInput) => {
    try {
      const url = isEditing
        ? `/api/marriage-certificate/${recordId}`
        : "/api/marriage-certificate";
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
          ? "Marriage record updated successfully"
          : "Marriage record created successfully"
      );
      router.push("/admin/marriage-certificate");
      router.refresh();
    } catch (error) {
      console.error("Error saving marriage record:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save marriage record"
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