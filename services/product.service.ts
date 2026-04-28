import { prisma } from "@/lib/prisma";

const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  category: {
    select: {
      name: true,
    },
  },
  variants: {
    select: {
      price: true,
    },
    orderBy: {
      price: "asc" as const,
    },
    take: 1,
  },
  images: {
    select: {
      url: true,
      altText: true,
      isPrimary: true,
      sortOrder: true,
    },
    orderBy: [
      { isPrimary: "desc" as const },
      { sortOrder: "asc" as const },
    ],
    take: 1,
  },
};

type ProductCardRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: {
    name: string;
  } | null;
  variants: Array<{
    price: number;
  }>;
  images: Array<{
    url: string;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }>;
};

export function formatProductCard(product: ProductCardRecord) {
  const price = product.variants?.[0]?.price;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description ?? "",
    tag: product.category?.name ?? "Featured",
    category: product.category?.name ?? "",
    price: typeof price === "number" ? `₹${Math.round(price / 100)}` : "₹0",
    images: product.images ?? [],
  };
}

export const getRandomProductsService = async (count = 5) => {
  const total = await prisma.product.count({ where: { isActive: true } });
  if (total === 0) return [];
  const skip = total > count ? Math.floor(Math.random() * (total - count + 1)) : 0;
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: productCardSelect,
    skip,
    take: count,
    orderBy: { createdAt: "desc" },
  });

  return products.map(formatProductCard);
};

export const getAllProductsService = async () => {
  return await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      variants: true,
      images: true,
      reviews: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductCardsService = async (take = 12) => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    select: productCardSelect,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(formatProductCard);
};

export const getProductByIdService = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      images: true,
      reviews: true,
      category: true,
    },
  });
};

export const getProductBySlugService = async (slug: string) => {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      images: true,
      reviews: true,
      category: true,
    },
  });
};
