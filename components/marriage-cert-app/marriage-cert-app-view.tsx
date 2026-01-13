"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit2, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getFullName } from "@/utils";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import { styles } from "@/lib/pdf-styles";
import { MarriageCertificateApplication } from "@/lib/generated/prisma/client";

interface MarriageCertificateApplicationPDFProps {
  application: MarriageCertificateApplication;
  pageSize?: "A4" | "LEGAL" | "LETTER";
}

const MarriageCertificateApplicationPDF: React.FC<
  MarriageCertificateApplicationPDFProps
> = ({ application, pageSize = "A4" }) => {
  const groomFullName = getFullName(
    application.groomLastName,
    application.groomFirstName,
    application.groomMiddleName
  );
  const brideFullName = getFullName(
    application.brideLastName,
    application.brideFirstName,
    application.brideMiddleName
  );

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        <View style={styles.headerRow} wrap={false}>
          <View style={styles.leftColumn}>
            <Image src="/logos/datu-gara-2.png" style={styles.lapuLapuImage} />
          </View>

          <View style={styles.centerColumn}>
            <Text style={styles.formNumber}>
              Marriage Certificate Application Form
            </Text>
            <Text style={styles.formNumber}>(Application-available)</Text>
            <Text style={styles.headerTitle}>Republic of the Philippines</Text>
            <Text style={styles.headerTitle}>Province of Leyte</Text>
            <Text style={styles.headerTitleBold}>Municipality of Carigara</Text>
            <Text style={styles.headerTitleLarge}>
              OFFICE OF THE MUNICIPAL CIVIL REGISTRAR
            </Text>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.logoContainer}>
              <Image src="/logos/mcro.png" style={styles.logo} />
              <Image src="/logos/lgu-carigara.png" style={styles.logo} />
              <Image src="/logos/bagong-pilipinas.png" style={styles.logo} />
            </View>
          </View>
        </View>

        {application.dateOfRegistration && (
          <Text style={styles.dateRight}>{application.dateOfRegistration}</Text>
        )}

        <Text style={styles.concernStatement}>TO WHOM IT MAY CONCERN:</Text>

        <Text style={styles.bodyText}>
          We certify that the following application for marriage certificate has
          been received and recorded in our Registry of Marriage Applications
          {application.pageNo && application.bookNo && (
            <>
              {" "}on page{" "}
              <Text style={{ fontWeight: "bold" }}>{application.pageNo}</Text> of
              Book No.{" "}
              <Text style={{ fontWeight: "bold" }}>{application.bookNo}</Text>
            </>
          )}
          :
        </Text>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Registry No.</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{application.registryNo}</Text>
        </View>

        {application.dateOfRegistration && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date of Registration</Text>
            <Text style={styles.fieldColon}>:</Text>
            <Text style={styles.fieldValue}>{application.dateOfRegistration}</Text>
          </View>
        )}

        {application.bookNo && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Book No.</Text>
            <Text style={styles.fieldColon}>:</Text>
            <Text style={styles.fieldValue}>{application.bookNo}</Text>
          </View>
        )}

        {application.pageNo && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Page No.</Text>
            <Text style={styles.fieldColon}>:</Text>
            <Text style={styles.fieldValue}>{application.pageNo}</Text>
          </View>
        )}

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Groom</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValueBold}>{groomFullName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Date of Birth (Groom)</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{application.groomDateOfBirth}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Bride</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValueBold}>{brideFullName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Date of Birth (Bride)</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{application.brideDateOfBirth}</Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={styles.footerText}>
            This application was submitted and recorded in the registry.
          </Text>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteHighlight}>Note:</Text>
          <Text style={styles.noteText}>
            This is an application document. The actual marriage certificate will
            be issued upon completion of requirements and verification. A mark,
            erasure or alteration of any entry invalidates this application.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const MarriageCertificateApplicationView: React.FC<{
  application: MarriageCertificateApplication;
}> = ({ application }) => {
  const router = useRouter();
  const [showPDF, setShowPDF] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageSize, setPageSize] = useState<"A4" | "LEGAL" | "LETTER">("A4");

  const handleBack = () => {
    router.push("/admin/marriage-certificate-application");
  };

  const handleEdit = () => {
    router.push(
      `/admin/marriage-certificate-application/${application.id}/edit`
    );
  };

  const handleDelete = async () => {
    if (
      !confirm("Are you sure you want to delete this application?")
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
      router.push("/admin/marriage-certificate-application");
      router.refresh();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex gap-2 items-center">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
          </Button>

          {/* Add Paper Size Selector */}
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

          <PDFDownloadLink
            document={
              <MarriageCertificateApplicationPDF
                application={application}
                pageSize={pageSize}
              />
            }
            fileName={`marriage-certificate-application-${application.registryNo}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>

          <Button variant="ghost" onClick={handleEdit}>
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
              <MarriageCertificateApplicationPDF
                application={application}
                pageSize={pageSize}
              />
            </PDFViewer>
          </div>
        )}

        {!showPDF && (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">PDF preview is hidden</p>
            <Button onClick={() => setShowPDF(true)}>Show Preview</Button>
          </div>
        )}
      </div>
    </div>
  );
};