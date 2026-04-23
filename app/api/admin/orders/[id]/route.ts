import { NextRequest, NextResponse } from "next/server";
import { getOrder, getValidNextStatuses } from "@/lib/admin-store";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const order = getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    order,
    validNextStatuses: getValidNextStatuses(order.status),
  });
}
