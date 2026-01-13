import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  birthRecordSchema,
  BirthRecordFormInput,
} from "@/lib/validations/birth-record.schema";

interface UseBirthRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<BirthRecordFormInput>;
  isEditing?: boolean;
}

export function useBirthRecordForm({
  recordId,
  defaultValues,
  isEditing = false,
}: UseBirthRecordFormProps) {
  const router = useRouter();
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    defaultValues?.signatureImagePath || null
  );
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  const form = useForm<BirthRecordFormInput>({
    resolver: zodResolver(birthRecordSchema),
    defaultValues: defaultValues || {
      registryNo: "",
      bookNo: "",
      pageNo: "",
      dateOfRegistration: "",
      childLastName: "",
      childFirstName: "",
      childMiddleName: "",
      sex: "" as "Male" | "Female",
      dateOfBirth: "",
      placeOfBirth: "",
      isTwin: false,
      typeOfBirth: "",
      birthOrder: "",
      timeOfBirth: "",
      motherLastName: "",
      motherFirstName: "",
      motherMiddleName: "",
      motherCitizenship: "",
      fatherLastName: "",
      fatherFirstName: "",
      fatherMiddleName: "",
      fatherCitizenship: "",
      dateOfMarriage: "",
      placeOfMarriage: "",
      remarks: "",
      requestorName: "",
      requestPurpose: "",
      registrarName: "",
      verifiedBy: "",
      verifierPosition: "",
      certifyingOfficerName: "",
      certifyingOfficerPosition: "",
      processFeeInfo: "",
      signatureImagePath: "",
    },
  });

  const onSubmit = async (data: BirthRecordFormInput) => {
    try {
      const url = isEditing
        ? `/api/birth-certificate/${recordId}`
        : "/api/birth-certificate";
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
          ? "Birth record updated successfully"
          : "Birth record created successfully"
      );
      router.push("/admin/birth-certificate");
      router.refresh();
    } catch (error) {
      console.error("Error saving birth record:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save birth record"
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