"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterState } from "@/types";
import { BirthRecordList } from "@/components/birth-certificate/birth-record-list";
import { filterBirthRecords } from "@/utils/birth-records/filterBirthRecords";
import { useBirthRecords } from "@/hooks/use-birth-record";

const EMPTY_FILTERS: FilterState = {
  childLastName: "",
  childFirstName: "",
  fatherLastName: "",
  fatherFirstName: "",
  motherLastName: "",
  motherFirstName: "",
  dob: "",
};

const BirthCertificates: React.FC = () => {
  const router = useRouter();
  const { records, deleteRecord } = useBirthRecords();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

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
