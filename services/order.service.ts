import { prisma } from "@/lib/prisma";

export const createOrder = async ({
  userId,
  addressId,
}: {
  userId: string;
  addressId: string;
}) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  });

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // 👤 Get user (for snapshot)
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.variant.price,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      addressId,

      customerName: user.name || "Customer",
      customerEmail: user.email || "",

      totalAmount,

      items: {
        create: cartItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,

          productName: item.variant.product.name,
          variantName: item.variant.name,
          priceAtOrder: item.variant.price,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return order;
};