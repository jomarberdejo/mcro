"use client";

import React from "react";
import { Controller } from "react-hook-form";
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
import { BirthRecordFormInput } from "@/lib/validations/birth-record.schema";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useBirthRecordForm } from "@/hooks/birth-certificate/use-birth-record-form";
import { DuplicateDialog } from "../duplicate-dialog";

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
    supportingDocuments,
    isUploadingDoc,
    handleSupportingDocumentsUpload,
    removeSupportingDocument,
    onSubmit,
    handleCancel,
    showDuplicateDialog,
    duplicateRecords,
    handleProceedWithSave,
    handleViewExisting,
    handleCancelDuplicate,
  } = useBirthRecordForm({ recordId, defaultValues, isEditing });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;
  const isTwinValue = watch("isTwin");

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
            <div className="mb-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
              <div className="flex items-start gap-4">
                <FileImage className="w-8 h-8 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Supporting Documents
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Upload supporting documents such as birth certificates, IDs,
                    or other relevant files. You can upload multiple images at
                    once.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        id="documentsUpload"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
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
                        rules={{ required: "Registry No. is required" }}
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
                                  "border-red-500 focus-visible:ring-red-500",
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      {/* Page No */}
                      <Controller
                        name="pageNo"
                        control={control}
                        rules={{ required: "Page No. is required" }}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="pageNo"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Page No. *
                            </FieldLabel>
                            <Input
                              id="pageNo"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500",
                              )}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      {/* Book No */}
                      <Controller
                        name="bookNo"
                        control={control}
                        rules={{ required: "Book No. is required" }}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="bookNo"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Book No. *
                            </FieldLabel>
                            <Input
                              id="bookNo"
                              {...field}
                              className={cn(
                                "h-11 text-base transition-all",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-500",
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

                    {/* Date of Registration */}
                    <Controller
                      name="dateOfRegistration"
                      control={control}
                      rules={{ required: "Date of Registration is required" }}
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
                            {...field}
                            className={cn(
                              "h-11 text-base transition-all",
                              fieldState.invalid &&
                                "border-red-500 focus-visible:ring-red-500",
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

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Child&apos;s Information
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
                                  "border-red-500 focus-visible:ring-red-500",
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
                                  "border-red-500 focus-visible:ring-red-500",
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
                                  "w-full h-11 text-base",
                                  fieldState.invalid &&
                                    "border-red-500 focus:ring-red-500",
                                )}
                              >
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                              <SelectContent className="w-(--radix-select-trigger-width)">
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
                                  "border-red-500 focus-visible:ring-red-500",
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
                            name="typeOfBirth"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel
                                  htmlFor="typeOfBirth"
                                  className="text-sm font-semibold text-gray-700"
                                >
                                  Type of Birth
                                </FieldLabel>
                                <Input
                                  id="typeOfBirth"
                                  placeholder="e.g., Twin, Triplet"
                                  className={cn(
                                    "h-11 text-base transition-all",
                                    fieldState.invalid &&
                                      "border-red-500 focus-visible:ring-red-500",
                                  )}
                                  {...field}
                                  value={field.value ?? ""}
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Controller
                            name="birthOrder"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel
                                  htmlFor="birthOrder"
                                  className="text-sm font-semibold text-gray-700 mt-4"
                                >
                                  Birth Order
                                </FieldLabel>
                                <Input
                                  id="birthOrder"
                                  placeholder="e.g., 1st, 2nd"
                                  className={cn(
                                    "h-11 text-base transition-all",
                                    fieldState.invalid &&
                                      "border-red-500 focus-visible:ring-red-500",
                                  )}
                                  {...field}
                                  value={field.value ?? ""}
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Controller
                            name="timeOfBirth"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel
                                  htmlFor="timeOfBirth"
                                  className="text-sm font-semibold text-gray-700 mt-4"
                                >
                                  Time of Birth
                                </FieldLabel>
                                <Input
                                  id="timeOfBirth"
                                  placeholder="Enter time of birth"
                                  className={cn(
                                    "h-11 text-base transition-all",
                                    fieldState.invalid &&
                                      "border-red-500 focus-visible:ring-red-500",
                                  )}
                                  {...field}
                                  value={field.value ?? ""}
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
                      Mother&apos;s Information
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
                      Father&apos;s Information
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
                            <p className="text-xs text-gray-500 mb-2">
                              Press Enter twice between paragraphs. Each
                              paragraph will be automatically indented in the
                              PDF.
                            </p>
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
                              placeholder="e.g., upon request, for employment, for travel"
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
                      {/* Registrar */}
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

            <DuplicateDialog
              open={showDuplicateDialog}
              duplicates={duplicateRecords}
              onProceed={handleProceedWithSave}
              onViewExisting={handleViewExisting}
              onCancel={handleCancelDuplicate}
              title="Potential Duplicate Birth Certificate Found"
              renderRecord={(duplicate) => (
                <>
                  <div className="font-medium">
                    {duplicate.childFirstName} {duplicate.childMiddleName}{" "}
                    {duplicate.childLastName}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Registry No: {duplicate.registryNo}</div>
                    <div>
                      Date of Birth:{" "}
                      {new Date(duplicate.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>
                </>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
