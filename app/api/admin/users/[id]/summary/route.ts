import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const totalOrders = await prisma.order.count({ where: { userId: id } });

    const ordersData = await prisma.order.findMany({
      where: { userId: id, status: { not: "CANCELLED" } },
      select: { totalAmount: true },
    });
    const lifetimeSpend = ordersData.reduce((acc: number, order: { totalAmount: number } ) => acc + order.totalAmount, 0);

    const recentOrders = await prisma.order.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, status: true, totalAmount: true, createdAt: true },
    });

    return NextResponse.json({
      summary: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedDate: user.createdAt.toISOString(),
        totalOrders,
        lifetimeSpend,
        recentOrders: recentOrders.map((o: { id: string; status: any; totalAmount: number; createdAt: Date }) => ({
          ...o,
          createdAt: o.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/users/[id]/summary error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
