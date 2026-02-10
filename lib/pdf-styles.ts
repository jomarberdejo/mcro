import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    paddingLeft: 72,
    paddingRight: 72,
    paddingTop: 48,
    fontFamily: "Times-Roman",
    fontSize: 11,
  },
  headerContainer: {
    position: "relative",
    minHeight: 120,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "2px solid #000",
    paddingBottom: 10,
  },
  leftColumn: {
    width: "35%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  rightLogoColumn: {
    width: "65%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 15,
  },
  formNumberCont: {
    marginBottom: 10,
  },
  formNumber: {
    fontSize: 8,
    color: "#666",
    fontStyle: "italic",
  },
  headerTitleCont: {},
  headerTitle: {
    fontSize: 12,
    textAlign: "left",
  },
  headerTitleBold: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    fontStyle: "italic",
    textAlign: "left",
  },
  headerTitleLargeCont: {
    position: "absolute",
    bottom: 29,
    left: 60,
    right: 0,
  },

  headerTitleLarge: {
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  logo: {
    width: 55,
    height: 55,
  },
  logoSingle: {
    width: 60,
    height: 60,
  },
  logoDatuGara: {
    width: 90,
    height: 90,
  },
  dateRight: {
    textAlign: "right",
    fontSize: 11,
    marginBottom: 20,
  },
  concernStatement: {
    fontSize: 11,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 11,
    lineHeight: 1.4,
    textAlign: "justify",
    marginBottom: 12,
    textIndent: 30,
  },
  bookReference: {
    fontSize: 11,
    marginBottom: 15,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "center",
    paddingLeft: 30,
  },
  fieldLabel: {
    width: "35%",
    fontSize: 11,
    color: "#333",
  },
  fieldColon: {
    width: "5%",
    fontSize: 11,
  },
  fieldValue: {
    width: "60%",
    fontSize: 11,
  },
  fieldValueBold: {
    width: "60%",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  remarksSection: {
    marginTop: 12,
    paddingLeft: 30,
    marginBottom: 8,
  },
  remarksTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#666",
  },
  remarksText: {
    fontSize: 11,
    lineHeight: 1.4,
    textAlign: "justify",
    marginBottom: 6,
    textTransform: "uppercase",
    textIndent: 30,
  },
  footerText: {
    fontSize: 11,
    marginTop: 8,
    marginBottom: 8,
    textIndent: 30,
  },
  requestorName: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  registrarSignaturePathCont: {
    alignItems: "center",
    marginLeft: "auto",
    marginTop: 20,
    paddingRight: 30,
  },
  verifierSignaturePathCont: {
    marginTop: 8,
    alignItems: "center",
    marginRight: "auto",
    paddingLeft: 50,
  },
  certifyingContainer: {
    marginVertical: 5,
    alignItems: "center",
    marginRight: "auto",
  },
  certifyingLabel: {
    marginBottom: 10,
    fontSize: 10,
  },
  signatureRight: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  signatureLeft: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  signatureImage: {
    width: 100,
    height: 35,
    marginBottom: -12,
    objectFit: "contain",
  },
  signatureName: {
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  signatureTitle: {
    fontSize: 10,
    marginTop: 2,
  },
  verifiedLabel: {
    fontSize: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  regFeeInfoContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
  noteContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    marginTop: 8,
  },
  noteHighlight: {
    fontWeight: 700,
  },
  noteText: {
    fontSize: 10,
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
    paddingLeft: 72,
    paddingRight: 72,
    paddingTop: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  documentHeader: {
    marginBottom: 20,
    borderBottom: "2px solid #333",
    paddingBottom: 10,
  },
  documentHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  documentSubHeaderText: {
    fontSize: 11,
    textAlign: "center",
    color: "#666",
  },
  documentInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  documentInfoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  documentInfoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: 120,
  },
  documentInfoValue: {
    fontSize: 10,
    flex: 1,
  },
  documentImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  documentImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  documentPageNumber: {
    position: "absolute",
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: "#666",
  },
  noDocumentsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    padding: 40,
  },
});