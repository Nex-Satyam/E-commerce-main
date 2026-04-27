import { prisma } from "@/lib/prisma";
export const getRandomProductsService = async (count = 5) => {
  const total = await prisma.product.count({ where: { isActive: true } });
  if (total === 0) return [];
  const skip = total > count ? Math.floor(Math.random() * (total - count + 1)) : 0;
  return await prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: true,
      images: true,
      reviews: true,
      category: true,
    },
    skip,
    take: count,
    orderBy: { createdAt: "desc" },
  });
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