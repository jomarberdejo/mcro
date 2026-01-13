import { MarriageCertificateApplicationFilterState } from "@/app/admin/(pages)/marriage-certificate-application/page";
import { MarriageCertificateApplication } from "@/lib/generated/prisma/client";

export function filterMarriageCertificateApplications(
  applications: MarriageCertificateApplication[],
  filters: MarriageCertificateApplicationFilterState
): MarriageCertificateApplication[] {
  return applications.filter((app) => {
    // Registry No filter
    if (
      filters.registryNo &&
      !app.registryNo.toLowerCase().includes(filters.registryNo.toLowerCase())
    ) {
      return false;
    }

    // Groom filters
    if (
      filters.groomLastName &&
      !app.groomLastName.toLowerCase().includes(filters.groomLastName.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.groomFirstName &&
      !app.groomFirstName.toLowerCase().includes(filters.groomFirstName.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.groomMiddleName &&
      app.groomMiddleName &&
      !app.groomMiddleName.toLowerCase().includes(filters.groomMiddleName.toLowerCase())
    ) {
      return false;
    }

    // Bride filters
    if (
      filters.brideLastName &&
      !app.brideLastName.toLowerCase().includes(filters.brideLastName.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.brideFirstName &&
      !app.brideFirstName.toLowerCase().includes(filters.brideFirstName.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.brideMiddleName &&
      app.brideMiddleName &&
      !app.brideMiddleName.toLowerCase().includes(filters.brideMiddleName.toLowerCase())
    ) {
      return false;
    }

    // Date of Registration filter
    if (
      filters.dateOfRegistration &&
      app.dateOfRegistration &&
      !app.dateOfRegistration.toLowerCase().includes(filters.dateOfRegistration.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}