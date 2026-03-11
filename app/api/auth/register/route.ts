import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAuth } from "@/lib/auth";
import { logActivity } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const session = await verifyAuth(token);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { name, username, password, email, office, role } =
      await request.json();

    if (!name || !username || !password || !role) {
      return NextResponse.json(
        { error: "Name, username, password, and role are required." },
        { status: 400 }
      );
    }

    if (!["ADMIN", "STAFF"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be ADMIN or STAFF." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 409 }
      );
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email is already in use." },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        email: email || null,
        office: office || "MCRO",
        role,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        office: true,
        role: true,
        createdAt: true,
      },
    });

    await logActivity({
      userId: session.userId,
      action: "CREATE",
      module: "Auth",
      description: `Created ${role} account: ${newUser.username} (${newUser.name})`,
    });

    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the account." },
      { status: 500 }
    );
  }
}