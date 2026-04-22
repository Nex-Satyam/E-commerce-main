import { CategoryCard } from "@/components/home/category-card";
import { categories } from "@/components/home/home-data";
import { SectionHeading } from "@/components/home/section-heading";

export function CategoriesSection() {
  return (
    <section className="section-block" id="categories">
      <SectionHeading
        eyebrow="Categories"
        title="Shop the wardrobe by mood and fit."
      />
      <div className="category-grid">
        {categories.map((category, index) => (
          <CategoryCard key={category.name} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}