import { NextRequest } from "next/server";
import { getRandomProductsService } from "@/services/product.service";

export async function GET(req: NextRequest) {
  try {
    const products = await getRandomProductsService(5);
    return Response.json(products);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
