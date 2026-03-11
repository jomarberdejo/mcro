import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { birthRecordSchema } from "@/lib/validations/birth-record.schema";
import { z } from "zod";
import { getCurrentUser } from "@/lib/user";
import { logActivity } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");


    const records = await prisma.birthRecord.findMany({
      where: search
        ? {
            OR: [
              { registryNo: { contains: search } },
              { childFirstName: { contains: search } },
              { childLastName: { contains: search } },
            ],
          }
        : undefined,
      include: {
        supportingDocuments: true
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching birth records:", error);
    return NextResponse.json(
      { error: "Failed to fetch birth records" },
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
    const validatedData = birthRecordSchema.parse(body);

    const { supportingDocuments, ...recordData } = validatedData;

    const record = await prisma.birthRecord.create({
      data: {
        ...recordData,
        userId: user.userId,
        supportingDocuments: {
          create:
            supportingDocuments?.map((doc) => ({
              filePath: doc.filePath,
              fileName: doc.fileName,
              fileSize: doc.fileSize,
              mimeType: doc.mimeType,
              type: "BIRTH_CERTIFICATE",
            })) || [],
        },
      },
      include: {
        supportingDocuments: true,
      },
    });

    await logActivity({
      userId: user.userId,
      action: "CREATE",
      module: "Birth Certificate",
      description: `Created birth certificate for ${recordData.childFirstName} ${recordData.childLastName}`,
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

    console.error("Error creating birth record:", error);
    return NextResponse.json(
      { error: "Failed to create birth record" },
      { status: 500 },
    );
  }
}
