import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marriageCertificateApplicationSchema } from "@/lib/validations/marriage-cert-app.schema";
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
    
    const application = await prisma.marriageCertificateApplication.findUnique({
      where: { id },
      include: {
        supportingDocuments: true, 
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Marriage certificate application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error("Error fetching marriage certificate application:", error);
    return NextResponse.json(
      { error: "Failed to fetch marriage certificate application" },
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
    const validatedData = marriageCertificateApplicationSchema.parse(body);

    const { supportingDocuments, ...applicationData } = validatedData;

    const existingApplication = await prisma.marriageCertificateApplication.findUnique({
      where: { id },
      select: {
        supportingDocuments: true,
      },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Marriage certificate application not found" },
        { status: 404 }
      );
    }

    const existingDocPaths = new Set(
      existingApplication.supportingDocuments.map(doc => doc.filePath)
    );
    
    const newDocPaths = new Set(
      supportingDocuments?.map(doc => doc.filePath) || []
    );

    const docsToDelete = existingApplication.supportingDocuments.filter(
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

    const application = await prisma.marriageCertificateApplication.update({
      where: { id },
      data: {
        ...applicationData,
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
            type: 'MARRIAGE_CERTIFICATE_APPLICATION',
          })),
        },
      },
      include: {
        supportingDocuments: true,
      },
    });

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating marriage certificate application:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update marriage certificate application" },
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
    
    const application = await prisma.marriageCertificateApplication.findUnique({
      where: { id },
      include: {
        supportingDocuments: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Marriage certificate application not found" },
        { status: 404 }
      );
    }

    if (application.supportingDocuments.length > 0) {
      for (const doc of application.supportingDocuments) {
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

    await prisma.marriageCertificateApplication.delete({
      where: { id },
    });

    return NextResponse.json(
      { 
        message: "Marriage certificate application deleted successfully",
        deletedDocuments: application.supportingDocuments.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting marriage certificate application:", error);
    return NextResponse.json(
      { error: "Failed to delete marriage certificate application" },
      { status: 500 }
    );
  }
}