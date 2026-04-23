import { NextRequest, NextResponse } from "next/server";
import { duplicateProduct } from "@/lib/admin-store";

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const product = duplicateProduct(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product }, { status: 201 });
}
