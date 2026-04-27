import { NextRequest } from "next/server";
import { handleCheckout } from "@/controllers/order.controller";

export async function POST(req: NextRequest) {
  return handleCheckout(req);
}