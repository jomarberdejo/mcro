"use client";

import { RecordsModal } from "@/components/dashboard/record-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Heart,
  LucideIcon,
  Cross,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type RecordType = "birth" | "death" | "marriage" | "application";

export type BirthRecord = {
  id: string;
  childFirstName: string;
  childMiddleName: string | null;
  childLastName: string;
  registryNo: string;
  dateOfBirth: string;
};

export type DeathRecord = {
  id: string;
  deceasedFirstName: string;
  deceasedMiddleName: string | null;
  deceasedLastName: string;
  registryNo: string;
  dateOfDeath: string | null;
};

export type MarriageRecord = {
  id: string;
  husbandFirstName: string;
  husbandMiddleName: string | null;
  husbandLastName: string;
  wifeFirstName: string;
  wifeMiddleName: string | null;
  wifeLastName: string;
  registryNo: string;
  dateOfMarriage: string;
};

export type ApplicationRecord = {
  id: string;
  groomFirstName: string;
  groomMiddleName: string | null;
  groomLastName: string;
  brideFirstName: string;
  brideMiddleName: string | null;
  brideLastName: string;
  registryNo: string;
};

export type StatCard = {
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
    | ApplicationRecord[];
  type: RecordType;
  url: string;
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
  const router = useRouter();

  const handleCardClick = (stat: StatCard) => {
    // setSelectedStat(stat);
    // setIsModalOpen(true);
    router.push(stat.url);
  };
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon] || FileText;
          return (
            <Card
              key={stat.title}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2"
              onClick={() => handleCardClick(stat)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-bold">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-5xl font-bold">
                  {stat.count.toLocaleString()}
                </div>
                <p className="text-base text-muted-foreground font-medium">
                  {stat.description}
                </p>
                <p className="text-base text-blue-600 font-semibold pt-2">
                  Click to view all records →
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
