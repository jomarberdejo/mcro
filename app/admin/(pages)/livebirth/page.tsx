"use client";

import React, { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import {
  BirthRecord,
  PageMode,
  FilterState,
  emptyRecord,
} from "@/types";
import {
  loadRecords,
  saveRecord,
  deleteRecord,
  filterRecords,
} from "@/utils";
import { BirthRecordForm } from "@/components/birth-certificate/birth-record-form";
import { BirthRecordView } from "@/components/birth-certificate/birth-record-view";
import { BirthRecordList } from "@/components/birth-certificate/birth-record-list";

const CivilRegistrySystem: React.FC = () => {
  const [page, setPage] = useState<PageMode>("list");
  const [records, setRecords] = useState<BirthRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BirthRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BirthRecord>(emptyRecord());
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(null);
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
    const ok = typeof window !== "undefined" && !!storage;
    setStorageAvailable(ok);
    if (ok) loadAllRecords();
  }, []);

  const loadAllRecords = async () => {
    const loaded = await loadRecords();
    setRecords(loaded);
  };

  const handleSaveRecord = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!storageAvailable) {
      alert("Storage unavailable in this environment.");
      return;
    }

    const success = await saveRecord(formData);
    if (success) {
      await loadAllRecords();
      setFormData(emptyRecord());
      setPage("list");
      setIsEditing(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const success = await deleteRecord(id);
    if (success) {
      await loadAllRecords();
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
        setPage("list");
      }
    }
  };

  const handleChange = (
    name: keyof BirthRecord
  ): ((
    value:
      | string
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | boolean
  ) => void) => {
    return (value) => {
      const v =
        typeof value === "string"
          ? value
          : typeof value === "boolean"
          ? value
          : value.target.value;
      setFormData((p) => ({ ...p, [name]: v }));
    };
  };

  const handleEdit = (record: BirthRecord) => {
    setFormData(record);
    setIsEditing(true);
    setPage("form");
  };

  const handleView = (record: BirthRecord) => {
    setSelectedRecord(record);
    setPage("view");
  };

  const handleNew = () => {
    setFormData(emptyRecord());
    setIsEditing(false);
    setPage("form");
  };

  const handleCancel = () => {
    setPage("list");
    setFormData(emptyRecord());
    setIsEditing(false);
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

  const filteredRecords = filterRecords(records, filters);

  if (page === "form") {
    return (
      <BirthRecordForm
        formData={formData}
        isEditing={isEditing}
        onBack={() => setPage("list")}
        onSubmit={handleSaveRecord}
        onCancel={handleCancel}
        onChange={handleChange}
      />
    );
  }

  if (page === "view" && selectedRecord) {
    return (
      <BirthRecordView
        record={selectedRecord}
        onBack={() => setPage("list")}
        onEdit={() => handleEdit(selectedRecord)}
        onDelete={() => handleDeleteRecord(selectedRecord.id)}
      />
    );
  }

  // Render list page
  return (
    <BirthRecordList
      records={filteredRecords}
      filters={filters}
      storageAvailable={storageAvailable}
      onFilterChange={setFilters}
      onClearFilters={handleClearFilters}
      onNew={handleNew}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDeleteRecord}
    />
  );
};

export default CivilRegistrySystem;