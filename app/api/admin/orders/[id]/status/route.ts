import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminOrderInclude, formatAdminOrder } from "@/lib/admin-orders";
import { getValidNextStatuses } from "@/lib/admin-store";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { NotifType, OrderStatus } from "@prisma/client";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as { status?: OrderStatus };

    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!getValidNextStatuses(existingOrder.status).includes(body.status)) {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status },
      include: {
        ...adminOrderInclude,
        user: true,
      },
    });

    // Notify user about status change
    const typeMap: Record<OrderStatus, NotifType> = {
      PENDING: "ORDER_PLACED",
      CONFIRMED: "ORDER_CONFIRMED",
      SHIPPED: "ORDER_SHIPPED",
      DELIVERED: "ORDER_DELIVERED",
      CANCELLED: "ORDER_CANCELLED",
    };

    await createNotification(order.userId, typeMap[body.status], { orderId: id });

    return NextResponse.json({ order: formatAdminOrder(order) });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id]/status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
