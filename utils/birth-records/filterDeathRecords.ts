import { DeathRecord, DeathFilterState } from "@/types";

/**
 * Filters death records based on the provided filter criteria
 */
export function filterDeathRecords(
  records: DeathRecord[],
  filters: DeathFilterState
): DeathRecord[] {
  return records.filter((record) => {
    // Deceased Last Name
    if (
      filters.deceasedLastName &&
      !record.deceasedLastName
        .toLowerCase()
        .includes(filters.deceasedLastName.toLowerCase())
    ) {
      return false;
    }

    // Deceased First Name
    if (
      filters.deceasedFirstName &&
      !record.deceasedFirstName
        .toLowerCase()
        .includes(filters.deceasedFirstName.toLowerCase())
    ) {
      return false;
    }

    // Deceased Middle Name
    if (
      filters.deceasedMiddleName &&
      !record.deceasedMiddleName
        ?.toLowerCase()
        .includes(filters.deceasedMiddleName.toLowerCase())
    ) {
      return false;
    }

    // Date of Death
    if (
      filters.dateOfDeath &&
      !record.dateOfDeath
        .toLowerCase()
        .includes(filters.dateOfDeath.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}