import { DeathRecord, DeathFilterState } from "@/types";
import { filterRecords } from "../filter-records";

export function filterDeathRecords(
  records: DeathRecord[],
  filters: DeathFilterState
): DeathRecord[] {
  return filterRecords(records, filters);
}