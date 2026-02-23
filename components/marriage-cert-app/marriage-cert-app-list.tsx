
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { MarriageCertificateApplicationFilterState } from "@/app/admin/(pages)/marriage-cert-app/page";
import { useAuth } from "@/hooks/auth/use-auth";
import { UserRole } from "@/lib/generated/prisma/enums";
import { MarriageCertificateApplication } from "@/lib/generated/prisma/client";
import { getFullName } from "@/utils";

interface MarriageCertificateApplicationListProps {
  applications: MarriageCertificateApplication[];
  filters: MarriageCertificateApplicationFilterState;
  storageAvailable: boolean;
  onFilterChange: (filters: MarriageCertificateApplicationFilterState) => void;
  onClearFilters: () => void;
  onView: (application: MarriageCertificateApplication) => void;
  onEdit: (application: MarriageCertificateApplication) => void;
  onDelete: (id: string) => void;
}

export const MarriageCertificateApplicationList: React.FC<
  MarriageCertificateApplicationListProps
> = ({
  applications,
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

  const totalPages = Math.ceil(applications.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentApplications = applications.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalRecords = applications.length;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, applications]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRecordsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = parseInt(e.target.value);
    setRecordsPerPage(value);
    setCurrentPage(1);
  };

  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

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
                Application for Marriage License
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
              {/* Registry Information */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Registry Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Registry No."
                    value={filters.registryNo}
                    onChange={(e) =>
                      onFilterChange({ ...filters, registryNo: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Date of Registration"
                    value={filters.dateOfRegistration}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        dateOfRegistration: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Groom Information */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Groom Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Last Name"
                    value={filters.groomLastName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        groomLastName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="First Name"
                    value={filters.groomFirstName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        groomFirstName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Middle Name"
                    value={filters.groomMiddleName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        groomMiddleName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Bride Information */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Bride Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Last Name"
                    value={filters.brideLastName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        brideLastName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="First Name"
                    value={filters.brideFirstName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        brideFirstName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Middle Name"
                    value={filters.brideMiddleName}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        brideMiddleName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" onClick={onClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>

            {!storageAvailable && (
              <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 p-3 rounded mb-4">
                Storage unavailable — applications cannot be saved.
              </div>
            )}

            <div className="mb-4 text-sm text-gray-600">
              Showing {indexOfFirstRecord + 1} to{" "}
              {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords}{" "}
              applications
            </div>

            <div className="border rounded-lg overflow-auto shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Registry No.
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Groom Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Bride Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Registration Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold w-40">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        No applications found.
                      </td>
                    </tr>
                  ) : (
                    currentApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">{app.registryNo}</td>
                        <td className="px-4 py-3">
                          {getFullName(
                            app.groomFirstName,
                            app.groomMiddleName,
                            app.groomLastName,
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {getFullName(
                            app.brideFirstName,
                            app.brideMiddleName,
                            app.brideLastName,
                          )}
                        </td>
                        <td className="px-4 py-3">{app.dateOfRegistration}</td>

                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onView(app)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(app)}
                              className="flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {user?.role === UserRole.ADMIN && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(app.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
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
