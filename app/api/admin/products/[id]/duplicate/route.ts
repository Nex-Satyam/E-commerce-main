import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD
import { duplicateProduct } from "@/lib/admin-store";

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const product = duplicateProduct(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product }, { status: 201 });
=======
import { prisma } from "@/lib/prisma";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newName = `${existing.name} Copy`;
    let baseSlug = generateSlug(newName);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await prisma.product.create({
      data: {
        name: newName,
        description: existing.description,
        slug,
        categoryId: existing.categoryId,
        isActive: false, // Start duplicates as inactive
        images: {
          create: existing.images.map((img) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        },
        variants: {
          create: existing.variants.map((v) => ({
            name: v.name,
            sku: `${v.sku}-copy`,
            price: v.price, // Already in PAISE
            stock: v.stock,
          })),
        },
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    });

    const formattedProduct = {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      variants: product.variants.map((v) => ({ ...v, price: v.price / 100 })),
    };

    return NextResponse.json({ product: formattedProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error duplicating product:", error);
    return NextResponse.json({ error: "Failed to duplicate product" }, { status: 500 });
  }
>>>>>>> origin/main
}
