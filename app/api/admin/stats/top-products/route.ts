import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Fetch all order items from DELIVERED orders
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        status: "DELIVERED",
      },
    },
    select: {
      productName: true,
      variantId: true, // Used as a group key since productId isn't stored directly in OrderItem snapshot, but we can group by productName
      quantity: true,
      priceAtOrder: true, // PAISE
    },
  });

  const totals = new Map<string, { name: string; unitsSold: number; revenue: number }>();

  items.forEach((item) => {
    // Grouping by product name for simplicity (since it's a snapshot)
    const key = item.productName;
    const current = totals.get(key) ?? { name: item.productName, unitsSold: 0, revenue: 0 };
    
    current.unitsSold += item.quantity;
    current.revenue += (item.quantity * item.priceAtOrder) / 100; // PAISE to RUPEES
    
    totals.set(key, current);
  });

  const topProducts = Array.from(totals.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  return NextResponse.json(topProducts);
}
