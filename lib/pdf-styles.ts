import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 30, // Reduced from 40
    fontFamily: "Times-Roman",
    fontSize: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10, // Reduced from 15
    paddingBottom: 8, // Reduced from 10
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
    width: 70, // Reduced from 80
    height: 70, // Reduced from 80
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
    width: 55, // Reduced from 60
    height: 55, // Reduced from 60
  },
  dateRight: {
    textAlign: "right",
    fontSize: 10,
    marginTop: 8, // Reduced from 10
    marginBottom: 12, // Reduced from 20
  },
  concernStatement: {
    fontSize: 11,
    marginBottom: 10, // Reduced from 15
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.4, // Reduced from 1.5
    textAlign: "justify",
    marginBottom: 12, // Reduced from 15
    textIndent: 30,
  },
  bookReference: {
    fontSize: 10,
    marginBottom: 15, // Reduced from 20
  },
  // Field rows - label and value on same line
  fieldRow: {
    flexDirection: "row",
    marginBottom: 4, // Reduced from 6
    alignItems: "flex-start",
    paddingLeft: 30,
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
    marginTop: 12, // Reduced from 20
    paddingLeft: 30,
    marginBottom: 8, // Add this
  },
  remarksTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8, // Reduced from 10
    color: "#666",
  },
  remarksText: {
    fontSize: 9,
    lineHeight: 1.4, // Reduced from 1.5
    textAlign: "justify",
    marginBottom: 6, // Reduced from 10
    textTransform: "uppercase",
    textIndent: 30,
  },
  // Footer
  footerText: {
    fontSize: 10,
    marginTop: 8, // Reduced from 10
    marginBottom: 8, // Reduced from 10
    textIndent: 30,
  },
  requestorName: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  signatureRightContainer: {
    alignItems: "center",
    marginLeft: "auto",
    marginTop: 10, // Reduced from default
    paddingRight: 30,
  },
  signatureLeftContainer: {
    marginTop: 8, // Reduced from default
    alignItems: "center",
    marginRight: "auto",
    paddingLeft: 50,
  },
  certifyingContainer: {
    marginVertical: 5, // Reduced from default
  },
  certifyingLabel: {
    marginBottom: 10, // Reduced from 10
    fontSize: 9,
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
    width: 100, // Reduced from 120
    height: 35, // Reduced from 40
    marginBottom: -15,
    objectFit: "contain",
  },
  signatureName: {
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  signatureTitle: {
    fontSize: 9,
    marginTop: 2,
  },
  verifiedLabel: {
    fontSize: 10,
    marginTop: 8, // Reduced from default
    marginBottom: 5,
  },
  regFeeInfoContainer: {
    marginTop: 8, // Reduced from 10
    marginBottom: 8, // Reduced from 10
  },
  noteContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    paddingLeft: 30,
    marginTop: 8,
  },
  noteHighlight: {
    fontWeight: 700,
  },
  noteText: {
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 4,
    paddingLeft: 30,
    textTransform: "uppercase",
    color: "#333",
  },
});


export const documentStyles = StyleSheet.create({
  documentPage: {
    padding: 40,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  documentHeader: {
    marginBottom: 20,
    borderBottom: '2px solid #333',
    paddingBottom: 10,
  },
  documentHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  documentSubHeaderText: {
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
  documentInfoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  documentInfoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 120,
  },
  documentInfoValue: {
    fontSize: 10,
    flex: 1,
  },
  documentImageContainer: {
    flex: 1,
    width: '100%',
    minHeight: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  documentPageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: '#666',
  },
  noDocumentsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});