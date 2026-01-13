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
import { MarriageRecordFormInput } from "@/lib/validations/marriage-record.schema";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useMarriageRecordForm } from "@/hooks/marriage-certificate/use-marriage-form";

interface MarriageRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<MarriageRecordFormInput>;
  isEditing?: boolean;
}

interface SupportingDocument {
  id: string;
  path: string;
  preview: string;
  name: string;
}

export const MarriageRecordForm: React.FC<MarriageRecordFormProps> = ({
  recordId,
  defaultValues,
  isEditing = false,
}) => {
  const { form, isProcessing, onSubmit, handleCancel } = useMarriageRecordForm({
    recordId,
    defaultValues,
    isEditing,
  });

  const {
    control,
    handleSubmit,
    setValue,
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
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing
                ? "Edit Marriage Registration"
                : "New Marriage Registration"}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="dateOfMarriage"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="dateOfMarriage"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Date of Marriage *
                            </FieldLabel>
                            <Input
                              id="dateOfMarriage"
                              placeholder="e.g., January 15, 2024"
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
                        name="placeOfMarriage"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="placeOfMarriage"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Place of Marriage *
                            </FieldLabel>
                            <Input
                              id="placeOfMarriage"
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
                            placeholder="e.g., January 20, 2024"
                            {...field}
                            className="h-11 text-base transition-all"
                          />
                        </Field>
                      )}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Husband Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="husbandLastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="husbandLastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name *
                            </FieldLabel>
                            <Input
                              id="husbandLastName"
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
                        name="husbandFirstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="husbandFirstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name *
                            </FieldLabel>
                            <Input
                              id="husbandFirstName"
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
                        name="husbandMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="husbandMiddleName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Middle Name
                            </FieldLabel>
                            <Input
                              id="husbandMiddleName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <Controller
                        name="husbandAge"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="husbandAge"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Age *
                            </FieldLabel>
                            <Input
                              id="husbandAge"
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
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
                        name="husbandNationality"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="husbandNationality"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Nationality *
                            </FieldLabel>
                            <Input
                              id="husbandNationality"
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
                        name="husbandCivilStatus"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="husbandCivilStatus"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Civil Status *
                            </FieldLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="husbandCivilStatus"
                                className={cn(
                                  "w-full h-11 text-base",
                                  fieldState.invalid &&
                                    "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="w-(--radix-select-trigger-width)">
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                                <SelectItem value="Divorced">
                                  Divorced
                                </SelectItem>
                                <SelectItem value="Separated">
                                  Separated
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Controller
                        name="husbandFatherName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="husbandFatherName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Father's Name
                            </FieldLabel>
                            <Input
                              id="husbandFatherName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />

                      <Controller
                        name="husbandMotherName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="husbandMotherName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Mother's Name
                            </FieldLabel>
                            <Input
                              id="husbandMotherName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Wife Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="wifeLastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="wifeLastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name *
                            </FieldLabel>
                            <Input
                              id="wifeLastName"
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
                        name="wifeFirstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="wifeFirstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name *
                            </FieldLabel>
                            <Input
                              id="wifeFirstName"
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
                        name="wifeMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="wifeMiddleName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Middle Name
                            </FieldLabel>
                            <Input
                              id="wifeMiddleName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <Controller
                        name="wifeAge"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="wifeAge"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Age *
                            </FieldLabel>
                            <Input
                              id="wifeAge"
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
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
                        name="wifeNationality"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="wifeNationality"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Nationality *
                            </FieldLabel>
                            <Input
                              id="wifeNationality"
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
                        name="wifeCivilStatus"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="wifeCivilStatus"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Civil Status *
                            </FieldLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="wifeCivilStatus"
                                className={cn(
                                  "w-full h-11 text-base",
                                  fieldState.invalid &&
                                    "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="w-(--radix-select-trigger-width)">
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                                <SelectItem value="Divorced">
                                  Divorced
                                </SelectItem>
                                <SelectItem value="Separated">
                                  Separated
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Controller
                        name="wifeFatherName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="wifeFatherName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Father's Name
                            </FieldLabel>
                            <Input
                              id="wifeFatherName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />

                      <Controller
                        name="wifeMotherName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="wifeMotherName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Mother's Name
                            </FieldLabel>
                            <Input
                              id="wifeMotherName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Additional Information
                    </h3>

                    <div className="space-y-4">
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
                            <FieldLabel
                              htmlFor="processFeeInfo"
                              className="text-sm font-semibold text-gray-700"
                            >
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
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Issuance Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="requestorName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="requestorName"
                              className="text-sm font-semibold text-gray-700"
                            >
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
                            <FieldLabel
                              htmlFor="requestPurpose"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Purpose of Request
                            </FieldLabel>
                            <Input
                              id="requestPurpose"
                              placeholder="e.g., upon request, for employment"
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
                      Certification Details
                    </h3>

                    <div className="space-y-4">
                      <Controller
                        name="registrarName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="registrarName"
                              className="text-sm font-semibold text-gray-700"
                            >
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
                              <FieldLabel
                                htmlFor="verifiedBy"
                                className="text-sm font-semibold text-gray-700"
                              >
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
                              <FieldLabel
                                htmlFor="verifierPosition"
                                className="text-sm font-semibold text-gray-700"
                              >
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
                              <FieldLabel
                                htmlFor="certifyingOfficerName"
                                className="text-sm font-semibold text-gray-700"
                              >
                                Certifying Officer Name (Optional)
                              </FieldLabel>
                              <Input
                                id="certifyingOfficerName"
                                placeholder="Name of officer preparing the certificate"
                                className="h-11 text-base transition-all"
                                {...field}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Leave blank if same as MCR
                              </p>
                            </Field>
                          )}
                        />

                        <Controller
                          name="certifyingOfficerPosition"
                          control={control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel
                                htmlFor="certifyingOfficerPosition"
                                className="text-sm font-semibold text-gray-700"
                              >
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
