import { MarriageRecord } from "@/types";

/**
 * Fetch all marriage records from the API
 */
export async function fetchMarriageRecords(): Promise<MarriageRecord[]> {
  const response = await fetch("/api/marriage-certificate", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch marriage records");
  }

  return response.json();
}

/**
 * Fetch a single marriage record by ID
 */
export async function fetchMarriageRecordById(id: string): Promise<MarriageRecord> {
  const response = await fetch(`/api/marriage-certificate/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch marriage record");
  }

  return response.json();
}

/**
 * Create a new marriage record
 */
export async function createMarriageRecord(
  record: Omit<MarriageRecord, "id" | "createdAt">
): Promise<MarriageRecord> {
  const response = await fetch("/api/marriage-certificate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error("Failed to create marriage record");
  }

  return response.json();
}

/**
 * Update an existing marriage record
 */
export async function updateMarriageRecord(
  id: string,
  record: Partial<MarriageRecord>
): Promise<MarriageRecord> {
  const response = await fetch(`/api/marriage-certificate/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error("Failed to update marriage record");
  }

  return response.json();
}

/**
 * Delete a marriage record
 */
export async function deleteMarriageRecord(id: string): Promise<void> {
  const response = await fetch(`/api/marriage-certificate/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete marriage record");
  }
}