import { NextRequest, NextResponse } from "next/server";
import { adminOrderInclude, formatAdminOrder } from "@/lib/admin-orders";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as { note?: string };
  
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
