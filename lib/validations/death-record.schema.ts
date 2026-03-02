import { z } from "zod";
import { supportingDocumentSchema } from "./schema";

export const deathRecordSchema = z.object({
  registryNo: z.string().min(1, "Registry number is required"),
  bookNo: z.string().min(1, "Book number is required"),
  pageNo: z.string().min(1, "Page number is required"),

  // Deceased Information
  deceasedLastName: z.string().optional().default(""),
  deceasedFirstName: z.string().optional().default(""),
  deceasedMiddleName: z.string().optional().default(""),
  sex: z.enum(["Male", "Female"]).nullable().optional(),
  age: z.string().optional().default(""),
  civilStatus: z
    .enum(["Single", "Married", "Widowed", "Divorced"])
    .nullable()
    .optional(),
  citizenship: z.string().optional().default(""),

  // Death Details
  dateOfDeath: z.string().optional().default(""),
  placeOfDeath: z.string().optional().default(""),
  causeOfDeath: z.string().optional().default(""),

  // Registration Details
  dateOfRegistration: z.string().optional().default(""),
  hasParentNames: z.boolean().optional().default(false),
  nameOfFather: z.string().optional().default(""),
  nameOfMother: z.string().optional().default(""),

  // Request Information
  requestorName: z.string().optional().default(""),
  requestPurpose: z.string().optional().default(""),

  // Official Information
  registrarName: z.string().optional().default(""),
  verifiedBy: z.string().optional().default(""),
  verifierPosition: z.string().optional().default(""),
  certifyingOfficerName: z.string().optional().default(""),
  certifyingOfficerPosition: z.string().optional().default(""),
  registrarSignaturePath: z.string().optional().default(""),
  verifierSignaturePath: z.string().optional().default(""),

  certifyingOfficerSignaturePath: z.string().optional().default(""),

  // Additional Information
  processFeeInfo: z.string().optional().default(""),
  remarks: z.string().optional().default(""),
  supportingDocuments: z.array(supportingDocumentSchema).optional().default([]),
  certificateDate: z.string().optional().default(""),
});

export type DeathRecordFormInput = z.input<typeof deathRecordSchema>;
export type DeathRecordFormData = z.output<typeof deathRecordSchema>;
