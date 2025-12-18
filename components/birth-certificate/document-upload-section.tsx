import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileImage, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface DocumentUploadSectionProps {
  documentPreview: string | null;
  isProcessing: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  documentPreview,
  isProcessing,
  onUpload,
  onRemove,
}) => {
  return (
    <div className="mb-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
      <div className="flex items-start gap-4">
        <FileImage className="w-8 h-8 text-blue-600 mt-1" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 mb-2">
            Auto-populate from Document
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            Upload a birth certificate image and AI will automatically extract
            and fill the form fields.
          </p>

          {!documentPreview ? (
            <div className="flex items-center gap-3">
              <Input
                id="documentUpload"
                type="file"
                accept="image/*"
                onChange={onUpload}
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
              <span className="text-sm text-gray-600">PNG, JPG up to 5MB</span>
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
                  onClick={onRemove}
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
  );
};