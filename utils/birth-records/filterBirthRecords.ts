import { BirthRecord, BirthFilterState } from "@/types";
import { filterRecords } from "../filter-records";

export function filterBirthRecords(
  records: BirthRecord[],
  filters: BirthFilterState
): BirthRecord[] {
  return filterRecords(records, filters, {
    dob: "dateOfBirth" as keyof BirthRecord, 
  });
}