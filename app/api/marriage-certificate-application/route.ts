import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marriageCertificateApplicationSchema } from "@/lib/validations/marriage-cert-app.schema";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

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
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching marriage certificate applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = marriageCertificateApplicationSchema.parse(body);

    const application = await prisma.marriageCertificateApplication.create({
      data: validatedData,
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }
    console.error("Error creating marriage certificate application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}