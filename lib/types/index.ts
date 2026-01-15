
import { Prisma } from "@/lib/generated/prisma/client";

export type MarriageCertificateApplicationWithDocuments = Prisma.MarriageCertificateApplicationGetPayload<{
  include: { supportingDocuments: true }
}>;

export type BirthRecordWithDocuments = Prisma.BirthRecordGetPayload<{
  include: { supportingDocuments: true }
}>;

export type DeathRecordWithDocuments = Prisma.DeathRecordGetPayload<{
  include: { supportingDocuments: true }
}>;

export type MarriageRecordWithDocuments = Prisma.MarriageRecordGetPayload<{
  include: { supportingDocuments: true }
}>;