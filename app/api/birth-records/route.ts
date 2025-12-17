// app/api/birth-records/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { birthRecordSchema } from "@/lib/validations/birth-record.schema";
import { z } from "zod";

// GET all birth records
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    const records = await prisma.birthRecord.findMany({
      where: search
        ? {
            OR: [
              { registryNo: { contains: search } },
              { childFirstName: { contains: search } },
              { childLastName: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching birth records:", error);
    return NextResponse.json(
      { error: "Failed to fetch birth records" },
      { status: 500 }
    );
  }
}

// POST new birth record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = birthRecordSchema.parse(body);

    const record = await prisma.birthRecord.create({
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
    console.error("Error creating birth record:", error);
    return NextResponse.json(
      { error: "Failed to create birth record" },
      { status: 500 }
    );
  }
}