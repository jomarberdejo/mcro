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
        
        // Update form value
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
      // Reset file input
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
        
        // Update form value
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
      router.push("/admin/marriage-cert-app");
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
    supportingDocuments,
    isUploadingDoc,
    handleSupportingDocumentsUpload,
    removeSupportingDocument,
  };
}