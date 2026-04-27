import { NextRequest, NextResponse } from "next/server";
import { handleAddAddress, handleGetAddresses } from "@/controllers/address.controller";

export async function POST(req: NextRequest) {
  return handleAddAddress(req);
}

export async function GET(req: NextRequest) {
  return handleGetAddresses(req);
}
