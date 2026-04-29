import { prisma } from "@/lib/prisma";

const WISHLIST_INCLUDE = {
  product: {
    include: {
      images: {
        orderBy: [
          { isPrimary: "desc" as const },
          { sortOrder: "asc" as const },
        ],
      },
      variants: true,
      category: true,
    },
  },
};

export const getWishlist = async (userId: string) => {
  if (!userId) throw new Error("Please login first");

  return await prisma.wishlist.findMany({
    where: { userId },
    include: WISHLIST_INCLUDE,
    orderBy: { addedAt: "desc" },
  });
};

export const addToWishlist = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  if (!userId) throw new Error("Please login first");
  if (!productId) throw new Error("Product id is required");

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Product not found");
  if (!product.isActive) throw new Error("Product is not available");

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
    include: WISHLIST_INCLUDE,
  });
};

export const removeFromWishlist = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  if (!userId) throw new Error("Please login first");
  if (!productId) throw new Error("Product id is required");

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!existing) {
    throw new Error("Product not found in wishlist");
  }

  return await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

export const toggleWishlist = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return {
      wishlisted: false,
      message: "Removed from wishlist",
    };
  }

  await addToWishlist({ userId, productId });

  return {
    wishlisted: true,
    message: "Added to wishlist",
  };
};

export const isProductWishlisted = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return !!existing;
};