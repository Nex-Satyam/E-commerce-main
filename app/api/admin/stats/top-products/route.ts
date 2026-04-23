import { NextResponse } from "next/server";
import { getTopProducts } from "@/lib/admin-store";

export async function GET() {
  return NextResponse.json(getTopProducts());
}
