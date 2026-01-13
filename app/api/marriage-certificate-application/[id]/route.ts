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

    const application = await prisma.marriageCertificateApplication.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }
    console.error("Error updating marriage certificate application:", error);
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
    });

    if (!application) {
      return NextResponse.json(
        { error: "Marriage certificate application not found" },
        { status: 404 }
      );
    }

    await prisma.marriageCertificateApplication.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Marriage certificate application deleted successfully" },
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