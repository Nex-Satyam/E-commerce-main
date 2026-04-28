import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addAddress, getAddresses } from "@/services/address.service";

export async function handleAddAddress(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await req.json();
    const address = await addAddress({ userId, ...body });
    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 });
  }
}

export async function handleGetAddresses(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const addresses = await getAddresses(userId);
    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}
