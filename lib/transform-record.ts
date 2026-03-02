// lib/transform-records.ts

import { BirthRecordFormInput } from "@/lib/validations/birth-record.schema";
import { DeathRecordFormInput } from "@/lib/validations/death-record.schema";
import { MarriageRecordFormInput } from "@/lib/validations/marriage-record.schema";
import { MarriageCertificateApplicationFormInput } from "@/lib/validations/marriage-cert-app.schema";
import {
  BirthRecordWithDocuments,
  DeathRecordWithDocuments,
  MarriageRecordWithDocuments,
  MarriageCertificateApplicationWithDocuments,
} from "./types";

/**
 * Transform BirthRecord (Prisma) into form input
 */
export function transformBirthRecord(
  record: BirthRecordWithDocuments,
): Partial<BirthRecordFormInput> {
  return {
    registryNo: record.registryNo ?? "",
    dateOfRegistration: record.dateOfRegistration ?? "",
    bookNo: record.bookNo ?? "",
    pageNo: record.pageNo ?? "",

    childLastName: record.childLastName ?? "",
    childFirstName: record.childFirstName ?? "",
    childMiddleName: record.childMiddleName ?? "",

    sex:
      record.sex === "Male" || record.sex === "Female" ? record.sex : null,

    dateOfBirth: record.dateOfBirth ?? "",
    placeOfBirth: record.placeOfBirth ?? "",

    isTwin: record.isTwin ?? false,
    birthOrder: record.birthOrder ?? "",
    typeOfBirth: record.typeOfBirth ?? "",
    timeOfBirth: record.timeOfBirth ?? "",

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
    verifiedBy: record.verifiedBy ?? "",
    verifierPosition: record.verifierPosition ?? "",
    processFeeInfo: record.processFeeInfo ?? "",
    requestorName: record.requestorName ?? "",
    requestPurpose: record.requestPurpose ?? "",
    certifyingOfficerName: record.certifyingOfficerName ?? "",
    certifyingOfficerPosition: record.certifyingOfficerPosition ?? "",
    certificateDate: record.certificateDate ?? "",
    registrarSignaturePath: record.registrarSignaturePath ?? "",
    verifierSignaturePath: record.verifierSignaturePath ?? "",
    certifyingOfficerSignaturePath: record.certifyingOfficerSignaturePath ?? "",
    supportingDocuments:
      record.supportingDocuments?.map((doc) => ({
        filePath: doc.filePath,
        fileName: doc.fileName,
        fileSize: doc.fileSize ?? undefined,
        mimeType: doc.mimeType ?? undefined,
      })) ?? [],
  };
}

/**
 * Transform MarriageRecord (Prisma) into form input
 */
export function transformMarriageRecord(
  record: MarriageRecordWithDocuments,
): Partial<MarriageRecordFormInput> {
  return {
    registryNo: record.registryNo ?? "",
    dateOfRegistration: record.dateOfRegistration ?? "",
    bookNo: record.bookNo ?? "",
    pageNo: record.pageNo ?? "",

    dateOfMarriage: record.dateOfMarriage ?? "",
    placeOfMarriage: record.placeOfMarriage ?? "",

    husbandLastName: record.husbandLastName ?? "",
    husbandFirstName: record.husbandFirstName ?? "",
    husbandMiddleName: record.husbandMiddleName ?? "",
    husbandAge: record.husbandAge ?? "",
    husbandNationality: record.husbandNationality ?? "",
    husbandCivilStatus: record.husbandCivilStatus ?? "Single",
    husbandMotherName: record.husbandMotherName ?? "",
    husbandFatherName: record.husbandFatherName ?? "",

    wifeLastName: record.wifeLastName ?? "",
    wifeFirstName: record.wifeFirstName ?? "",
    wifeMiddleName: record.wifeMiddleName ?? "",
    wifeAge: record.wifeAge ?? "",
    wifeNationality: record.wifeNationality ?? "",
    wifeCivilStatus: record.wifeCivilStatus ?? "Single",
    wifeMotherName: record.wifeMotherName ?? "",
    wifeFatherName: record.wifeFatherName ?? "",

    requestorName: record.requestorName ?? "",
    requestPurpose: record.requestPurpose ?? "",
    registrarName: record.registrarName ?? "",
    verifiedBy: record.verifiedBy ?? "",
    verifierPosition: record.verifierPosition ?? "",
    certifyingOfficerName: record.certifyingOfficerName ?? "",
    certifyingOfficerPosition: record.certifyingOfficerPosition ?? "",
    processFeeInfo: record.processFeeInfo ?? "",
    remarks: record.remarks ?? "",
    certificateDate: record.certificateDate ?? "",

    registrarSignaturePath: record.registrarSignaturePath ?? "",
    verifierSignaturePath: record.verifierSignaturePath ?? "",
    certifyingOfficerSignaturePath: record.certifyingOfficerSignaturePath ?? "",
    supportingDocuments:
      record.supportingDocuments?.map((doc) => ({
        filePath: doc.filePath,
        fileName: doc.fileName,
        fileSize: doc.fileSize ?? undefined,
        mimeType: doc.mimeType ?? undefined,
      })) ?? [],
  };
}

/**
 * Transform DeathRecord (Prisma) into form input
 */
export function transformDeathRecord(
  record: DeathRecordWithDocuments,
): Partial<DeathRecordFormInput> {
  return {
    registryNo: record.registryNo ?? "",
    dateOfRegistration: record.dateOfRegistration ?? "",
    bookNo: record.bookNo ?? "",
    pageNo: record.pageNo ?? "",

    deceasedLastName: record.deceasedLastName ?? "",
    deceasedFirstName: record.deceasedFirstName ?? "",
    deceasedMiddleName: record.deceasedMiddleName ?? "",
    sex: record.sex === "Male" || record.sex === "Female" ? record.sex : null,
    age: record.age ?? "",
    civilStatus: record.civilStatus ?? null,
    citizenship: record.citizenship ?? "",

    dateOfDeath: record.dateOfDeath ?? "",
    placeOfDeath: record.placeOfDeath ?? "",
    causeOfDeath: record.causeOfDeath ?? "",
    hasParentNames: record.hasParentNames ?? false,
    nameOfFather: record.nameOfFather ?? "",
    nameOfMother: record.nameOfMother ?? "",

    requestorName: record.requestorName ?? "",
    requestPurpose: record.requestPurpose ?? "",
    registrarName: record.registrarName ?? "",
    verifiedBy: record.verifiedBy ?? "",
    verifierPosition: record.verifierPosition ?? "",
    certifyingOfficerName: record.certifyingOfficerName ?? "",
    certifyingOfficerPosition: record.certifyingOfficerPosition ?? "",
    processFeeInfo: record.processFeeInfo ?? "",
    remarks: record.remarks ?? "",
    certificateDate: record.certificateDate ?? "",
    registrarSignaturePath: record.registrarSignaturePath ?? "",
    verifierSignaturePath: record.verifierSignaturePath ?? "",
    certifyingOfficerSignaturePath: record.certifyingOfficerSignaturePath ?? "",
    supportingDocuments:
      record.supportingDocuments?.map((doc) => ({
        filePath: doc.filePath,
        fileName: doc.fileName,
        fileSize: doc.fileSize ?? undefined,
        mimeType: doc.mimeType ?? undefined,
      })) ?? [],
  };
}

/**
 * Transform MarriageCertificateApplication (Prisma) into form input
 */
export function transformMarriageCertificateApplication(
  application: MarriageCertificateApplicationWithDocuments,
): Partial<MarriageCertificateApplicationFormInput> {
  return {
    registryNo: application.registryNo ?? "",
    bookNo: application.bookNo ?? "",
    pageNo: application.pageNo ?? "",
    dateOfRegistration: application.dateOfRegistration ?? "",

    groomFirstName: application.groomFirstName ?? "",
    groomMiddleName: application.groomMiddleName ?? "",
    groomLastName: application.groomLastName ?? "",
    groomDateOfBirth: application.groomDateOfBirth ?? "",

    brideFirstName: application.brideFirstName ?? "",
    brideMiddleName: application.brideMiddleName ?? "",
    brideLastName: application.brideLastName ?? "",
    brideDateOfBirth: application.brideDateOfBirth ?? "",
    supportingDocuments:
      application.supportingDocuments?.map((doc) => ({
        filePath: doc.filePath,
        fileName: doc.fileName,
        fileSize: doc.fileSize ?? undefined,
        mimeType: doc.mimeType ?? undefined,
      })) ?? [],
  };
}
