import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  birthRecordSchema,
  BirthRecordFormInput,
} from "@/lib/validations/birth-record.schema";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useDuplicateCheck } from "../use-duplicate-check";

interface UseBirthRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<BirthRecordFormInput>;
  isEditing?: boolean;
}

export interface SupportingDocument {
  id: string;
  path: string;
  preview: string;
  name: string;
  size: number;
  mimeType: string;
}

interface BirthCertificateCheckData {
  childFirstName: string;
  childLastName: string;
  childMiddleName?: string;
}

export function useBirthRecordForm({
  recordId,
  defaultValues,
  isEditing = false,
}: UseBirthRecordFormProps) {
  const router = useRouter();
  const { uploadFile, deleteFile } = useFileUpload();

  const {
    showDuplicateDialog,
    duplicateRecords,
    handleDuplicateCheck,
    handleProceedWithSave,
    handleViewExisting,
    handleCancelDuplicate,
  } = useDuplicateCheck<BirthRecordFormInput, BirthCertificateCheckData>({
    apiEndpoint: "/api/birth-certificate/check-duplicate",
    redirectBasePath: "/admin/birth-certificate",
    recordId,
  });

  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    defaultValues?.signatureImagePath || null,
  );
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [supportingDocuments, setSupportingDocuments] = useState<
    SupportingDocument[]
  >([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

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
      supportingDocuments: [],
      certificateDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
    },
  });

  useEffect(() => {
    if (
      defaultValues?.supportingDocuments &&
      defaultValues.supportingDocuments.length > 0
    ) {
      const existingDocs: SupportingDocument[] =
        defaultValues.supportingDocuments.map((doc) => ({
          id: doc.filePath,
          path: doc.filePath,
          preview: doc.filePath,
          name: doc.fileName,
          size: doc.fileSize || 0,
          mimeType: doc.mimeType || "image/jpeg",
        }));
      setSupportingDocuments(existingDocs);
    }
  }, [defaultValues?.supportingDocuments]);

  const handleSupportingDocumentsUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
    );

    if (invalidFiles.length > 0) {
      toast.error("All files must be images under 5MB");
      return;
    }

    setIsUploadingDoc(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadFile(file, "documents");
        const previewUrl = URL.createObjectURL(file);

        return {
          id: result.path,
          path: result.path,
          preview: previewUrl,
          name: file.name,
          size: file.size,
          mimeType: file.type,
        };
      });

      const uploadedDocs = await Promise.all(uploadPromises);

      setSupportingDocuments((prev) => {
        const newDocs = [...prev, ...uploadedDocs];

        form.setValue(
          "supportingDocuments",
          newDocs.map((d) => ({
            filePath: d.path,
            fileName: d.name,
            fileSize: d.size,
            mimeType: d.mimeType,
          })),
        );

        return newDocs;
      });

      toast.success(`${uploadedDocs.length} document(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload documents",
      );
    } finally {
      setIsUploadingDoc(false);
      const fileInput = document.getElementById(
        "documentsUpload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const removeSupportingDocument = async (docId: string) => {
    const doc = supportingDocuments.find((d) => d.id === docId);
    if (!doc) return;

    try {
      // Only delete from storage if it's a newly uploaded file (has blob URL)
      if (doc.preview.startsWith("blob:")) {
        await deleteFile(doc.path);
        URL.revokeObjectURL(doc.preview);
      } else {
        // For existing files, just delete from storage
        await deleteFile(doc.path);
      }

      setSupportingDocuments((prev) => {
        const updatedDocs = prev.filter((d) => d.id !== docId);

        form.setValue(
          "supportingDocuments",
          updatedDocs.map((d) => ({
            filePath: d.path,
            fileName: d.name,
            fileSize: d.size,
            mimeType: d.mimeType,
          })),
        );

        return updatedDocs;
      });

      toast.success("Document removed");
    } catch (error) {
      console.error("Error removing document:", error);
      toast.error("Failed to remove document");
    }
  };

  const saveRecord = async (data: BirthRecordFormInput) => {
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
          : "Birth record created successfully",
      );
      router.push("/admin/birth-certificate");
      router.refresh();
    } catch (error) {
      console.error("Error saving birth record:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save birth record",
      );
    }
  };

  const onSubmit = async (data: BirthRecordFormInput): Promise<void> => {
    const checkData: BirthCertificateCheckData = {
      childFirstName: data.childFirstName,
      childLastName: data.childLastName,
      childMiddleName: data?.childMiddleName,
    };

    await handleDuplicateCheck(checkData, data, saveRecord);
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
    supportingDocuments,
    isUploadingDoc,
    handleSupportingDocumentsUpload,
    removeSupportingDocument,
    showDuplicateDialog,
    duplicateRecords,
    handleProceedWithSave: () => handleProceedWithSave(saveRecord),
    handleViewExisting,
    handleCancelDuplicate,
  };
}
