import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItemById,
  updateCartItemById,
} from "@/services/cart.service";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export async function handleGetCart() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await getCart(userId);

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get cart" },
      { status: 500 }
    );
  }
}

export async function handleAddToCart(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const variantId = body.variantId;
    const quantity = Number(body.quantity);

    if (!variantId || !Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "variantId and valid quantity are required" },
        { status: 400 }
      );
    }

    const cartItem = await addToCart({
      userId,
      variantId,
      quantity,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Item added to cart",
        cartItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to add item to cart",
      },
      { status: 400 }
    );
  }
}

export async function handleUpdateCart(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const cartItemId = body.cartItemId;
    const quantity = Number(body.quantity);

    if (!cartItemId || !Number.isInteger(quantity) || quantity < 0) {
      return NextResponse.json(
        { error: "cartItemId and valid quantity are required" },
        { status: 400 }
      );
    }

    const cartItem = await updateCartItemById({
      userId,
      cartItemId,
      quantity,
    });

    return NextResponse.json({
      success: true,
      message: quantity === 0 ? "Item removed from cart" : "Cart updated",
      cartItem,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update cart item",
      },
      { status: 400 }
    );
  }
}

export async function handleDeleteCartItem(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("cartItemId");

    if (!cartItemId) {
      return NextResponse.json(
        { error: "cartItemId is required" },
        { status: 400 }
      );
    }

    await removeCartItemById({
      userId,
      cartItemId,
    });

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("DELETE CART ITEM ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to remove cart item",
      },
      { status: 400 }
    );
  }
}

export async function handleClearCart() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await clearCart(userId);

    return NextResponse.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to clear cart",
      },
      { status: 400 }
    );
  }
}
