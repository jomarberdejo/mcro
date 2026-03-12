import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAuth } from "@/lib/auth";
import { logActivity } from "@/lib/audit";


export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const session = await verifyAuth(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: session.userId } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Email is already in use." },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: name.trim(),
        email: email || null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        office: true,
        role: true,
      },
    });

    await logActivity({
      userId: session.userId,
      action: "UPDATE",
      module: "Auth",
      description: `Updated profile info for ${updated.username}`,
    });

    return NextResponse.json({ success: true, user: updated }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating your profile." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const session = await verifyAuth(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, username: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashed },
    });

    await logActivity({
      userId: session.userId,
      action: "UPDATE",
      module: "Auth",
      description: `Changed password for ${user.username}`,
    });

    return NextResponse.json(
      { success: true, message: "Password changed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "An error occurred while changing your password." },
      { status: 500 }
    );
  }
}