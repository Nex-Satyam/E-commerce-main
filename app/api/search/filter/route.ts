import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/services/search.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const price = searchParams.get("price") || "";
  const rating = parseInt(searchParams.get("rating") || "0");

  const products = searchProducts({ q, category, price, rating });
  return NextResponse.json({ products });
}
