import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { ProductDetailView } from "@/components/product/product-detail-view";

type ProductPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/product/slug/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    notFound();
  }
  const data = await res.json();
  const product = data?.data;
  if (!product) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <ProductDetailView product={product} />
      <SiteFooter />
    </>
  );
}
