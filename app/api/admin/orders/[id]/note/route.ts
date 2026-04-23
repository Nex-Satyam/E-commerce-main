import { NextRequest, NextResponse } from "next/server";
import { updateOrderNote } from "@/lib/admin-store";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as { note?: string };
  const order = updateOrderNote(id, body.note ?? "");

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
