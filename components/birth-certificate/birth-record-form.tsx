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
  birthRecordSchema,
  BirthRecordFormData,
  BirthRecordFormInput,
} from "@/lib/validations/birth-record.schema";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useBirthRecordForm } from "@/hooks/use-birth-record-form";

interface BirthRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<BirthRecordFormInput>;
  isEditing?: boolean;
}

export const BirthRecordForm: React.FC<BirthRecordFormProps> = ({
  recordId,
  defaultValues,
  isEditing = false,
}) => {
const {
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
  } = useBirthRecordForm({ recordId, defaultValues, isEditing });

  const { control, handleSubmit, setValue, watch, formState: { isSubmitting } } = form;

  const { uploadFile, deleteFile, extractDataFromFile } = useFileUpload(
    setValue,
    watch
  );

  const isTwinValue = watch("isTwin");

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

  // Document upload handlers
  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsProcessing(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      setDocumentPreview(previewUrl);
      await extractDataFromFile(file);
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process document"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const removeDocument = () => {
    if (documentPreview) {
      URL.revokeObjectURL(documentPreview);
    }
    setDocumentPreview(null);
    const fileInput = document.getElementById(
      "documentUpload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
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
              {isEditing ? "Edit Birth Registration" : "New Birth Registration"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {!isEditing && (
              <div className="mb-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                <div className="flex items-start gap-4">
                  <FileImage className="w-8 h-8 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Auto-populate from Document
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Upload a birth certificate image and AI will automatically
                      extract and fill the form fields.
                    </p>

                    {!documentPreview ? (
                      <div className="flex items-center gap-3">
                        <Input
                          id="documentUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleDocumentUpload}
                          className="hidden"
                          disabled={isProcessing}
                        />
                        <Button
                          type="button"
                          variant="default"
                          onClick={() =>
                            document.getElementById("documentUpload")?.click()
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Birth Certificate
                            </>
                          )}
                        </Button>
                        <span className="text-sm text-gray-600">
                          PNG, JPG up to 5MB
                        </span>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-3 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-green-700">
                            ✓ Document uploaded and processed
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeDocument}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="relative w-full h-32 bg-gray-100 border rounded overflow-hidden">
                          <Image
                            src={documentPreview}
                            alt="Document preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
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
                            className={cn(
                              "h-11 text-base transition-all",
                              fieldState.invalid &&
                                "border-red-500 focus-visible:ring-red-500"
                            )}
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="dateOfRegistration"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel
                            htmlFor="dateOfRegistration"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Date of Registration *
                          </FieldLabel>
                          <Input
                            id="dateOfRegistration"
                            placeholder="e.g., January 15, 2024"
                            className={cn(
                              "h-11 text-base transition-all",
                              fieldState.invalid &&
                                "border-red-500 focus-visible:ring-red-500"
                            )}
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Child Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="childLastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="childLastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name *
                            </FieldLabel>
                            <Input
                              id="childLastName"
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              {...field}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="childFirstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="childFirstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name *
                            </FieldLabel>
                            <Input
                              id="childFirstName"
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              {...field}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="childMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="childMiddleName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Middle Name
                            </FieldLabel>
                            <Input
                              id="childMiddleName"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <Controller
                        name="sex"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="sex"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Sex *
                            </FieldLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="sex"
                                className={cn(
                                  "h-11 text-base",
                                  fieldState.invalid &&
                                    "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="dateOfBirth"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Date of Birth *
                            </FieldLabel>
                            <Input
                              id="dateOfBirth"
                              placeholder="e.g., January 1, 2024"
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500"
                              )}
                              {...field}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="placeOfBirth"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="placeOfBirth"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Place of Birth
                            </FieldLabel>
                            <Input
                              id="placeOfBirth"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <Controller
                        name="isTwin"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="isTwin"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                            <FieldLabel
                              htmlFor="isTwin"
                              className="cursor-pointer text-sm font-medium text-gray-700"
                            >
                              This is a twin/multiple birth
                            </FieldLabel>
                          </div>
                        )}
                      />
                      {isTwinValue && (
                        <div className="ml-6 mt-3">
                          <Controller
                            name="birthOrder"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel
                                  htmlFor="birthOrder"
                                  className="text-sm font-semibold text-gray-700"
                                >
                                  Birth Order
                                </FieldLabel>
                                <Input
                                  id="birthOrder"
                                  placeholder="e.g., First, Second, Twin A"
                                  className={cn(
                                    "h-11 text-base transition-all",
                                    fieldState.invalid &&
                                      "border-red-500 focus-visible:ring-red-500"
                                  )}
                                  {...field}
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Mother Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="motherLastName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="motherLastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name
                            </FieldLabel>
                            <Input
                              id="motherLastName"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                      <Controller
                        name="motherFirstName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="motherFirstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name
                            </FieldLabel>
                            <Input
                              id="motherFirstName"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                      <Controller
                        name="motherMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="motherMiddleName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Middle Name
                            </FieldLabel>
                            <Input
                              id="motherMiddleName"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>
                    <div className="mt-4">
                      <Controller
                        name="motherCitizenship"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="motherCitizenship"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Citizenship
                            </FieldLabel>
                            <Input
                              id="motherCitizenship"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Father Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="fatherLastName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="fatherLastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name
                            </FieldLabel>
                            <Input
                              id="fatherLastName"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                      <Controller
                        name="fatherFirstName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="fatherFirstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name
                            </FieldLabel>
                            <Input
                              id="fatherFirstName"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                      <Controller
                        name="fatherMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="fatherMiddleName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Middle Name
                            </FieldLabel>
                            <Input
                              id="fatherMiddleName"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>
                    <div className="mt-4">
                      <Controller
                        name="fatherCitizenship"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="fatherCitizenship"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Citizenship
                            </FieldLabel>
                            <Input
                              id="fatherCitizenship"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Marriage Information (Optional)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="dateOfMarriage"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="dateOfMarriage"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Date of Marriage
                            </FieldLabel>
                            <Input
                              id="dateOfMarriage"
                              placeholder="e.g., June 12, 2020"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                      <Controller
                        name="placeOfMarriage"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="placeOfMarriage"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Place of Marriage
                            </FieldLabel>
                            <Input
                              id="placeOfMarriage"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-5">
                      <Controller
                        name="remarks"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="remarks"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Remarks (Optional)
                            </FieldLabel>
                            <Textarea
                              id="remarks"
                              rows={4}
                              className="text-base whitespace-pre-wrap font-mono"
                              {...field}
                            />
                          </Field>
                        )}
                      />
                      <Controller
                        name="registrarName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="registrarName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Registrar Name
                            </FieldLabel>
                            <Input
                              id="registrarName"
                              className="h-11 text-base transition-all"
                              {...field}
                            />
                          </Field>
                        )}
                      />

                      <div>
                        <FieldLabel className="mb-2 block text-sm font-semibold text-gray-700">
                          Registrar Signature (Optional)
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
                                onClick={() =>
                                  document
                                    .getElementById("signatureUpload")
                                    ?.click()
                                }
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
                                PNG, JPG up to 2MB
                              </span>
                            </div>
                          ) : (
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-start justify-between mb-2">
                                <FieldLabel className="text-sm font-medium">
                                  Signature Preview
                                </FieldLabel>
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
                      disabled={isSubmitting || isProcessing}
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
