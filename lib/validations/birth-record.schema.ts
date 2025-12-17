// lib/validations/birth-record.schema.ts
import { z } from "zod";

export const birthRecordSchema = z.object({
  registryNo: z.string().min(1, "Registry number is required"),
  dateOfRegistration: z.string().min(1, "Registration date is required"),
  
  // Child Information
  childLastName: z.string().min(1, "Child's last name is required"),
  childFirstName: z.string().min(1, "Child's first name is required"),
  childMiddleName: z.string().default(""),
  sex: z.enum(["Male", "Female"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  placeOfBirth: z.string().default(""),
  isTwin: z.boolean().default(false),
  birthOrder: z.string().default(""),
  
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
  registrarName: z.string().default(""),
  signatureImagePath: z.string().default(""), 
}).refine((data) => {
  if (data.isTwin && !data.birthOrder) {
    return false;
  }
  return true;
}, {
  message: "Birth order is required for twin/multiple births",
  path: ["birthOrder"],
});


export type BirthRecordFormInput = z.input<typeof birthRecordSchema>;
export type BirthRecordFormData = z.output<typeof birthRecordSchema>;