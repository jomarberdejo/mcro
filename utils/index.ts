export const getFullName = (
  lastName?: string | null,
  firstName?: string | null,
  middleName?: string | null
): string => {
  return `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();
};

