import { NextRequest, NextResponse } from "next/server";
import {
  getAllProductsController,
  getProductByIdController,
  getProductBySlugController, // 👈 ADD THIS
} from "@/controllers/product.controller";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  // 🔥 1. Search by ID
  if (id) {
    const result = await getProductByIdController(id);

    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    });
  }

  // 🔥 2. Search by SLUG
  if (slug) {
    const result = await getProductBySlugController(slug);

    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    });
  }

  const result = await getAllProductsController();

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}