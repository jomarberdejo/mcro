import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marriageCertificateApplicationSchema } from "@/lib/validations/marriage-cert-app.schema";
import { z } from "zod";

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

    // Destructure to separate supportingDocuments
    const { supportingDocuments, ...applicationData } = validatedData;

    // Check if application exists
    const existingApplication = await prisma.marriageCertificateApplication.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Marriage certificate application not found" },
        { status: 404 }
      );
    }

    await prisma.supportingDocument.deleteMany({
      where: { marriageCertificateApplicationId: id },
    });

    const application = await prisma.marriageCertificateApplication.update({
      where: { id },
      data: {
        ...applicationData,
        supportingDocuments: {
          create: supportingDocuments.map((doc) => ({
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

    // Optional: Delete physical files from storage
    // Uncomment if you want to delete files from disk/cloud storage
    /*
    if (application.supportingDocuments.length > 0) {
      const fs = require('fs').promises;
      const path = require('path');
      
      for (const doc of application.supportingDocuments) {
        try {
          const filePath = path.join(process.cwd(), 'public', doc.filePath);
          await fs.unlink(filePath);
        } catch (fileError) {
          console.error(`Failed to delete file: ${doc.filePath}`, fileError);
        }
      }
    }
    */

    // Delete application (supporting documents will be cascade deleted)
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