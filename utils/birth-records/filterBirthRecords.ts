import { BirthRecord, FilterState } from "@/types";

export function filterBirthRecords(
  records: BirthRecord[],
  filters: FilterState
): BirthRecord[] {
  return records.filter((record) => {
    const includes = (value?: string, filter?: string) =>
      !filter || value?.toLowerCase().includes(filter.toLowerCase());

    return (
      includes(record.childLastName, filters.childLastName) &&
      includes(record.childFirstName, filters.childFirstName) &&
      includes(record.fatherLastName, filters.fatherLastName) &&
      includes(record.fatherFirstName, filters.fatherFirstName) &&
      includes(record.motherLastName, filters.motherLastName) &&
      includes(record.motherFirstName, filters.motherFirstName) &&
      includes(record.dateOfBirth, filters.dob)
    );
  });
}
