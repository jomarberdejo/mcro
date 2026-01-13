"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ArrowLeft, Upload, X, FileImage, Loader2 } from "lucide-react";
import { MarriageCertificateApplicationFormInput } from "@/lib/validations/marriage-cert-app.schema";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useMarriageCertificateApplicationForm } from "@/hooks/marriage-cert-app/use-marriage-cert-app-form";

interface MarriageCertificateApplicationFormProps {
  applicationId?: string;
  defaultValues?: Partial<MarriageCertificateApplicationFormInput>;
  isEditing?: boolean;
}


interface SupportingDocument {
  id: string;
  path: string;
  preview: string;
  name: string;
}


export const MarriageCertificateApplicationForm: React.FC<
  MarriageCertificateApplicationFormProps
> = ({ applicationId, defaultValues, isEditing = false }) => {
  const {
    form,
    documentPreview,
    setDocumentPreview,
    isProcessing,
    setIsProcessing,
    onSubmit,
    handleCancel,
  } = useMarriageCertificateApplicationForm({
    applicationId,
    defaultValues,
    isEditing,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;

  


  const { uploadFile, deleteFile } = useFileUpload();
  
    const [supportingDocuments, setSupportingDocuments] = useState<
      SupportingDocument[]
    >([]);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);



   // Supporting documents handlers
    const handleSupportingDocumentsUpload = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
  
      // Validate files
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
          };
        });
  
        const uploadedDocs = await Promise.all(uploadPromises);
        setSupportingDocuments((prev) => [...prev, ...uploadedDocs]);
  
        // Update form value with paths
        const allPaths = [
          ...supportingDocuments.map((d) => d.path),
          ...uploadedDocs.map((d) => d.path),
        ];
        setValue("supportingDocuments", allPaths);
  
        toast.success(`${uploadedDocs.length} document(s) uploaded successfully`);
      } catch (error) {
        console.error("Error uploading documents:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to upload documents"
        );
      } finally {
        setIsUploadingDoc(false);
        // Reset file input
        const fileInput = document.getElementById(
          "documentsUpload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    };
  
    const removeSupportingDocument = async (docId: string) => {
      const doc = supportingDocuments.find((d) => d.id === docId);
      if (!doc) return;
  
      try {
        await deleteFile(doc.path);
        URL.revokeObjectURL(doc.preview);
  
        const updatedDocs = supportingDocuments.filter((d) => d.id !== docId);
        setSupportingDocuments(updatedDocs);
        setValue(
          "supportingDocuments",
          updatedDocs.map((d) => d.path)
        );
  
        toast.success("Document removed");
      } catch (error) {
        console.error("Error removing document:", error);
        toast.error("Failed to remove document");
      }
    };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing
                ? "Edit Marriage Certificate Application"
                : "New Marriage Certificate Application"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Supporting Documents Section */}
            <div className="mb-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
              <div className="flex items-start gap-4">
                <FileImage className="w-8 h-8 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Supporting Documents
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Upload supporting documents such as death certificates, IDs,
                    or other relevant files. You can upload multiple images at
                    once.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        id="documentsUpload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSupportingDocumentsUpload}
                        className="hidden"
                        disabled={isUploadingDoc}
                      />
                      <Button
                        type="button"
                        variant="default"
                        onClick={() =>
                          document.getElementById("documentsUpload")?.click()
                        }
                        disabled={isUploadingDoc}
                      >
                        {isUploadingDoc ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Documents
                          </>
                        )}
                      </Button>
                      <span className="text-sm text-gray-600">
                        PNG, JPG up to 5MB each
                      </span>
                    </div>

                    {/* Documents Preview Grid */}
                    {supportingDocuments.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                        {supportingDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="relative border rounded-lg p-2 bg-white group"
                          >
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeSupportingDocument(doc.id)}
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <div className="relative w-full h-24 bg-gray-100 border rounded overflow-hidden">
                              <Image
                                src={doc.preview}
                                alt={doc.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {doc.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {supportingDocuments.length > 0 && (
                      <p className="text-sm text-green-700 font-medium">
                        ✓ {supportingDocuments.length} document(s) uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                <div className="space-y-5">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      Registry Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Controller
                        name="registryNo"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="registryNo"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Registry No. *
                            </FieldLabel>
                            <Input
                              id="registryNo"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="pageNo"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="pageNo"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Page No.
                            </FieldLabel>
                            <Input
                              id="pageNo"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />

                      <Controller
                        name="bookNo"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="bookNo"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Book No.
                            </FieldLabel>
                            <Input
                              id="bookNo"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      name="dateOfRegistration"
                      control={control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel
                            htmlFor="dateOfRegistration"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Date of Registration
                          </FieldLabel>
                          <Input
                            id="dateOfRegistration"
                            placeholder="e.g., January 15, 2024"
                            {...field}
                            className="h-11 text-base transition-all"
                          />
                        </Field>
                      )}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Groom Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="groomLastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="groomLastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name *
                            </FieldLabel>
                            <Input
                              id="groomLastName"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="groomFirstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="groomFirstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name *
                            </FieldLabel>
                            <Input
                              id="groomFirstName"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="groomMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="groomMiddleName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Middle Name
                            </FieldLabel>
                            <Input
                              id="groomMiddleName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <Controller
                        name="groomDateOfBirth"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="groomDateOfBirth"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Date of Birth *
                            </FieldLabel>
                            <Input
                              id="groomDateOfBirth"
                              placeholder="e.g., January 1, 1990"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Bride Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="brideLastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="brideLastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name *
                            </FieldLabel>
                            <Input
                              id="brideLastName"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="brideFirstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="brideFirstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name *
                            </FieldLabel>
                            <Input
                              id="brideFirstName"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="brideMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="brideMiddleName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Middle Name
                            </FieldLabel>
                            <Input
                              id="brideMiddleName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <Controller
                        name="brideDateOfBirth"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="brideDateOfBirth"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Date of Birth *
                            </FieldLabel>
                            <Input
                              id="brideDateOfBirth"
                              placeholder="e.g., January 1, 1992"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="h-12 flex-1 text-base font-semibold"
                      disabled={isSubmitting || isProcessing}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isEditing ? "Updating..." : "Submitting..."}
                        </span>
                      ) : (
                        <>
                          {isEditing
                            ? "Update Application"
                            : "Submit Application"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="h-12"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
