import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalOrders, pendingOrders, revenueResult, lowStockCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: "DELIVERED" },
    }),
    prisma.productVariant.count({ where: { stock: { lt: 5 } } }),
  ]);

  const revenuePaise = revenueResult._sum.totalAmount || 0;

  return NextResponse.json({
    totalOrders,
    pendingOrders,
    revenue: revenuePaise / 100, // PAISE to RUPEES
    lowStockCount,
  });
}
