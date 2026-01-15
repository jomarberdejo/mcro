import z from "zod";

export const supportingDocumentSchema = z.object({
  filePath: z.string(),
  fileName: z.string(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});
