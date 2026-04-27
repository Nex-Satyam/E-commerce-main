export const updateCartItemById = async ({
  userId,
  cartItemId,
  quantity,
}: {
  userId: string;
  cartItemId: string;
  quantity: number;
}) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });
  if (!cartItem || cartItem.userId !== userId) {
    throw new Error("Cart item not found or unauthorized");
  }
  if (quantity === 0) {
    return await prisma.cartItem.delete({ where: { id: cartItemId } });
  }
  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};
import { prisma } from "@/lib/prisma";

export const addToCart = async ({
  userId,
  variantId,
  quantity,
}: {
  userId: string;
  variantId: string;
  quantity: number;
}) => {
  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_variantId: {
        userId,
        variantId,
      },
    },
  });

  if (existing) {
    return await prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity,
      },
    });
  }

  return await prisma.cartItem.create({
    data: {
      userId,
      variantId,
      quantity,
    },
  });
};

export const getCart = async (userId: string) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  });
};


export const updateCartItem = async ({
  userId,
  variantId,
  quantity,
}: {
  userId: string;
  variantId: string;
  quantity: number;
}) => {
  if (quantity === 0) {
    return await prisma.cartItem.delete({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
    });
  }

  return await prisma.cartItem.update({
    where: {
      userId_variantId: {
        userId,
        variantId,
      },
    },
     data: {
    quantity: quantity, 
  },
  });
};