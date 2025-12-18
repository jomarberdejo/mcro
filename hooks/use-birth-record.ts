"use client";

import { useEffect, useState, useCallback } from "react";
import { BirthRecord } from "@/types";
import { toast } from "sonner";
import { deleteBirthRecord, fetchBirthRecords } from "@/services/birth-records";

export function useBirthRecords() {
  const [records, setRecords] = useState<BirthRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBirthRecords();
      setRecords(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load birth records");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteBirthRecord(id);
      toast.success("Record deleted successfully");
      await loadRecords();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return {
    records,
    loading,
    reload: loadRecords,
    deleteRecord: removeRecord,
  };
}
