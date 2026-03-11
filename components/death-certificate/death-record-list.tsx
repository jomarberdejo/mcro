"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { DeathRecordListProps } from "@/types";
import { getFullName } from "@/utils";
import { UserRole } from "@/lib/generated/prisma/enums";
import { useAuth } from "@/hooks/auth/use-auth";
import { SupportingDocument } from "@/lib/generated/prisma/client";
import { SupportingDocsPopover } from "../supporting-docs-popover";

export const DeathRecordList: React.FC<DeathRecordListProps> = ({
  records,
  filters,
  storageAvailable,
  onFilterChange,
  onClearFilters,
  onView,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [recordsPerPage, setRecordsPerPage] = React.useState(10);
  const { user } = useAuth();

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalRecords = records.length;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, records]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (end - start + 1 < maxVisiblePages) start = end - maxVisiblePages + 1;
      for (let i = start; i <= end; i++) pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-semibold">
                Death Records
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={recordsPerPage}
                  onChange={handleRecordsPerPageChange}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">records per page</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6 flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Deceased Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Last Name"
                    value={filters.deceasedLastName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        deceasedLastName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="First Name"
                    value={filters.deceasedFirstName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        deceasedFirstName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Middle Name"
                    value={filters.deceasedMiddleName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        deceasedMiddleName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Date of Death"
                    value={filters.dateOfDeath}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        dateOfDeath: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Parent Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Father's Name"
                    value={filters.nameOfFather}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        nameOfFather: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Mother's Name"
                    value={filters.nameOfMother}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        nameOfMother: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" onClick={onClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>

            {!storageAvailable && (
              <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 p-3 rounded mb-4">
                Storage unavailable — records cannot be saved.
              </div>
            )}

            <div className="mb-4 text-sm text-gray-600">
              Showing {indexOfFirstRecord + 1} to{" "}
              {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords}{" "}
              records
            </div>

            <div className="border rounded-lg overflow-auto shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Registry No.
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Deceased Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Date of Death
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Age</th>
                    <th className="px-4 py-3 text-left font-semibold w-52">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">{record.registryNo}</td>
                        <td className="px-4 py-3">
                          {getFullName(
                            record.deceasedLastName,
                            record.deceasedFirstName,
                            record.deceasedMiddleName,
                          )}
                        </td>
                        <td className="px-4 py-3">{record.dateOfDeath}</td>
                        <td className="px-4 py-3">{record.age}</td>

                        <td className="px-4 py-3">
                          <div className="flex gap-2 items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onView(record)}
                              title="View record"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(record)}
                              title="Edit record"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {user?.role === UserRole.ADMIN && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(record.id)}
                                title="Delete record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            <SupportingDocsPopover
                              documents={record.supportingDocuments ?? []}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
