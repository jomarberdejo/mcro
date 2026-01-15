import { MarriageRecord, MarriageFilterState } from "@/types";
import { filterRecords } from "../filter-records";

export function filterMarriageRecords(
  records: MarriageRecord[],
  filters: MarriageFilterState
): MarriageRecord[] {
  return filterRecords(records, filters);
}