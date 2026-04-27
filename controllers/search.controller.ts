import { prisma } from "@/lib/prisma";
import  { NextRequest ,NextResponse} from "next/server";

export async function handleSearch(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const price = searchParams.get("price") || "";
    const rating = parseInt(searchParams.get("rating") || "0");

    const where: any = { isActive: true };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } }
      ];
    }
    if (category) {
      where.category = { name: category };
    }
    if (price) {
      const [min, max] = price.split("-").map(Number);
      where.price = { gte: min, lte: max };
    }
    if (rating && rating > 0) {
      where.rating = { gte: rating };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        images: true,
        reviews: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (err) {
    console.error("API Search error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
