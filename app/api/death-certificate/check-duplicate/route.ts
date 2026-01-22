import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
  
    const { deceasedFirstName, deceasedLastName, deceasedMiddleName, excludeId } =
      await request.json();

    const existingRecords = await prisma.deathRecord.findMany({
      where: {
        AND: [
          {
            deceasedFirstName: {
              equals: deceasedFirstName,
            },
          },
          {
            deceasedLastName: {
              equals: deceasedLastName,
            },
          },
          {
            deceasedMiddleName: {
              equals: deceasedMiddleName,
            },
          },
          ...(excludeId ? [{ id: { not: excludeId } }] : []),
        ],
      },
      select: {
        id: true,
        deceasedFirstName: true,
        deceasedLastName: true,
        deceasedMiddleName: true,
        registryNo: true,
        dateOfDeath: true,
      },
    });

    return NextResponse.json({
      hasDuplicates: existingRecords.length > 0,
      duplicates: existingRecords,
    });
  } catch (error) {
    console.error("Error checking duplicates:", error);
    return NextResponse.json(
      { error: "Failed to check for duplicates" },
      { status: 500 }
    );
  }
}