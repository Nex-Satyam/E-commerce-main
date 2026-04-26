import { NextRequest, NextResponse } from "next/server";
import { getValidNextStatuses } from "@/lib/admin-store";
import { adminOrderInclude, formatAdminOrder } from "@/lib/admin-orders";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: adminOrderInclude,
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const formattedOrder = formatAdminOrder(order);

  return NextResponse.json({
    order: formattedOrder,
    validNextStatuses: getValidNextStatuses(order.status),
  });
}
