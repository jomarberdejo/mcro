import { BirthRecordFormInput } from "@/lib/validations/birth-record.schema";
import { BirthRecord } from "./generated/prisma/client";

export function transformBirthRecord(
  record: BirthRecord
): Partial<BirthRecordFormInput> {
  return {
    registryNo: record.registryNo ?? "",
    dateOfRegistration: record.dateOfRegistration ?? "",

    childLastName: record.childLastName ?? "",
    childFirstName: record.childFirstName ?? "",
    childMiddleName: record.childMiddleName ?? "",

    sex:
      record.sex === "Male" || record.sex === "Female" ? record.sex : undefined,

    dateOfBirth: record.dateOfBirth ?? "",
    placeOfBirth: record.placeOfBirth ?? "",

    isTwin: record.isTwin ?? false,
    birthOrder: record.birthOrder ?? "",

    motherLastName: record.motherLastName ?? "",
    motherFirstName: record.motherFirstName ?? "",
    motherMiddleName: record.motherMiddleName ?? "",
    motherCitizenship: record.motherCitizenship ?? "",

    fatherLastName: record.fatherLastName ?? "",
    fatherFirstName: record.fatherFirstName ?? "",
    fatherMiddleName: record.fatherMiddleName ?? "",
    fatherCitizenship: record.fatherCitizenship ?? "",

    dateOfMarriage: record.dateOfMarriage ?? "",
    placeOfMarriage: record.placeOfMarriage ?? "",

    remarks: record.remarks ?? "",
    registrarName: record.registrarName ?? "",
    signatureImagePath: record.signatureImagePath ?? "",
  };
}
