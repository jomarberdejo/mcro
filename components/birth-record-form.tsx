// BirthRecordForm.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, X } from "lucide-react";
import { BirthRecord } from "@/types";
import Image from "next/image";

type OnChangeHandler = (
  name: keyof BirthRecord
) => (
  value:
    | string
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | boolean
) => void;

interface BirthRecordFormProps {
  formData: BirthRecord;
  isEditing: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: OnChangeHandler;
}

export const BirthRecordForm: React.FC<BirthRecordFormProps> = ({
  formData,
  isEditing,
  onBack,
  onSubmit,
  onCancel,
  onChange,
}) => {
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    formData.signatureImage || null
  );

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSignaturePreview(base64String);
        onChange("signatureImage")(base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading signature:", error);
      alert("Failed to upload signature");
    }
  };

  const removeSignature = () => {
    setSignaturePreview(null);
    onChange("signatureImage")("");
    // Reset file input
    const fileInput = document.getElementById("signatureUpload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" onClick={onBack}>
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
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Registry Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1" htmlFor="registryNo">
                    Registry No.
                  </Label>
                  <Input
                    id="registryNo"
                    value={formData.registryNo}
                    onChange={(e) => onChange("registryNo")(e)}
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="dateOfRegistration">
                    Date of Registration
                  </Label>
                  <Input
                    id="dateOfRegistration"
                    value={formData.dateOfRegistration}
                    onChange={(e) => onChange("dateOfRegistration")(e)}
                    placeholder="e.g., January 15, 2024"
                  />
                </div>
              </div>

              {/* Child Information */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Child Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-1" htmlFor="childLastName">
                      Last Name *
                    </Label>
                    <Input
                      id="childLastName"
                      value={formData.childLastName}
                      onChange={(e) => onChange("childLastName")(e)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="childFirstName">
                      First Name *
                    </Label>
                    <Input
                      id="childFirstName"
                      value={formData.childFirstName}
                      onChange={(e) => onChange("childFirstName")(e)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="childMiddleName">
                      Middle Name
                    </Label>
                    <Input
                      id="childMiddleName"
                      value={formData.childMiddleName}
                      onChange={(e) => onChange("childMiddleName")(e)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label className="mb-1" htmlFor="sex">
                      Sex *
                    </Label>
                    <Select
                      value={formData.sex}
                      onValueChange={(val) => onChange("sex")(val)}
                    >
                      <SelectTrigger id="sex">
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="dateOfBirth">
                      Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={(e) => onChange("dateOfBirth")(e)}
                      placeholder="e.g., January 1, 2024"
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="placeOfBirth">
                      Place of Birth
                    </Label>
                    <Input
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={(e) => onChange("placeOfBirth")(e)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="isTwin"
                      checked={formData.isTwin}
                      onChange={(e) => onChange("isTwin")(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label className="cursor-pointer" htmlFor="isTwin">
                      This is a twin/multiple birth
                    </Label>
                  </div>
                  {formData.isTwin && (
                    <div className="ml-6">
                      <Label className="mb-1" htmlFor="birthOrder">
                        Birth Order
                      </Label>
                      <Input
                        id="birthOrder"
                        value={formData.birthOrder}
                        onChange={(e) => onChange("birthOrder")(e)}
                        placeholder="e.g., First, Second, Twin A, Twin B"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Mother Information */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Mother Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-1" htmlFor="motherLastName">
                      Last Name
                    </Label>
                    <Input
                      id="motherLastName"
                      value={formData.motherLastName}
                      onChange={(e) => onChange("motherLastName")(e)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="motherFirstName">
                      First Name
                    </Label>
                    <Input
                      id="motherFirstName"
                      value={formData.motherFirstName}
                      onChange={(e) => onChange("motherFirstName")(e)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="motherMiddleName">
                      Middle Name
                    </Label>
                    <Input
                      id="motherMiddleName"
                      value={formData.motherMiddleName}
                      onChange={(e) => onChange("motherMiddleName")(e)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="mb-1" htmlFor="motherCitizenship">
                    Citizenship
                  </Label>
                  <Input
                    id="motherCitizenship"
                    value={formData.motherCitizenship}
                    onChange={(e) => onChange("motherCitizenship")(e)}
                  />
                </div>
              </div>

              {/* Father Information */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Father Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-1" htmlFor="fatherLastName">
                      Last Name
                    </Label>
                    <Input
                      id="fatherLastName"
                      value={formData.fatherLastName}
                      onChange={(e) => onChange("fatherLastName")(e)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="fatherFirstName">
                      First Name
                    </Label>
                    <Input
                      id="fatherFirstName"
                      value={formData.fatherFirstName}
                      onChange={(e) => onChange("fatherFirstName")(e)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="fatherMiddleName">
                      Middle Name
                    </Label>
                    <Input
                      id="fatherMiddleName"
                      value={formData.fatherMiddleName}
                      onChange={(e) => onChange("fatherMiddleName")(e)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="mb-1" htmlFor="fatherCitizenship">
                    Citizenship
                  </Label>
                  <Input
                    id="fatherCitizenship"
                    value={formData.fatherCitizenship}
                    onChange={(e) => onChange("fatherCitizenship")(e)}
                  />
                </div>
              </div>

              {/* Marriage Information */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">
                  Marriage Information (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1" htmlFor="dateOfMarriage">
                      Date of Marriage
                    </Label>
                    <Input
                      id="dateOfMarriage"
                      value={formData.dateOfMarriage}
                      onChange={(e) => onChange("dateOfMarriage")(e)}
                      placeholder="e.g., June 12, 2020"
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="placeOfMarriage">
                      Place of Marriage
                    </Label>
                    <Input
                      id="placeOfMarriage"
                      value={formData.placeOfMarriage}
                      onChange={(e) => onChange("placeOfMarriage")(e)}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t pt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1" htmlFor="remarks">
                      Remarks (Optional)
                    </Label>
                    <Textarea
                      id="remarks"
                      value={formData.remarks}
                      onChange={(e) => onChange("remarks")(e)}
                      rows={4}
                      className="whitespace-pre-wrap font-mono"
                    />
                  </div>
                  <div>
                    <Label className="mb-1" htmlFor="registrarName">
                      Registrar Name
                    </Label>
                    <Input
                      id="registrarName"
                      value={formData.registrarName}
                      onChange={(e) => onChange("registrarName")(e)}
                    />
                  </div>

                  {/* Signature Upload Section */}
                  <div>
                    <Label className="mb-2 block" htmlFor="signatureUpload">
                      Registrar Signature (Optional)
                    </Label>
                    <div className="space-y-3">
                      {!signaturePreview ? (
                        <div className="flex items-center gap-3">
                          <Input
                            id="signatureUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("signatureUpload")?.click()
                            }
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Signature
                          </Button>
                          <span className="text-sm text-gray-500">
                            PNG, JPG up to 2MB
                          </span>
                        </div>
                      ) : (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <Label className="text-sm font-medium">
                              Signature Preview
                            </Label>
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
                <Button type="submit" className="flex-1">
                  {isEditing ? "Update Record" : "Save Record"}
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};