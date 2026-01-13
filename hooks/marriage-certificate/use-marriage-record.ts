"use client";

import { useEffect, useState, useCallback } from "react";
import { MarriageRecord } from "@/types";
import { toast } from "sonner";
import { deleteMarriageRecord, fetchMarriageRecords } from "@/services/marriage-records";

export function useMarriageRecords() {
  const [records, setRecords] = useState<MarriageRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMarriageRecords();
      setRecords(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load marriage records");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteMarriageRecord(id);
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