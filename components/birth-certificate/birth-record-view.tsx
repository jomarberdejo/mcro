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
import { BirthRecord, SupportingDocument } from "@/lib/generated/prisma/client";
import { SupportingDocumentsPages } from "@/components/supporting-documents";
import { useMounted } from "@/hooks/use-mounted";

interface BirthRecordWithDocuments extends BirthRecord {
  supportingDocuments?: SupportingDocument[];
}

interface BirthCertificatePDFProps {
  record: BirthRecordWithDocuments;
  pageSize?: "A4" | "LEGAL" | "LETTER";
}

const BirthCertificatePDF: React.FC<BirthCertificatePDFProps> = ({
  record,
  pageSize = "A4",
}) => {
  const childFullName = getFullName(
    record.childLastName,
    record.childFirstName,
    record.childMiddleName,
  );
  const motherFullName = getFullName(
    record.motherLastName,
    record.motherFirstName,
    record.motherMiddleName,
  );
  const fatherFullName = getFullName(
    record.fatherLastName,
    record.fatherFirstName,
    record.fatherMiddleName,
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
                    Civil Registry Form No. 1A
                  </Text>
                  <Text style={styles.formNumber}>(Birth-available)</Text>
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
            <Text style={styles.headerTitleLarge}>
              OFFICE OF THE MUNICIPAL CIVIL REGISTRAR
            </Text>
          </View>
        </View>

        <Text style={styles.dateRight}>{record.certificateDate}</Text>

        <Text style={styles.concernStatement}>TO WHOM IT MAY CONCERN:</Text>

        <Text style={styles.bodyText}>
          We certify that among others, the following facts of birth appear in
          our Registry of Births on page{" "}
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
          <Text style={styles.fieldLabel}>Name of Child</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValueBold}>{childFullName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Sex</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.sex}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.dateOfBirth}</Text>
        </View>

        {record.isTwin && (
          <>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Type of Birth</Text>
              <Text style={styles.fieldColon}>:</Text>
              <Text style={styles.fieldValue}>{record.typeOfBirth}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Birth Order</Text>
              <Text style={styles.fieldColon}>:</Text>
              <Text style={styles.fieldValue}>{record.birthOrder}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Time of Birth</Text>
              <Text style={styles.fieldColon}>:</Text>
              <Text style={styles.fieldValue}>{record.timeOfBirth}</Text>
            </View>
          </>
        )}

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Place of Birth</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.placeOfBirth}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Mother</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{motherFullName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Citizenship of Mother</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.motherCitizenship}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Father</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{fatherFullName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Citizenship of Father</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>{record.fatherCitizenship}</Text>
        </View>

        {record.dateOfMarriage && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date of Marriage of Parents</Text>
            <Text style={styles.fieldColon}>:</Text>
            <Text style={styles.fieldValue}>{record.dateOfMarriage}</Text>
          </View>
        )}

        {record.placeOfMarriage && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Place of Marriage of Parents</Text>
            <Text style={styles.fieldColon}>:</Text>
            <Text style={styles.fieldValue}>{record.placeOfMarriage}</Text>
          </View>
        )}

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
              This certification is issued to {""}
              <Text style={styles.requestorName}>
                {record.requestorName}
              </Text>{" "}
              {""}
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

export const BirthRecordView: React.FC<{
  record: BirthRecordWithDocuments;
}> = ({ record }) => {
  const router = useRouter();
  const mounted = useMounted(); // <-- replaces useState + useEffect
  const [showPDF, setShowPDF] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageSize, setPageSize] = useState<"A4" | "LEGAL" | "LETTER">("A4");

  const handleBack = () => {
    router.push("/admin/birth-certificate");
  };

  const handleEdit = () => {
    router.push(`/admin/birth-certificate/${record.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/birth-certificate/${record.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      toast.success("Record deleted successfully");
      router.push("/admin/birth-certificate");
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
        <div className="mb-4 flex gap-2 items-center flex-wrap">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
          </Button>

          {/* {documents.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">
                {documents.length} Supporting Document
                {documents.length !== 1 ? "s" : ""}
              </span>
            </div>
          )} */}

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

          {mounted && (
            <PDFDownloadLink
              key={`download-${pageSize}`}
              document={
                <BirthCertificatePDF record={record} pageSize={pageSize} />
              }
              fileName={`birth-certificate-${record.registryNo}.pdf`}
            >
              {({ loading }) => (
                <Button disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          )}

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
        </div>

        {mounted && showPDF && (
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            style={{ height: "800px" }}
          >
            <PDFViewer
              key={`viewer-${pageSize}`}
              width="100%"
              height="100%"
            >
              <BirthCertificatePDF record={record} pageSize={pageSize} />
            </PDFViewer>
          </div>
        )}

        {!mounted && (
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center justify-center gap-3"
            style={{ height: "800px" }}
          >
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading PDF preview...</p>
          </div>
        )}
      </div>
    </div>
  );
};