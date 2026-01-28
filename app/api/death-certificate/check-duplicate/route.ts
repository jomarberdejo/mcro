import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      deceasedFirstName,
      deceasedLastName,
      deceasedMiddleName,
      registryNo,
      excludeId,
    } = await request.json();

    console.log(deceasedFirstName, deceasedLastName, deceasedMiddleName, registryNo, excludeId)

    const existingRecords = await prisma.deathRecord.findMany({
      where: {
        AND: [
          {
            OR: [
              {
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
                      equals: deceasedMiddleName || undefined,
                    },
                  },
                ],
              },
              {
                registryNo: {
                  equals: registryNo,
                },
              },
            ],
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
      { status: 500 },
    );
  }
}
