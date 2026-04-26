import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const notification = await prisma.notification.update({
      where: {
        id,
        userId: session.user.id, // Security check
      },
      data: { isRead: true },
    });

    return NextResponse.json({ notification });
  } catch (error) {
    console.error("PATCH /api/notifications/:id/read error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
