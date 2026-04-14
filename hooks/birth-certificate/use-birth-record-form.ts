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
import { SignatureDocument } from "../death-certificate/use-death-form";

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
  childFirstName?: string;
  childLastName?: string;
  childMiddleName?: string;
  registryNo: string;
  recordId?: string;
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

  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [supportingDocuments, setSupportingDocuments] = useState<
    SupportingDocument[]
  >([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<BirthRecordFormInput | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

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
      sex: null,
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
      motherAge: "",
      fatherLastName: "",
      fatherFirstName: "",
      fatherMiddleName: "",
      fatherCitizenship: "",
      dateOfMarriage: "",
      placeOfMarriage: "",
      remarks: "",
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

  const dateOfMarriage = form.watch("dateOfMarriage");

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

  useEffect(() => {
    if (
      typeof dateOfMarriage === "string" &&
      dateOfMarriage.trim().toLowerCase() === "not married"
    ) {
      form.setValue("placeOfMarriage", "Not Applicable", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [dateOfMarriage, form]);
  const checkEmptyFields = (data: BirthRecordFormInput): string[] => {
    const emptyFields: string[] = [];

    const requiredFields: { [key: string]: string } = {
      registryNo: "Registry Number",
      bookNo: "Book Number",
      pageNo: "Page Number",
      dateOfRegistration: "Date of Registration",
      childLastName: "Child's Last Name",
      childFirstName: "Child's First Name",
      sex: "Sex",
      dateOfBirth: "Date of Birth",
      placeOfBirth: "Place of Birth",
      motherLastName: "Mother's Last Name",
      motherFirstName: "Mother's First Name",
      fatherLastName: "Father's Last Name",
      fatherFirstName: "Father's First Name",
      registrarName: "Registrar Name",
    };

    Object.entries(requiredFields).forEach(([key, displayName]) => {
      const value = data[key as keyof BirthRecordFormInput];
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

        console.log("Uploaded file result:", previewUrl);

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
      if (doc.preview.startsWith("blob:")) {
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
      console.log("data ===", data);

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

  const handleProceedWithIncomplete = async () => {
    if (!pendingFormData) return;

    setShowIncompleteWarning(false);

    const checkData: BirthCertificateCheckData = {
      childFirstName: pendingFormData.childFirstName,
      childLastName: pendingFormData.childLastName,
      childMiddleName: pendingFormData?.childMiddleName,
      registryNo: pendingFormData?.registryNo,
      recordId: isEditing ? recordId : undefined,
    };

    await handleDuplicateCheck(checkData, pendingFormData, saveRecord);
    setPendingFormData(null);
  };

  const handleCancelIncomplete = () => {
    setShowIncompleteWarning(false);
    setPendingFormData(null);
    setEmptyFields([]);
    // toast.info("Please fill in the missing fields");
  };

  const onSubmit = async (data: BirthRecordFormInput): Promise<void> => {
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
      // );f

      return;
    }

    const checkData: BirthCertificateCheckData = {
      childFirstName: data.childFirstName,
      childLastName: data.childLastName,
      childMiddleName: data?.childMiddleName,
      registryNo: data?.registryNo,
      recordId: isEditing ? recordId : undefined,
    };

    await handleDuplicateCheck(checkData, data, saveRecord);
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
    showDuplicateDialog,
    duplicateRecords,
    handleProceedWithSave: () => handleProceedWithSave(saveRecord),
    handleViewExisting,
    handleCancelDuplicate,
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
