import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { formatOrderAddress, listOrders } from "@/lib/admin-store";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const { orders } = listOrders({
    status: params.get("status") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    page: 1,
    limit: Number.MAX_SAFE_INTEGER,
  });

  const csv = Papa.unparse(
    orders.map((order) => ({
      "Order ID": order.id,
      "Customer Name": order.customerName,
      Email: order.customerEmail ?? "",
      Items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      Total: order.totalAmount,
      Status: order.status,
      Date: order.createdAt,
      Address: formatOrderAddress(order),
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
