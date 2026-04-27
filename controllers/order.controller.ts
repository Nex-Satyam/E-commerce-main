import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/services/order.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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