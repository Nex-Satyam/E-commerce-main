import { NextRequest, NextResponse } from "next/server";
import { listVariantsForStock, updateBulkStock } from "@/lib/admin-store";

export async function GET() {
  return NextResponse.json({ variants: listVariantsForStock() });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const variants = updateBulkStock(body.updates ?? []);
  return NextResponse.json({ variants });
}
