import { ArrowUpRight } from "lucide-react";

import { CategoryItem } from "@/components/home/home-data";
import { Card, CardContent } from "@/components/ui/card";

type CategoryCardProps = {
  category: CategoryItem;
  index: number;
};

export function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <Card className="category-card border-[color:var(--border)] bg-transparent py-0 shadow-none">
      <CardContent className="grid gap-4 px-0 py-0">
        <div className="category-badge">{String(index + 1).padStart(2, "0")}</div>
        <p className="category-accent">{category.accent}</p>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
        <a href="#products">
          Explore <ArrowUpRight className="inline size-4" />
        </a>
      </CardContent>
    </Card>
  );
}