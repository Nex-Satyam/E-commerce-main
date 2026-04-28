import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  addToWishlist,
  getWishlist,
  isProductWishlisted,
  removeFromWishlist,
  toggleWishlist,
} from "@/services/wishlist.service";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

export async function handleGetWishlist(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (productId) {
      const wishlisted = await isProductWishlisted({ userId, productId });

      return NextResponse.json({
        success: true,
        wishlisted,
      });
    }

    const wishlist = await getWishlist(userId);

    return NextResponse.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to get wishlist",
      },
      { status: 500 }
    );
  }
}

export async function handleAddWishlist(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const productId = body.productId;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const wishlistItem = await addToWishlist({
      userId,
      productId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Added to wishlist",
        wishlistItem,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to add wishlist",
      },
      { status: 400 }
    );
  }
}

export async function handleToggleWishlist(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const productId = body.productId;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const result = await toggleWishlist({
      userId,
      productId,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update wishlist",
      },
      { status: 400 }
    );
  }
}

export async function handleRemoveWishlist(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    await removeFromWishlist({
      userId,
      productId,
    });

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to remove wishlist",
      },
      { status: 400 }
    );
  }
}