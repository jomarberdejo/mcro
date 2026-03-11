

import { MarriageCertificateApplicationWithDocs } from "@/components/marriage-cert-app/marriage-cert-app-list";
import { MarriageCertificateApplication } from "@/lib/generated/prisma/client";


/**
 * Fetch all marriage certificate applications
 */
export async function fetchMarriageCertificateApplications(): Promise<MarriageCertificateApplicationWithDocs[]> {
  const response = await fetch("/api/marriage-certificate-application");
  
  if (!response.ok) {
    throw new Error("Failed to fetch marriage certificate applications");
  }
  
  return response.json();
}

/**
 * Fetch a single marriage certificate application by ID
 */
export async function fetchMarriageCertificateApplicationById(id: string): Promise<MarriageCertificateApplication> {
  const response = await fetch(`/api/marriage-certificate-application/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch marriage certificate application");
  }
  
  return response.json();
}

/**
 * Create a new marriage certificate application
 */
export async function createMarriageCertificateApplication(
  data: Partial<MarriageCertificateApplication>
): Promise<MarriageCertificateApplication> {
  const response = await fetch("/api/marriage-certificate-application", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create marriage certificate application");
  }
  
  return response.json();
}

/**
 * Update an existing marriage certificate application
 */
export async function updateMarriageCertificateApplication(
  id: string,
  data: Partial<MarriageCertificateApplication>
): Promise<MarriageCertificateApplication> {
  const response = await fetch(`/api/marriage-certificate-application/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update marriage certificate application");
  }
  
  return response.json();
}

/**
 * Delete a marriage certificate application
 */
export async function deleteMarriageCertificateApplication(id: string): Promise<void> {
  const response = await fetch(`/api/marriage-certificate-application/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete marriage certificate application");
  }
}