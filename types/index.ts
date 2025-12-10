// types.ts
export type PageMode = "list" | "form" | "view";

export interface BirthRecord {
  id: string;
  createdAt: string;
  registryNo: string;
  dateOfRegistration: string;
  childLastName: string;
  childFirstName: string;
  childMiddleName: string;
  sex: string;
  dateOfBirth: string;
  isTwin: boolean;
  birthOrder: string;
  placeOfBirth: string;
  motherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherCitizenship: string;
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherCitizenship: string;
  dateOfMarriage: string;
  placeOfMarriage: string;
  remarks: string;
  registrarName: string;
}

export interface FilterState {
  childLastName: string;
  childFirstName: string;
  fatherLastName: string;
  fatherFirstName: string;
  motherLastName: string;
  motherFirstName: string;
  dob: string;
}

export const PREFIX = "birth_record:";

export const emptyRecord = (): BirthRecord => ({
  id: "",
  createdAt: "",
  registryNo: "",
  dateOfRegistration: "",
  childLastName: "",
  childFirstName: "",
  childMiddleName: "",
  sex: "",
  dateOfBirth: "",
  isTwin: false,
  birthOrder: "",
  placeOfBirth: "",
  motherLastName: "",
  motherFirstName: "",
  motherMiddleName: "",
  motherCitizenship: "",
  fatherLastName: "",
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherCitizenship: "",
  dateOfMarriage: "",
  placeOfMarriage: "",
  remarks: "",
  registrarName: "DARRYL U. MONTEALEGRE, MM",
});