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
import { DeathRecordFormInput } from "@/lib/validations/death-record.schema";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDeathRecordForm } from "@/hooks/death-certificate/use-death-form";
import { DuplicateDialog } from "../duplicate-dialog";
import { IncompleteFieldsDialog } from "../incomplete-fields-dialog";
import DocumentsUploadForm from "../documents-upload";

interface DeathRecordFormProps {
  recordId?: string;
  defaultValues?: Partial<DeathRecordFormInput>;
  isEditing?: boolean;
}

export const DeathRecordForm: React.FC<DeathRecordFormProps> = ({
  recordId,
  defaultValues,
  isEditing = false,
}) => {
  const {
    form,
    onSubmit,
    handleCancel,
    supportingDocuments,
    isUploadingDoc,
    handleSupportingDocumentsUpload,
    removeSupportingDocument,
    showDuplicateDialog,
    duplicateRecords,
    handleProceedWithSave,
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
  } = useDeathRecordForm({
    recordId,
    defaultValues,
    isEditing,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

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
            <div className="mb-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
               <DocumentsUploadForm 
                handleSupportingDocumentsUpload={handleSupportingDocumentsUpload}
                supportingDocuments={supportingDocuments}
                isUploadingDoc={isUploadingDoc}
                removeSupportingDocument={removeSupportingDocument}
              />
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

                    <Controller
                      name="certificateDate"
                      control={control}
                      rules={{ required: "Certificate date is required" }}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel
                            htmlFor="certificateDate"
                            className="text-sm font-semibold text-gray-700"
                          >
                            Certificate Date *
                          </FieldLabel>
                          <Input
                            id="certificateDate"
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
                      Deceased Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Controller
                        name="deceasedLastName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="deceasedLastName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Last Name *
                            </FieldLabel>
                            <Input
                              id="deceasedLastName"
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
                      <Controller
                        name="deceasedFirstName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="deceasedFirstName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              First Name *
                            </FieldLabel>
                            <Input
                              id="deceasedFirstName"
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
                      <Controller
                        name="deceasedMiddleName"
                        control={control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="deceasedMiddleName"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Middle Name
                            </FieldLabel>
                            <Input
                              id="deceasedMiddleName"
                              {...field}
                              className="h-11 text-base transition-all"
                            />
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
                            <FieldLabel
                              htmlFor="sex"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Sex
                            </FieldLabel>

                            <Select
                              onValueChange={(value) =>
                                field.onChange(value === "none" ? null : value)
                              }
                              value={field.value ?? "none"}
                            >
                              <SelectTrigger
                                id="sex"
                                className={cn(
                                  "w-full h-11 text-base",
                                  fieldState.invalid &&
                                    "border-red-500 focus:ring-red-500",
                                )}
                              >
                                <SelectValue placeholder="Select sex (optional)" />
                              </SelectTrigger>

                              <SelectContent className="w-(--radix-select-trigger-width)">
                                <SelectItem value="none">— None —</SelectItem>
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
                        name="age"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="age"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Age 
                            </FieldLabel>
                            <Input
                              id="age"
                              type="number"
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

                      <Controller
                        name="civilStatus"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="civilStatus"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Civil Status
                            </FieldLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(value === "none" ? null : value)
                              }
                              value={field.value ?? "none"}
                            >
                              <SelectTrigger
                                id="civilStatus"
                                className={cn(
                                  "w-full h-11 text-base",
                                  fieldState.invalid &&
                                    "border-red-500 focus:ring-red-500",
                                )}
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="w-(--radix-select-trigger-width)">
                                <SelectItem value="none">— None —</SelectItem>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                                <SelectItem value="Divorced">
                                  Divorced
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="citizenship"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="citizenship"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Citizenship 
                            </FieldLabel>
                            <Input
                              id="citizenship"
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
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-900">
                      Death Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="dateOfDeath"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="dateOfDeath"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Date of Death
                            </FieldLabel>
                            <Input
                              id="dateOfDeath"
                              placeholder="e.g., January 1, 2024"
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

                      <Controller
                        name="placeOfDeath"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="placeOfDeath"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Place of Death 
                            </FieldLabel>
                            <Input
                              id="placeOfDeath"
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

                    <div className="mt-4">
                      <Controller
                        name="causeOfDeath"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel
                              htmlFor="causeOfDeath"
                              className="text-sm font-semibold text-gray-700"
                            >
                              Cause of Death 
                            </FieldLabel>
                            <Textarea
                              id="causeOfDeath"
                              rows={3}
                              placeholder="Enter cause of death"
                              {...field}
                              className={cn(
                                "text-base",
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

                      {/* Registrar Signature Upload */}
                      <Field>
                        <FieldLabel className="text-sm font-semibold text-gray-700">
                          Registrar Signature (Optional)
                        </FieldLabel>
                        <div className="flex items-center gap-3">
                          <Input
                            id="registrarSignatureUpload"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleRegistrarSignatureUpload}
                            className="hidden"
                            disabled={isUploadingRegistrarSig}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("registrarSignatureUpload")
                                ?.click()
                            }
                            disabled={isUploadingRegistrarSig}
                          >
                            {isUploadingRegistrarSig ? (
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
                          {registrarSignature && (
                            <div className="flex items-center gap-2">
                              <div className="relative w-32 h-16 border rounded bg-white">
                                <Image
                                  src={registrarSignature.preview}
                                  alt="Registrar signature"
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeRegistrarSignature}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </Field>

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

                      {/* Verifier Signature Upload */}
                      <Field>
                        <FieldLabel className="text-sm font-semibold text-gray-700">
                          Verifier Signature (Optional)
                        </FieldLabel>
                        <div className="flex items-center gap-3">
                          <Input
                            id="verifierSignatureUpload"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleVerifierSignatureUpload}
                            className="hidden"
                            disabled={isUploadingVerifierSig}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("verifierSignatureUpload")
                                ?.click()
                            }
                            disabled={isUploadingVerifierSig}
                          >
                            {isUploadingVerifierSig ? (
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
                          {verifierSignature && (
                            <div className="flex items-center gap-2">
                              <div className="relative w-32 h-16 border rounded bg-white">
                                <Image
                                  src={verifierSignature.preview}
                                  alt="Verifier signature"
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeVerifierSignature}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </Field>

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

                      {/* Certifying Officer Signature Upload */}
                      <Field>
                        <FieldLabel className="text-sm font-semibold text-gray-700">
                          Certifying Officer Signature (Optional)
                        </FieldLabel>
                        <div className="flex items-center gap-3">
                          <Input
                            id="certifyingOfficerSignatureUpload"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleCertifyingOfficerSignatureUpload}
                            className="hidden"
                            disabled={isUploadingCertifyingOfficerSig}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById(
                                  "certifyingOfficerSignatureUpload",
                                )
                                ?.click()
                            }
                            disabled={isUploadingCertifyingOfficerSig}
                          >
                            {isUploadingCertifyingOfficerSig ? (
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
                          {certifyingOfficerSignature && (
                            <div className="flex items-center gap-2">
                              <div className="relative w-32 h-16 border rounded bg-white">
                                <Image
                                  src={certifyingOfficerSignature.preview}
                                  alt="Certifying officer signature"
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeCertifyingOfficerSignature}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </Field>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="h-12 flex-1 text-base font-semibold"
                      disabled={
                        isSubmitting ||
                        isUploadingDoc ||
                        isUploadingRegistrarSig ||
                        isUploadingVerifierSig ||
                        isUploadingCertifyingOfficerSig
                      }
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
                    {duplicate.deceasedFirstName} {duplicate.deceasedMiddleName}{" "}
                    {duplicate.deceasedLastName}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Registry No: {duplicate.registryNo}</div>
                    <div>Date of Death: {duplicate.dateOfDeath}</div>
                  </div>
                </>
              )}
            />

            <IncompleteFieldsDialog
              open={showIncompleteWarning}
              emptyFields={emptyFields}
              onProceed={handleProceedWithIncomplete}
              onCancel={handleCancelIncomplete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
