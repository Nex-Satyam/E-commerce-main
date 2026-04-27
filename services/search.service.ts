
export type SearchParams = {
  q?: string;
  category?: string;
  price?: string;
  rating?: number;
};

// Client-side: always call the API
export async function searchProducts({ q = "", category = "", price = "", rating = 0 }: SearchParams) {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (category) params.append("category", category);
  if (price) params.append("price", price);
  if (rating) params.append("rating", rating.toString());

  const apiUrl = `/api/search?${params.toString()}`;
  const res = await fetch(apiUrl);
  if (!res.ok) {
    console.error("Search API error", res.status, res.statusText);
    return [];
  }
  const data = await res.json();
  return data.products || [];
}
