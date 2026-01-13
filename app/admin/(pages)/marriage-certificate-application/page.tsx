"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMarriageCertificateApplications } from "@/hooks/marriage-certificate-application/use-marriage-certificate-application";
import { filterMarriageCertificateApplications } from "@/utils/birth-records/filterMarriageCertificateApplication";
import { MarriageCertificateApplicationList } from "@/components/marriage-certificate-application/marriage-certificate-application-list";

export interface MarriageCertificateApplicationFilterState {
  registryNo: string;
  groomLastName: string;
  groomFirstName: string;
  groomMiddleName: string;
  brideLastName: string;
  brideFirstName: string;
  brideMiddleName: string;
  dateOfRegistration: string;
}

const EMPTY_FILTERS: MarriageCertificateApplicationFilterState = {
  registryNo: "",
  groomLastName: "",
  groomFirstName: "",
  groomMiddleName: "",
  brideLastName: "",
  brideFirstName: "",
  brideMiddleName: "",
  dateOfRegistration: "",
};

const MarriageCertificateApplications: React.FC = () => {
  const router = useRouter();
  const { applications, deleteApplication } = useMarriageCertificateApplications();
  const [filters, setFilters] = useState<MarriageCertificateApplicationFilterState>(EMPTY_FILTERS);

  const filteredApplications = filterMarriageCertificateApplications(applications, filters);

  return (
    <MarriageCertificateApplicationList
      applications={filteredApplications}
      filters={filters}
      storageAvailable
      onFilterChange={setFilters}
      onClearFilters={() => setFilters(EMPTY_FILTERS)}
      onNew={() => router.push("/admin/marriage-certificate-application/new")}
      onView={(app) => router.push(`/admin/marriage-certificate-application/${app.id}`)}
      onEdit={(app) => router.push(`/admin/marriage-certificate-application/${app.id}/edit`)}
      onDelete={deleteApplication}
    />
  );
};

export default MarriageCertificateApplications;