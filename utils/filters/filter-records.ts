
export function filterRecords<TRecord extends Record<string, any>, TFilters extends Record<string, any>>(
  records: TRecord[],
  filters: TFilters,
  fieldMappings?: Partial<Record<keyof TFilters, keyof TRecord>>
): TRecord[] {
  return records.filter((record) => {
    for (const filterKey in filters) {
      const filterValue = filters[filterKey];
      
      if (!filterValue) continue;

      const recordKey = fieldMappings?.[filterKey as keyof TFilters] ?? filterKey;
      const recordValue = record[recordKey as keyof TRecord];

      if (recordValue == null) return false;

      const recordStr = String(recordValue).toLowerCase();
      const filterStr = String(filterValue).toLowerCase();

      if (!recordStr.includes(filterStr)) {
        return false;
      }
    }

    return true;
  });
}