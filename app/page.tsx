import { CategoriesSection } from "@/components/home/categories-section";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductsSection } from "@/components/home/products-section";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";

export default function Home() {
  return (
    <main className="homepage">
      <SiteHeader />
      <HeroSlider />
      <CategoriesSection />
      <ProductsSection />
      <SiteFooter />
    </main>
  );
}