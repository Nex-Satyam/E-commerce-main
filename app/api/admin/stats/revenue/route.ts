import { NextRequest, NextResponse } from "next/server";
import { getRevenueByDay } from "@/lib/admin-store";

export async function GET(request: NextRequest) {
  const days = Number(request.nextUrl.searchParams.get("days") ?? 7);
  return NextResponse.json(getRevenueByDay(Number.isFinite(days) ? days : 7));
}
