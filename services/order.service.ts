import { prisma } from "@/lib/prisma";
export const getOrdersByUserId = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });
};

export const cancelOrderById = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) throw new Error("Order not found or unauthorized");
  if (order.status === "DELIVERED" || order.status === "CANCELLED") throw new Error("Cannot cancel this order");
  return await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
};

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