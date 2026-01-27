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
  StyleSheet,
} from "@react-pdf/renderer";
import { styles } from "@/lib/pdf-styles";
import {
  MarriageRecord,
  SupportingDocument,
} from "@/lib/generated/prisma/client";
import { SupportingDocumentsPages } from "@/components/supporting-documents";

interface MarriageRecordWithDocuments extends MarriageRecord {
  supportingDocuments?: SupportingDocument[];
}

interface MarriageCertificatePDFProps {
  record: MarriageRecordWithDocuments;
  pageSize?: "A4" | "LEGAL" | "LETTER";
}

export const marriageStyles = StyleSheet.create({
  ...styles,

  marriageColumnsContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
  },
  marriageColumn: {
    width: "50%",
    paddingHorizontal: 10,
  },
  marriageColumnTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    textTransform: "uppercase",
    color: "#333",
    borderBottom: "1px solid #000",
    paddingBottom: 4,
    marginVertical: 20,
  },
  marriageFieldRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  marriageFieldLabel: {
    width: "45%",
    fontSize: 10,
    color: "#333",
  },
  marriageFieldColon: {
    width: "5%",
    fontSize: 10,
  },
  marriageFieldValue: {
    width: "50%",
    fontSize: 10,
  },
  marriageFieldValueBold: {
    width: "50%",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  registryInfoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  registryInfoFieldRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  registryInfoFieldLabel: {
    width: "22%",
    fontSize: 10,
    color: "#333",
  },
  registryInfoFieldColon: {
    fontSize: 10,
    width: "5%",
  },
  registryInfoFieldValue: {
    fontSize: 10,
    width: "25%",
  },
});

const MarriageCertificatePDF: React.FC<MarriageCertificatePDFProps> = ({
  record,
  pageSize = "A4",
}) => {
  const husbandFullName = getFullName(
    record.husbandLastName,
    record.husbandFirstName,
    record.husbandMiddleName,
  );
  const wifeFullName = getFullName(
    record.wifeLastName,
    record.wifeFirstName,
    record.wifeMiddleName,
  );

  const documents = record.supportingDocuments || [];



  return (
    <Document>
      <Page size={pageSize} style={marriageStyles.page}>
        <Image src="/logos/datu-gara-3.png" style={styles.pageBackgroundLogo} />

        <View>
          <View wrap={false} style={styles.headerRow}>
            <View style={styles.leftLogoColumn}>
              <Image src="/logos/mcro.png" style={styles.logo} />
              <Image src="/logos/lgu-carigara.png" style={styles.logo} />
            </View>

            <View style={styles.centerColumn}>
              <Text style={styles.formNumber}>Civil Registry Form No. 3A</Text>
              <Text style={styles.formNumber}>(Marriage-available)</Text>
              <Text style={styles.headerTitle}>
                Republic of the Philippines
              </Text>
              <Text style={styles.headerTitle}>Province of Leyte</Text>
              <Text style={styles.headerTitleBold}>
                Municipality of Carigara
              </Text>
            </View>

            <View style={styles.rightLogoColumn}>
              <Image
                src="/logos/bagong-pilipinas.png"
                style={styles.logoSingle}
              />
            </View>
          </View>

          <Text style={styles.headerTitleLarge}>
            OFFICE OF THE MUNICIPAL CIVIL REGISTRAR
          </Text>
        </View>

        <Text style={styles.dateRight}>{record.certificateDate}</Text>

        <Text style={styles.concernStatement}>TO WHOM IT MAY CONCERN:</Text>

        <Text style={styles.bodyText}>
          We certify that among others, the following facts of marriage appear
          in our Registry of Marriages on page{" "}
          <Text style={{ fontWeight: "bold" }}>{record.pageNo}</Text> of Book
          No. <Text style={{ fontWeight: "bold" }}>{record.bookNo}:</Text>
        </Text>

        <View style={marriageStyles.marriageColumnsContainer}>
          <View style={marriageStyles.marriageColumn}>
            <Text style={marriageStyles.marriageColumnTitle}>HUSBAND</Text>

            <View style={marriageStyles.marriageFieldRow}>
              <Text style={marriageStyles.marriageFieldLabel}>Name</Text>
              <Text style={marriageStyles.marriageFieldColon}>:</Text>
              <Text style={marriageStyles.marriageFieldValueBold}>
                {husbandFullName}
              </Text>
            </View>

            <View style={marriageStyles.marriageFieldRow}>
              <Text style={marriageStyles.marriageFieldLabel}>Age</Text>
              <Text style={marriageStyles.marriageFieldColon}>:</Text>
              <Text style={marriageStyles.marriageFieldValue}>
                {record.husbandAge}
              </Text>
            </View>

            <View style={marriageStyles.marriageFieldRow}>
              <Text style={marriageStyles.marriageFieldLabel}>Nationality</Text>
              <Text style={marriageStyles.marriageFieldColon}>:</Text>
              <Text style={marriageStyles.marriageFieldValue}>
                {record.husbandNationality}
              </Text>
            </View>

            <View style={marriageStyles.marriageFieldRow}>
              <Text style={marriageStyles.marriageFieldLabel}>
                Civil Status
              </Text>
              <Text style={marriageStyles.marriageFieldColon}>:</Text>
              <Text style={marriageStyles.marriageFieldValue}>
                {record.husbandCivilStatus}
              </Text>
            </View>

            {record.husbandMotherName && (
              <View style={marriageStyles.marriageFieldRow}>
                <Text style={marriageStyles.marriageFieldLabel}>
                  Mother&apos;s Name
                </Text>
                <Text style={marriageStyles.marriageFieldColon}>:</Text>
                <Text style={marriageStyles.marriageFieldValue}>
                  {record.husbandMotherName}
                </Text>
              </View>
            )}

            {record.husbandFatherName && (
              <View style={marriageStyles.marriageFieldRow}>
                <Text style={marriageStyles.marriageFieldLabel}>
                  Father&apos;s Name
                </Text>
                <Text style={marriageStyles.marriageFieldColon}>:</Text>
                <Text style={marriageStyles.marriageFieldValue}>
                  {record.husbandFatherName}
                </Text>
              </View>
            )}
          </View>

          <View style={marriageStyles.marriageColumn}>
            <Text style={marriageStyles.marriageColumnTitle}>WIFE</Text>

            <View style={marriageStyles.marriageFieldRow}>
              <Text style={marriageStyles.marriageFieldLabel}>Name</Text>
              <Text style={marriageStyles.marriageFieldColon}>:</Text>
              <Text style={marriageStyles.marriageFieldValueBold}>
                {wifeFullName}
              </Text>
            </View>

            <View style={marriageStyles.marriageFieldRow}>
              <Text style={marriageStyles.marriageFieldLabel}>Age</Text>
              <Text style={marriageStyles.marriageFieldColon}>:</Text>
              <Text style={marriageStyles.marriageFieldValue}>
                {record.wifeAge}
              </Text>
            </View>

            <View style={marriageStyles.marriageFieldRow}>
              <Text style={marriageStyles.marriageFieldLabel}>Nationality</Text>
              <Text style={marriageStyles.marriageFieldColon}>:</Text>
              <Text style={marriageStyles.marriageFieldValue}>
                {record.wifeNationality}
              </Text>
            </View>

            <View style={marriageStyles.marriageFieldRow}>
              <Text style={marriageStyles.marriageFieldLabel}>
                Civil Status
              </Text>
              <Text style={marriageStyles.marriageFieldColon}>:</Text>
              <Text style={marriageStyles.marriageFieldValue}>
                {record.wifeCivilStatus}
              </Text>
            </View>

            {record.wifeMotherName && (
              <View style={marriageStyles.marriageFieldRow}>
                <Text style={marriageStyles.marriageFieldLabel}>
                  Mother&apos;s Name
                </Text>
                <Text style={marriageStyles.marriageFieldColon}>:</Text>
                <Text style={marriageStyles.marriageFieldValue}>
                  {record.wifeMotherName}
                </Text>
              </View>
            )}

            {record.wifeFatherName && (
              <View style={marriageStyles.marriageFieldRow}>
                <Text style={marriageStyles.marriageFieldLabel}>
                  Father&apos;s Name
                </Text>
                <Text style={marriageStyles.marriageFieldColon}>:</Text>
                <Text style={marriageStyles.marriageFieldValue}>
                  {record.wifeFatherName}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={marriageStyles.registryInfoContainer}>
          <View style={marriageStyles.registryInfoFieldRow}>
            <Text style={marriageStyles.registryInfoFieldLabel}>
              LCR Registry No.
            </Text>
            <Text style={marriageStyles.registryInfoFieldColon}>:</Text>
            <Text style={marriageStyles.registryInfoFieldValue}>
              {record.registryNo}
            </Text>
          </View>

          {record.dateOfRegistration && (
            <View style={marriageStyles.registryInfoFieldRow}>
              <Text style={marriageStyles.registryInfoFieldLabel}>
                Date of Registration
              </Text>
              <Text style={marriageStyles.registryInfoFieldColon}>:</Text>
              <Text style={marriageStyles.registryInfoFieldValue}>
                {record.dateOfRegistration}
              </Text>
            </View>
          )}

          <View style={marriageStyles.registryInfoFieldRow}>
            <Text style={marriageStyles.registryInfoFieldLabel}>
              Date of Marriage
            </Text>
            <Text style={marriageStyles.registryInfoFieldColon}>:</Text>
            <Text style={marriageStyles.registryInfoFieldValue}>
              {record.dateOfMarriage}
            </Text>
          </View>

          <View style={marriageStyles.registryInfoFieldRow}>
            <Text style={marriageStyles.registryInfoFieldLabel}>
              Place of Marriage
            </Text>
            <Text style={marriageStyles.registryInfoFieldColon}>:</Text>
            <Text style={marriageStyles.registryInfoFieldValue}>
              {record.placeOfMarriage}
            </Text>
          </View>
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

        <View style={styles.signatureRightContainer}>
          {record.signatureImagePath && (
            <Image
              src={record.signatureImagePath}
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

        <View style={styles.signatureLeftContainer}>
          {record.signatureImagePath && (
            <Image
              src={record.signatureImagePath}
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
export const MarriageRecordView: React.FC<{
  record: MarriageRecordWithDocuments;
}> = ({ record }) => {
  const router = useRouter();
  const [showPDF, setShowPDF] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageSize, setPageSize] = useState<"A4" | "LEGAL" | "LETTER">("A4");

  const handleBack = () => {
    router.push("/admin/marriage-certificate");
  };

  const handleEdit = () => {
    router.push(`/admin/marriage-certificate/${record.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/marriage-certificate/${record.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      toast.success("Record deleted successfully");
      router.push("/admin/marriage-certificate");
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
              <MarriageCertificatePDF record={record} pageSize={pageSize} />
            }
            fileName={`marriage-certificate-${record.registryNo}.pdf`}
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
              <MarriageCertificatePDF record={record} pageSize={pageSize} />
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
