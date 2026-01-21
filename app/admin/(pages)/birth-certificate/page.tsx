"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BirthFilterState } from "@/types";
import { BirthRecordList } from "@/components/birth-certificate/birth-record-list";
import { filterBirthRecords } from "@/utils/filters/filterBirthRecords";
import { useBirthRecords } from "@/hooks/birth-certificate/use-birth-record";

const EMPTY_FILTERS: BirthFilterState = {
  childLastName: "",
  childFirstName: "",
  childMiddleName: "",
  fatherLastName: "",
  fatherFirstName: "",
  fatherMiddleName: "",
  motherLastName: "",
  motherFirstName: "",
  motherMiddleName: "",
  dob: "",
};

const BirthCertificates: React.FC = () => {
  const router = useRouter();
  const { records, deleteRecord } = useBirthRecords();
  const [filters, setFilters] = useState<BirthFilterState>(EMPTY_FILTERS);

  const filteredRecords = filterBirthRecords(records, filters);
  

  return (
    <BirthRecordList
      records={filteredRecords}
      filters={filters}
      storageAvailable
      onFilterChange={setFilters}
      onClearFilters={() => setFilters(EMPTY_FILTERS)}
      onNew={() => router.push("/admin/birth-certificate/new")}
      onView={(r) => router.push(`/admin/birth-certificate/${r.id}`)}
      onEdit={(r) => router.push(`/admin/birth-certificate/${r.id}/edit`)}
      onDelete={deleteRecord}
    />
  );
};

export default BirthCertificates;
