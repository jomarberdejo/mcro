
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/use-file-upload";
import { DeathRecordFormInput, deathRecordSchema } from "@/lib/validations/death-record.schema";
import { useDuplicateCheck } from "../use-duplicate-check";

interface UseDeathRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<DeathRecordFormInput>;
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

interface DeathCertificateCheckData {
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedMiddleName?: string;
}

export function useDeathRecordForm({
  recordId,
  defaultValues,
  isEditing = false,
}: UseDeathRecordFormProps) {

  const {
    showDuplicateDialog,
    duplicateRecords,
    handleDuplicateCheck,
    handleProceedWithSave,
    handleViewExisting,
    handleCancelDuplicate,
  } = useDuplicateCheck<DeathRecordFormInput, DeathCertificateCheckData>({
    apiEndpoint: "/api/death-certificate/check-duplicate",
    redirectBasePath: "/admin/death-certificate",
    recordId,
  });

  const router = useRouter();
  const { uploadFile, deleteFile } = useFileUpload();

  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    defaultValues?.signatureImagePath || null
  );
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [supportingDocuments, setSupportingDocuments] = useState<SupportingDocument[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

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
      age: "",
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
      supportingDocuments: [],
    },
  });

  useEffect(() => {
    if (defaultValues?.supportingDocuments && defaultValues.supportingDocuments.length > 0) {
      const existingDocs: SupportingDocument[] = defaultValues.supportingDocuments.map((doc) => ({
        id: doc.filePath,
        path: doc.filePath,
        preview: doc.filePath,
        name: doc.fileName,
        size: doc.fileSize || 0,
        mimeType: doc.mimeType || 'image/jpeg',
      }));
      setSupportingDocuments(existingDocs);
    }
  }, [defaultValues?.supportingDocuments]);

  const handleSupportingDocumentsUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024
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
          }))
        );
        
        return newDocs;
      });

      toast.success(`${uploadedDocs.length} document(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload documents"
      );
    } finally {
      setIsUploadingDoc(false);
      const fileInput = document.getElementById("documentsUpload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const removeSupportingDocument = async (docId: string) => {
    const doc = supportingDocuments.find((d) => d.id === docId);
    if (!doc) return;

    try {
      // Only delete from storage if it's a newly uploaded file (has blob URL)
      if (doc.preview.startsWith('blob:')) {
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
          }))
        );
        
        return updatedDocs;
      });

      toast.success("Document removed");
    } catch (error) {
      console.error("Error removing document:", error);
      toast.error("Failed to remove document");
    }
  };

  const saveRecord = async (data: DeathRecordFormInput) => {
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

   const onSubmit = async (data: DeathRecordFormInput): Promise<void> => {
    const checkData: DeathCertificateCheckData = {
      deceasedFirstName: data.deceasedFirstName,
      deceasedLastName: data.deceasedLastName,
      deceasedMiddleName: data?.deceasedMiddleName,
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