import { z } from "zod";
import { supportingDocumentSchema } from "./schema";

export const birthRecordSchema = z
  .object({
    registryNo: z.string().min(1, "Registry number is required"),
    bookNo: z.string().min(1, "Book number is required"),
    pageNo: z.string().min(1, "Page number is required"),
    dateOfRegistration: z.string().optional().default(""),

    // Child Information
    childLastName: z.string().optional().default(""),
    childFirstName: z.string().optional().default(""),
    childMiddleName: z.string().optional().default(""),
    sex: z.enum(["Male", "Female"]).nullable().optional(),
    dateOfBirth: z.string().optional().default(""),
    placeOfBirth: z.string().optional().default(""),
    isTwin: z.boolean().default(false),
    typeOfBirth: z.string().optional().default(""),
    birthOrder: z.string().optional().default(""),
    timeOfBirth: z.string().optional().default(""),

    // Mother Information
    motherLastName: z.string().optional().default(""),
    motherFirstName: z.string().optional().default(""),
    motherMiddleName: z.string().optional().default(""),
    motherCitizenship: z.string().optional().default(""),

    // Father Information
    fatherLastName: z.string().optional().default(""),
    fatherFirstName: z.string().optional().default(""),
    fatherMiddleName: z.string().optional().default(""),
    fatherCitizenship: z.string().optional().default(""),

    // Marriage Information
    dateOfMarriage: z.string().optional().default(""),
    placeOfMarriage: z.string().optional().default(""),

    // Additional Information
    remarks: z.string().optional().default(""),
    processFeeInfo: z.string().optional().default(""),
    registrarName: z.string().optional().default(""),
    verifiedBy: z.string().optional().default(""),
    verifierPosition: z.string().optional().default(""),
    requestorName: z.string().optional().default(""),
    requestPurpose: z.string().optional().default(""),
    certifyingOfficerName: z.string().optional().default(""),
    certifyingOfficerPosition: z.string().optional().default(""),
    supportingDocuments: z.array(supportingDocumentSchema).default([]),
    certificateDate: z.string().optional().default(""),
    registrarSignaturePath: z.string().optional().default(""),
    verifierSignaturePath: z.string().optional().default(""),

    certifyingOfficerSignaturePath: z.string().optional().default(""),
  })
  .refine(
    (data) => {
      if (data.isTwin && !data.birthOrder) {
        return false;
      }
      return true;
    },
    {
      message: "Birth order is required for twin/multiple births",
      path: ["birthOrder"],
    },
  );

export type BirthRecordFormInput = z.input<typeof birthRecordSchema>;
export type BirthRecordFormData = z.output<typeof birthRecordSchema>;
