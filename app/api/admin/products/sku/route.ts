import { NextRequest, NextResponse } from "next/server";
import { isSkuUnique } from "@/lib/admin-store";

export async function GET(request: NextRequest) {
  const sku = request.nextUrl.searchParams.get("sku") ?? "";
  const excludeVariantId = request.nextUrl.searchParams.get("excludeVariantId") ?? undefined;
  return NextResponse.json({ unique: sku.trim().length > 0 && isSkuUnique(sku, excludeVariantId) });
}
