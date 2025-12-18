import { BirthRecord } from "@/types";

export async function fetchBirthRecords(): Promise<BirthRecord[]> {
  const res = await fetch("/api/birth-certificate");

  if (!res.ok) {
    throw new Error("Failed to fetch birth records");
  }

  return res.json();
}

export async function deleteBirthRecord(id: string): Promise<void> {
  const res = await fetch(`/api/birth-certificate/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete birth record");
  }
}
