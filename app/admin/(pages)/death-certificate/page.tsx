"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DeathFilterState } from "@/types";
import { DeathRecordList } from "@/components/death-certificate/death-record-list";
import { useDeathRecords } from "@/hooks/death-certificate/use-death-record";
import { filterDeathRecords } from "@/utils/birth-records/filterDeathRecords";

const EMPTY_FILTERS: DeathFilterState = {
  deceasedLastName: "",
  deceasedFirstName: "",
  deceasedMiddleName: "",
  dateOfDeath: "",
};

const DeathCertificates: React.FC = () => {
  const router = useRouter();
  const { records, deleteRecord } = useDeathRecords();
  const [filters, setFilters] = useState<DeathFilterState>(EMPTY_FILTERS);

  const filteredRecords = filterDeathRecords(records, filters);

  return (
    <DeathRecordList
      records={filteredRecords}
      filters={filters}
      storageAvailable
      onFilterChange={setFilters}
      onClearFilters={() => setFilters(EMPTY_FILTERS)}
      onNew={() => router.push("/admin/death-certificate/new")}
      onView={(r) => router.push(`/admin/death-certificate/${r.id}`)}
      onEdit={(r) => router.push(`/admin/death-certificate/${r.id}/edit`)}
      onDelete={deleteRecord}
    />
  );
};

export default DeathCertificates;