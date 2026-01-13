import { z } from "zod";

export const marriageCertificateApplicationSchema = z.object({
  registryNo: z.string().min(1, "Registry number is required"),
  bookNo: z.string().default(""),
  pageNo: z.string().default(""),
  dateOfRegistration: z.string().default(""),
  
  groomFirstName: z.string().min(1, "Groom's first name is required"),
  groomMiddleName: z.string().default(""),
  groomLastName: z.string().min(1, "Groom's last name is required"),
  groomDateOfBirth: z.string().min(1, "Groom's date of birth is required"),
  
  brideFirstName: z.string().min(1, "Bride's first name is required"),
  brideMiddleName: z.string().default(""),
  brideLastName: z.string().min(1, "Bride's last name is required"),
  brideDateOfBirth: z.string().min(1, "Bride's date of birth is required"),
});

export type MarriageCertificateApplicationFormInput = z.input<typeof marriageCertificateApplicationSchema>;
export type MarriageCertificateApplicationFormData = z.output<typeof marriageCertificateApplicationSchema>;