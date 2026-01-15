import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deathRecordSchema } from "@/lib/validations/death-record.schema";
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
    
    const record = await prisma.deathRecord.findUnique({
      where: { id },
      include: {
        supportingDocuments: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Death record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error fetching death record:", error);
    return NextResponse.json(
      { error: "Failed to fetch death record" },
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
    const validatedData = deathRecordSchema.parse(body);

    // Destructure to separate supportingDocuments
    const { supportingDocuments, ...recordData } = validatedData;

    // Check if record exists and get old signature path
    const existingRecord = await prisma.deathRecord.findUnique({
      where: { id },
      select: { signatureImagePath: true },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "Death record not found" },
        { status: 404 }
      );
    }

    // Delete old signature file if it changed
    if (validatedData.signatureImagePath) {
      if (
        existingRecord.signatureImagePath &&
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

    // Delete existing supporting documents
    await prisma.supportingDocument.deleteMany({
      where: { deathRecordId: id },
    });

    // Update record with new supporting documents
    const record = await prisma.deathRecord.update({
      where: { id },
      data: {
        ...recordData,
        supportingDocuments: {
          create: supportingDocuments?.map((doc) => ({
            filePath: doc.filePath,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            type: 'DEATH_CERTIFICATE',
          })) || [],
        },
      },
      include: {
        supportingDocuments: true,
      },
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    console.error("Error updating death record:", error);
    return NextResponse.json(
      { error: "Failed to update death record" },
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
    
    const record = await prisma.deathRecord.findUnique({
      where: { id },
      include: {
        supportingDocuments: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Death record not found" },
        { status: 404 }
      );
    }

    // Delete signature file if exists
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

    // Optional: Delete supporting document files from storage
    // Uncomment if you want to delete files from disk/cloud storage
    /*
    if (record.supportingDocuments.length > 0) {
      for (const doc of record.supportingDocuments) {
        try {
          const docFilePath = path.join(process.cwd(), 'public', doc.filePath);
          if (existsSync(docFilePath)) {
            await unlink(docFilePath);
          }
        } catch (fileError) {
          console.error(`Failed to delete file: ${doc.filePath}`, fileError);
        }
      }
    }
    */

    // Delete record (supporting documents will be cascade deleted)
    await prisma.deathRecord.delete({
      where: { id },
    });

    return NextResponse.json(
      { 
        message: "Death record deleted successfully",
        deletedDocuments: record.supportingDocuments.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting death record:", error);
    return NextResponse.json(
      { error: "Failed to delete death record" },
      { status: 500 }
    );
  }
}