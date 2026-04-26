import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const type = searchParams.get("type");

    const skip = (page - 1) * limit;

    const where: any = {
      userId: session.user.id,
    };

    if (unreadOnly) {
      where.isRead = false;
    }

    if (type) {
      where.type = type;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.notification.count({ where });

    return NextResponse.json({
      notifications,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
