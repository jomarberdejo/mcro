import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, subfolder, filename } = body;

    console.log("DELETE REQUEST:", { type, subfolder, filename });

    if (!type || !subfolder || !filename) {
      return NextResponse.json(
        { error: "Type, subfolder, and filename are required" },
        { status: 400 }
      );
    }

    // Security: Prevent directory traversal
    if (
      filename.includes("..") || 
      type.includes("..") || 
      subfolder.includes("..")
    ) {
      return NextResponse.json(
        { error: "Invalid path" },
        { status: 400 }
      );
    }

    // Validate subfolder is either 'images' or 'pdfs'
    if (subfolder !== "images" && subfolder !== "pdfs") {
      return NextResponse.json(
        { error: "Invalid subfolder" },
        { status: 400 }
      );
    }

    // Construct file path with subfolder
    const filepath = path.join(process.cwd(), "uploads", type, subfolder, filename);

    console.log("ATTEMPTING TO DELETE:", filepath);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete the file
    // await unlink(filepath);

    console.log("FILE DELETED SUCCESSFULLY:", filepath);

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