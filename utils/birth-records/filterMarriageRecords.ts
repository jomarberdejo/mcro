import { MarriageRecord, MarriageFilterState } from "@/types";

/**
 * Filters marriage records based on the provided filter criteria
 */
export function filterMarriageRecords(
  records: MarriageRecord[],
  filters: MarriageFilterState
): MarriageRecord[] {
  return records.filter((record) => {
    // Husband Last Name
    if (
      filters.husbandLastName &&
      !record.husbandLastName
        .toLowerCase()
        .includes(filters.husbandLastName.toLowerCase())
    ) {
      return false;
    }

    // Husband First Name
    if (
      filters.husbandFirstName &&
      !record.husbandFirstName
        .toLowerCase()
        .includes(filters.husbandFirstName.toLowerCase())
    ) {
      return false;
    }

    // Husband Middle Name
    if (
      filters.husbandMiddleName &&
      !record.husbandMiddleName
        ?.toLowerCase()
        .includes(filters.husbandMiddleName.toLowerCase())
    ) {
      return false;
    }

    // Wife Last Name
    if (
      filters.wifeLastName &&
      !record.wifeLastName
        .toLowerCase()
        .includes(filters.wifeLastName.toLowerCase())
    ) {
      return false;
    }

    // Wife First Name
    if (
      filters.wifeFirstName &&
      !record.wifeFirstName
        .toLowerCase()
        .includes(filters.wifeFirstName.toLowerCase())
    ) {
      return false;
    }

    // Wife Middle Name
    if (
      filters.wifeMiddleName &&
      !record.wifeMiddleName
        ?.toLowerCase()
        .includes(filters.wifeMiddleName.toLowerCase())
    ) {
      return false;
    }

    // Date of Marriage
    if (
      filters.dateOfMarriage &&
      !record.dateOfMarriage
        .toLowerCase()
        .includes(filters.dateOfMarriage.toLowerCase())
    ) {
      return false;
    }

    // Place of Marriage
    if (
      filters.placeOfMarriage &&
      !record.placeOfMarriage
        .toLowerCase()
        .includes(filters.placeOfMarriage.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}