import { BirthRecord, BirthFilterState } from "@/types";

export function filterBirthRecords(
  records: BirthRecord[],
  filters: BirthFilterState
): BirthRecord[] {
  return records.filter((record) => {
    const includes = (value?: string | null, filter?: string) =>
      !filter || (value ?? "").toLowerCase().includes(filter.toLowerCase());

    return (
      includes(record.childLastName, filters.childLastName) &&
      includes(record.childFirstName, filters.childFirstName) &&
      includes(record.childMiddleName, filters.childMiddleName) &&
      includes(record.fatherLastName, filters.fatherLastName) &&
      includes(record.fatherFirstName, filters.fatherFirstName) &&
      includes(record.fatherMiddleName, filters.fatherMiddleName) &&
      includes(record.motherLastName, filters.motherLastName) &&
      includes(record.motherFirstName, filters.motherFirstName) &&
      includes(record.motherMiddleName, filters.motherMiddleName) &&
      includes(record.dateOfBirth, filters.dob)
    );
  });
}
