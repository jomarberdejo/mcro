import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
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
  },
  remarksTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#666",
  },
  remarksText: {
    fontSize: 9,
    lineHeight: 1.5,
    textAlign: "justify",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  // Footer
  footerText: {
    fontSize: 10,
    marginBottom: 5,
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
