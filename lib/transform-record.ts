// lib/transform-records.ts

import { BirthRecord, DeathRecord, MarriageRecord, MarriageCertificateApplication } from "./generated/prisma/client";
import { BirthRecordFormInput } from "@/lib/validations/birth-record.schema";
import { DeathRecordFormInput } from "@/lib/validations/death-record.schema";
import { MarriageRecordFormInput } from "@/lib/validations/marriage-record.schema";
import { MarriageCertificateApplicationFormInput } from "@/lib/validations/marriage-certificate-application.schema";

/**
 * Transform BirthRecord (Prisma) into form input
 */
export function transformBirthRecord(
  record: BirthRecord
): Partial<BirthRecordFormInput> {
  return {
    registryNo: record.registryNo ?? "",
    dateOfRegistration: record.dateOfRegistration ?? "",
    bookNo: record.bookNo ?? "",
    pageNo: record.pageNo ?? "",

    childLastName: record.childLastName ?? "",
    childFirstName: record.childFirstName ?? "",
    childMiddleName: record.childMiddleName ?? "",

    sex: record.sex === "Male" || record.sex === "Female" ? record.sex : undefined,

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

    signatureImagePath: record.signatureImagePath ?? "",
  };
}

/**
 * Transform MarriageRecord (Prisma) into form input
 */
export function transformMarriageRecord(
  record: MarriageRecord
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
    husbandAge: record.husbandAge ?? 0,
    husbandNationality: record.husbandNationality ?? "",
    husbandCivilStatus: record.husbandCivilStatus ?? "Single",
    husbandMotherName: record.husbandMotherName ?? "",
    husbandFatherName: record.husbandFatherName ?? "",

    wifeLastName: record.wifeLastName ?? "",
    wifeFirstName: record.wifeFirstName ?? "",
    wifeMiddleName: record.wifeMiddleName ?? "",
    wifeAge: record.wifeAge ?? 0,
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

    signatureImagePath: record.signatureImagePath ?? "",
  };
}

/**
 * Transform DeathRecord (Prisma) into form input
 */
export function transformDeathRecord(
  record: DeathRecord
): Partial<DeathRecordFormInput> {
  return {
    registryNo: record.registryNo ?? "",
    dateOfRegistration: record.dateOfRegistration ?? "",
    bookNo: record.bookNo ?? "",
    pageNo: record.pageNo ?? "",

    deceasedLastName: record.deceasedLastName ?? "",
    deceasedFirstName: record.deceasedFirstName ?? "",
    deceasedMiddleName: record.deceasedMiddleName ?? "",
    sex: record.sex === "Male" || record.sex === "Female" ? record.sex : "Male",
    age: record.age ?? 0,
    civilStatus: record.civilStatus ?? "Single",
    citizenship: record.citizenship ?? "",

    dateOfDeath: record.dateOfDeath ?? "",
    placeOfDeath: record.placeOfDeath ?? "",
    causeOfDeath: record.causeOfDeath ?? "",

    requestorName: record.requestorName ?? "",
    requestPurpose: record.requestPurpose ?? "",
    registrarName: record.registrarName ?? "",
    verifiedBy: record.verifiedBy ?? "",
    verifierPosition: record.verifierPosition ?? "",
    certifyingOfficerName: record.certifyingOfficerName ?? "",
    certifyingOfficerPosition: record.certifyingOfficerPosition ?? "",
    processFeeInfo: record.processFeeInfo ?? "",
    remarks: record.remarks ?? "",

    signatureImagePath: record.signatureImagePath ?? "",
  };
}

/**
 * Transform MarriageCertificateApplication (Prisma) into form input
 */
export function transformMarriageCertificateApplication(
  application: MarriageCertificateApplication
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
  };
}