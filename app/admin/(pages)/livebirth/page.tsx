"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BirthRecord, FilterState } from "@/types";
import { BirthRecordList } from "@/components/birth-certificate/birth-record-list";
import { toast } from "sonner";

const LiveBirth: React.FC = () => {
  const router = useRouter();
  const [records, setRecords] = useState<BirthRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    childLastName: "",
    childFirstName: "",
    fatherLastName: "",
    fatherFirstName: "",
    motherLastName: "",
    motherFirstName: "",
    dob: "",
  });

  useEffect(() => {
    loadAllRecords();
  }, []);

  const loadAllRecords = async () => {
    try {
      const response = await fetch("/api/birth-records");
      
      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error loading records:", error);
      toast.error("Failed to load birth records");
    } finally {
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const response = await fetch(`/api/birth-records/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      toast.success("Record deleted successfully");
      await loadAllRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };

  const handleNew = () => {
    router.push("/admin/birth-records/new");
  };

  const handleView = (record: BirthRecord) => {
    router.push(`/admin/birth-records/${record.id}`);
  };

  const handleEdit = (record: BirthRecord) => {
    router.push(`/admin/birth-records/${record.id}/edit`);
  };

  const handleClearFilters = () => {
    setFilters({
      childLastName: "",
      childFirstName: "",
      fatherLastName: "",
      fatherFirstName: "",
      motherLastName: "",
      motherFirstName: "",
      dob: "",
    });
  };

  const filteredRecords = filterRecordsLocally(records, filters);

  return (
    <BirthRecordList
      records={filteredRecords}
      filters={filters}
      storageAvailable={true}
      onFilterChange={setFilters}
      onClearFilters={handleClearFilters}
      onNew={handleNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDeleteRecord}
    />
  );
};

function filterRecordsLocally(records: BirthRecord[], filters: FilterState): BirthRecord[] {
  return records.filter((record) => {
    const matchesChildLastName =
      !filters.childLastName ||
      record.childLastName.toLowerCase().includes(filters.childLastName.toLowerCase());
    
    const matchesChildFirstName =
      !filters.childFirstName ||
      record.childFirstName.toLowerCase().includes(filters.childFirstName.toLowerCase());
    
    const matchesFatherLastName =
      !filters.fatherLastName ||
      record.fatherLastName?.toLowerCase().includes(filters.fatherLastName.toLowerCase());
    
    const matchesFatherFirstName =
      !filters.fatherFirstName ||
      record.fatherFirstName?.toLowerCase().includes(filters.fatherFirstName.toLowerCase());
    
    const matchesMotherLastName =
      !filters.motherLastName ||
      record.motherLastName?.toLowerCase().includes(filters.motherLastName.toLowerCase());
    
    const matchesMotherFirstName =
      !filters.motherFirstName ||
      record.motherFirstName?.toLowerCase().includes(filters.motherFirstName.toLowerCase());
    
    const matchesDob =
      !filters.dob ||
      record.dateOfBirth.toLowerCase().includes(filters.dob.toLowerCase());

    return (
      matchesChildLastName &&
      matchesChildFirstName &&
      matchesFatherLastName &&
      matchesFatherFirstName &&
      matchesMotherLastName &&
      matchesMotherFirstName &&
      matchesDob
    );
  });
}

export default LiveBirth;