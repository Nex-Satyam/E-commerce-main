import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function handleSearch(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const price = searchParams.get("price") || "";
    const rating = parseInt(searchParams.get("rating") || "0");

    const where: Prisma.ProductWhereInput = { isActive: true };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
      ];
    }
    if (category) {
      where.category = { name: { equals: category, mode: "insensitive" } };
    }
    if (price) {
      const [min, max] = price.split("-").map(Number);
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        where.variants = {
          some: {
            price: {
              gte: min,
              lte: max,
            },
          },
        };
      }
    }

    const productsResult = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        images: true,
        reviews: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const products =
      rating && rating > 0
        ? productsResult.filter((product) => {
            if (!product.reviews.length) return rating <= 4;
            const average =
              product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length;

            return average >= rating;
          })
        : productsResult;

    return NextResponse.json({ products });
  } catch (err) {
    console.error("API Search error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
