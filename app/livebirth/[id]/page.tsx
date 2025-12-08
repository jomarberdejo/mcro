"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LiveBirthRecord } from "@/lib/data";

export default function PrintPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<LiveBirthRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("livebirth");
    if (!saved) return;

    const arr: LiveBirthRecord[] = JSON.parse(saved);
    const found = arr.find((item) => item.id === id);
    setRecord(found || null);
  }, [id]);

  if (!record) return <div className="p-6 text-red-500">Record not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto print:p-0">
      <div className="flex justify-end mb-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Print
        </button>
      </div>

      {/* Official Civil Registry Layout */}
      <div 
        className="bg-white p-12 shadow-lg print:shadow-none" 
        style={{ fontFamily: 'Times New Roman, serif' }}
      >
        <div className="border-2 border-black p-8">
          {/* Header Section */}
          <div className="text-center mb-6">
            {/* Logos */}
            <div className="flex justify-center items-center gap-8 mb-4">
              {/* Left Logo Placeholder */}
              <div className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center text-xs text-gray-500">
                LOGO 1
              </div>
              
              {/* Center Logo Placeholder */}
              <div className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center text-xs text-gray-500">
                LOGO 2
              </div>
              
              {/* Right Logo Placeholder */}
              <div className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center text-xs text-gray-500">
                LOGO 3
              </div>
            </div>

            <div className="text-sm mb-2">Civil Registry Form No. 1A</div>
            <div className="text-sm mb-4">(Birth available)</div>
            
            <div className="font-bold">Republic of the Philippines</div>
            <div>Province of Leyte</div>
            <div className="italic">Municipality of Carigara</div>
            <div className="font-bold text-lg mt-2">
              OFFICE OF THE MUNICIPAL CIVIL REGISTRAR
            </div>
          </div>

          <div className="flex justify-between mb-6 text-sm">
            <div>Reg. No.: {record.registry_no || 'N/A'}</div>
            <div>Date: {record.date_of_registration ? new Date(record.date_of_registration).toLocaleDateString() : new Date().toLocaleDateString()}</div>
          </div>

          {/* Main Content */}
          <div className="mb-4 font-bold">TO WHOM IT MAY CONCERN:</div>

          <div className="mb-6 text-sm">
            We certify that among others, the following facts of birth appear in our Registry of Births on page __ of Book No. __:
          </div>

          {/* Birth Details Table */}
          <table className="w-full text-sm mb-6">
            <tbody>
              <tr>
                <td className="py-2 pr-4 font-semibold w-1/3">Registry No.</td>
                <td className="py-2">{record.registry_no || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Date of Registration</td>
                <td className="py-2">
                  {record.date_of_registration 
                    ? new Date(record.date_of_registration).toLocaleDateString() 
                    : new Date().toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Name of Child</td>
                <td className="py-2">{record.first_name} {record.last_name}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Sex</td>
                <td className="py-2">{record.sex}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Date of Birth</td>
                <td className="py-2">{new Date(record.date_of_birth).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Place of Birth</td>
                <td className="py-2">{record.place_of_birth}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Name of Mother</td>
                <td className="py-2">{record.mother_name}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Citizenship of Mother</td>
                <td className="py-2">{'Filipino'}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Name of Father</td>
                <td className="py-2">{record.father_name}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Citizenship of Father</td>
                <td className="py-2">{'Filipino'}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Date of Marriage of Parents</td>
                <td className="py-2">
                  {'No Column'}
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold">Place of Marriage of Parents</td>
                <td className="py-2">{'No Column'}</td>
              </tr>
            </tbody>
          </table>

          {/* Remarks Section */}
          {record.remarks && (
            <div className="mb-6">
              <div className="font-bold mb-2">REMARKS:</div>
              <div className="text-sm whitespace-pre-wrap">{record.remarks}</div>
            </div>
          )}

          {/* Footer Text */}
          <div className="text-sm mb-6">
            This certification is issued to PSA - OCRG for filing in the archives.
          </div>

          {/* Registrar Signature */}
          <div className="flex justify-end mt-12">
            <div className="text-center">
              <div className="mb-1 font-bold">
                {('DARRYL U. MONTEALEGRE, MM').toUpperCase()}
              </div>
              <div className="text-sm">Municipal Civil Registrar</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm">Verified by:</div>
            <div className="mt-8 font-bold">
              {('DARRYL U. MONTEALEGRE, MM').toUpperCase()}
            </div>
            <div className="text-sm">Municipal Civil Registrar</div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-xs text-center italic">
            Note: A mark, erasure or alteration of any entry invalidates this certification.
          </div>
        </div>
      </div>
    </div>
  );
}