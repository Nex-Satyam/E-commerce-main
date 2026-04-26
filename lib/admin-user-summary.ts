import { prisma } from "@/lib/prisma";

export async function getAdminUserSummary(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return null;
  }

  const totalOrders = await prisma.order.count({ where: { userId: id } });

  const ordersData = await prisma.order.findMany({
    where: { userId: id, status: { not: "CANCELLED" } },
    select: { totalAmount: true },
  });

  const lifetimeSpend = ordersData.reduce((acc, order) => acc + order.totalAmount, 0);

  const recentOrders = await prisma.order.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, status: true, totalAmount: true, createdAt: true },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    joinedDate: user.createdAt.toISOString(),
    totalOrders,
    lifetimeSpend,
    recentOrders: recentOrders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
    })),
  };
}
