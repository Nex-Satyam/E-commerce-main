import { NextRequest } from "next/server";
import { handleAddToCart, handleGetCart } from "@/controllers/cart.controller";

export async function POST(req: NextRequest) {
  return handleAddToCart(req);
}

export async function GET() {
  return handleGetCart();
}
