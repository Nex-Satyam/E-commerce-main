
"use client";

import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Truck, XCircle, Package, CheckCircle, Clock, ArrowRight, X, MapPin, Home } from "lucide-react";
function TrackingModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: Order | null }) {
  if (!open || !order) return null;

  const steps = [
    { label: "Order Placed", icon: <Package className="size-5 text-blue-500" />, date: order.createdAt },
    { label: "Processed", icon: <Clock className="size-5 text-indigo-500" />, date: order.createdAt },
    { label: "Shipped", icon: <Truck className="size-5 text-yellow-600" />, date: order.createdAt },
    { label: "Out for Delivery", icon: <MapPin className="size-5 text-orange-500" />, date: order.createdAt },
    { label: "Delivered", icon: <Home className="size-5 text-green-600" />, date: order.createdAt },
  ];
  let activeStep = 0;
  if (order.status === "DELIVERED") activeStep = 4;
  else if (order.status === "OUT_FOR_DELIVERY") activeStep = 3;
  else if (order.status === "SHIPPED") activeStep = 2;
  else if (order.status === "PROCESSED") activeStep = 1;
  else if (order.status === "CANCELLED") activeStep = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="size-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
          <Truck className="size-6 mr-2" /> Tracking Order #{order.id.slice(-6)}
        </h2>
        {order.status === "CANCELLED" ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <XCircle className="size-10 text-red-400 mb-2" />
            <span className="text-lg font-semibold text-red-500">Order Cancelled</span>
            <span className="text-gray-500">This order was cancelled and will not be delivered.</span>
          </div>
        ) : (
          <ol className="relative border-l-2 border-indigo-200 ml-6 mt-2">
            {steps.map((step, idx) => (
              <li key={step.label} className="mb-8 ml-4 flex gap-4 items-start">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 ${idx < activeStep ? "border-green-400 bg-green-50" : idx === activeStep ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-gray-50"}`}>
                  {idx < activeStep ? <CheckCircle className="size-5 text-green-500" /> : step.icon}
                </span>
                <div>
                  <span className={`block font-semibold text-base ${idx < activeStep ? "text-green-700" : idx === activeStep ? "text-indigo-700" : "text-gray-400"}`}>{step.label}</span>
                  <span className="block text-xs text-gray-400 mt-1">{new Date(step.date).toLocaleString()}</span>
                  {idx < steps.length - 1 && <ArrowRight className="size-4 text-gray-300 mt-2" />}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

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
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

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

  const handleTrack = (order: Order) => {
    setTrackingOrder(order);
    setTrackingOpen(true);
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
                    onClick={() => handleTrack(order)}
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
      <TrackingModal open={trackingOpen} onClose={() => setTrackingOpen(false)} order={trackingOrder} />
      <SiteFooter />
    </>
  );
}
