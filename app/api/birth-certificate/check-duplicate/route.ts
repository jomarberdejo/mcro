import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { childFirstName, childLastName, childMiddleName, excludeId, registryNo } =
      await request.json();

    const existingRecords = await prisma.birthRecord.findMany({
       where: {
        AND: [
          {
            OR: [
              {
                AND: [
                  {
                    childFirstName: {
                      equals: childFirstName,
                    },
                  },
                  {
                    childLastName: {
                      equals: childLastName,
                    },
                  },
                  {
                    childMiddleName: {
                      equals: childMiddleName || undefined,
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
        childFirstName: true,
        childLastName: true,
        childMiddleName: true,
        dateOfBirth: true,
        registryNo: true,
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