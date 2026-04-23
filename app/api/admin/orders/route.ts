import { NextRequest, NextResponse } from "next/server";
import { listOrders } from "@/lib/admin-store";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") ?? 1);
  const limit = Number(params.get("limit") ?? 10);

  return NextResponse.json(
    listOrders({
      status: params.get("status") ?? "",
      search: params.get("search") ?? "",
      from: params.get("from") ?? "",
      to: params.get("to") ?? "",
      page: Number.isFinite(page) ? page : 1,
      limit: Number.isFinite(limit) ? limit : 10,
    })
  );
}
