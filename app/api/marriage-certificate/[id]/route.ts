import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marriageRecordSchema } from "@/lib/validations/marriage-record.schema";
import { z } from "zod";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { getCurrentUser } from "@/lib/user";
import { logActivity } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
   
    const record = await prisma.marriageRecord.findUnique({
      where: { id },
      include: {
        supportingDocuments: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Marriage record not found" },
        { status: 404 }
      );
    }
   

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error fetching marriage record:", error);
    return NextResponse.json(
      { error: "Failed to fetch marriage record" },
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
    const user = await getCurrentUser();
        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    const body = await request.json();
    const validatedData = marriageRecordSchema.parse(body);

    const { supportingDocuments, ...recordData } = validatedData;

    const existingRecord = await prisma.marriageRecord.findUnique({
      where: { id },
      select: { 
        registrarSignaturePath: true,
        verifierSignaturePath: true,
        certifyingOfficerSignaturePath: true,
        supportingDocuments: true,
      },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "Marriage record not found" },
        { status: 404 }
      );
    }

    const deleteOldSignature = async (oldPath: string | null, newPath: string | null | undefined) => {
      if (oldPath && oldPath !== newPath) {
        const oldFilePath = path.join(
          process.cwd(),
          "uploads",
          "signature",
          path.basename(oldPath)
        );
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath).catch(console.error);
        }
      }
    };

    await deleteOldSignature(
      existingRecord.registrarSignaturePath,
      validatedData.registrarSignaturePath
    );
    await deleteOldSignature(
      existingRecord.verifierSignaturePath,
      validatedData.verifierSignaturePath
    );
    await deleteOldSignature(
      existingRecord.certifyingOfficerSignaturePath,
      validatedData.certifyingOfficerSignaturePath
    );

    // Handle supporting documents
    const existingDocPaths = new Set(
      existingRecord.supportingDocuments.map(doc => doc.filePath)
    );
    
    const newDocPaths = new Set(
      supportingDocuments?.map(doc => doc.filePath) || []
    );

    const docsToDelete = existingRecord.supportingDocuments.filter(
      doc => !newDocPaths.has(doc.filePath)
    );

    const docsToCreate = supportingDocuments?.filter(
      doc => !existingDocPaths.has(doc.filePath)
    ) || [];

    for (const doc of docsToDelete) {
      const docFilePath = path.join(
        process.cwd(),
        "uploads",
        "documents",
        path.basename(doc.filePath)
      );
      if (existsSync(docFilePath)) {
        await unlink(docFilePath).catch(console.error);
      }
    }

    const record = await prisma.marriageRecord.update({
      where: { id },
      data: {
        ...recordData,
        supportingDocuments: {
          deleteMany: {
            id: {
              in: docsToDelete.map(doc => doc.id),
            },
          },
          create: docsToCreate.map((doc) => ({
            filePath: doc.filePath,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            type: 'MARRIAGE_CERTIFICATE',
          })),
        },
      },
      include: {
        supportingDocuments: true,
      },
    });

     await logActivity({
          userId: user.userId,
          action: "UPDATE",
          module: "Marriage Certificate",
          description: `Updated marriage certificate for ${record.husbandFirstName}  ${record.husbandLastName} and ${record.wifeFirstName} ${record.wifeLastName}`,
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
    
    console.error("Error updating marriage record:", error);
    return NextResponse.json(
      { error: "Failed to update marriage record" },
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
     const user = await getCurrentUser();
        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
    
    const record = await prisma.marriageRecord.findUnique({
      where: { id },
      include: {
        supportingDocuments: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Marriage record not found" },
        { status: 404 }
      );
    }

    const deleteSignatureFile = async (signaturePath: string | null) => {
      if (signaturePath) {
        const filePath = path.join(
          process.cwd(),
          "uploads",
          "signature",
          path.basename(signaturePath)
        );
        if (existsSync(filePath)) {
          await unlink(filePath).catch(console.error);
        }
      }
    };

    await deleteSignatureFile(record.registrarSignaturePath);
    await deleteSignatureFile(record.verifierSignaturePath);
    await deleteSignatureFile(record.certifyingOfficerSignaturePath);

    if (record.supportingDocuments.length > 0) {
      for (const doc of record.supportingDocuments) {
        try {
          const docFilePath = path.join(
            process.cwd(),
            "uploads",
            "documents",
            path.basename(doc.filePath)
          );
          if (existsSync(docFilePath)) {
            await unlink(docFilePath).catch(console.error);
          }
        } catch (fileError) {
          console.error(`Failed to delete file: ${doc.filePath}`, fileError);
        }
      }
    }

    await prisma.marriageRecord.delete({
      where: { id },
    });

      await logActivity({
          userId: user.userId,
          action: "DELETE",
          module: "Marriage Certificate",
          description: `Deleted marriage certificate for ${record.husbandFirstName}  ${record.husbandLastName} and ${record.wifeFirstName} ${record.wifeLastName}`,
        });

    return NextResponse.json(
      { 
        message: "Marriage record deleted successfully",
        deletedDocuments: record.supportingDocuments.length,
        deletedSignatures: [
          record.registrarSignaturePath,
          record.verifierSignaturePath,
          record.certifyingOfficerSignaturePath,
        ].filter(Boolean).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting marriage record:", error);
    return NextResponse.json(
      { error: "Failed to delete marriage record" },
      { status: 500 }
    );
  }
}