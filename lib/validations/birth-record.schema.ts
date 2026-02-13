import { z } from "zod";
import { supportingDocumentSchema } from "./schema";

export const birthRecordSchema = z
  .object({
    registryNo: z.string().min(1, "Registry number is required"),
    bookNo: z.string().min(1, "Book number is required"),
    pageNo: z.string().min(1, "Page number is required"),
    dateOfRegistration: z.string().min(1, "Registration date is required"),

    // Child Information
    childLastName: z.string().min(1, "Child's last name is required"),
    childFirstName: z.string().min(1, "Child's first name is required"),
    childMiddleName: z.string().default(""),
    sex: z.enum(["Male", "Female"]).nullable().optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    placeOfBirth: z.string().default(""),
    isTwin: z.boolean().default(false),
    typeOfBirth: z.string().default(""),
    birthOrder: z.string().default(""),
    timeOfBirth: z.string().default(""),

    // Mother Information
    motherLastName: z.string().default(""),
    motherFirstName: z.string().default(""),
    motherMiddleName: z.string().default(""),
    motherCitizenship: z.string().default(""),

    // Father Information
    fatherLastName: z.string().default(""),
    fatherFirstName: z.string().default(""),
    fatherMiddleName: z.string().default(""),
    fatherCitizenship: z.string().default(""),

    // Marriage Information
    dateOfMarriage: z.string().default(""),
    placeOfMarriage: z.string().default(""),

    // Additional Information
    remarks: z.string().default(""),
    processFeeInfo: z.string().default(""),
    registrarName: z.string().default(""),
    verifiedBy: z.string().default(""),
    verifierPosition: z.string().default(""),
    requestorName: z.string().default(""),
    requestPurpose: z.string().default(""),
    certifyingOfficerName: z.string().default(""),
    certifyingOfficerPosition: z.string().default(""),
    supportingDocuments: z.array(supportingDocumentSchema).default([]),
    certificateDate: z.string().default(""),
    registrarSignaturePath: z.string().default(""),
    verifierSignaturePath: z.string().default(""),

    certifyingOfficerSignaturePath: z.string().default(""),
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
