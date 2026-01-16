import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 30, 
    fontFamily: "Times-Roman",
    fontSize: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10, 
    paddingBottom: 8, 
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
    width: 70, 
    height: 70, 
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
    width: 55, 
    height: 55, 
  },
  dateRight: {
    textAlign: "right",
    fontSize: 10,
    marginTop: 8, 
    marginBottom: 12, 
  },
  concernStatement: {
    fontSize: 11,
    marginBottom: 10, 
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.4,
    textAlign: "justify",
    marginBottom: 12, 
    textIndent: 30,
  },
  bookReference: {
    fontSize: 10,
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
    fontSize: 9,
    lineHeight: 1.4, 
    textAlign: "justify",
    marginBottom: 6, 
    textTransform: "uppercase",
    textIndent: 30,
  },
  footerText: {
    fontSize: 10,
    marginTop: 8, 
    marginBottom: 8, 
    textIndent: 30,
  },
  requestorName: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  signatureRightContainer: {
    alignItems: "center",
    marginLeft: "auto",
    marginTop: 10, 
    paddingRight: 30,
  },
  signatureLeftContainer: {
    marginTop: 8, 
    alignItems: "center",
    marginRight: "auto",
    paddingLeft: 50,
  },
  certifyingContainer: {
    marginVertical: 5, 
  },
  certifyingLabel: {
    marginBottom: 10, 
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
    width: 100, 
    height: 35,
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
    marginTop: 8, 
    marginBottom: 5,
  },
  regFeeInfoContainer: {
    marginTop: 8, 
    marginBottom: 8, 
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