import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sku = request.nextUrl.searchParams.get("sku")?.trim() ?? "";
  const excludeVariantId = request.nextUrl.searchParams.get("excludeVariantId") ?? undefined;

  if (!sku) {
    return NextResponse.json({ unique: false });
  }

  const existingVariant = await prisma.productVariant.findFirst({
    where: {
      sku: { equals: sku, mode: "insensitive" },
      ...(excludeVariantId ? { id: { not: excludeVariantId } } : {}),
    },
  });

  return NextResponse.json({ unique: !existingVariant });
}
