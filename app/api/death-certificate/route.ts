import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deathRecordSchema } from "@/lib/validations/death-record.schema";
import { z } from "zod";
import { logActivity } from "@/lib/audit";
import { getCurrentUser } from "@/lib/user";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    const records = await prisma.deathRecord.findMany({
      where: search
        ? {
            OR: [
              { registryNo: { contains: search } },
              { deceasedFirstName: { contains: search } },
              { deceasedLastName: { contains: search } },
            ],
          }
        : undefined,
      include: {
        supportingDocuments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching death records:", error);
    return NextResponse.json(
      { error: "Failed to fetch death records" },
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
    const validatedData = deathRecordSchema.parse(body);

    const { supportingDocuments, ...recordData } = validatedData;

    const record = await prisma.deathRecord.create({
      data: {
        ...recordData,
        supportingDocuments: {
          create:
            supportingDocuments?.map((doc) => ({
              filePath: doc.filePath,
              fileName: doc.fileName,
              fileSize: doc.fileSize,
              mimeType: doc.mimeType,
              type: "DEATH_CERTIFICATE",
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
      module: "Death Certificate",
      description: `Created death certificate for ${recordData.deceasedFirstName} ${recordData.deceasedLastName}`,
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

    console.error("Error creating death record:", error);
    return NextResponse.json(
      { error: "Failed to create death record" },
      { status: 500 },
    );
  }
}
