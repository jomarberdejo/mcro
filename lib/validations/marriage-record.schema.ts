import { z } from "zod";

export const marriageRecordSchema = z.object({
  registryNo: z.string().min(1, "Registry number is required"),
  bookNo: z.string().default(""),
  pageNo: z.string().default(""),
  
  // Marriage Details
  dateOfMarriage: z.string().min(1, "Date of marriage is required"),
  placeOfMarriage: z.string().min(1, "Place of marriage is required"),
  dateOfRegistration: z.string().default(""),
  
  // Husband Information
  husbandLastName: z.string().min(1, "Husband's last name is required"),
  husbandFirstName: z.string().min(1, "Husband's first name is required"),
  husbandMiddleName: z.string().default(""),
  husbandAge: z.number().min(18, "Husband must be at least 18 years old").max(150, "Invalid age"),
  husbandNationality: z.string().min(1, "Husband's nationality is required"),
  husbandCivilStatus: z.enum(["Single", "Married", "Widowed", "Divorced"]),
  husbandMotherName: z.string().default(""),
  husbandFatherName: z.string().default(""),
  
  // Wife Information
  wifeLastName: z.string().min(1, "Wife's last name is required"),
  wifeFirstName: z.string().min(1, "Wife's first name is required"),
  wifeMiddleName: z.string().default(""),
  wifeAge: z.number().min(18, "Wife must be at least 18 years old").max(150, "Invalid age"),
  wifeNationality: z.string().min(1, "Wife's nationality is required"),
  wifeCivilStatus: z.enum(["Single", "Married", "Widowed", "Divorced"]),
  wifeMotherName: z.string().default(""),
  wifeFatherName: z.string().default(""),
  
  // Request Information
  requestorName: z.string().default(""),
  requestPurpose: z.string().default(""),
  
  // Official Information
  registrarName: z.string().default(""),
  verifiedBy: z.string().default(""),
  verifierPosition: z.string().default(""),
  certifyingOfficerName: z.string().default(""),
  certifyingOfficerPosition: z.string().default(""),
  
  // Additional Information
  processFeeInfo: z.string().default(""),
  remarks: z.string().default(""),
  signatureImagePath: z.string().default(""),
});

export type MarriageRecordFormInput = z.input<typeof marriageRecordSchema>;
export type MarriageRecordFormData = z.output<typeof marriageRecordSchema>;