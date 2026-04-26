// controllers/cart.controller.ts
import { NextRequest, NextResponse } from "next/server";
import { addToCart, getCart } from "@/services/cart.service";

export async function handleAddToCart(req: NextRequest) {
  const body = await req.json();
  const { productSlug, size, color, quantity } = body;
  if (!productSlug || !size || !color || quantity === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const cart = addToCart({ productSlug, size, color, quantity });
  return NextResponse.json({ cart });
}

export async function handleGetCart() {
  const cart = getCart();
  return NextResponse.json({ cart });
}
