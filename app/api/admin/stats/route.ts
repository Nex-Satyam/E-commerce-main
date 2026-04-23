import { NextResponse } from "next/server";
import { getStats } from "@/lib/admin-store";

export async function GET() {
  return NextResponse.json(getStats());
}
