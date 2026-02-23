import { FileImage, Loader2, Upload, X } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { SupportingDocument } from "@/hooks/birth-certificate/use-birth-record-form";

interface DocumentsUploadFormProps {
  supportingDocuments: SupportingDocument[];
  isUploadingDoc: boolean;
  handleSupportingDocumentsUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSupportingDocument: (id: string) => void;
}

const DocumentsUploadForm: React.FC<DocumentsUploadFormProps> = ({
  supportingDocuments,
  isUploadingDoc,
  handleSupportingDocumentsUpload,
  removeSupportingDocument,
}) => {
  return (
    <div className="flex items-start gap-4">
      <FileImage className="w-8 h-8 text-blue-600 mt-1" />
      <div className="flex-1">
        <h4 className="font-semibold text-blue-900 mb-2">
          Supporting Documents
        </h4>
        <p className="text-sm text-blue-700 mb-3">
          Upload supporting documents such as birth certificates, IDs, or other
          relevant files. You can upload multiple images at once.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              id="documentsUpload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,application/pdf"
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
              Images (PNG, JPG) or PDF up to 10MB each
            </span>
          </div>

          {supportingDocuments.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
              {supportingDocuments.map((doc) => {
                const isPDF =
                  doc.mimeType === "application/pdf" ||
                  doc.name.toLowerCase().endsWith(".pdf");

                return (
                  <div
                    key={doc.id}
                    className="relative border rounded-lg p-2 bg-white group hover:shadow-md transition-shadow"
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

                    {isPDF ? (
                      <Link
                        href={doc.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="relative w-full h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center hover:bg-gray-100 hover:border-blue-400 transition-colors cursor-pointer">
                          <span className="text-3xl mb-1">📄</span>
                          <span className="text-xs text-gray-600 font-medium">
                            Click to view PDF
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href={doc.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="relative w-full h-24 bg-gray-100 border rounded overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                          <Image
                            src={doc.preview}
                            alt={doc.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-semibold">
                              View
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}

                    <div className="mt-1">
                      <p className="text-xs text-gray-600 truncate font-medium">
                        {doc.name}
                      </p>
                      {doc.size && (
                        <p className="text-xs text-gray-400">
                          {(doc.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {supportingDocuments.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-700 font-medium bg-green-50 p-2 rounded">
              <span>✓</span>
              <span>
                {supportingDocuments.length} document(s) uploaded
                {supportingDocuments.some(
                  (doc) => doc.mimeType === "application/pdf",
                ) && " (Click to preview)"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsUploadForm;