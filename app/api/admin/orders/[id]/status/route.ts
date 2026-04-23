import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, type OrderStatus } from "@/lib/admin-store";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as { status?: OrderStatus };

  if (!body.status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  const result = updateOrderStatus(id, body.status);

  if (!result?.order) {
    return NextResponse.json({ error: "Invalid order or status transition" }, { status: 400 });
  }

  return NextResponse.json(result);
}
