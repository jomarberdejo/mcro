import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { birthRecordSchema } from "@/lib/validations/birth-record.schema";
import { z } from "zod";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const record = await prisma.birthRecord.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Birth record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error fetching birth record:", error);
    return NextResponse.json(
      { error: "Failed to fetch birth record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = birthRecordSchema.parse(body);

    if (validatedData.signatureImagePath) {
      const existingRecord = await prisma.birthRecord.findUnique({
        where: { id },
        select: { signatureImagePath: true },
      });

      if (
        existingRecord?.signatureImagePath &&
        existingRecord.signatureImagePath !== validatedData.signatureImagePath
      ) {
        const oldFilePath = path.join(
          process.cwd(),
          "public",
          existingRecord.signatureImagePath
        );
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath).catch(console.error);
        }
      }
    }

    const record = await prisma.birthRecord.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }
    console.error("Error updating birth record:", error);
    return NextResponse.json(
      { error: "Failed to update birth record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const record = await prisma.birthRecord.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Birth record not found" },
        { status: 404 }
      );
    }

    if (record.signatureImagePath) {
      const filePath = path.join(
        process.cwd(),
        "public",
        record.signatureImagePath
      );
      if (existsSync(filePath)) {
        await unlink(filePath).catch(console.error);
      }
    }

    await prisma.birthRecord.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Birth record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting birth record:", error);
    return NextResponse.json(
      { error: "Failed to delete birth record" },
      { status: 500 }
    );
  }
}