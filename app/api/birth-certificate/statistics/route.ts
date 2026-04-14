// Query params:
//   dobYearFrom    e.g. 2020
//   dobYearTo      e.g. 2024
//   regMonth       e.g. 1
//   regYear        e.g. 2024

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function parseFlexibleDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr.trim());
  if (!isNaN(d.getTime())) return d;

  const parts = dateStr.trim().split("/");
  if (parts.length === 3) {
    const [m, day, y] = parts.map(Number);
    if (!isNaN(m) && !isNaN(day) && !isNaN(y)) return new Date(y, m - 1, day);
  }
  return null;
}

function getMotherAgeGroup(age: number) {
  if (age >= 10 && age <= 14) return "10-14";
  if (age >= 15 && age <= 19) return "15-19";
  if (age >= 20 && age <= 49) return "20-49";
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const dobYearFrom = searchParams.get("dobYearFrom")
    ? parseInt(searchParams.get("dobYearFrom")!)
    : null;
  const dobYearTo = searchParams.get("dobYearTo")
    ? parseInt(searchParams.get("dobYearTo")!)
    : null;
  const regMonth = searchParams.get("regMonth")
    ? parseInt(searchParams.get("regMonth")!)
    : null;
  const regYear = searchParams.get("regYear")
    ? parseInt(searchParams.get("regYear")!)
    : null;

  const records = await prisma.birthRecord.findMany({
    select: {
      sex: true,
      dateOfBirth: true,
      dateOfRegistration: true,
      motherAge: true,
    },
  });

  type SexCount = { Male: number; Female: number; Unknown: number };
  const result: Record<string, SexCount> = {
    "10-14": { Male: 0, Female: 0, Unknown: 0 },
    "15-19": { Male: 0, Female: 0, Unknown: 0 },
    "20-49": { Male: 0, Female: 0, Unknown: 0 },
  };

  for (const r of records) {
    if (dobYearFrom !== null || dobYearTo !== null) {
      const dob = parseFlexibleDate(r.dateOfBirth);
      if (!dob) continue;
      const year = dob.getFullYear();
      if (dobYearFrom !== null && year < dobYearFrom) continue;
      if (dobYearTo !== null && year > dobYearTo) continue;
    }

    if (regMonth !== null || regYear !== null) {
      const reg = parseFlexibleDate(r.dateOfRegistration);
      if (!reg) continue;
      if (regMonth !== null && reg.getMonth() + 1 !== regMonth) continue;
      if (regYear !== null && reg.getFullYear() !== regYear) continue;
    }

    const age = parseInt(r.motherAge ?? "", 10);
    if (isNaN(age)) continue;
    const group = getMotherAgeGroup(age);
    if (!group) continue;

    if (r.sex === "Male") result[group].Male++;
    else if (r.sex === "Female") result[group].Female++;
    else result[group].Unknown++;
  }
  return NextResponse.json(result);
}
