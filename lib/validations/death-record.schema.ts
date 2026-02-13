import { z } from "zod";
import { supportingDocumentSchema } from "./schema";

export const deathRecordSchema = z.object({
  registryNo: z.string().min(1, "Registry number is required"),
  bookNo: z.string().min(1, "Book number is required"),
  pageNo: z.string().min(1, "Page number is required"),

  // Deceased Information
  deceasedLastName: z.string().min(1, "Deceased's last name is required"),
  deceasedFirstName: z.string().min(1, "Deceased's first name is required"),
  deceasedMiddleName: z.string().default(""),
  sex: z.enum(["Male", "Female"]).nullable().optional(),
  age: z.string(),
  civilStatus: z.enum(["Single", "Married", "Widowed", "Divorced"]),
  citizenship: z.string().min(1, "Citizenship is required"),

  // Death Details
  dateOfDeath: z.string().min(1, "Date of death is required"),
  placeOfDeath: z.string().min(1, "Place of death is required"),
  causeOfDeath: z.string().min(1, "Cause of death is required"),

  // Registration Details
  dateOfRegistration: z.string().min(1, "Registration date is required"),

  // Request Information
  requestorName: z.string().default(""),
  requestPurpose: z.string().default(""),

  // Official Information
  registrarName: z.string().default(""),
  verifiedBy: z.string().default(""),
  verifierPosition: z.string().default(""),
  certifyingOfficerName: z.string().default(""),
  certifyingOfficerPosition: z.string().default(""),
  registrarSignaturePath: z.string().default(""),
  verifierSignaturePath: z.string().default(""),

  certifyingOfficerSignaturePath: z.string().default(""),

  // Additional Information
  processFeeInfo: z.string().default(""),
  remarks: z.string().default(""),
  supportingDocuments: z.array(supportingDocumentSchema).default([]),
  certificateDate: z.string().default(""),
});

export type DeathRecordFormInput = z.input<typeof deathRecordSchema>;
export type DeathRecordFormData = z.output<typeof deathRecordSchema>;
