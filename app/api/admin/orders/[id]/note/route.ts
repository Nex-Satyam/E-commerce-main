import { NextRequest, NextResponse } from "next/server";
import { updateOrderNote } from "@/lib/admin-store";
import { adminOrderInclude, formatAdminOrder } from "@/lib/admin-orders";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as { note?: string };
  const order = updateOrderNote(id, body.note ?? "");

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
  
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { adminNote: body.note ?? "" },
      include: adminOrderInclude,
    });
    const formattedOrder = formatAdminOrder(order);

    return NextResponse.json({ order: formattedOrder });
  } catch {
    return NextResponse.json({ error: "Order not found or could not be updated" }, { status: 404 });
  }
}
