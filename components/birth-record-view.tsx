// BirthRecordView.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit2, Trash2, FileText } from "lucide-react";
import { BirthRecord } from "@/types";
import { getFullName } from "@/utils";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  Font,
  Image,
} from "@react-pdf/renderer";

interface BirthRecordViewProps {
  record: BirthRecord;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Register fonts
Font.register({
  family: "Times-Roman",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
});

// PDF Styles matching the official document
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "1px solid #000",
  },
  leftColumn: {
    alignItems: "center",
  },

  centerColumn: {
    flexShrink: 0,
    width: "50%",
  },
  rightColumn: {
    width: "30%",
    alignItems: "flex-end",
  },
  lapuLapuImage: {
    width: 80,
    height: 80,
    opacity: 0.4,
  },
  formNumber: {
    fontSize: 9,
    color: "#666",
    marginBottom: 1,
    fontStyle: "italic",
  },
  headerTitle: {
    fontSize: 10,
    marginBottom: 1,
  },
  headerTitleBold: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 1,
    fontStyle: "italic",
  },
  headerTitleLarge: {
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  logoContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
  },
  dateRight: {
    textAlign: "right",
    fontSize: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  // Main content
  concernStatement: {
    fontSize: 11,
    marginBottom: 15,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: "justify",
    marginBottom: 15,
  },
  bookReference: {
    fontSize: 10,
    marginBottom: 20,
  },
  // Field rows - label and value on same line
  fieldRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  fieldLabel: {
    width: "35%",
    fontSize: 10,
    color: "#333",
  },
  fieldColon: {
    width: "5%",
    fontSize: 10,
  },
  fieldValue: {
    width: "60%",
    fontSize: 10,
  },
  fieldValueBold: {
    width: "60%",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  // Remarks section
  remarksSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  remarksTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#666",
  },
  remarksText: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: "justify",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  // Footer
  footerText: {
    fontSize: 10,
    marginBottom: 10,
  },
  // Signature section
  signatureRightContainer: {
    alignItems: "center",
    marginLeft: "auto",
  },
  signatureLeftContainer: {
    alignItems: "center",
    marginRight: "auto",
  },
  signatureRight: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  signatureLeft: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginRight: "auto",
    alignItems: "center",
  },
  signatureImage: {
    width: 120,
    height: 40,
    marginBottom: -15,
    objectFit: "contain",
  },

  signatureName: {
    fontSize: 11,
    fontWeight: "bold",
  },
  signatureTitle: {
    fontSize: 9,
    marginTop: 2,
  },
  verifiedLabel: {
    fontSize: 10,
    marginTop: 5,
  },

  noteContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    marginTop: 30,
    alignItems: "center",
  },
  noteHighlight: {
    fontWeight: 700,
  },

  noteText: {
    fontSize: 9,
  },
});

// PDF Document Component
const BirthCertificatePDF: React.FC<{ record: BirthRecord }> = ({ record }) => {
  const childFullName = getFullName(
    record.childLastName,
    record.childFirstName,
    record.childMiddleName
  );
  const motherFullName = getFullName(
    record.motherLastName,
    record.motherFirstName,
    record.motherMiddleName
  );
  const fatherFullName = getFullName(
    record.fatherLastName,
    record.fatherFirstName,
    record.fatherMiddleName
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          {/* Left: Lapu-Lapu Image (Blurry/Watermark) */}
          <View style={styles.leftColumn}>
            <Image src="/datu-gara.png" style={styles.lapuLapuImage} />
          </View>

          {/* Center: Text Information */}
          <View style={styles.centerColumn}>
            <Text style={styles.formNumber}>Civil Registry Form No. 1A</Text>
            <Text style={styles.formNumber}>(Birth-available)</Text>
            <Text style={styles.headerTitle}>Republic of the Philippines</Text>
            <Text style={styles.headerTitle}>Province of Leyte</Text>
            <Text style={styles.headerTitleBold}>Municipality of Carigara</Text>
            <Text style={styles.headerTitleLarge}>
              OFFICE OF THE MUNICIPAL CIVIL REGISTRAR
            </Text>
          </View>

          {/* Right: Three Logos in a Row */}
          <View style={styles.rightColumn}>
            <View style={styles.logoContainer}>
              <Image src="/mcro.png" style={styles.logo} />
              <Image src="/logo.png" style={styles.logo} />
              <Image src="/bagong-pilipinas.png" style={styles.logo} />
            </View>
          </View>
        </View>

        {/* Date on the right */}
        <Text style={styles.dateRight}>{record.dateOfRegistration}</Text>

        {/* TO WHOM IT MAY CONCERN */}
        <Text style={styles.concernStatement}>TO WHOM IT MAY CONCERN:</Text>

        {/* Body text */}
        <Text style={styles.bodyText}>
          We certify that among others, the following facts of birth appear in
          our Registry of Births on page{" "}
          <Text style={{ fontWeight: "bold" }}>97</Text> of Book No.{" "}
          <Text style={{ fontWeight: "bold" }}>7:</Text>
        </Text>

        {/* Fields - Label : Value format */}
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

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Date of Marriage of Parents</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>
            {record.dateOfMarriage || "No Column"}
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Place of Marriage of Parents</Text>
          <Text style={styles.fieldColon}>:</Text>
          <Text style={styles.fieldValue}>
            {record.placeOfMarriage || "No Column"}
          </Text>
        </View>

        {/* Remarks */}
        <View style={styles.remarksSection}>
          <Text style={styles.remarksTitle}>REMARKS:</Text>

          {record.remarks ? (
            <Text style={styles.remarksText}>{record.remarks}</Text>
          ) : (
            <>
              <Text style={styles.remarksText}>
                PURSUANT TO THE DECISION RENDERED BY MCR DARRYL U. MONTEALEGRE
                DATED JUNE 27, 2025 AND AFFIRMED BY CRG UNDER OCRG NUMBER
                25-2820504 DATED SEPTEMBER 24, 2025 THE CHILD'S MIDDLE NAME IS
                HEREBY CORRECTED FROM "M" TO "MORANO".
              </Text>
              <Text style={styles.remarksText}>
                PURSUANT TO THE DECISION RENDERED BY MCR DARRYL U. MONTEALEGRE
                DATED JULY 14, 2025 AND AFFIRMED BY CRG UNDER OCRG NUMBER
                25-2820504 DATED SEPTEMBER 24, 2025 THE CHILD'S DATE OF BIRTH IS
                HEREBY CORRECTED FROM "JUNE 27, 1956" TO "JULY 3, 1956".
              </Text>
            </>
          )}
        </View>

        {/* Footer Statement */}
        <Text style={styles.footerText}>
          This certification is issued to PSA – OCRG for filing in the archives.
        </Text>

        {/* Right Signature with Image */}
        <View style={styles.signatureRightContainer}>
          {record.signatureImage && (
            <Image src={record.signatureImage} style={styles.signatureImage} />
          )}
          <View style={styles.signatureRight}>
            <Text style={styles.signatureName}>
              {record.registrarName || "DARRYL U. MONTEALEGRE, MM"}
            </Text>
            <Text style={styles.signatureTitle}>Municipal Civil Registrar</Text>
          </View>
        </View>

        <View>
          <Text style={styles.verifiedLabel}>Verified by:</Text>
        </View>

        <View style={styles.signatureLeftContainer}>
          {record.signatureImage && (
            <Image src={record.signatureImage} style={styles.signatureImage} />
          )}
          <View style={styles.signatureLeft}>
            <Text style={styles.signatureName}>DARRYL U. MONTEALEGRE, MM</Text>
            <Text style={styles.signatureTitle}>Municipal Civil Registrar</Text>
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteHighlight}>Note:</Text>
          <Text style={styles.noteText}>
            A mark, erasure or alteration of any entry invalidates this
            certification.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const BirthRecordView: React.FC<BirthRecordViewProps> = ({
  record,
  onBack,
  onEdit,
  onDelete,
}) => {
  const [showPDF, setShowPDF] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
          </Button>

          <PDFDownloadLink
            document={<BirthCertificatePDF record={record} />}
            fileName={`birth-certificate-${record.registryNo}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>

          <Button variant="ghost" onClick={onEdit}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </Button>

          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
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
              <BirthCertificatePDF record={record} />
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
