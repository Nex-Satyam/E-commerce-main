import { NextRequest } from "next/server";
import {
  handleAddWishlist,
  handleGetWishlist,
  handleRemoveWishlist,
  handleToggleWishlist,
} from "@/controllers/wishlist.controller";

export async function GET(req: NextRequest) {
  return handleGetWishlist(req);
}

export async function POST(req: NextRequest) {
  return handleAddWishlist(req);
}

export async function PATCH(req: NextRequest) {
  return handleToggleWishlist(req);
}

export async function DELETE(req: NextRequest) {
  return handleRemoveWishlist(req);
}