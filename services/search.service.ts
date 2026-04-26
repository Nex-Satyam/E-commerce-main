// services/search.service.ts
import { products } from "@/components/home/home-data";

export type SearchParams = {
  q?: string;
  category?: string;
  price?: string;
  rating?: number;
};

function parsePrice(price: string) {
  return Number(price.replace(/[^\d.]/g, ""));
}

export function searchProducts({ q = "", category = "", price = "", rating = 0 }: SearchParams) {
  let filtered = products;
  const query = q.toLowerCase();
  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query)
    );
  }
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (price) {
    const [min, max] = price.split("-").map(Number);
    filtered = filtered.filter((p) => {
      const priceNum = parsePrice(p.price);
      return priceNum >= min && priceNum <= max;
    });
  }
  if (rating && rating > 0) {
    filtered = filtered.filter((p) => Math.floor(p.rating) >= rating);
  }
  return filtered;
}
