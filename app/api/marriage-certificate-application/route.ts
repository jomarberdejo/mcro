import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marriageCertificateApplicationSchema } from "@/lib/validations/marriage-cert-app.schema";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    console.log("Fetching marriage certificate applications with search:", search);

    const applications = await prisma.marriageCertificateApplication.findMany({
      where: search
        ? {
            OR: [
              { registryNo: { contains: search } },
              { groomFirstName: { contains: search } },
              { groomLastName: { contains: search } },
              { brideFirstName: { contains: search } },
              { brideLastName: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
       include: {
        supportingDocuments: true
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching marriage certificate applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = marriageCertificateApplicationSchema.parse(body);

    const { supportingDocuments, ...applicationData } = validatedData;

    const application = await prisma.marriageCertificateApplication.create({
      data: {
        ...applicationData,
        supportingDocuments: {
          create: supportingDocuments.map((doc) => ({
            filePath: doc.filePath,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            type: "MARRIAGE_CERTIFICATE_APPLICATION",
          })),
        },
      },
      include: {
        supportingDocuments: true,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating marriage certificate application:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}
