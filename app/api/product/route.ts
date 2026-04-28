import { NextRequest, NextResponse } from "next/server";
import {
  getAllProductsController,
  getProductByIdController,
  getProductBySlugController,
} from "@/controllers/product.controller";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  if (id) {
    const result = await getProductByIdController(id);
    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    });
  }


  const result = await getAllProductsController();
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}