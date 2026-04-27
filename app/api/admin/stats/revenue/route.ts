import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const paramDays = Number(request.nextUrl.searchParams.get("days") ?? 7);
  const days = Number.isFinite(paramDays) ? Math.max(1, paramDays) : 7;

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  
  // Calculate the start date (00:00:00 of the earliest day)
  const startDate = new Date(now.getTime() - (days - 1) * dayMs);
  startDate.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
      totalAmount: true,
    },
  });

  // Initialize array with all days set to 0 revenue
  const revenueByDay = Array.from({ length: days }, (_, index) => {
    const date = new Date(now.getTime() - (days - index - 1) * dayMs);
    return {
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD
      revenue: 0,
    };
  });

  // Aggregate orders by day
  orders.forEach((order) => {
    const orderDateStr = order.createdAt.toISOString().slice(0, 10);
    const dayRecord = revenueByDay.find((d) => d.date === orderDateStr);
    if (dayRecord) {
      dayRecord.revenue += order.totalAmount / 100; // Convert PAISE to RUPEES
    }
  });

  return NextResponse.json(revenueByDay);
}
