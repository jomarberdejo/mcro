// lib/utils/filterRecords.ts

/**
 * Generic record filtering utility
 * @param records - Array of records to filter
 * @param filters - Object containing filter criteria
 * @param fieldMappings - Map of filter keys to record keys (optional, defaults to same keys)
 * @returns Filtered array of records
 */
export function filterRecords<TRecord extends Record<string, any>, TFilters extends Record<string, any>>(
  records: TRecord[],
  filters: TFilters,
  fieldMappings?: Partial<Record<keyof TFilters, keyof TRecord>>
): TRecord[] {
  return records.filter((record) => {
    // Check each filter criterion
    for (const filterKey in filters) {
      const filterValue = filters[filterKey];
      
      // Skip empty filters
      if (!filterValue) continue;

      // Determine the corresponding record field
      const recordKey = fieldMappings?.[filterKey as keyof TFilters] ?? filterKey;
      const recordValue = record[recordKey as keyof TRecord];

      // Handle null/undefined record values
      if (recordValue == null) return false;

      // Perform case-insensitive string matching
      const recordStr = String(recordValue).toLowerCase();
      const filterStr = String(filterValue).toLowerCase();

      if (!recordStr.includes(filterStr)) {
        return false;
      }
    }

    return true;
  });
}