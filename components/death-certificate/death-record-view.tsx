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
import { DeathRecord, SupportingDocument } from "@/lib/generated/prisma/client";
import { SupportingDocumentsPages } from "../supporting-documents";

interface DeathRecordWithDocuments extends DeathRecord {
  supportingDocuments?: SupportingDocument[];
}

interface DeathCertificatePDFProps {
  record: DeathRecordWithDocuments;
  pageSize?: "A4" | "LEGAL" | "LETTER";
}

const DeathCertificatePDF: React.FC<DeathCertificatePDFProps> = ({
  record,
  pageSize = "A4",
}) => {
  const deceasedFullName = getFullName(
    record.deceasedLastName,
    record.deceasedFirstName,
    record.deceasedMiddleName,
  );

  const documents = record.supportingDocuments || [];

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
         <View style={styles.headerContainer}>
          <View wrap={false} style={styles.headerRow}>
            <View style={styles.leftColumn}>
              <Image src="/logos/datu-gara-3.png" style={styles.logoDatuGara} />
              <View>
                <View style={styles.formNumberCont}>
                  <Text style={styles.formNumber}>
                    Civil Registry Form No. 2A
                  </Text>
                  <Text style={styles.formNumber}>(Death-available)</Text>
                </View>

                <View style={styles.headerTitleCont}>
                  <Text style={styles.headerTitle}>
                    Republic of the Philippines
                  </Text>
                  <Text style={styles.headerTitle}>Province of Leyte</Text>
                  <Text style={styles.headerTitleBold}>
                    Municipality of Carigara
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.rightLogoColumn}>
              <Image src="/logos/mcro.png" style={styles.logo} />
              <Image src="/logos/lgu-carigara.png" style={styles.logo} />
              <Image
                src="/logos/bagong-pilipinas.png"
                style={styles.logoSingle}
              />

            </View>
          </View>

          <View style={styles.headerTitleLargeCont}>
            <Text style={styles.headerTitleLarge}>OFFICE OF THE MUNICIPAL CIVIL REGISTRAR</Text>
          </View>
        </View>

        <Text style={styles.dateRight}>{record.certificateDate}</Text>

        <Text style={styles.concernStatement}>TO WHOM IT MAY CONCERN:</Text>

        <Text style={styles.bodyText}>
          We certify that among others, the following facts of death appear in
          our Registry of Deaths on page{" "}
          <Text style={{ fontWeight: "bold" }}>{record.pageNo}</Text> of Book
          No. <Text style={{ fontWeight: "bold" }}>{record.bookNo}:</Text>
        </Text>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Registry No.</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.registryNo}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Date of Registration</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.dateOfRegistration}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Deceased</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValueBold}>{deceasedFullName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Sex</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.sex}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Age</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.age}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Civil Status</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.civilStatus}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Citizenship</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.citizenship}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Date of Death</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.dateOfDeath}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Place of Death</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.placeOfDeath}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Cause of Death</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.causeOfDeath}</Text>
        </View>

        {record.remarks && (
          <View style={styles.remarksSection}>
            <Text style={styles.remarksTitle}>REMARKS:</Text>
            {record.remarks
              .split("\n\n")
              .filter((para) => para.trim())
              .map((paragraph, index) => (
                <Text key={index} style={styles.remarksText}>
                  {paragraph.trim().replace(/\n/g, " ")}
                </Text>
              ))}
          </View>
        )}

        <View wrap={false}>
          {record.requestorName && record.requestPurpose && (
            <Text style={styles.footerText}>
              This certification is issued to{" "}
              <Text style={styles.requestorName}>{record.requestorName}</Text>{" "}
              {record.requestPurpose}.
            </Text>
          )}
        </View>

        <View style={styles.registrarSignaturePathCont}>
          {record.registrarSignaturePath && (
            <Image
              src={record.registrarSignaturePath}
              style={styles.signatureImage}
            />
          )}
          <View style={styles.signatureRight}>
            <Text style={styles.signatureName}>{record.registrarName}</Text>
            <Text style={styles.signatureTitle}>Municipal Civil Registrar</Text>
          </View>
          {record.certifyingOfficerName && record.certifyingOfficerPosition && (
            <View style={styles.certifyingContainer}>
              <Text style={styles.certifyingLabel}>
                &quot;FOR AND BEHALF OF THE MCR&quot;
              </Text>
              {record.certifyingOfficerSignaturePath && (
                <Image
                  src={record.certifyingOfficerSignaturePath}
                  style={styles.signatureImage}
                />
              )}
              <View style={styles.signatureRight}>
                <Text style={styles.signatureName}>
                  {record.certifyingOfficerName}
                </Text>
                <Text style={styles.signatureTitle}>
                  {record.certifyingOfficerPosition}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View>
          <Text style={styles.verifiedLabel}>Verified by:</Text>
        </View>

        <View style={styles.verifierSignaturePathCont}>
          {record.verifierSignaturePath && (
            <Image
              src={record.verifierSignaturePath}
              style={styles.signatureImage}
            />
          )}
          <View style={styles.signatureLeft}>
            <Text style={styles.signatureName}>{record.verifiedBy}</Text>
            <Text style={styles.signatureTitle}>{record.verifierPosition}</Text>
          </View>
        </View>

        <View style={styles.regFeeInfoContainer}>
          <Text>{record.processFeeInfo}</Text>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteHighlight}>Note:</Text>
          <Text style={styles.noteText}>
            A mark, erasure or alteration of any entry invalidates this
            certification.
          </Text>
        </View>
      </Page>

      <SupportingDocumentsPages documents={documents} pageSize={pageSize} />
    </Document>
  );
};

export const DeathRecordView: React.FC<{
  record: DeathRecordWithDocuments;
}> = ({ record }) => {
  const router = useRouter();
  const [showPDF, setShowPDF] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageSize, setPageSize] = useState<"A4" | "LEGAL" | "LETTER">("A4");

  const handleBack = () => {
    router.push("/admin/death-certificate");
  };

  const handleEdit = () => {
    router.push(`/admin/death-certificate/${record.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/death-certificate/${record.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      toast.success("Record deleted successfully");
      router.push("/admin/death-certificate");
      router.refresh();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    } finally {
      setIsDeleting(false);
    }
  };

  const documents = record.supportingDocuments || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex gap-2 items-center">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
          </Button>

          {/* Document Count Badge */}
          {documents.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">
                {documents.length} Supporting Document
                {documents.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

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
              <DeathCertificatePDF record={record} pageSize={pageSize} />
            }
            fileName={`death-certificate-${record.registryNo}.pdf`}
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

          {/* <Button variant="outline" onClick={() => setShowPDF(!showPDF)}>
            <FileText className="w-4 h-4 mr-2" />
            {showPDF ? "Hide" : "Show"} Preview
          </Button> */}
        </div>

        {showPDF && (
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            style={{ height: "800px" }}
          >
            <PDFViewer width="100%" height="100%">
              <DeathCertificatePDF record={record} pageSize={pageSize} />
            </PDFViewer>
          </div>
        )}

        {/* {!showPDF && (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">PDF preview is hidden</p>
            <Button onClick={() => setShowPDF(true)}>Show Preview</Button>
          </div>
        )} */}
      </div>
    </div>
  );
};
