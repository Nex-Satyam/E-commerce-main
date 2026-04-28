import { prisma } from "@/lib/prisma";

const CART_ITEM_INCLUDE = {
  variant: {
    include: {
      product: {
        include: {
          images: {
            orderBy: [
              { isPrimary: "desc" as const },
              { sortOrder: "asc" as const },
            ],
          },
        },
      },
    },
  },
};

export const getCart = async (userId: string) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: CART_ITEM_INCLUDE,
    orderBy: { addedAt: "desc" },
  });
};

export const addToCart = async ({
  userId,
  variantId,
  quantity,
}: {
  userId: string;
  variantId: string;
  quantity: number;
}) => {
  if (!userId) throw new Error("Please login first");
  if (!variantId) throw new Error("Variant id is required");
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  return await prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
      },
    });

    if (!variant) throw new Error("Product variant not found");
    if (!variant.product.isActive) throw new Error("Product is not available");
    if (variant.stock <= 0) throw new Error("This item is out of stock");

    const existing = await tx.cartItem.findUnique({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
    });

    const finalQuantity = (existing?.quantity || 0) + quantity;

    if (finalQuantity > variant.stock) {
      throw new Error(`Only ${variant.stock} items available`);
    }

    if (existing) {
      return await tx.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: finalQuantity,
        },
        include: CART_ITEM_INCLUDE,
      });
    }

    return await tx.cartItem.create({
      data: {
        userId,
        variantId,
        quantity,
      },
      include: CART_ITEM_INCLUDE,
    });
  });
};

export const updateCartItemById = async ({
  userId,
  cartItemId,
  quantity,
}: {
  userId: string;
  cartItemId: string;
  quantity: number;
}) => {
  if (!userId) throw new Error("Please login first");
  if (!cartItemId) throw new Error("Cart item id is required");
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Invalid quantity");
  }

  return await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cartItem || cartItem.userId !== userId) {
      throw new Error("Cart item not found");
    }

    if (quantity === 0) {
      return await tx.cartItem.delete({
        where: { id: cartItemId },
      });
    }

    if (!cartItem.variant.product.isActive) {
      throw new Error("Product is not available");
    }

    if (cartItem.variant.stock <= 0) {
      throw new Error("This item is out of stock");
    }

    if (quantity > cartItem.variant.stock) {
      throw new Error(`Only ${cartItem.variant.stock} items available`);
    }

    return await tx.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity,
      },
      include: CART_ITEM_INCLUDE,
    });
  });
};

export const removeCartItemById = async ({
  userId,
  cartItemId,
}: {
  userId: string;
  cartItemId: string;
}) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem || cartItem.userId !== userId) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export const clearCart = async (userId: string) => {
  return await prisma.cartItem.deleteMany({
    where: { userId },
  });
};