import { NextRequest, NextResponse } from "next/server";
import { listProducts, saveProduct } from "@/lib/admin-store";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  return NextResponse.json(
    listProducts({
      search: params.get("search") ?? "",
      category: params.get("category") ?? "",
      active: params.get("active") ?? "",
      page: Number(params.get("page") ?? 1),
      limit: Number(params.get("limit") ?? 20),
    })
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = saveProduct(body);
  return NextResponse.json({ product }, { status: 201 });
}
