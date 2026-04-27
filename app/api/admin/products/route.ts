
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";





export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim() || "";
    const categoryId = params.get("category") || "";
    const activeParam = params.get("active");
    const page = Math.max(1, Number(params.get("page") ?? 1));
    const limit = Math.max(1, Number(params.get("limit") ?? 20));

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (activeParam === "true") {
      where.isActive = true;
    } else if (activeParam === "false") {
      where.isActive = false;
    }

    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    const formattedProducts = products.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      variants: p.variants.map((v) => ({
        ...v,
        price: v.price / 100,
      })),
    }));

    return NextResponse.json({
      products: formattedProducts,
      total,
      page,
      limit,
      categories,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    let baseSlug = generateSlug(body.name);
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        slug,
        categoryId: body.categoryId,
        isActive: body.isActive ?? true,
        images: {
          create: body.images?.map((img: any, idx: number) => ({
            url: img.url,
            isPrimary: img.isPrimary || false,
            sortOrder: img.sortOrder ?? idx,
          })) || [],
        },
        variants: {
          create: body.variants?.map((v: any) => ({
            name: v.name,
            sku: v.sku,
            price: Math.round(Number(v.price) * 100), 
            stock: Number(v.stock),
          })) || [],
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
      variants: product.variants.map(v => ({ ...v, price: v.price / 100 }))
    };

    return NextResponse.json({ product: formattedProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
