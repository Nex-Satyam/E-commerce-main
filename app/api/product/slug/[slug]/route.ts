
import { NextRequest, NextResponse } from "next/server";
import { getProductBySlugController } from "@/controllers/product.controller";

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  const { slug } = params;
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