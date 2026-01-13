"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ArrowLeft, Upload, X, FileImage, Loader2 } from "lucide-react";
import {
  DeathRecordFormInput,
} from "@/lib/validations/death-record.schema";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useDeathRecordForm } from "@/hooks/death-certificate/use-death-form";

interface DeathRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<DeathRecordFormInput>;
  isEditing?: boolean;
}

interface SupportingDocument {
  id: string;
  path: string;
  preview: string;
  name: string;
}

export const DeathRecordForm: React.FC<DeathRecordFormProps> = ({
  recordId,
  defaultValues,
  isEditing = false,
}) => {
  const {
    form,
    signaturePreview,
    setSignaturePreview,
    isUploadingSignature,
    setIsUploadingSignature,
    onSubmit,
    handleCancel,
  } = useDeathRecordForm({ recordId, defaultValues, isEditing });

  const { control, handleSubmit, setValue, watch, formState: { isSubmitting } } = form;

  const { uploadFile, deleteFile } = useFileUpload(
    setValue,
    watch
  );

  const [supportingDocuments, setSupportingDocuments] = useState<SupportingDocument[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const handleSignatureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploadingSignature(true);

    try {
      const currentSignaturePath = watch("signatureImagePath");
      if (currentSignaturePath) {
        await deleteFile(currentSignaturePath);
      }

      const result = await uploadFile(file, "signature");
      setSignaturePreview(result.path);
      setValue("signatureImagePath", result.path);
      toast.success("Signature uploaded successfully");
    } catch (error) {
      console.error("Error uploading signature:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload signature"
      );
    } finally {
      setIsUploadingSignature(false);
    }
  };

  const removeSignature = async () => {
    const currentPath = watch("signatureImagePath");
    if (currentPath) {
      await deleteFile(currentPath);
    }

    setSignaturePreview(null);
    setValue("signatureImagePath", "");
    const fileInput = document.getElementById(
      "signatureUpload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Supporting documents handlers
  const handleSupportingDocumentsUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const invalidFiles = files.filter(
      file => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024
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
      setSupportingDocuments(prev => [...prev, ...uploadedDocs]);
      
      // Update form value with paths
      const allPaths = [...supportingDocuments.map(d => d.path), ...uploadedDocs.map(d => d.path)];
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
      const fileInput = document.getElementById("documentsUpload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const removeSupportingDocument = async (docId: string) => {
    const doc = supportingDocuments.find(d => d.id === docId);
    if (!doc) return;

    try {
      await deleteFile(doc.path);
      URL.revokeObjectURL(doc.preview);
      
      const updatedDocs = supportingDocuments.filter(d => d.id !== docId);
      setSupportingDocuments(updatedDocs);
      setValue("supportingDocuments", updatedDocs.map(d => d.path));
      
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
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Death Registration" : "New Death Registration"}
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
                    Upload supporting documents such as death certificates, IDs, or other relevant files.
                    You can upload multiple images at once.
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
                    <h3 className="font-semibold text-gray-900">Registry Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Controller
                        name="registryNo"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="registryNo" className="text-sm font-semibold text-gray-700">
                              Registry No. *
                            </FieldLabel>
                            <Input
                              id="registryNo"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="pageNo"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel htmlFor="pageNo" className="text-sm font-semibold text-gray-700">
                              Page No.
                            </FieldLabel>
                            <Input id="pageNo" {...field} className="h-11 text-base transition-all" />
                          </Field>
                        )}
                      />

                      <Controller
                        name="bookNo"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel htmlFor="bookNo" className="text-sm font-semibold text-gray-700">
                              Book No.
                            </FieldLabel>
                            <Input id="bookNo" {...field} className="h-11 text-base transition-all" />
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      name="dateOfRegistration"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="dateOfRegistration" className="text-sm font-semibold text-gray-700">
                            Date of Registration *
                          </FieldLabel>
                          <Input
                            id="dateOfRegistration"
                            placeholder="e.g., January 15, 2024"
                            {...field}
                            className={cn(
                              "h-11 text-base transition-all",
                              fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                            )}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">Deceased Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="deceasedLastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="deceasedLastName" className="text-sm font-semibold text-gray-700">
                              Last Name *
                            </FieldLabel>
                            <Input
                              id="deceasedLastName"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="deceasedFirstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="deceasedFirstName" className="text-sm font-semibold text-gray-700">
                              First Name *
                            </FieldLabel>
                            <Input
                              id="deceasedFirstName"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name="deceasedMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel htmlFor="deceasedMiddleName" className="text-sm font-semibold text-gray-700">
                              Middle Name
                            </FieldLabel>
                            <Input id="deceasedMiddleName" {...field} className="h-11 text-base transition-all" />
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <Controller
                        name="sex"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="sex" className="text-sm font-semibold text-gray-700">
                              Sex *
                            </FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger
                                id="sex"
                                className={cn(
                                  "w-full h-11 text-base",
                                  fieldState.invalid && "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                              <SelectContent className="w-(--radix-select-trigger-width)">
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="age"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="age" className="text-sm font-semibold text-gray-700">
                              Age *
                            </FieldLabel>
                            <Input
                              id="age"
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="civilStatus"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="civilStatus" className="text-sm font-semibold text-gray-700">
                              Civil Status *
                            </FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger
                                id="civilStatus"
                                className={cn(
                                  "w-full h-11 text-base",
                                  fieldState.invalid && "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="w-(--radix-select-trigger-width)">
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                                <SelectItem value="Divorced">Divorced</SelectItem>
                                <SelectItem value="Separated">Separated</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="citizenship"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="citizenship" className="text-sm font-semibold text-gray-700">
                              Citizenship *
                            </FieldLabel>
                            <Input
                              id="citizenship"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">Death Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="dateOfDeath"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="dateOfDeath" className="text-sm font-semibold text-gray-700">
                              Date of Death *
                            </FieldLabel>
                            <Input
                              id="dateOfDeath"
                              placeholder="e.g., January 1, 2024"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="placeOfDeath"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="placeOfDeath" className="text-sm font-semibold text-gray-700">
                              Place of Death *
                            </FieldLabel>
                            <Input
                              id="placeOfDeath"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <Controller
                        name="causeOfDeath"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="causeOfDeath" className="text-sm font-semibold text-gray-700">
                              Cause of Death *
                            </FieldLabel>
                            <Textarea
                              id="causeOfDeath"
                              rows={3}
                              placeholder="Enter cause of death"
                              {...field}
                              className={cn(
                                "text-base",
                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">Additional Information</h3>

                    <div className="space-y-4">
                      <Controller
                        name="remarks"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel htmlFor="remarks" className="text-sm font-semibold text-gray-700">
                              Remarks (Optional)
                            </FieldLabel>
                            <Textarea
                              id="remarks"
                              rows={4}
                              placeholder="Enter remarks here..."
                              className="text-base"
                              {...field}
                            />
                          </Field>
                        )}
                      />

                      <Controller
                        name="processFeeInfo"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel htmlFor="processFeeInfo" className="text-sm font-semibold text-gray-700">
                              Registration Fee Details (Optional)
                            </FieldLabel>
                            <Textarea
                              id="processFeeInfo"
                              rows={3}
                              placeholder="e.g., Registration fee paid: PHP 150.00, OR No. 12345"
                              className="text-base"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">Issuance Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="requestorName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel htmlFor="requestorName" className="text-sm font-semibold text-gray-700">
                              Issued To (Requestor Name)
                            </FieldLabel>
                            <Input
                              id="requestorName"
                              placeholder="e.g., Juan Dela Cruz"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />

                      <Controller
                        name="requestPurpose"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel htmlFor="requestPurpose" className="text-sm font-semibold text-gray-700">
                              Purpose of Request
                            </FieldLabel>
                            <Input
                              id="requestPurpose"
                              placeholder="e.g., upon request, for legal purposes"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">Certification Details</h3>

                    <div className="space-y-4">
                      <Controller
                        name="registrarName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel htmlFor="registrarName" className="text-sm font-semibold text-gray-700">
                              Municipal Civil Registrar Name
                            </FieldLabel>
                            <Input
                              id="registrarName"
                              placeholder="e.g., DARRYL U. MONTEALEGRE, MM"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                          name="verifiedBy"
                          control={control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel htmlFor="verifiedBy" className="text-sm font-semibold text-gray-700">
                                Verified By
                              </FieldLabel>
                              <Input
                                id="verifiedBy"
                                placeholder="Name of verifying officer"
                                className="h-11 text-base transition-all"
                                {...field}
                              />
                            </Field>
                          )}
                        />

                        <Controller
                          name="verifierPosition"
                          control={control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel htmlFor="verifierPosition" className="text-sm font-semibold text-gray-700">
                                Verifier Position
                              </FieldLabel>
                              <Input
                                id="verifierPosition"
                                placeholder="e.g., Registration Officer II"
                                className="h-11 text-base transition-all"
                                {...field}
                              />
                            </Field>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                          name="certifyingOfficerName"
                          control={control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel htmlFor="certifyingOfficerName" className="text-sm font-semibold text-gray-700">
                                Certifying Officer Name (Optional)
                              </FieldLabel>
                              <Input
                                id="certifyingOfficerName"
                                placeholder="Name of officer preparing the certificate"
                                className="h-11 text-base transition-all"
                                {...field}
                              />
                              <p className="text-xs text-gray-500 mt-1">Leave blank if same as MCR</p>
                            </Field>
                          )}
                        />

                        <Controller
                          name="certifyingOfficerPosition"
                          control={control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel htmlFor="certifyingOfficerPosition" className="text-sm font-semibold text-gray-700">
                                Certifying Officer Position (Optional)
                              </FieldLabel>
                              <Input
                                id="certifyingOfficerPosition"
                                placeholder="e.g., Registration Officer I"
                                className="h-11 text-base transition-all"
                                {...field}
                              />
                            </Field>
                          )}
                        />
                      </div>

                      <div>
                        <FieldLabel className="mb-2 block text-sm font-semibold text-gray-700">
                          Signature Image (Optional)
                        </FieldLabel>

                        <div className="space-y-3">
                          {!signaturePreview ? (
                            <div className="flex items-center gap-3">
                              <Input
                                id="signatureUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleSignatureUpload}
                                className="hidden"
                                disabled={isUploadingSignature}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("signatureUpload")?.click()}
                                disabled={isUploadingSignature}
                              >
                                {isUploadingSignature ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Signature
                                  </>
                                )}
                              </Button>
                              <span className="text-sm text-gray-500">
                                PNG, JPG up to 2MB (transparent background recommended)
                              </span>
                            </div>
                          ) : (
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-start justify-between mb-2">
                                <FieldLabel className="text-sm font-medium">Signature Preview</FieldLabel>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeSignature}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="relative w-full max-w-xs h-24 bg-white border rounded flex items-center justify-center">
                                <Image
                                  src={signaturePreview}
                                  alt="Signature preview"
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="h-12 flex-1 text-base font-semibold"
                      disabled={isSubmitting || isUploadingDoc}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isEditing ? "Updating..." : "Saving..."}
                        </span>
                      ) : (
                        <>{isEditing ? "Update Record" : "Save Record"}</>
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