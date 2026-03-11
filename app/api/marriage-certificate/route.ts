import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { marriageRecordSchema } from "@/lib/validations/marriage-record.schema";
import { z } from "zod";
import { getCurrentUser } from "@/lib/user";
import { logActivity } from "@/lib/audit";

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
      include: {
        supportingDocuments: true,
      },
     orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching marriage records:", error);
    return NextResponse.json(
      { error: "Failed to fetch marriage records" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const validatedData = marriageRecordSchema.parse(body);

    const { supportingDocuments, ...recordData } = validatedData;

    const record = await prisma.marriageRecord.create({
      data: {
        ...recordData,
        supportingDocuments: {
          create: supportingDocuments.map((doc) => ({
            filePath: doc.filePath,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            type: "MARRIAGE_CERTIFICATE",
          })),
        },
      },
      include: {
        supportingDocuments: true,
      },
    });

    await logActivity({
      userId: user.userId,
      action: "CREATE",
      module: "Marriage Certificate",
      description: `Created marriage certificate for ${recordData.husbandFirstName}  ${recordData.husbandLastName} and ${recordData.wifeFirstName} ${recordData.wifeLastName}`,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Error creating marriage record:", error);
    return NextResponse.json(
      { error: "Failed to create marriage record" },
      { status: 500 },
    );
  }
}
