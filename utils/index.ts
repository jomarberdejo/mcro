
export const getFullName = (
  lastName?: string | null,
  firstName?: string | null,
  middleName?: string | null
): string => {
  return `${lastName}, ${firstName}${middleName ? " " + middleName : ""}`.trim();
};

