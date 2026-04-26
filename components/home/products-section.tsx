import { products } from "@/components/home/home-data";
<<<<<<< HEAD
import ProductCard from "@/components/home/product-card";
=======
import { ProductCard } from "@/components/home/product-card";
>>>>>>> origin/main
import { SectionHeading } from "@/components/home/section-heading";

export function ProductsSection() {
  return (
    <section className="section-block" id="products">
      <SectionHeading
        eyebrow="Featured Products"
        title="Pieces designed to mix, layer, and last."
        note="Neutral shades, breathable textures, and silhouettes that move across workdays, weekends, and evenings."
        split
      />
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}