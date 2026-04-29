import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type DeliveryMethod = "standard" | "express";
type RazorpayError = {
  statusCode?: number;
  error?: {
    description?: string;
    reason?: string;
  };
  message?: string;
};

function getCheckoutAmountPaise({
  subtotal,
  deliveryMethod,
  giftWrap,
}: {
  subtotal: number;
  deliveryMethod: DeliveryMethod;
  giftWrap: boolean;
}) {
  const baseShipping = subtotal >= 18000 ? 0 : 1200;
  const shipping = deliveryMethod === "express" ? baseShipping + 1800 : baseShipping;
  const giftWrapCharge = giftWrap ? 900 : 0;
  const tax = Math.round(subtotal * 0.08);

  return subtotal + shipping + giftWrapCharge + tax;
}

function getRazorpayErrorMessage(error: unknown) {
  const razorpayError = error as RazorpayError;

  return (
    razorpayError.error?.description ||
    razorpayError.error?.reason ||
    razorpayError.message ||
    "Payment order creation failed"
  );
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID missing in session" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay credentials are not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const deliveryMethod: DeliveryMethod =
      body?.deliveryMethod === "express" ? "express" : "standard";
    const giftWrap = Boolean(body?.giftWrap);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.variant.price,
      0
    );
    const amount = getCheckoutAmountPaise({ subtotal, deliveryMethod, giftWrap });

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now().toString(36)}_${userId.slice(0, 8)}`,
    });

    return NextResponse.json({
      success: true,
      keyId,
      order,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", getRazorpayErrorMessage(error));

    return NextResponse.json(
      { success: false, error: getRazorpayErrorMessage(error) },
      { status: 500 }
    );
  }
}
