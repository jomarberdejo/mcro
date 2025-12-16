// BirthRecordList.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { BirthRecord, BirthRecordListProps, FilterState } from "@/types";
import { getFullName } from "@/utils";

export const BirthRecordList: React.FC<BirthRecordListProps> = ({
  records,
  filters,
  storageAvailable,
  onFilterChange,
  onClearFilters,
  onNew,
  onView,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [recordsPerPage, setRecordsPerPage] = React.useState(10);

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalRecords = records.length;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, records]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRecordsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setRecordsPerPage(value);
    setCurrentPage(1); 
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = end - maxVisiblePages + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
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
                Live Birth Records
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Child Last Name"
                  value={filters.childLastName}
                  onChange={(e) =>
                    onFilterChange({ ...filters, childLastName: e.target.value })
                  }
                />
                <Input
                  placeholder="Child First Name"
                  value={filters.childFirstName}
                  onChange={(e) =>
                    onFilterChange({ ...filters, childFirstName: e.target.value })
                  }
                />
                <Input
                  placeholder="Father Last Name"
                  value={filters.fatherLastName}
                  onChange={(e) =>
                    onFilterChange({ ...filters, fatherLastName: e.target.value })
                  }
                />
                <Input
                  placeholder="Father First Name"
                  value={filters.fatherFirstName}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      fatherFirstName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Mother Last Name"
                  value={filters.motherLastName}
                  onChange={(e) =>
                    onFilterChange({ ...filters, motherLastName: e.target.value })
                  }
                />
                <Input
                  placeholder="Mother First Name"
                  value={filters.motherFirstName}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      motherFirstName: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Date of Birth"
                  value={filters.dob}
                  onChange={(e) =>
                    onFilterChange({ ...filters, dob: e.target.value })
                  }
                />
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="flex gap-2" onClick={onNew}>
                  <Plus className="w-4 h-4" /> New Record
                </Button>
              </div>
            </div>

            {!storageAvailable && (
              <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 p-3 rounded mb-4">
                Storage unavailable — records cannot be saved.
              </div>
            )}

            <div className="mb-4 text-sm text-gray-600">
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords} records
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Registry No.
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Child Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Date of Birth
                    </th>
                    <th className="px-4 py-3 text-left font-semibold w-40">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">
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
                            record.childLastName,
                            record.childFirstName,
                            record.childMiddleName
                          )}
                        </td>
                        <td className="px-4 py-3">{record.dateOfBirth}</td>

                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onView(record)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(record)}
                              className="flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(record.id)}
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