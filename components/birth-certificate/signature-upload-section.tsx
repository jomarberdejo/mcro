import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface SignatureUploadSectionProps {
  signaturePreview: string | null;
  isUploadingSignature: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const SignatureUploadSection: React.FC<SignatureUploadSectionProps> = ({
  signaturePreview,
  isUploadingSignature,
  onUpload,
  onRemove,
}) => {
  return (
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
              onChange={onUpload}
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
            <span className="text-sm text-gray-500">PNG, JPG up to 2MB</span>
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
                onClick={onRemove}
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
  );
};