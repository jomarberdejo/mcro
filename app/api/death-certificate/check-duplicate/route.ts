import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      deceasedFirstName,
      deceasedLastName,
      deceasedMiddleName,
      excludeId,
      registryNo,
    } = await request.json();

    console.log("Checking duplicates for:", {
      deceasedFirstName,
      deceasedLastName,
      deceasedMiddleName,
      excludeId,
      registryNo,
    });

    const orConditions = [];

    const hasValidNameFields = 
      deceasedFirstName?.trim() && 
      deceasedLastName?.trim();

    if (hasValidNameFields) {
      orConditions.push({
        AND: [
          {
            deceasedFirstName: {
              equals: deceasedFirstName.trim(),
            },
          },
          {
            deceasedLastName: {
              equals: deceasedLastName.trim(),
            },
          },
          ...(deceasedMiddleName?.trim()
            ? [
                {
                  deceasedMiddleName: {
                    equals: deceasedMiddleName.trim(),
                  },
                },
              ]
            : []),
        ],
      });
    }

    if (registryNo?.trim()) {
      orConditions.push({
        registryNo: {
          equals: registryNo.trim(),
        },
      });
    }

    if (orConditions.length === 0) {
      return NextResponse.json({
        hasDuplicates: false,
        duplicates: [],
      });
    }

    const existingRecords = await prisma.deathRecord.findMany({
      where: {
        AND: [
          {
            OR: orConditions,
          },
          ...(excludeId ? [{ id: { not: excludeId } }] : []),
        ],
      },
      select: {
        id: true,
        deceasedFirstName: true,
        deceasedLastName: true,
        deceasedMiddleName: true,
        dateOfDeath: true,
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
      { status: 500 },
    );
  }
}