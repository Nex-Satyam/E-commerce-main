
import { NextRequest, NextResponse } from "next/server";
import { getProductBySlugController } from "@/controllers/product.controller";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  console.log("Received slug in API route:", slug);

  if (!slug) {
    return NextResponse.json(
      { success: false, message: "Missing slug" },
      { status: 400 }
    );
  }

  const result = await getProductBySlugController(slug);

  return NextResponse.json(result, {
    status: result.success ? 200 : 404,
  });
}