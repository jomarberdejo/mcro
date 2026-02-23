import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; 

    console.log("FORM DATA ==== ", formData);

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only image files (JPG, PNG, GIF, WEBP) and PDF files are allowed" },
        { status: 400 }
      );
    }

    const maxSize = type === "signature" 
      ? 2 * 1024 * 1024 
      : 10 * 1024 * 1024; 
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size should be less than ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    const isPDF = file.type === "application/pdf";
    const subFolder = isPDF ? "pdfs" : "images";
    
    const uploadDir = path.join(process.cwd(), "uploads", type, subFolder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name);
    const filename = `${timestamp}-${randomString}${extension}`;
    const filepath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const apiPath = `/api/files/${type}/${subFolder}/${filename}`;

    return NextResponse.json(
      { 
        success: true, 
        path: apiPath,
        filename,
        mimeType: file.type 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}