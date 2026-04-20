"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, BarChart2, Loader2 } from "lucide-react";

type SexCount = { Male: number; Female: number };
type StatsResult = Record<"10-14" | "15-19" | "20-49", SexCount>;

interface Props {
  onClose: () => void;
}

const AGE_GROUPS = ["10-14", "15-19", "20-49"] as const;

export const StatisticsReportModal: React.FC<Props> = ({ onClose }) => {
  const [dobYearFrom, setDobYearFrom] = useState("");
  const [dobYearTo, setDobYearTo] = useState("");
  const [regMonth, setRegMonth] = useState("");
  const [regYear, setRegYear] = useState("");
  const [result, setResult] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (dobYearFrom) params.set("dobYearFrom", dobYearFrom);
      if (dobYearTo) params.set("dobYearTo", dobYearTo);
      if (regMonth) params.set("regMonth", regMonth);
      if (regYear) params.set("regYear", regYear);

      if (!dobYearFrom || !dobYearTo || !regMonth || !regYear) {
        setError("Please provide all filter criteria.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/birth-certificate/statistics?${params}`);
      if (!res.ok) throw new Error("Failed to fetch statistics.");

      const data: StatsResult = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDobYearFrom("");
    setDobYearTo("");
    setRegMonth("");
    setRegYear("");
    setResult(null);
    setError("");
  };

  const grandTotal = result
    ? AGE_GROUPS.reduce(
        (acc, g) => ({
          Male: acc.Male + result[g].Male,
          Female: acc.Female + result[g].Female
        }),
        { Male: 0, Female: 0 },
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Birth Statistics Report</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Child&apos;s Year of Birth
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="From (e.g. 2000)"
                  value={dobYearFrom}
                  onChange={(e) => setDobYearFrom(e.target.value)}
                  min={1900}
                  max={new Date().getFullYear()}
                  
                  style={{
                    width: 300,
                  }}
                />
                <span className="text-gray-400 text-sm">to</span>
                <Input
                  type="number"
                  placeholder="To (e.g. 2024)"
                  value={dobYearTo}
                  onChange={(e) => setDobYearTo(e.target.value)}
                  min={1900}
                  max={new Date().getFullYear()}
                  style={{
                    width: 300,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Date of Registration
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={regMonth}
                  onChange={(e) => setRegMonth(e.target.value)}
                  className="border rounded px-3 py-2 text-sm w-full"
                >
                  <option value="">Month (any)</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Year"
                  value={regYear}
                  onChange={(e) => setRegYear(e.target.value)}
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              {error}
            </p>
          )}

          {result && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Results by Mother&apos;s Age Group
              </p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        Mother&apos;s Age
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-blue-700">
                        Male
                      </th>
                      <th className="px-4 py-2 text-center font-semibold text-pink-600">
                        Female
                      </th>
                     
                      <th className="px-4 py-2 text-center font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {AGE_GROUPS.map((group) => {
                      const row = result[group];
                      const total = row.Male + row.Female;
                      return (
                        <tr key={group} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium">{group}</td>
                          <td className="px-4 py-2 text-center text-blue-700">
                            {row.Male}
                          </td>
                          <td className="px-4 py-2 text-center text-pink-600">
                            {row.Female}
                          </td>
                          
                          <td className="px-4 py-2 text-center font-semibold">
                            {total}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Grand Total Row */}
                  {grandTotal && (
                    <tfoot className="bg-gray-100 border-t-2">
                      <tr>
                        <td className="px-4 py-2 font-bold">Total</td>
                        <td className="px-4 py-2 text-center font-bold text-blue-700">
                          {grandTotal.Male}
                        </td>
                        <td className="px-4 py-2 text-center font-bold text-pink-600">
                          {grandTotal.Female}
                        </td>
                      
                        <td className="px-4 py-2 text-center font-bold">
                          {grandTotal.Male +
                            grandTotal.Female}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
