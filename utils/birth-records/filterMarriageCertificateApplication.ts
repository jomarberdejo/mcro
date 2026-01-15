import { MarriageCertificateApplicationFilterState } from "@/app/admin/(pages)/marriage-cert-app/page";
import { MarriageCertificateApplication } from "@/lib/generated/prisma/client";
import { filterRecords } from "../filter-records";

export function filterMarriageCertificateApplications(
  applications: MarriageCertificateApplication[],
  filters: MarriageCertificateApplicationFilterState
): MarriageCertificateApplication[] {
  return filterRecords(applications, filters);
}