import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      childFirstName,
      childLastName,
      childMiddleName,
      excludeId,
      registryNo,
    } = await request.json();

    console.log("Checking duplicates for:", {
      childFirstName,
      childLastName,
      childMiddleName,
      excludeId,
      registryNo,
    });

    const orConditions = [];

    const hasValidNameFields = 
      childFirstName?.trim() && 
      childLastName?.trim();

    if (hasValidNameFields) {
      orConditions.push({
        AND: [
          {
            childFirstName: {
              equals: childFirstName.trim(),
            },
          },
          {
            childLastName: {
              equals: childLastName.trim(),
            },
          },
          ...(childMiddleName?.trim()
            ? [
                {
                  childMiddleName: {
                    equals: childMiddleName.trim(),
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

    const existingRecords = await prisma.birthRecord.findMany({
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
      { status: 500 },
    );
  }
}