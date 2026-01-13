"use client";

import { useEffect, useState, useCallback } from "react";
import { DeathRecord } from "@/types";
import { toast } from "sonner";
import { deleteDeathRecord, fetchDeathRecords } from "@/services/death-records";

export function useDeathRecords() {
  const [records, setRecords] = useState<DeathRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDeathRecords();
      setRecords(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load death records");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteDeathRecord(id);
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