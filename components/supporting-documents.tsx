"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { SupportingDocument } from "@/lib/generated/prisma/client";
import { documentStyles } from "@/lib/pdf-styles";

interface SupportingDocumentsPagesProps {
  documents: SupportingDocument[];
  pageSize?: 'A4' | 'LEGAL' | 'LETTER';
}

export const SupportingDocumentsPages: React.FC<SupportingDocumentsPagesProps> = ({
  documents,
  pageSize = 'A4',
}) => {
  if (!documents || documents.length === 0) return null;

  return (
    <>
      {documents.map((doc, index) => (
        <Page key={doc.id} size={pageSize} style={documentStyles.documentPage}>
          <View style={documentStyles.documentImageContainer}>
            {doc.mimeType?.startsWith('image/') ? (
              <Image
                src={doc.filePath}
                style={documentStyles.documentImage}
              />
            ) : (
              <Text style={documentStyles.noDocumentsText}>
                Document preview not available for this file type.
                {'\n'}File: {doc.fileName}
              </Text>
            )}
          </View>
        </Page>
      ))}
    </>
  );
};