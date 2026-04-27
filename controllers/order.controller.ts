import { getOrdersByUserId as getOrdersByUserIdService, cancelOrderById as cancelOrderByIdService } from "@/services/order.service";
import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";


import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/services/order.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export const getOrdersByUserId = async (userId: string) => {
  return await getOrdersByUserIdService(userId);
};

export const cancelOrderById = async (orderId: string, userId: string) => {


  const order = await cancelOrderByIdService(orderId, userId);

  let userEmail = order.customerEmail;
  if (!userEmail) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    userEmail = user?.email || "";
  }

  try {
    await resend.emails.send({
      from: "orders@yourshop.com",
      to: userEmail,
      subject: `Order Cancelled - ${order.id}`,
      html: `<h2>Your order has been cancelled</h2><p>Your order <b>#${order.id}</b> was cancelled. If you have questions, contact support.</p>`
    });
  } catch (e) {
    console.error("Failed to send cancellation email", e);
  }

  return order;
};


export async function handleCheckout(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const body = await req.json();
    const { addressId } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "Address required" },
        { status: 400 }
      );
    }


    const order = await createOrder({ userId, addressId });

    try {
      await resend.emails.send({
        from: "orders@yourshop.com",
        to: session.user.email || "",
        subject: `Order Confirmation - ${order.id}`,
        html: `<h2>Thank you for your order!</h2><p>Your order <b>#${order.id}</b> has been placed successfully.</p>`
      });
    } catch (e) {
      console.error("Failed to send order email", e);
    }

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}