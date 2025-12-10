import { BirthRecord, FilterState, PREFIX } from "@/types";
import { storage } from "@/lib/storage";

export const getFullName = (
  lastName: string,
  firstName: string,
  middleName: string
): string => {
  return `${lastName}, ${firstName}${middleName ? " " + middleName : ""}`.trim();
};

export const loadRecords = async (): Promise<BirthRecord[]> => {
  try {
    const { keys } = await storage.list(PREFIX);
    const loaded: BirthRecord[] = [];
    
    for (const k of keys) {
      const result = await storage.get(k);
      if (result?.value) {
        try {
          const parsed: BirthRecord = JSON.parse(result.value);
          loaded.push(parsed);
        } catch (err) {
          console.warn("Failed to parse record", k, err);
        }
      }
    }
    
    loaded.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return loaded;
  } catch (err) {
    console.error("Error loading records:", err);
    return [];
  }
};

export const saveRecord = async (data: BirthRecord): Promise<boolean> => {
  const ok =
    data.registryNo &&
    data.childLastName &&
    data.childFirstName &&
    data.dateOfBirth;
    
  if (!ok) {
    alert(
      "Please fill registry no, child name (last and first) and date of birth."
    );
    return false;
  }

  const record: BirthRecord = {
    ...data,
    id: data.id || crypto.randomUUID(),
    createdAt: data.createdAt || new Date().toISOString(),
  };

  try {
    await storage.set(`${PREFIX}${record.id}`, JSON.stringify(record));
    return true;
  } catch (err) {
    console.error("Error saving record:", err);
    alert("Failed to save record.");
    return false;
  }
};

export const deleteRecord = async (id: string): Promise<boolean> => {
  if (!confirm("Delete this record? This cannot be undone.")) return false;
  
  try {
    await storage.remove(`${PREFIX}${id}`);
    return true;
  } catch (err) {
    console.error("Error deleting record:", err);
    alert("Failed to delete.");
    return false;
  }
};

export const filterRecords = (
  records: BirthRecord[],
  filters: FilterState
): BirthRecord[] => {
  return records.filter((record) => {
    const matchesChildLast =
      !filters.childLastName ||
      record.childLastName
        .toLowerCase()
        .includes(filters.childLastName.toLowerCase());

    const matchesChildFirst =
      !filters.childFirstName ||
      record.childFirstName
        .toLowerCase()
        .includes(filters.childFirstName.toLowerCase());

    const matchesFatherLast =
      !filters.fatherLastName ||
      record.fatherLastName
        .toLowerCase()
        .includes(filters.fatherLastName.toLowerCase());

    const matchesFatherFirst =
      !filters.fatherFirstName ||
      record.fatherFirstName
        .toLowerCase()
        .includes(filters.fatherFirstName.toLowerCase());

    const matchesMotherLast =
      !filters.motherLastName ||
      record.motherLastName
        .toLowerCase()
        .includes(filters.motherLastName.toLowerCase());

    const matchesMotherFirst =
      !filters.motherFirstName ||
      record.motherFirstName
        .toLowerCase()
        .includes(filters.motherFirstName.toLowerCase());

    const matchesDob =
      !filters.dob ||
      record.dateOfBirth.toLowerCase().includes(filters.dob.toLowerCase());

    return (
      matchesChildLast &&
      matchesChildFirst &&
      matchesFatherLast &&
      matchesFatherFirst &&
      matchesMotherLast &&
      matchesMotherFirst &&
      matchesDob
    );
  });
};