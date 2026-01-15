"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit2, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  PDFDownloadLink,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { MarriageCertificateApplication, SupportingDocument } from "@/lib/generated/prisma/client";

interface MarriageCertificateApplicationWithDocuments extends MarriageCertificateApplication {
  supportingDocuments?: SupportingDocument[];
}

interface SupportingDocumentsPDFProps {
  application: MarriageCertificateApplicationWithDocuments;
  pageSize?: "A4" | "LEGAL" | "LETTER";
}

// PDF Styles for supporting documents
const documentStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #333',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  documentInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 120,
  },
  infoValue: {
    fontSize: 10,
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    minHeight: 0, // Prevent overflow
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  noDocumentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDocumentsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: '#666',
  },
});

const SupportingDocumentsPDF: React.FC<SupportingDocumentsPDFProps> = ({ 
  application, 
  pageSize = "A4" 
}) => {
  const documents = application.supportingDocuments || [];

  // If no documents, show a message
  if (documents.length === 0) {
    return (
      <Document>
        <Page size={pageSize} style={documentStyles.page}>
          <View style={documentStyles.header}>
            <Text style={documentStyles.headerText}>
              Supporting Documents
            </Text>
            <Text style={documentStyles.subHeaderText}>
              Registry No: {application.registryNo}
            </Text>
          </View>
          <View style={documentStyles.noDocumentsContainer}>
            <Text style={documentStyles.noDocumentsText}>
              No supporting documents attached to this application.
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {documents.map((doc, index) => (
        <Page key={doc.id} size={pageSize} style={documentStyles.page}>
          {/* Header */}
          <View style={documentStyles.header}>
            <Text style={documentStyles.headerText}>
              Supporting Document {index + 1} of {documents.length}
            </Text>
            <Text style={documentStyles.subHeaderText}>
              Registry No: {application.registryNo}
            </Text>
          </View>

          {/* Document Information */}
          <View style={documentStyles.documentInfo}>
            <View style={documentStyles.infoRow}>
              <Text style={documentStyles.infoLabel}>File Name:</Text>
              <Text style={documentStyles.infoValue}>{doc.fileName}</Text>
            </View>

            {doc.fileSize && (
              <View style={documentStyles.infoRow}>
                <Text style={documentStyles.infoLabel}>File Size:</Text>
                <Text style={documentStyles.infoValue}>
                  {(doc.fileSize / 1024).toFixed(2)} KB
                </Text>
              </View>
            )}

            {doc.mimeType && (
              <View style={documentStyles.infoRow}>
                <Text style={documentStyles.infoLabel}>Type:</Text>
                <Text style={documentStyles.infoValue}>{doc.mimeType}</Text>
              </View>
            )}

            {doc.description && (
              <View style={documentStyles.infoRow}>
                <Text style={documentStyles.infoLabel}>Description:</Text>
                <Text style={documentStyles.infoValue}>{doc.description}</Text>
              </View>
            )}

            {doc.uploadedAt && (
              <View style={documentStyles.infoRow}>
                <Text style={documentStyles.infoLabel}>Uploaded:</Text>
                <Text style={documentStyles.infoValue}>
                  {new Date(doc.uploadedAt).toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {/* Document Image */}
          <View style={documentStyles.imageContainer}>
            {doc.mimeType?.startsWith('image/') ? (
              <Image 
                src={doc.filePath} 
                style={documentStyles.documentImage}
              />
            ) : (
              <Text style={documentStyles.noDocumentsText}>
                Document preview not available for this file type.
                {'\n'}File: {doc.fileName}
              </Text>
            )}
          </View>

          {/* Page Number */}
          <Text style={documentStyles.pageNumber}>
            Page {index + 1} of {documents.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export const MarriageCertificateApplicationView: React.FC<{
  application: MarriageCertificateApplicationWithDocuments;
}> = ({ application }) => {
  const router = useRouter();
  const [showPDF, setShowPDF] = useState(true);
  const [pageSize, setPageSize] = useState<"A4" | "LEGAL" | "LETTER">("A4");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBack = () => {
    router.push("/admin/marriage-cert-app");
  };

  const handleEdit = () => {
    router.push(`/admin/marriage-cert-app/${application.id}/edit`);
  };

  const handleDelete = async () => {
    if (
      !confirm("Are you sure you want to delete this application and all its supporting documents?")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/marriage-certificate-application/${application.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      toast.success("Application deleted successfully");
      router.push("/admin/marriage-cert-app");
      router.refresh();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };

  const documents = application.supportingDocuments || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Controls */}
        <div className="mb-4 flex gap-2 items-center flex-wrap">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
          </Button>

          <div className="flex-1" />

          {/* Document Count Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">
              {documents.length} Document{documents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Paper Size Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Paper Size:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as any)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="A4">A4 (8.3" × 11.7")</option>
              <option value="LEGAL">Legal (8.5" × 14")</option>
              <option value="LETTER">Letter (8.5" × 11")</option>
            </select>
          </div>

          {/* Download PDF */}
          <PDFDownloadLink
            document={
              <SupportingDocumentsPDF
                application={application}
                pageSize={pageSize}
              />
            }
            fileName={`supporting-documents-${application.registryNo}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>

          {/* Edit Button */}
          <Button variant="ghost" onClick={handleEdit}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </Button>

          {/* Delete Button */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>

          {/* Toggle Preview */}
          <Button variant="outline" onClick={() => setShowPDF(!showPDF)}>
            <FileText className="w-4 h-4 mr-2" />
            {showPDF ? "Hide" : "Show"} Preview
          </Button>
        </div>

        {/* PDF Preview */}
        {showPDF && (
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            style={{ height: "800px" }}
          >
            <PDFViewer width="100%" height="100%">
              <SupportingDocumentsPDF
                application={application}
                pageSize={pageSize}
              />
            </PDFViewer>
          </div>
        )}

        {/* Hidden State */}
        {!showPDF && (
          <div className="bg-white shadow-lg rounded-lg p-8">
            {/* Documents List */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Supporting Documents</h2>
              <p className="text-sm text-gray-600 mb-4">
                Registry No: <span className="font-semibold">{application.registryNo}</span>
              </p>
              
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No supporting documents attached</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div 
                      key={doc.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {doc.mimeType?.startsWith('image/') ? (
                            <ImageIcon className="w-8 h-8 text-blue-500" />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">
                            Document {index + 1}: {doc.fileName}
                          </h3>
                          {doc.description && (
                            <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            {doc.fileSize && (
                              <span>Size: {(doc.fileSize / 1024).toFixed(2)} KB</span>
                            )}
                            {doc.mimeType && (
                              <span>Type: {doc.mimeType}</span>
                            )}
                            {doc.uploadedAt && (
                              <span>
                                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Show Preview Button */}
            <div className="text-center">
              <Button onClick={() => setShowPDF(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Show PDF Preview
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};