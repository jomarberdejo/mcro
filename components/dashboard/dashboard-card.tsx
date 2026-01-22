"use client";

import { RecordsModal } from "@/components/dashboard/record-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BirthRecord, DeathRecord, MarriageCertificateApplication, MarriageRecord } from "@/lib/generated/prisma/client";
import {
  FileText,
  Heart,
  LucideIcon,
  Cross,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

type RecordType = "birth" | "death" | "marriage" | "application";

type StatCard = {
  title: string;
  count: number;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  records:
    | BirthRecord[]
    | DeathRecord[]
    | MarriageRecord[]
    | MarriageCertificateApplication[];
  type: RecordType;
};

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Cross,
  Heart,
  ClipboardList,
};

export function DashboardCards({ stats }: { stats: StatCard[] }) {
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (stat: StatCard) => {
    setSelectedStat(stat);
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon] || FileText;
          return (
            <Card
              key={stat.title}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleCardClick(stat)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.count.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Click to view all records
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedStat && (
        <RecordsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedStat.title}
          records={selectedStat.records}
          type={selectedStat.type}
        />
      )}
    </>
  );
}
