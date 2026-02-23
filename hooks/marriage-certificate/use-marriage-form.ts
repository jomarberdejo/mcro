import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MarriageRecordFormInput,
  marriageRecordSchema,
} from "@/lib/validations/marriage-record.schema";
import { useFileUpload } from "@/hooks/use-file-upload";
import { SignatureDocument } from "../death-certificate/use-death-form";

interface UseMarriageRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<MarriageRecordFormInput>;
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

export function useMarriageRecordForm({
  recordId,
  defaultValues,
  isEditing = false,
}: UseMarriageRecordFormProps) {
  const router = useRouter();
  const { uploadFile, deleteFile } = useFileUpload();

  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [supportingDocuments, setSupportingDocuments] = useState<
    SupportingDocument[]
  >([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<MarriageRecordFormInput | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  // Signature states
  const [registrarSignature, setRegistrarSignature] =
    useState<SignatureDocument | null>(null);
  const [verifierSignature, setVerifierSignature] =
    useState<SignatureDocument | null>(null);
  const [certifyingOfficerSignature, setCertifyingOfficerSignature] =
    useState<SignatureDocument | null>(null);

  const [isUploadingRegistrarSig, setIsUploadingRegistrarSig] = useState(false);
  const [isUploadingVerifierSig, setIsUploadingVerifierSig] = useState(false);
  const [isUploadingCertifyingOfficerSig, setIsUploadingCertifyingOfficerSig] =
    useState(false);

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
      husbandAge: "",
      husbandNationality: "",
      husbandCivilStatus: null,
      husbandMotherName: "",
      husbandFatherName: "",
      wifeLastName: "",
      wifeFirstName: "",
      wifeMiddleName: "",
      wifeAge: "",
      wifeNationality: "",
      wifeCivilStatus: null,
      wifeMotherName: "",
      wifeFatherName: "",
      requestorName: "",
      requestPurpose: "",
      registrarName: "DARRYL U. MONTEALEGRE, MM",
      verifiedBy: "",
      verifierPosition: "",
      certifyingOfficerName: "",
      certifyingOfficerPosition: "",
      processFeeInfo: `O.R No. :
Amount Paid: Ph50.00
Date Paid: 
Doc. Authentication Fee: Ph10.00 doc. Stamp tax: Ph30.00`,
      remarks: "",
      supportingDocuments: [],
      registrarSignaturePath: "",
      verifierSignaturePath: "",
      certifyingOfficerSignaturePath: "",
      certificateDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  });

  useEffect(() => {
    if (defaultValues?.registrarSignaturePath) {
      setRegistrarSignature({
        id: defaultValues.registrarSignaturePath,
        path: defaultValues.registrarSignaturePath,
        preview: defaultValues.registrarSignaturePath,
        name: "registrar-signature",
      });
    }

    if (defaultValues?.verifierSignaturePath) {
      setVerifierSignature({
        id: defaultValues.verifierSignaturePath,
        path: defaultValues.verifierSignaturePath,
        preview: defaultValues.verifierSignaturePath,
        name: "verifier-signature",
      });
    }

    if (defaultValues?.certifyingOfficerSignaturePath) {
      setCertifyingOfficerSignature({
        id: defaultValues.certifyingOfficerSignaturePath,
        path: defaultValues.certifyingOfficerSignaturePath,
        preview: defaultValues.certifyingOfficerSignaturePath,
        name: "certifying-officer-signature",
      });
    }
  }, [
    defaultValues?.registrarSignaturePath,
    defaultValues?.verifierSignaturePath,
    defaultValues?.certifyingOfficerSignaturePath,
  ]);

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

  const checkEmptyFields = (data: MarriageRecordFormInput): string[] => {
    const emptyFields: string[] = [];

    const requiredFields: { [key: string]: string } = {
      registryNo: "Registry Number",
      bookNo: "Book Number",
      pageNo: "Page Number",
      dateOfMarriage: "Date of Marriage",
      placeOfMarriage: "Place of Marriage",
      dateOfRegistration: "Date of Registration",
      husbandLastName: "Husband's Last Name",
      husbandFirstName: "Husband's First Name",
      husbandAge: "Husband's Age",
      husbandNationality: "Husband's Nationality",
      husbandCivilStatus: "Husband's Civil Status",
      wifeLastName: "Wife's Last Name",
      wifeFirstName: "Wife's First Name",
      wifeAge: "Wife's Age",
      wifeNationality: "Wife's Nationality",
      wifeCivilStatus: "Wife's Civil Status",
      registrarName: "Registrar Name",
    };

    Object.entries(requiredFields).forEach(([key, displayName]) => {
      const value = data[key as keyof MarriageRecordFormInput];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        emptyFields.push(displayName);
      }
    });

    if (
      !data.registrarSignaturePath ||
      data.registrarSignaturePath.trim() === ""
    ) {
      emptyFields.push("Registrar Signature");
    }

    return emptyFields;
  };

  const handleRegistrarSignatureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setIsUploadingRegistrarSig(true);

    try {
      if (registrarSignature) {
        await deleteFile(registrarSignature.path);
        if (registrarSignature.preview.startsWith("blob:")) {
          URL.revokeObjectURL(registrarSignature.preview);
        }
      }

      const result = await uploadFile(file, "signature");
      const previewUrl = URL.createObjectURL(file);

      const newSignature: SignatureDocument = {
        id: result.path,
        path: result.path,
        preview: previewUrl,
        name: file.name,
      };

      setRegistrarSignature(newSignature);
      form.setValue("registrarSignaturePath", result.path);

      toast.success("Registrar signature uploaded successfully");
    } catch (error) {
      console.error("Error uploading registrar signature:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload signature",
      );
    } finally {
      setIsUploadingRegistrarSig(false);
      e.target.value = "";
    }
  };

  const removeRegistrarSignature = async () => {
    if (!registrarSignature) return;

    try {
      await deleteFile(registrarSignature.path);

      if (registrarSignature.preview.startsWith("blob:")) {
        URL.revokeObjectURL(registrarSignature.preview);
      }

      setRegistrarSignature(null);
      form.setValue("registrarSignaturePath", "");
      toast.success("Registrar signature removed");
    } catch (error) {
      console.error("Error removing registrar signature:", error);
      toast.error("Failed to remove signature");
    }
  };

  const handleVerifierSignatureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setIsUploadingVerifierSig(true);

    try {
      if (verifierSignature) {
        await deleteFile(verifierSignature.path);
        if (verifierSignature.preview.startsWith("blob:")) {
          URL.revokeObjectURL(verifierSignature.preview);
        }
      }

      const result = await uploadFile(file, "signature");
      const previewUrl = URL.createObjectURL(file);

      const newSignature: SignatureDocument = {
        id: result.path,
        path: result.path,
        preview: previewUrl,
        name: file.name,
      };

      setVerifierSignature(newSignature);
      form.setValue("verifierSignaturePath", result.path);

      toast.success("Verifier signature uploaded successfully");
    } catch (error) {
      console.error("Error uploading verifier signature:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload signature",
      );
    } finally {
      setIsUploadingVerifierSig(false);
      e.target.value = "";
    }
  };

  const removeVerifierSignature = async () => {
    if (!verifierSignature) return;

    try {
      await deleteFile(verifierSignature.path);

      if (verifierSignature.preview.startsWith("blob:")) {
        URL.revokeObjectURL(verifierSignature.preview);
      }

      setVerifierSignature(null);
      form.setValue("verifierSignaturePath", "");
      toast.success("Verifier signature removed");
    } catch (error) {
      console.error("Error removing verifier signature:", error);
      toast.error("Failed to remove signature");
    }
  };

  const handleCertifyingOfficerSignatureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setIsUploadingCertifyingOfficerSig(true);

    try {
      if (certifyingOfficerSignature) {
        await deleteFile(certifyingOfficerSignature.path);
        if (certifyingOfficerSignature.preview.startsWith("blob:")) {
          URL.revokeObjectURL(certifyingOfficerSignature.preview);
        }
      }

      const result = await uploadFile(file, "signature");
      const previewUrl = URL.createObjectURL(file);

      const newSignature: SignatureDocument = {
        id: result.path,
        path: result.path,
        preview: previewUrl,
        name: file.name,
      };

      setCertifyingOfficerSignature(newSignature);
      form.setValue("certifyingOfficerSignaturePath", result.path);

      toast.success("Certifying officer signature uploaded successfully");
    } catch (error) {
      console.error("Error uploading certifying officer signature:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload signature",
      );
    } finally {
      setIsUploadingCertifyingOfficerSig(false);
      e.target.value = "";
    }
  };

  const removeCertifyingOfficerSignature = async () => {
    if (!certifyingOfficerSignature) return;

    try {
      await deleteFile(certifyingOfficerSignature.path);

      if (certifyingOfficerSignature.preview.startsWith("blob:")) {
        URL.revokeObjectURL(certifyingOfficerSignature.preview);
      }

      setCertifyingOfficerSignature(null);
      form.setValue("certifyingOfficerSignaturePath", "");
      toast.success("Certifying officer signature removed");
    } catch (error) {
      console.error("Error removing certifying officer signature:", error);
      toast.error("Failed to remove signature");
    }
  };

  const handleSupportingDocumentsUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
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

  const saveRecord = async (data: MarriageRecordFormInput) => {
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
          : "Marriage record created successfully",
      );
      router.push("/admin/marriage-certificate");
      router.refresh();
    } catch (error) {
      console.error("Error saving marriage record:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save marriage record",
      );
    }
  };

  const handleProceedWithIncomplete = async () => {
    if (!pendingFormData) return;

    setShowIncompleteWarning(false);
    await saveRecord(pendingFormData);
    setPendingFormData(null);
  };

  const handleCancelIncomplete = () => {
    setShowIncompleteWarning(false);
    setPendingFormData(null);
    setEmptyFields([]);
    // toast.info("Please fill in the missing fields");
  };

  const onSubmit = async (data: MarriageRecordFormInput) => {
    const foundEmptyFields = checkEmptyFields(data);

    if (foundEmptyFields.length > 0) {
      setEmptyFields(foundEmptyFields);
      setPendingFormData(data);
      setShowIncompleteWarning(true);

      // toast.warning(
      //   `Some field${foundEmptyFields.length > 1 ? "s are" : " is"} missing`,
      //   {
      //     duration: 3000,
      //   },
      // );

      return;
    }

    // If all fields are filled, proceed normally
    await saveRecord(data);
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
    isUploadingSignature,
    setIsUploadingSignature,
    onSubmit,
    handleCancel,
    supportingDocuments,
    isUploadingDoc,
    handleSupportingDocumentsUpload,
    removeSupportingDocument,
    registrarSignature,
    verifierSignature,
    certifyingOfficerSignature,
    isUploadingRegistrarSig,
    isUploadingVerifierSig,
    isUploadingCertifyingOfficerSig,
    handleRegistrarSignatureUpload,
    handleVerifierSignatureUpload,
    handleCertifyingOfficerSignatureUpload,
    removeRegistrarSignature,
    removeVerifierSignature,
    removeCertifyingOfficerSignature,
    showIncompleteWarning,
    handleProceedWithIncomplete,
    handleCancelIncomplete,
    emptyFields,
  };
}
