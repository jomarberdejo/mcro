import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const data = { id: user.id, username: user.username };

  return NextResponse.json(data, { status: 200 });
}
