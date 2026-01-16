"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { SupportingDocument } from "@/lib/generated/prisma/client";
import { documentStyles } from "@/lib/pdf-styles";


interface SupportingDocumentsPagesProps {
  documents: SupportingDocument[];
  registryNo: string;
  recordName: string;
  pageSize?: 'A4' | 'LEGAL' | 'LETTER';
}

export const SupportingDocumentsPages: React.FC<SupportingDocumentsPagesProps> = ({
  documents,
  registryNo,
  recordName,
  pageSize = 'A4',
}) => {
  if (!documents || documents.length === 0) return null;

  return (
    <>
      {documents.map((doc, index) => (
        <Page key={doc.id} size={pageSize} style={documentStyles.documentPage}>
          {/* Header */}
          <View style={documentStyles.documentHeader}>
            <Text style={documentStyles.documentHeaderText}>
              Supporting Document {index + 1} of {documents.length}
            </Text>
            <Text style={documentStyles.documentSubHeaderText}>
              Registry No: {registryNo} - {recordName}
            </Text>
          </View>

          {/* Document Information */}
          <View style={documentStyles.documentInfo}>
            <View style={documentStyles.documentInfoRow}>
              <Text style={documentStyles.documentInfoLabel}>File Name:</Text>
              <Text style={documentStyles.documentInfoValue}>{doc.fileName}</Text>
            </View>

            {doc.fileSize && (
              <View style={documentStyles.documentInfoRow}>
                <Text style={documentStyles.documentInfoLabel}>File Size:</Text>
                <Text style={documentStyles.documentInfoValue}>
                  {(doc.fileSize / 1024).toFixed(2)} KB
                </Text>
              </View>
            )}

            {doc.mimeType && (
              <View style={documentStyles.documentInfoRow}>
                <Text style={documentStyles.documentInfoLabel}>Type:</Text>
                <Text style={documentStyles.documentInfoValue}>{doc.mimeType}</Text>
              </View>
            )}

            {doc.description && (
              <View style={documentStyles.documentInfoRow}>
                <Text style={documentStyles.documentInfoLabel}>Description:</Text>
                <Text style={documentStyles.documentInfoValue}>{doc.description}</Text>
              </View>
            )}

            {doc.uploadedAt && (
              <View style={documentStyles.documentInfoRow}>
                <Text style={documentStyles.documentInfoLabel}>Uploaded:</Text>
                <Text style={documentStyles.documentInfoValue}>
                  {new Date(doc.uploadedAt).toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {/* Document Image */}
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

          {/* Page Number */}
          <Text style={documentStyles.documentPageNumber}>
            Page {index + 2} of {documents.length + 1}
          </Text>
        </Page>
      ))}
    </>
  );
};
