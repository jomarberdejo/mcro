import { DeathRecord } from "@/types";

/**
 * Fetch all death records from the API
 */
export async function fetchDeathRecords(): Promise<DeathRecord[]> {
  const response = await fetch("/api/death-certificate", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch death records");
  }

  return response.json();
}

/**
 * Fetch a single death record by ID
 */
export async function fetchDeathRecordById(id: string): Promise<DeathRecord> {
  const response = await fetch(`/api/death-certificate/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch death record");
  }

  return response.json();
}

/**
 * Create a new death record
 */
export async function createDeathRecord(
  record: Omit<DeathRecord, "id" | "createdAt">
): Promise<DeathRecord> {
  const response = await fetch("/api/death-certificate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error("Failed to create death record");
  }

  return response.json();
}

/**
 * Update an existing death record
 */
export async function updateDeathRecord(
  id: string,
  record: Partial<DeathRecord>
): Promise<DeathRecord> {
  const response = await fetch(`/api/death-certificate/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error("Failed to update death record");
  }

  return response.json();
}

/**
 * Delete a death record
 */
export async function deleteDeathRecord(id: string): Promise<void> {
  const response = await fetch(`/api/death-certificate/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete death record");
  }
}