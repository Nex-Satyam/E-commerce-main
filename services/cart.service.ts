import { cookies } from "next/headers";

export type CartItem = {
  productSlug: string;
  size: string;
  color: string;
  quantity: number;
};

const CART_COOKIE = "cart";


export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE)?.value;
  if (!cartCookie) return [];
  try {
    return JSON.parse(cartCookie);
  } catch {
    return [];
  }
}


export async function addToCart(item: CartItem) {
  const cart = await getCart();
  const existing = cart.find(
    (i) =>
      i.productSlug === item.productSlug &&
      i.size === item.size &&
      i.color === item.color
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(cart), { path: "/", httpOnly: false });
  return cart;
}
