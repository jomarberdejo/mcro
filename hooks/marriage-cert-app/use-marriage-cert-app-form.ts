// hooks/marriage-cert-app/use-marriage-cert-app-form.ts

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/use-file-upload";
import {
  marriageCertificateApplicationSchema,
  MarriageCertificateApplicationFormInput,
} from "@/lib/validations/marriage-cert-app.schema";

interface UseMarriageCertificateApplicationFormProps {
  applicationId?: string;
  defaultValues?: Partial<MarriageCertificateApplicationFormInput>;
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

export function useMarriageCertificateApplicationForm({
  applicationId,
  defaultValues,
  isEditing = false,
}: UseMarriageCertificateApplicationFormProps) {
  const router = useRouter();
  const { uploadFile, deleteFile } = useFileUpload();

  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [supportingDocuments, setSupportingDocuments] = useState<SupportingDocument[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<MarriageCertificateApplicationFormInput | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

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

  const checkEmptyFields = (data: MarriageCertificateApplicationFormInput): string[] => {
    const emptyFields: string[] = [];
    
    const requiredFields: { [key: string]: string } = {
      registryNo: "Registry Number",
      bookNo: "Book Number",
      pageNo: "Page Number",
      dateOfRegistration: "Date of Registration",
      groomFirstName: "Groom's First Name",
      groomLastName: "Groom's Last Name",
      groomDateOfBirth: "Groom's Date of Birth",
      brideFirstName: "Bride's First Name",
      brideLastName: "Bride's Last Name",
      brideDateOfBirth: "Bride's Date of Birth",
    };

    Object.entries(requiredFields).forEach(([key, displayName]) => {
      const value = data[key as keyof MarriageCertificateApplicationFormInput];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        emptyFields.push(displayName);
      }
    });

    return emptyFields;
  };

  const handleSupportingDocumentsUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";

      if (!isImage && !isPDF) return true; 

      const maxSize = isPDF ? 10 * 1024 * 1024 : 5 * 1024 * 1024; 
      return file.size > maxSize;
    });

    if (invalidFiles.length > 0) {
      toast.error("Only images (max 5MB) and PDFs (max 10MB) are allowed");
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
      if (doc.preview.startsWith('blob:')) {
        await deleteFile(doc.path);
        URL.revokeObjectURL(doc.preview);
      } else {
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

  const saveApplication = async (data: MarriageCertificateApplicationFormInput) => {
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
      router.push("/admin/marriage-cert-app");
      router.refresh();
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save application"
      );
    }
  };

  const handleProceedWithIncomplete = async () => {
    if (!pendingFormData) return;

    setShowIncompleteWarning(false);
    await saveApplication(pendingFormData);
    setPendingFormData(null);
  };

  const handleCancelIncomplete = () => {
    setShowIncompleteWarning(false);
    setPendingFormData(null);
    setEmptyFields([]);
    // toast.info("Please fill in the missing fields");
  };

  const onSubmit = async (data: MarriageCertificateApplicationFormInput) => {
    const foundEmptyFields = checkEmptyFields(data);

    if (foundEmptyFields.length > 0) {
      setEmptyFields(foundEmptyFields);
      setPendingFormData(data);
      setShowIncompleteWarning(true);
      
      // toast.warning(
      //   `Some field${foundEmptyFields.length > 1 ? "s are" : " is"} missing`,
      //   {
      //     duration: 3000,
      //   }
      // );
      
      return;
    }

    // If all fields are filled, proceed normally
    await saveApplication(data);
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
    supportingDocuments,
    isUploadingDoc,
    handleSupportingDocumentsUpload,
    removeSupportingDocument,
    showIncompleteWarning,
    handleProceedWithIncomplete,
    handleCancelIncomplete,
    emptyFields,
  };
}