import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marriageRecordSchema } from "@/lib/validations/marriage-record.schema";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    const records = await prisma.marriageRecord.findMany({
      where: search
        ? {
            OR: [
              { registryNo: { contains: search } },
              { husbandFirstName: { contains: search } },
              { husbandLastName: { contains: search } },
              { wifeFirstName: { contains: search } },
              { wifeLastName: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching marriage records:", error);
    return NextResponse.json(
      { error: "Failed to fetch marriage records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = marriageRecordSchema.parse(body);

    const record = await prisma.marriageRecord.create({
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
    console.error("Error creating marriage record:", error);
    return NextResponse.json(
      { error: "Failed to create marriage record" },
      { status: 500 }
    );
  }
}