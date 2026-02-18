import { z } from "zod";
import { supportingDocumentSchema } from "./schema";



export const marriageCertificateApplicationSchema = z.object({
  registryNo: z.string().min(1, "Registry number is required"),
  bookNo: z.string().min(1, "Book number is required"),
  pageNo: z.string().min(1, "Page number is required"),
  dateOfRegistration: z.string().optional().default(""),
  
  groomFirstName: z.string().optional().default(""),
  groomMiddleName: z.string().optional().default(""),
  groomLastName: z.string().optional().default(""),
  groomDateOfBirth: z.string().optional().default(""),
  
  brideFirstName: z.string().optional().default(""),
  brideMiddleName: z.string().optional().default(""),
  brideLastName: z.string().optional().default(""),
  brideDateOfBirth: z.string().optional().default(""),
  supportingDocuments: z.array(supportingDocumentSchema).default([])
});

export type MarriageCertificateApplicationFormInput = z.input<typeof marriageCertificateApplicationSchema>;
export type MarriageCertificateApplicationFormData = z.output<typeof marriageCertificateApplicationSchema>;