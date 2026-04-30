import { Prisma } from "@prisma/client";

export const adminOrderInclude = {
  address: true,
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                orderBy: { sortOrder: "asc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.OrderInclude;

type AdminOrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof adminOrderInclude;
}>;

export function formatAdminOrder(order: AdminOrderWithRelations) {
  const addr = order.address;
  const addressText = addr
    ? [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")
    : "";

  return {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    paidAt: order.paidAt?.toISOString() ?? null,
    totalAmount: order.totalAmount / 100,
    addressText,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.variant.productId,
      productName: item.productName,
      productSlug: item.variant.product.slug,
      productImage: item.variant.product.images[0]?.url ?? null,
      quantity: item.quantity,
      unitPrice: item.priceAtOrder / 100,
      variantId: item.variantId,
      variantName: item.variantName,
    })),
  };
}
