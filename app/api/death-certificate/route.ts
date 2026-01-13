import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deathRecordSchema } from "@/lib/validations/death-record.schema";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    const records = await prisma.deathRecord.findMany({
      where: search
        ? {
            OR: [
              { registryNo: { contains: search } },
              { deceasedFirstName: { contains: search } },
              { deceasedLastName: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching death records:", error);
    return NextResponse.json(
      { error: "Failed to fetch death records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = deathRecordSchema.parse(body);

    const record = await prisma.deathRecord.create({
      data: validatedData,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }
    console.error("Error creating death record:", error);
    return NextResponse.json(
      { error: "Failed to create death record" },
      { status: 500 }
    );
  }
}