"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Edit2,
  Trash2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
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
import {
  MarriageCertificateApplication,
  SupportingDocument,
} from "@/lib/generated/prisma/client";
import { documentStyles } from "@/lib/pdf-styles";

interface MarriageCertificateApplicationWithDocuments extends MarriageCertificateApplication {
  supportingDocuments?: SupportingDocument[];
}

interface SupportingDocumentsPDFProps {
  application: MarriageCertificateApplicationWithDocuments;
  pageSize?: "A4" | "LEGAL" | "LETTER";
}

const SupportingDocumentsPDF: React.FC<SupportingDocumentsPDFProps> = ({
  application,
  pageSize = "A4",
}) => {
  const documents = application.supportingDocuments || [];

  if (documents.length === 0) {
    return (
      <Document>
        <Page size={pageSize}>
          <View>
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
        <Page key={doc.id} size={pageSize}>
          <View style={documentStyles.documentImageContainer}>
            {doc.mimeType?.startsWith("image/") ? (
              <Image src={doc.filePath} style={documentStyles.documentImage} />
            ) : (
              <Text style={documentStyles.noDocumentsText}>
                Document preview not available for this file type.
                {"\n"}File: {doc.fileName}
              </Text>
            )}
          </View>
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
      !confirm(
        "Are you sure you want to delete this application and all its supporting documents?",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/marriage-certificate-application/${application.id}`,
        {
          method: "DELETE",
        },
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
        <div className="mb-4 flex gap-2 items-center flex-wrap">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">
              {documents.length} Document{documents.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Paper Size:</label>
            <select
              value={pageSize}
              onChange={(e) =>
                setPageSize(e.target.value as "A4" | "LEGAL" | "LETTER")
              }
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="A4">A4 (8.3&quot; × 11.7&quot;)</option>
              <option value="LEGAL">Legal (8.5&quot; × 14&quot;)</option>
              <option value="LETTER">Letter (8.5&quot; × 11&quot;)</option>
            </select>
          </div>

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

          <Button variant="outline" onClick={handleEdit}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>

          <Button variant="outline" onClick={() => setShowPDF(!showPDF)}>
            <FileText className="w-4 h-4 mr-2" />
            {showPDF ? "Hide" : "Show"} Preview
          </Button>
        </div>

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

        {!showPDF && (
          <div className="bg-white shadow-lg rounded-lg p-8">
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
