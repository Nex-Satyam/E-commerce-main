export const queryKeys = {
  admin: {
    categories: ["admin", "categories"] as const,
    dashboard: ["admin", "dashboard"] as const,
    order: (id: string) => ["admin", "orders", id] as const,
    orders: (params: Record<string, string | number>) =>
      ["admin", "orders", params] as const,
    products: (params: Record<string, string | number>) =>
      ["admin", "products", params] as const,
    productForm: (id?: string) => ["admin", "product-form", id ?? "new"] as const,
    bulkStock: ["admin", "bulk-stock"] as const,
    users: (params: Record<string, string | number>) =>
      ["admin", "users", params] as const,
    userSummary: (id: string | null) => ["admin", "users", "summary", id] as const,
    notifications: (params: Record<string, string | number | boolean>) =>
      ["admin", "notifications", params] as const,
  },
  addresses: ["addresses"] as const,
  cart: {
    count: ["cart", "count"] as const,
    items: ["cart", "items"] as const,
  },
  featuredProducts: ["featured-products"] as const,
  notifications: {
    list: (limit = 10) => ["notifications", "list", limit] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
  orders: ["orders"] as const,
  profile: ["profile"] as const,
  product: {
    random: ["products", "random"] as const,
    wishlistState: (productId?: string) =>
      ["products", "wishlist-state", productId ?? ""] as const,
  },
  search: (params: Record<string, string | number>) =>
    ["search", params] as const,
  wishlist: ["wishlist"] as const,
};
