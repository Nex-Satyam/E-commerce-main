import { getRandomProductsService } from "@/services/product.service";

export async function GET() {
  try {
    const products = await getRandomProductsService(5);
    return Response.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch random products";
    return Response.json({ error: message }, { status: 500 });
  }
}
