"use client";

import React from "react";
import { Page, Text, View, Image, Link } from "@react-pdf/renderer";
import { SupportingDocument } from "@/lib/generated/prisma/client";
import { documentStyles } from "@/lib/pdf-styles";

interface SupportingDocumentsPagesProps {
  documents: SupportingDocument[];
  pageSize?: "A4" | "LEGAL" | "LETTER";
}

export const SupportingDocumentsPages: React.FC<
  SupportingDocumentsPagesProps
> = ({ documents, pageSize = "A4"}) => {

  
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : process.env.NEXT_PUBLIC_APP_URL;

  const sortedDocuments = React.useMemo(() => {
    const images = documents.filter(
      (doc) => doc.mimeType !== "application/pdf",
    );
    const pdfs = documents.filter((doc) => doc.mimeType === "application/pdf");

    return [...images, ...pdfs];
  }, [documents]);

  if (!documents || documents.length === 0) return null;

  return (
    <>
      {sortedDocuments.map((doc) => (
        <Page key={doc.id} size={pageSize} style={documentStyles.documentPage}>
          <View style={documentStyles.documentImageContainer}>
            {doc.mimeType?.startsWith("image/") ? (
              <Image src={doc.filePath} style={documentStyles.documentImage} />
            ) : doc.mimeType === "application/pdf" ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 40,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 10,
                    textAlign: "center",
                    color: "#111827",
                  }}
                >
                  {doc.fileName}
                </Text>

                <Link
                  src={`${baseUrl}${doc.filePath}`}
                  style={{
                    fontSize: 10,
                    color: "#2563eb",
                    textDecoration: "underline",
                    marginTop: 10,
                    padding: "8px 16px",
                    backgroundColor: "#eff6ff",
                    borderRadius: 4,
                  }}
                >
                  Click to Open PDF
                </Link>

                <Text
                  style={{
                    fontSize: 8,
                    color: "#9ca3af",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  (Opens in browser)
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 40,
                }}
              >
                <Text
                  style={{ fontSize: 12, color: "#666", textAlign: "center" }}
                >
                  {doc.fileName}
                </Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </>
  );
};
