"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

const quantityOptions = [0, 1, 2, 3, 4, 5];

function parsePrice(price: string) {
  return Number(price.replace(/[^\d.]/g, ""));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function CartPageView() {
  
  const [item, setItem] = useState([]);
useEffect(() => {
  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart");
      const data = res.data;
      console.log("Cart data:", data);
      setItem(data.cart || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchCart();
}, []);
 const items = item.map((cartItem: any) => {
  const product = cartItem.variant.product;
  const quantity = cartItem.quantity;
  const unitPrice = cartItem.variant.price;

  return {
    ...cartItem,
    product: {
      ...product,
      image: product.images?.[0]?.url,
      price: unitPrice,
      sku: cartItem.variant.sku,
    },
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
    size: cartItem.variant.name,
    color: "-",
  };
});

  const hasItems = items.length > 0;
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = hasItems ? (subtotal >= 180 ? 0 : 12) : 0;
  const tax = hasItems ? Number((subtotal * 0.08).toFixed(2)) : 0;
  const orderTotal = subtotal + shipping + tax;

  return (
    <main className="cart-page">
      <div className="cart-breadcrumb">
        <Link href="/" className="cart-back-link">
          <ArrowLeft className="size-4" /> Continue Shopping
        </Link>
        <span>/</span>
        <strong>Cart</strong>
      </div>

      <section className="cart-layout">
        <div className="cart-main">
          <div className="cart-head">
            <p className="eyebrow">Shopping Cart</p>
            <h1>Your selected pieces.</h1>
            <p>
              Review your items, update quantities, and proceed when your order
              feels right.
            </p>
          </div>

          <div className="cart-item-list">
            {hasItems ? (
              items.map((item) => (
                <Card key={item.variantId} className="cart-item-card py-0 shadow-none">
                  <CardContent className="cart-item-content">
                    <Link href={`/products/slug/${item.product.slug}`} className="cart-item-image-link">
                      <div className="cart-item-image-wrap">
                        <Image
src={item.product.image || "/placeholder.png"}                 
         alt={item.product.name}
                          fill
                          sizes="180px"
                          className="cart-item-image"
                        />
                      </div>
                    </Link>

                    <div className="cart-item-copy">
                      <div className="cart-item-info">
<p className="cart-item-tag">{item.product.tag || "Product"}</p>         
               <h2>{item.product.name}</h2>
                        <p>{item.product.description}</p>
                      </div>

                      <div className="cart-item-variants">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>SKU: {item.product.sku}</span>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <label className="cart-quantity-field">
                        <span>Quantity</span>
                        <select
                          value={item.quantity}
                          onChange={async (e) => {
                            const newQuantity = Number(e.target.value);
                            console.log("Updating cart:", { variantId: item.variantId, quantity: newQuantity });
                            try {
                              const patchRes = await axios.patch("/api/cart", {
                                variantId: item.variantId,
                                quantity: newQuantity,
                              });
                              console.log("PATCH response:", patchRes.data);
                              const res = await axios.get("/api/cart");
                              console.log("Updated cart:", res.data.cart);
                              setItem(res.data.cart || []);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          {quantityOptions.map((option) => (
                            <option key={option} value={option}>
                              {option === 0 ? "0 (Remove)" : option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="cart-price-block">
                        <span>{item.product.price} each</span>
                        <strong>{formatCurrency(item.totalPrice)}</strong>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="cart-empty-card py-0 shadow-none">
                <CardContent className="cart-empty-content">
                  <p className="eyebrow">Cart Empty</p>
                  <h2>Your bag is clear.</h2>
                  <p>
                    Add a few pieces back to your cart to continue to checkout.
                  </p>
                  <CtaButton asChild className="cart-empty-button">
                    <Link href="/#products">Browse Products</Link>
                  </CtaButton>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <aside className="cart-summary">
          <Card className="cart-summary-card py-0 shadow-none">
            <CardContent className="cart-summary-content">
              <div>
                <p className="eyebrow">Order Summary</p>
                <h2>{hasItems ? "Ready to check out?" : "Your cart is empty"}</h2>
              </div>

              <div className="cart-summary-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong>
                </div>
                <div>
                  <span>Estimated Tax</span>
                  <strong>{formatCurrency(tax)}</strong>
                </div>
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <strong>{formatCurrency(orderTotal)}</strong>
              </div>

              <div className="cart-summary-actions">
                {hasItems ? (
                  <CtaButton  asChild  className="cart-summary-button">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </CtaButton>
                ) : (
                 <CtaButton
  className="cart-summary-button"
  onClick={async () => {
    try {
      const res = await axios.post("/api/checkout", {
        addressId: "YOUR_ADDRESS_ID",
      });

      console.log("Order:", res.data);

      alert("Order placed successfully 🎉");

      window.location.href = "/orders";

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Checkout failed");
    }
  }}
>
  Proceed to Checkout
</CtaButton>
                )}
                <CtaButton tone="light" className="cart-summary-button" disabled={!hasItems}>
                  Save for Later
                </CtaButton>
              </div>

              <div className="cart-summary-notes">
                <span>
                  <Truck className="size-4" /> Free delivery above ₹180
                </span>
                <span>
                  <ShieldCheck className="size-4" /> Secure checkout protected end to end
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}

export default CartPageView;
