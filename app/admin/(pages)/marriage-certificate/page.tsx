"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MarriageFilterState } from "@/types";
import { MarriageRecordList } from "@/components/marriage-certificate/marriage-record-list";
import { filterMarriageRecords } from "@/utils/filters/filterMarriageRecords";
import { useMarriageRecords } from "@/hooks/marriage-certificate/use-marriage-record";

const EMPTY_FILTERS: MarriageFilterState = {
  husbandLastName: "",
  husbandFirstName: "",
  husbandMiddleName: "",
  wifeLastName: "",
  wifeFirstName: "",
  wifeMiddleName: "",
  dateOfMarriage: "",
  placeOfMarriage: "",
};

const MarriageCertificates: React.FC = () => {
  const router = useRouter();
  const { records, deleteRecord } = useMarriageRecords();
  const [filters, setFilters] = useState<MarriageFilterState>(EMPTY_FILTERS);

  const filteredRecords = filterMarriageRecords(records, filters);

  return (
    <MarriageRecordList
      records={filteredRecords}
      filters={filters}
      storageAvailable
      onFilterChange={setFilters}
      onClearFilters={() => setFilters(EMPTY_FILTERS)}
      onNew={() => router.push("/admin/marriage-certificate/new")}
      onView={(r) => router.push(`/admin/marriage-certificate/${r.id}`)}
      onEdit={(r) => router.push(`/admin/marriage-certificate/${r.id}/edit`)}
      onDelete={deleteRecord}
    />
  );
};

export default MarriageCertificates;