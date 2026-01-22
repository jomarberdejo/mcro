"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BirthRecord, DeathRecord, MarriageCertificateApplication, MarriageRecord } from "@/lib/generated/prisma/client";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

type RecordType = "birth" | "death" | "marriage" | "application";


type RecordsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  records: BirthRecord[] | DeathRecord[] | MarriageRecord[] | MarriageCertificateApplication[];
  type: RecordType;
};

export function RecordsModal({
  isOpen,
  onClose,
  title,
  records,
  type,
}: RecordsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const formatName = (
    firstName: string,
    middleName: string | null,
    lastName: string
  ) => {
    const middle = middleName ? ` ${middleName} ` : " ";
    return `${firstName}${middle}${lastName}`;
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;

    const query = searchQuery.toLowerCase();

    return records.filter((record) => {
      if (type === "birth") {
        const r = record as BirthRecord;
        const fullName = formatName(r.childFirstName, r.childMiddleName, r.childLastName).toLowerCase();
        return fullName.includes(query) || r.registryNo.toLowerCase().includes(query);
      }
      if (type === "death") {
        const r = record as DeathRecord;
        const fullName = formatName(r.deceasedFirstName, r.deceasedMiddleName, r.deceasedLastName).toLowerCase();
        return fullName.includes(query) || r.registryNo.toLowerCase().includes(query);
      }
      if (type === "marriage") {
        const r = record as MarriageRecord;
        const husbandName = formatName(r.husbandFirstName, r.husbandMiddleName, r.husbandLastName).toLowerCase();
        const wifeName = formatName(r.wifeFirstName, r.wifeMiddleName, r.wifeLastName).toLowerCase();
        return husbandName.includes(query) || wifeName.includes(query) || r.registryNo.toLowerCase().includes(query);
      }
      if (type === "application") {
        const r = record as MarriageCertificateApplication;
        const groomName = formatName(r.groomFirstName, r.groomMiddleName, r.groomLastName).toLowerCase();
        const brideName = formatName(r.brideFirstName, r.brideMiddleName, r.brideLastName).toLowerCase();
        return groomName.includes(query) || brideName.includes(query) || r.registryNo.toLowerCase().includes(query);
      }
      return false;
    });
  }, [records, searchQuery, type]);

  const renderRecord = (record: any, index: number) => {
    if (type === "birth") {
      const r = record as BirthRecord;
      return (
        <div
          key={r.id}
          className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">
              {formatName(r.childFirstName, r.childMiddleName, r.childLastName)}
            </p>
            <p className="text-sm text-muted-foreground">
              Registry No: {r.registryNo} • Birth Date: {r.dateOfBirth}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">#{index + 1}</div>
        </div>
      );
    }

    if (type === "death") {
      const r = record as DeathRecord;
      return (
        <div
          key={r.id}
          className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">
              {formatName(r.deceasedFirstName, r.deceasedMiddleName, r.deceasedLastName)}
            </p>
            <p className="text-sm text-muted-foreground">
              Registry No: {r.registryNo} • Death Date: {r.dateOfDeath}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">#{index + 1}</div>
        </div>
      );
    }

    if (type === "marriage") {
      const r = record as MarriageRecord;
      return (
        <div
          key={r.id}
          className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">
              {formatName(r.husbandFirstName, r.husbandMiddleName, r.husbandLastName)}
              {" & "}
              {formatName(r.wifeFirstName, r.wifeMiddleName, r.wifeLastName)}
            </p>
            <p className="text-sm text-muted-foreground">
              Registry No: {r.registryNo} • Marriage Date: {r.dateOfMarriage}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">#{index + 1}</div>
        </div>
      );
    }

    if (type === "application") {
      const r = record as MarriageCertificateApplication;
      return (
        <div
          key={r.id}
          className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">
              {formatName(r.groomFirstName, r.groomMiddleName, r.groomLastName)}
              {" & "}
              {formatName(r.brideFirstName, r.brideMiddleName, r.brideLastName)}
            </p>
            <p className="text-sm text-muted-foreground">
              Registry No: {r.registryNo}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">#{index + 1}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Showing {filteredRecords.length} of {records.length} records
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or registry number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => renderRecord(record, index))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No records found
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}