
"use client";

import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";

import { useEffect,useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Truck, XCircle } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  productName?: string;
  variantName?: string;
  priceAtOrder?: number;
  variant?: {
    product?: { name?: string };
  };
};

type Order = {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get("/api/order/user");
        setOrders(res.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleCancel = async (orderId: string) => {
    await axios.post("/api/order/user", { orderId, action: "cancel" });
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "CANCELLED" } : o));
  };

  const handleTrack = (orderId: string) => {
    alert("Tracking order: " + orderId);
  };

  if (loading) return <div className="text-center py-20">Loading your orders...</div>;
  if (!orders.length) return <div className="text-center py-20 text-gray-500">No orders found.</div>;

  return (
    <>
      <SiteHeader />
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 tracking-tight drop-shadow">Order History</h1>
        <div className="grid gap-10">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-xl rounded-2xl border-0 bg-gradient-to-br from-white to-indigo-50">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BadgeCheck className="text-green-500" />
                    <span className="font-semibold text-lg">Order #{order.id.slice(-6)}</span>
                    <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${order.status === "CANCELLED" ? "bg-red-100 text-red-500" : order.status === "DELIVERED" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-700"}`}>{order.status}</span>
                  </div>
                  <div className="text-gray-600 mb-1">Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
                  <div className="text-gray-500 mb-2">Total: ₹{order.totalAmount}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.items?.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium shadow transition hover:scale-105 hover:shadow-lg"
                      >
                        <span className="font-semibold">{item.productName || item.variant?.product?.name}</span>
                        <span className="opacity-70">{item.variantName}</span>
                        <span className="bg-indigo-100 text-indigo-600 rounded px-2 py-0.5 ml-2">× {item.quantity}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[180px] items-end">
                  <Button
                    variant="outline"
                    className="rounded-full border-indigo-400 text-indigo-700 hover:bg-indigo-100 font-semibold shadow-md"
                    onClick={() => handleTrack(order.id)}
                    disabled={order.status === "CANCELLED"}
                  >
                    <Truck className="size-4 mr-2" /> Track Order
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-full font-semibold shadow-md"
                    onClick={() => handleCancel(order.id)}
                    disabled={order.status === "CANCELLED" || order.status === "DELIVERED"}
                  >
                    <XCircle className="size-4 mr-2" /> Cancel Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
