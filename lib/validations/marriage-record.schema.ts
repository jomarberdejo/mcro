import { z } from "zod";
import { supportingDocumentSchema } from "./schema";

export const marriageRecordSchema = z.object({
  registryNo: z.string().min(1, "Registry number is required"),
  bookNo: z.string().min(1, "Book number is required"),
  pageNo: z.string().min(1, "Page number is required"),

  // Marriage Details
  dateOfMarriage: z.string().optional().default(""),
  placeOfMarriage: z.string().optional().default(""),
  dateOfRegistration: z.string().optional().default(""),

  // Husband Information
  husbandLastName: z.string().optional().default(""),
  husbandFirstName: z.string().optional().default(""),
  husbandMiddleName: z.string().optional().default(""),
  husbandAge: z.string().optional().default(""),
  husbandNationality: z.string().optional().default(""),
  husbandCivilStatus: z
    .enum(["Single", "Married", "Widowed", "Divorced"])
    .nullable()
    .optional(),
  husbandMotherName: z.string().optional().default(""),
  husbandFatherName: z.string().optional().default(""),

  // Wife Information
  wifeLastName: z.string().optional().default(""),
  wifeFirstName: z.string().optional().default(""),
  wifeMiddleName: z.string().optional().default(""),
  wifeAge: z.string().optional().default(""),
  wifeNationality: z.string().optional().default(""),
  wifeCivilStatus: z
    .enum(["Single", "Married", "Widowed", "Divorced"])
    .nullable()
    .optional(),
  wifeMotherName: z.string().optional().default(""),
  wifeFatherName: z.string().optional().default(""),

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

export type MarriageRecordFormInput = z.input<typeof marriageRecordSchema>;
export type MarriageRecordFormData = z.output<typeof marriageRecordSchema>;
