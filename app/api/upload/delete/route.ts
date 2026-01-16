import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, filename } = body;

    if (!type || !filename) {
      return NextResponse.json(
        { error: "Type and filename are required" },
        { status: 400 }
      );
    }

    // Security: Prevent directory traversal
    if (filename.includes("..") || type.includes("..")) {
      return NextResponse.json(
        { error: "Invalid path" },
        { status: 400 }
      );
    }

    // Construct file path
    const filepath = path.join(process.cwd(), "uploads", type, filename);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete the file
    await unlink(filepath);

    return NextResponse.json(
      { 
        success: true, 
        message: "File deleted successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}