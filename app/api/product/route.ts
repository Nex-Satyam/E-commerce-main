import { NextRequest, NextResponse } from "next/server";
import {
  getAllProductsController,
  getProductCardsController,
  getProductByIdController,
} from "@/controllers/product.controller";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const view = searchParams.get("view");

  if (id) {
    const result = await getProductByIdController(id);
    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    });
  }

  if (view === "card") {
    const result = await getProductCardsController();
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  }

  const result = await getAllProductsController();
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
