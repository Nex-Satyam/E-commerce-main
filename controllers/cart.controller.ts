import { NextRequest, NextResponse } from "next/server";
import { addToCart, getCart, updateCartItem } from "@/services/cart.service";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function handleAddToCart(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
console.log("SESSION:", session);
console.log("USER ID:", session?.user?.id);
    const body = await req.json();
    const { variantId, quantity } = body;
console.log("BODY:", body);

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const cartItem = await addToCart({
      userId,
      variantId,
      quantity,
    });

    return NextResponse.json({ success: true, cartItem });

  } catch (error) {
  console.error("FULL ERROR:", error); 

  return NextResponse.json(
    { error: "Failed to add to cart" },
    { status: 500 }
  );
}
}
export async function handleGetCart() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id; 

  const cart = await getCart(userId);

  return NextResponse.json({ success: true, cart });
}

export async function handleUpdateCart(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const { variantId, quantity } = body;

    const result = await updateCartItem({
      userId,
      variantId,
      quantity,
    });

    return NextResponse.json({ success: true, result });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}