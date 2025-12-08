"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Printer, ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { storage } from "@/lib/storage";

type PageMode = "list" | "form" | "view";

export interface BirthRecord {
  id: string;
  createdAt: string;
  registryNo: string;
  dateOfRegistration: string;
  childLastName: string;
  childFirstName: string;
  childMiddleName: string;
  sex: string;
  dateOfBirth: string;
  isTwin: boolean;
  birthOrder: string;
  placeOfBirth: string;
  motherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherCitizenship: string;
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherCitizenship: string;
  dateOfMarriage: string;
  placeOfMarriage: string;
  remarks: string;
  registrarName: string;
}

const PREFIX = "birth_record:";

const emptyRecord = (): BirthRecord => ({
  id: "",
  createdAt: "",
  registryNo: "",
  dateOfRegistration: "",
  childLastName: "",
  childFirstName: "",
  childMiddleName: "",
  sex: "",
  dateOfBirth: "",
  isTwin: false,
  birthOrder: "",
  placeOfBirth: "",
  motherLastName: "",
  motherFirstName: "",
  motherMiddleName: "",
  motherCitizenship: "",
  fatherLastName: "",
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherCitizenship: "",
  dateOfMarriage: "",
  placeOfMarriage: "",
  remarks: "",
  registrarName: "",
});

const CivilRegistrySystem: React.FC = () => {
  const [page, setPage] = useState<PageMode>("list");
  const [records, setRecords] = useState<BirthRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BirthRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BirthRecord>(emptyRecord());
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(null);
  const [filters, setFilters] = useState({
    childLastName: "",
    childFirstName: "",
    fatherLastName: "",
    fatherFirstName: "",
    motherLastName: "",
    motherFirstName: "",
    dob: "",
  });

  useEffect(() => {
    const ok = typeof window !== "undefined" && !!storage;
    setStorageAvailable(ok);
    if (ok) loadRecords().catch((e) => console.error(e));
  }, []);

  const loadRecords = async () => {
    try {
      const { keys } = await storage.list(PREFIX);
      const loaded: BirthRecord[] = [];
      for (const k of keys) {
        const result = await storage.get(k);
        if (result?.value) {
          try {
            const parsed: BirthRecord = JSON.parse(result.value);
            loaded.push(parsed);
          } catch (err) {
            console.warn("Failed to parse record", k, err);
          }
        }
      }
      loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecords(loaded);
    } catch (err) {
      console.error("Error loading records:", err);
      setRecords([]);
    }
  };

  const saveRecord = async (data: BirthRecord) => {
    if (!storageAvailable) {
      alert("Storage unavailable in this environment.");
      return;
    }

    const ok = data.registryNo && data.childLastName && data.childFirstName && data.dateOfBirth;
    if (!ok) {
      alert("Please fill registry no, child name (last and first) and date of birth.");
      return;
    }

    const record: BirthRecord = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: data.createdAt || new Date().toISOString(),
    };

    try {
      await storage.set(`${PREFIX}${record.id}`, JSON.stringify(record));
      await loadRecords();
      setFormData(emptyRecord());
      setPage("list");
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving record:", err);
      alert("Failed to save record.");
    }
  };

  const deleteRecord = async (id: string) => {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    try {
      await storage.remove(`${PREFIX}${id}`);
      await loadRecords();
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
        setPage("list");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete.");
    }
  };

  const handleChange =
    (name: keyof BirthRecord) =>
      (value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | boolean) => {
        const v = typeof value === "string" ? value : typeof value === "boolean" ? value : value.target.value;
        setFormData((p) => ({ ...p, [name]: v }));
      };

  const handleEdit = (record: BirthRecord) => {
    setFormData(record);
    setIsEditing(true);
    setPage("form");
  };

  const handleView = (record: BirthRecord) => {
    setSelectedRecord(record);
    setPage("view");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await saveRecord(formData);
  };

  const handleNew = () => {
    setFormData(emptyRecord());
    setIsEditing(false);
    setPage("form");
  };

  const getFullName = (lastName: string, firstName: string, middleName: string) => {
    return `${lastName}, ${firstName}${middleName ? ' ' + middleName : ''}`.trim();
  };

  const filteredRecords = records.filter((record) => {
    const matchesChildLast = !filters.childLastName || 
      record.childLastName.toLowerCase().includes(filters.childLastName.toLowerCase());
    
    const matchesChildFirst = !filters.childFirstName || 
      record.childFirstName.toLowerCase().includes(filters.childFirstName.toLowerCase());

    const matchesFatherLast = !filters.fatherLastName || 
      record.fatherLastName.toLowerCase().includes(filters.fatherLastName.toLowerCase());
    
    const matchesFatherFirst = !filters.fatherFirstName || 
      record.fatherFirstName.toLowerCase().includes(filters.fatherFirstName.toLowerCase());

    const matchesMotherLast = !filters.motherLastName || 
      record.motherLastName.toLowerCase().includes(filters.motherLastName.toLowerCase());
    
    const matchesMotherFirst = !filters.motherFirstName || 
      record.motherFirstName.toLowerCase().includes(filters.motherFirstName.toLowerCase());

    const matchesDob = !filters.dob || 
      record.dateOfBirth.toLowerCase().includes(filters.dob.toLowerCase());

    return (
      matchesChildLast &&
      matchesChildFirst &&
      matchesFatherLast &&
      matchesFatherFirst &&
      matchesMotherLast &&
      matchesMotherFirst &&
      matchesDob
    );
  });

  // Render form
  if (page === "form") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <Button variant="ghost" onClick={() => setPage("list")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Birth Registration" : "New Birth Registration"}</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Registry Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="registryNo">Registry No.</Label>
                    <Input
                      id="registryNo"
                      value={formData.registryNo}
                      onChange={(e) => handleChange("registryNo")(e)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfRegistration">Date of Registration</Label>
                    <Input
                      id="dateOfRegistration"
                      value={formData.dateOfRegistration}
                      onChange={(e) => handleChange("dateOfRegistration")(e)}
                      placeholder="e.g., January 15, 2024"
                    />
                  </div>
                </div>

                {/* Child Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Child Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="childLastName">Last Name *</Label>
                      <Input
                        id="childLastName"
                        value={formData.childLastName}
                        onChange={(e) => handleChange("childLastName")(e)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="childFirstName">First Name *</Label>
                      <Input
                        id="childFirstName"
                        value={formData.childFirstName}
                        onChange={(e) => handleChange("childFirstName")(e)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="childMiddleName">Middle Name</Label>
                      <Input
                        id="childMiddleName"
                        value={formData.childMiddleName}
                        onChange={(e) => handleChange("childMiddleName")(e)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label htmlFor="sex">Sex *</Label>
                      <Select value={formData.sex} onValueChange={(val) => handleChange("sex")(val)}>
                        <SelectTrigger id="sex">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange("dateOfBirth")(e)}
                        placeholder="e.g., January 1, 2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="placeOfBirth">Place of Birth</Label>
                      <Input
                        id="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={(e) => handleChange("placeOfBirth")(e)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id="isTwin"
                        checked={formData.isTwin}
                        onChange={(e) => handleChange("isTwin")(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="isTwin" className="cursor-pointer">This is a twin/multiple birth</Label>
                    </div>
                    {formData.isTwin && (
                      <div className="ml-6">
                        <Label htmlFor="birthOrder">Birth Order</Label>
                        <Input
                          id="birthOrder"
                          value={formData.birthOrder}
                          onChange={(e) => handleChange("birthOrder")(e)}
                          placeholder="e.g., First, Second, Twin A, Twin B"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Mother Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Mother Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="motherLastName">Last Name</Label>
                      <Input
                        id="motherLastName"
                        value={formData.motherLastName}
                        onChange={(e) => handleChange("motherLastName")(e)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="motherFirstName">First Name</Label>
                      <Input
                        id="motherFirstName"
                        value={formData.motherFirstName}
                        onChange={(e) => handleChange("motherFirstName")(e)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="motherMiddleName">Middle Name</Label>
                      <Input
                        id="motherMiddleName"
                        value={formData.motherMiddleName}
                        onChange={(e) => handleChange("motherMiddleName")(e)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="motherCitizenship">Citizenship</Label>
                    <Input
                      id="motherCitizenship"
                      value={formData.motherCitizenship}
                      onChange={(e) => handleChange("motherCitizenship")(e)}
                    />
                  </div>
                </div>

                {/* Father Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Father Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fatherLastName">Last Name</Label>
                      <Input
                        id="fatherLastName"
                        value={formData.fatherLastName}
                        onChange={(e) => handleChange("fatherLastName")(e)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fatherFirstName">First Name</Label>
                      <Input
                        id="fatherFirstName"
                        value={formData.fatherFirstName}
                        onChange={(e) => handleChange("fatherFirstName")(e)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fatherMiddleName">Middle Name</Label>
                      <Input
                        id="fatherMiddleName"
                        value={formData.fatherMiddleName}
                        onChange={(e) => handleChange("fatherMiddleName")(e)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="fatherCitizenship">Citizenship</Label>
                    <Input
                      id="fatherCitizenship"
                      value={formData.fatherCitizenship}
                      onChange={(e) => handleChange("fatherCitizenship")(e)}
                    />
                  </div>
                </div>

                {/* Marriage Information */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Marriage Information (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfMarriage">Date of Marriage</Label>
                      <Input
                        id="dateOfMarriage"
                        value={formData.dateOfMarriage}
                        onChange={(e) => handleChange("dateOfMarriage")(e)}
                        placeholder="e.g., June 12, 2020"
                      />
                    </div>
                    <div>
                      <Label htmlFor="placeOfMarriage">Place of Marriage</Label>
                      <Input
                        id="placeOfMarriage"
                        value={formData.placeOfMarriage}
                        onChange={(e) => handleChange("placeOfMarriage")(e)}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="remarks">Remarks (Optional)</Label>
                      <Textarea
                        id="remarks"
                        value={formData.remarks}
                        onChange={(e) => handleChange("remarks")(e)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="registrarName">Registrar Name</Label>
                      <Input
                        id="registrarName"
                        value={formData.registrarName}
                        onChange={(e) => handleChange("registrarName")(e)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {isEditing ? "Update Record" : "Save Record"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setPage("list");
                      setFormData(emptyRecord());
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // View page
  if (page === "view" && selectedRecord) {
    const childFullName = getFullName(
      selectedRecord.childLastName,
      selectedRecord.childFirstName,
      selectedRecord.childMiddleName
    );
    const motherFullName = getFullName(
      selectedRecord.motherLastName,
      selectedRecord.motherFirstName,
      selectedRecord.motherMiddleName
    );
    const fatherFullName = getFullName(
      selectedRecord.fatherLastName,
      selectedRecord.fatherFirstName,
      selectedRecord.fatherMiddleName
    );

    return (
      <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
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

        <div className="max-w-4xl mx-auto print:max-w-none">
          <link
            href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap"
            rel="stylesheet"
          />

          <div className="mb-4 print:hidden flex gap-2">
            <Button variant="ghost" onClick={() => setPage("list")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
            </Button>
            <Button onClick={() => print()}>
              <Printer className="w-4 h-4 mr-2" /> Print Certificate
            </Button>
            <Button variant="ghost" onClick={() => handleEdit(selectedRecord)}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => deleteRecord(selectedRecord.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>

          <div
            className="bg-white shadow-2xl print:shadow-none print-container"
            style={{ 
              fontFamily: "'Libre Baskerville', 'Georgia', serif",
              fontSize: '11pt',
              lineHeight: '1.4'
            }}
          >
            <div className="border-4 border-double border-gray-800 p-8 h-full flex flex-col">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 flex-shrink-0">
                  <img src="/logos/left.png" alt="left logo" className="w-full h-auto object-contain opacity-70" />
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

                <div className="flex items-start gap-2 flex-shrink-0">
                  <img src="/logos/center.png" alt="center logo" className="w-14 h-14 object-contain" />
                  <img src="/logos/right.png" alt="right logo" className="w-14 h-14 object-contain" />
                </div>
              </div>

              <div className="border-t-2 border-gray-300 my-4"></div>

              {/* Date aligned right */}
              <div className="text-right mb-6" style={{ fontSize: '10pt' }}>
                {selectedRecord.dateOfRegistration}
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
                      <td className="py-2 px-3">{selectedRecord.registryNo}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Date of Registration:</td>
                      <td className="py-2 px-3">{selectedRecord.dateOfRegistration}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Name of Child:</td>
                      <td className="py-2 px-3 uppercase font-semibold">{childFullName}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Sex:</td>
                      <td className="py-2 px-3">{selectedRecord.sex}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Date of Birth:</td>
                      <td className="py-2 px-3">{selectedRecord.dateOfBirth}</td>
                    </tr>
                    {selectedRecord.isTwin && selectedRecord.birthOrder && (
                      <tr className="border-b border-gray-300">
                        <td className="py-2 px-3 font-semibold bg-gray-50">Birth Order:</td>
                        <td className="py-2 px-3">{selectedRecord.birthOrder}</td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Place of Birth:</td>
                      <td className="py-2 px-3">{selectedRecord.placeOfBirth}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Mother's Maiden Name:</td>
                      <td className="py-2 px-3 uppercase">{motherFullName}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Mother's Citizenship:</td>
                      <td className="py-2 px-3">{selectedRecord.motherCitizenship}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Father's Name:</td>
                      <td className="py-2 px-3 uppercase">{fatherFullName}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Father's Citizenship:</td>
                      <td className="py-2 px-3">{selectedRecord.fatherCitizenship}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold bg-gray-50">Date of Marriage of Parents:</td>
                      <td className="py-2 px-3">{selectedRecord.dateOfMarriage || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold bg-gray-50">Place of Marriage of Parents:</td>
                      <td className="py-2 px-3">{selectedRecord.placeOfMarriage || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Remarks if present */}
              {selectedRecord.remarks && (
                <div className="mb-4 border border-gray-400 p-3">
                  <div className="font-bold mb-2" style={{ fontSize: '10pt' }}>REMARKS:</div>
                  <div style={{ fontSize: '9pt' }} className="whitespace-pre-wrap italic">{selectedRecord.remarks}</div>
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
                      {selectedRecord.registrarName || "___________________"}
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
        </div>
      </div>
    );
  }

  // LIST page
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Live Birth Records</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Child Last Name"
                  value={filters.childLastName}
                  onChange={(e) => setFilters({ ...filters, childLastName: e.target.value })}
                />
                <Input
                  placeholder="Child First Name"
                  value={filters.childFirstName}
                  onChange={(e) => setFilters({ ...filters, childFirstName: e.target.value })}
                />
                <Input
                  placeholder="Father Last Name"
                  value={filters.fatherLastName}
                  onChange={(e) => setFilters({ ...filters, fatherLastName: e.target.value })}
                />
                <Input
                  placeholder="Father First Name"
                  value={filters.fatherFirstName}
                  onChange={(e) => setFilters({ ...filters, fatherFirstName: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Mother Last Name"
                  value={filters.motherLastName}
                  onChange={(e) => setFilters({ ...filters, motherLastName: e.target.value })}
                />
                <Input
                  placeholder="Mother First Name"
                  value={filters.motherFirstName}
                  onChange={(e) => setFilters({ ...filters, motherFirstName: e.target.value })}
                />
                <Input
                  placeholder="Date of Birth"
                  value={filters.dob}
                  onChange={(e) => setFilters({ ...filters, dob: e.target.value })}
                />
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      childLastName: "",
                      childFirstName: "",
                      fatherLastName: "",
                      fatherFirstName: "",
                      motherLastName: "",
                      motherFirstName: "",
                      dob: "",
                    })}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="flex gap-2" onClick={handleNew}>
                  <Plus className="w-4 h-4" /> New Record
                </Button>
              </div>
            </div>

            {!storageAvailable && (
              <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 p-3 rounded mb-4">
                Storage unavailable — records cannot be saved.
              </div>
            )}

            <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Registry No.</th>
                    <th className="px-4 py-3 text-left font-semibold">Child Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Date of Birth</th>
                    <th className="px-4 py-3 text-left font-semibold w-40">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-4 py-3">{record.registryNo}</td>
                        <td className="px-4 py-3">
                          {getFullName(record.childLastName, record.childFirstName, record.childMiddleName)}
                        </td>
                        <td className="px-4 py-3">{record.dateOfBirth}</td>
                       
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(record)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteRecord(record.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CivilRegistrySystem;