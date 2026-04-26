import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const formattedProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: product.variants.map((v) => ({ ...v, price: v.price / 100 })),
  };

  return NextResponse.json({ product: formattedProduct });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Determine variant IDs to keep/update
    const incomingVariantIds = (body.variants || []).map((v: any) => v.id).filter(Boolean);

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description?.trim() || null }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        // For images, we can safely delete and recreate since there are no strict FKs depending on them
        ...(body.images !== undefined && {
          images: {
            deleteMany: {},
            create: body.images.map((img: any, idx: number) => ({
              url: img.url,
              isPrimary: img.isPrimary || false,
              sortOrder: img.sortOrder ?? idx,
            })),
          },
        }),
        // For variants, we upsert to preserve IDs for OrderItems and CartItems
        ...(body.variants !== undefined && {
          variants: {
            // Optional: try to delete removed variants (might fail if linked to orders, handled in catch or ignored)
            // deleteMany: { id: { notIn: incomingVariantIds } },
            upsert: body.variants.map((v: any) => ({
              where: { id: v.id || "new" },
              update: {
                name: v.name,
                sku: v.sku,
                price: Math.round(Number(v.price) * 100),
                stock: Number(v.stock),
              },
              create: {
                name: v.name,
                sku: v.sku,
                price: Math.round(Number(v.price) * 100),
                stock: Number(v.stock),
              },
            })),
          },
        }),
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

    return NextResponse.json({ product: formattedProduct });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
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

    return NextResponse.json({ product: formattedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: "Product not found or failed to delete" }, { status: 404 });
  }
}
