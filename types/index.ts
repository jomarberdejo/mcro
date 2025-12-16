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
  signatureImage: string; 
}


export interface BirthRecordViewProps {
  record: BirthRecord;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}



export interface BirthRecordListProps {
  records: BirthRecord[];
  filters: FilterState;
  storageAvailable: boolean | null;
  onFilterChange: (filters: FilterState) => void;
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
  onChange: OnChangeHandler;
}

export type OnChangeHandler = (
  name: keyof BirthRecord
) => (
  value:
    | string
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | boolean
) => void;





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
  signatureImage: "",
});