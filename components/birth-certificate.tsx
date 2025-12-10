// components/birth-certificate.tsx
import { BirthRecord } from "@/types";
import React from "react";

interface BirthCertificateProps {
  record: BirthRecord;
}

export const BirthCertificate: React.FC<BirthCertificateProps> = ({ record }) => {
  const getFullName = (lastName: string, firstName: string, middleName: string) => {
    return `${lastName}, ${firstName}${middleName ? ' ' + middleName : ''}`.trim();
  };

  const childFullName = getFullName(
    record.childLastName,
    record.childFirstName,
    record.childMiddleName
  );
  const motherFullName = getFullName(
    record.motherLastName,
    record.motherFirstName,
    record.motherMiddleName
  );
  const fatherFullName = getFullName(
    record.fatherLastName,
    record.fatherFirstName,
    record.fatherMiddleName
  );

  return (
    <div className="bg-white shadow-2xl print:shadow-none print-container" style={{ 
      fontFamily: "'Libre Baskerville', 'Georgia', serif",
      fontSize: '11pt',
      lineHeight: '1.4',
      width: '210mm',
      minHeight: '297mm',
      padding: '15mm 20mm',
      boxSizing: 'border-box',
      border: '4px double #1f2937'
    }}>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .print-container {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 15mm 20mm;
            box-sizing: border-box;
          }
        }
      `}</style>

      <div className="h-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-16 shrink-0">
            <div className="w-full h-16 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              Left Logo
            </div>
          </div>

          <div className="text-center flex-1 px-4">
            <div style={{ fontSize: '9pt' }} className="text-gray-600">Civil Registry Form No. 1A</div>
            <div style={{ fontSize: '8pt' }} className="text-gray-500 italic mb-2">(Birth-available)</div>
            
            <div style={{ fontSize: '10pt' }} className="mb-1">Republic of the Philippines</div>
            <div style={{ fontSize: '10pt' }} className="mb-1">Province of Leyte</div>
            <div style={{ fontSize: '13pt' }} className="font-bold mb-1">Municipality of Carigara</div>
            <div style={{ fontSize: '14pt' }} className="font-bold tracking-wider">
              OFFICE OF THE MUNICIPAL CIVIL REGISTRAR
            </div>
          </div>

          <div className="flex items-start gap-2 shrink-0">
            <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              Center Logo
            </div>
            <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              Right Logo
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-300 my-4"></div>

        {/* Date aligned right */}
        <div className="text-right mb-6" style={{ fontSize: '10pt' }}>
          {record.dateOfRegistration}
        </div>

        {/* Salutation */}
        <div className="mb-4 font-bold" style={{ fontSize: '11pt' }}>
          TO WHOM IT MAY CONCERN:
        </div>

        {/* Certification statement */}
        <div className="mb-6 text-justify" style={{ fontSize: '10pt', lineHeight: '1.6' }}>
          This is to certify that the following particulars of birth have been duly registered in the Civil Registry of this Municipality in accordance with Act No. 3753, as amended:
        </div>

        {/* Birth Details Table */}
        <div className="mb-6 border border-gray-400">
          <table className="w-full" style={{ fontSize: '10pt' }}>
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50 w-2/5">Registry Number:</td>
                <td className="py-2 px-3">{record.registryNo}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Date of Registration:</td>
                <td className="py-2 px-3">{record.dateOfRegistration}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Name of Child:</td>
                <td className="py-2 px-3 uppercase font-semibold">{childFullName}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Sex:</td>
                <td className="py-2 px-3">{record.sex}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Date of Birth:</td>
                <td className="py-2 px-3">{record.dateOfBirth}</td>
              </tr>
              {record.isTwin && record.birthOrder && (
                <tr className="border-b border-gray-300">
                  <td className="py-2 px-3 font-semibold bg-gray-50">Birth Order:</td>
                  <td className="py-2 px-3">{record.birthOrder}</td>
                </tr>
              )}
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Place of Birth:</td>
                <td className="py-2 px-3">{record.placeOfBirth}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Mother's Maiden Name:</td>
                <td className="py-2 px-3 uppercase">{motherFullName}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Mother's Citizenship:</td>
                <td className="py-2 px-3">{record.motherCitizenship}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Father's Name:</td>
                <td className="py-2 px-3 uppercase">{fatherFullName}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Father's Citizenship:</td>
                <td className="py-2 px-3">{record.fatherCitizenship}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-semibold bg-gray-50">Date of Marriage of Parents:</td>
                <td className="py-2 px-3">{record.dateOfMarriage || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold bg-gray-50">Place of Marriage of Parents:</td>
                <td className="py-2 px-3">{record.placeOfMarriage || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remarks if present */}
        {record.remarks && (
          <div className="mb-4 border border-gray-400 p-3">
            <div className="font-bold mb-2" style={{ fontSize: '10pt' }}>REMARKS:</div>
            <div style={{ fontSize: '9pt' }} className="whitespace-pre-wrap italic">{record.remarks}</div>
          </div>
        )}

        {/* Purpose statement */}
        <div className="mb-6 text-justify" style={{ fontSize: '10pt', lineHeight: '1.6' }}>
          This certification is issued upon the request of the interested party for whatever legal purpose it may serve.
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        {/* Signature section */}
        <div className="flex justify-between items-end mt-auto">
          <div style={{ fontSize: '9pt' }} className="text-gray-600">
            <div>Issued this: ________________</div>
            <div className="mt-2">At: Carigara, Leyte</div>
          </div>

          <div className="text-center">
            <div className="mb-12"></div>
            <div className="border-t-2 border-black pt-1 px-8">
              <div className="font-bold uppercase" style={{ fontSize: '11pt' }}>
                {record.registrarName || "___________________"}
              </div>
              <div style={{ fontSize: '9pt' }} className="mt-1">Municipal Civil Registrar</div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div style={{ fontSize: '8pt' }} className="text-center text-gray-500 italic">
            Note: Any erasure, alteration, or superimposition of entries shall invalidate this certificate.
          </div>
        </div>
      </div>
    </div>
  );
};