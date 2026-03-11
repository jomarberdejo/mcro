import {
  MarriageCertificateApplication,
  SupportingDocument,
} from "@/lib/generated/prisma/client";

export type PageMode = "list" | "form" | "view";

// ==================== BIRTH RECORDS ====================

export interface BirthRecord {
  id: string;
  registryNo: string;
  bookNo: string;
  pageNo: string;
  dateOfRegistration: string;
  childLastName: string;
  childFirstName: string;
  childMiddleName?: string | null;
  sex: string;
  dateOfBirth: string;
  placeOfBirth?: string | null;
  isTwin: boolean;
  typeOfBirth?: string | null;
  birthOrder?: string | null;
  timeOfBirth?: string | null;
  motherLastName?: string | null;
  motherFirstName?: string | null;
  motherMiddleName?: string | null;
  motherCitizenship?: string | null;
  fatherLastName?: string | null;
  fatherFirstName?: string | null;
  fatherMiddleName?: string | null;
  fatherCitizenship?: string | null;
  dateOfMarriage?: string | null;
  placeOfMarriage?: string | null;
  remarks?: string | null;
  processFeeInfo?: string | null;
  registrarName?: string | null;
  verifiedBy?: string | null;
  verifierPosition?: string | null;
  requestorName?: string | null;
  requestPurpose?: string | null;
  certifyingOfficerName?: string | null;
  certifyingOfficerPosition?: string | null;
  signatureImagePath?: string | null;
  userId?: string | null;
  createdAt?: string | null;
  supportingDocuments?: SupportingDocument[];
}

export interface BirthRecordViewProps {
  record: BirthRecord;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface BirthRecordListProps {
  records: BirthRecord[];
  filters: BirthFilterState;
  storageAvailable: boolean | null;
  onFilterChange: (filters: BirthFilterState) => void;
  onClearFilters: () => void;
  onNew: () => void;
  onView: (record: BirthRecord) => void;
  onEdit: (record: BirthRecord) => void;
  onDelete: (id: string) => void;
}

export interface BirthRecordFormProps {
  formData: BirthRecord;
  isEditing: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: BirthOnChangeHandler;
}

export type BirthOnChangeHandler = (
  name: keyof BirthRecord,
) => (
  value:
    | string
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | boolean,
) => void;

export interface BirthFilterState {
  childLastName: string;
  childFirstName: string;
  childMiddleName?: string;
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName?: string;
  motherLastName: string;
  motherFirstName: string;
  motherMiddleName?: string;
  dob: string;
}

export const BIRTH_PREFIX = "birth_record:";

export const emptyBirthRecord = (): BirthRecord => ({
  id: "",
  pageNo: "",
  bookNo: "",
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
  verifiedBy: "",
  verifierPosition: "",
  certifyingOfficerName: "",
  certifyingOfficerPosition: "",
  requestorName: "",
  requestPurpose: "",
  signatureImagePath: "",
});

// ==================== DEATH RECORDS ====================

export interface DeathRecord {
  id: string;
  createdAt: string;
  registryNo: string;
  pageNo: string;
  bookNo: string;
  deceasedLastName: string;
  deceasedFirstName: string;
  deceasedMiddleName: string;
  sex: string;
  age: number;
  civilStatus: string;
  citizenship: string;
  dateOfDeath: string;
  placeOfDeath: string;
  causeOfDeath: string;
  dateOfRegistration: string;
  requestorName: string;
  requestPurpose: string;
  registrarName: string;
  verifiedBy: string;
  verifierPosition: string;
  certifyingOfficerName: string;
  certifyingOfficerPosition: string;
  processFeeInfo: string;
  remarks: string;
  signatureImage: string;
  supportingDocuments?: SupportingDocument[];
}

export interface DeathRecordViewProps {
  record: DeathRecord;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface DeathRecordListProps {
  records: DeathRecord[];
  filters: DeathFilterState;
  storageAvailable: boolean | null;
  onFilterChange: (filters: DeathFilterState) => void;
  onClearFilters: () => void;
  onNew: () => void;
  onView: (record: DeathRecord) => void;
  onEdit: (record: DeathRecord) => void;
  onDelete: (id: string) => void;
}

export interface DeathRecordFormProps {
  formData: DeathRecord;
  isEditing: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: DeathOnChangeHandler;
}

export type DeathOnChangeHandler = (
  name: keyof DeathRecord,
) => (
  value:
    | string
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | number,
) => void;

export interface DeathFilterState {
  deceasedLastName: string;
  deceasedFirstName: string;
  deceasedMiddleName?: string;
  dateOfDeath: string;
  nameOfFather?: string;
  nameOfMother?: string;
}

export const DEATH_PREFIX = "death_record:";

export const emptyDeathRecord = (): DeathRecord => ({
  id: "",
  createdAt: "",
  registryNo: "",
  pageNo: "",
  bookNo: "",
  deceasedLastName: "",
  deceasedFirstName: "",
  deceasedMiddleName: "",
  sex: "",
  age: 0,
  civilStatus: "",
  citizenship: "",
  dateOfDeath: "",
  placeOfDeath: "",
  causeOfDeath: "",
  dateOfRegistration: "",
  requestorName: "",
  requestPurpose: "",
  registrarName: "DARRYL U. MONTEALEGRE, MM",
  verifiedBy: "",
  verifierPosition: "",
  certifyingOfficerName: "",
  certifyingOfficerPosition: "",
  processFeeInfo: "",
  remarks: "",
  signatureImage: "",
});

// ==================== MARRIAGE RECORDS ====================

export interface MarriageRecord {
  id: string;
  createdAt: string;
  registryNo: string;
  bookNo: string;
  pageNo: string;
  dateOfMarriage: string;
  placeOfMarriage: string;
  dateOfRegistration: string;
  husbandLastName: string;
  husbandFirstName: string;
  husbandMiddleName: string;
  husbandAge: number;
  husbandNationality: string;
  husbandCivilStatus: string;
  husbandMotherName: string;
  husbandFatherName: string;
  wifeLastName: string;
  wifeFirstName: string;
  wifeMiddleName: string;
  wifeAge: number;
  wifeNationality: string;
  wifeCivilStatus: string;
  wifeMotherName: string;
  wifeFatherName: string;
  requestorName: string;
  requestPurpose: string;
  registrarName: string;
  verifiedBy: string;
  verifierPosition: string;
  certifyingOfficerName: string;
  certifyingOfficerPosition: string;
  processFeeInfo: string;
  remarks: string;
  signatureImage: string;
  supportingDocuments?: SupportingDocument[];
}

export interface MarriageRecordViewProps {
  record: MarriageRecord;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface MarriageRecordListProps {
  records: MarriageRecord[];
  filters: MarriageFilterState;
  storageAvailable: boolean | null;
  onFilterChange: (filters: MarriageFilterState) => void;
  onClearFilters: () => void;
  onNew: () => void;
  onView: (record: MarriageRecord) => void;
  onEdit: (record: MarriageRecord) => void;
  onDelete: (id: string) => void;
}

export interface MarriageRecordFormProps {
  formData: MarriageRecord;
  isEditing: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: MarriageOnChangeHandler;
}

export type MarriageOnChangeHandler = (
  name: keyof MarriageRecord,
) => (
  value:
    | string
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | number,
) => void;

export interface MarriageFilterState {
  husbandLastName: string;
  husbandFirstName: string;
  husbandMiddleName?: string;
  wifeLastName: string;
  wifeFirstName: string;
  wifeMiddleName?: string;
  dateOfMarriage: string;
  placeOfMarriage: string;
}

export const MARRIAGE_PREFIX = "marriage_record:";

export const emptyMarriageRecord = (): MarriageRecord => ({
  id: "",
  createdAt: "",
  registryNo: "",
  bookNo: "",
  pageNo: "",
  dateOfMarriage: "",
  placeOfMarriage: "",
  dateOfRegistration: "",
  husbandLastName: "",
  husbandFirstName: "",
  husbandMiddleName: "",
  husbandAge: 0,
  husbandNationality: "",
  husbandCivilStatus: "",
  husbandMotherName: "",
  husbandFatherName: "",
  wifeLastName: "",
  wifeFirstName: "",
  wifeMiddleName: "",
  wifeAge: 0,
  wifeNationality: "",
  wifeCivilStatus: "",
  wifeMotherName: "",
  wifeFatherName: "",
  requestorName: "",
  requestPurpose: "",
  registrarName: "DARRYL U. MONTEALEGRE, MM",
  verifiedBy: "",
  verifierPosition: "",
  certifyingOfficerName: "",
  certifyingOfficerPosition: "",
  processFeeInfo: "",
  remarks: "",
  signatureImage: "",
});

// ==================== SHARED TYPES ====================

export type CivilStatus = "Single" | "Married" | "Widowed" | "Divorced";
export type Sex = "Male" | "Female";
