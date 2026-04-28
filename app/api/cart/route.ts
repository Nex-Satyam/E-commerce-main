import { NextRequest } from "next/server";
import {
  handleAddToCart,
  handleClearCart,
  handleDeleteCartItem,
  handleGetCart,
  handleUpdateCart,
} from "@/controllers/cart.controller";

export async function GET() {
  return handleGetCart();
}

export async function POST(req: NextRequest) {
  return handleAddToCart(req);
}

export async function PATCH(req: NextRequest) {
  return handleUpdateCart(req);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clear = searchParams.get("clear");

  if (clear === "true") {
    return handleClearCart();
  }

  return handleDeleteCartItem(req);
}