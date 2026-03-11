import { MarriageCertificateApplicationFilterState } from "@/app/admin/(pages)/marriage-cert-app/page";
import { MarriageCertificateApplication } from "@/lib/generated/prisma/client";
import { filterRecords } from "./filter-records";
import { MarriageCertificateApplicationWithDocs } from "@/components/marriage-cert-app/marriage-cert-app-list";

export function filterMarriageCertificateApplications(
  applications: MarriageCertificateApplicationWithDocs[],
  filters: MarriageCertificateApplicationFilterState
): MarriageCertificateApplicationWithDocs[] {
  return filterRecords(applications, filters);
}