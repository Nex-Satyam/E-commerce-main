export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type AdminOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  addressText?: string;
  adminNote?: string;
  items: Array<{
    id: string;
    productId: string;
    variantId: string;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
  }>;
};

export type AdminCategory = {
  id: string;
  name: string;
};

export type AdminProductImage = {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type AdminProductVariant = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category: AdminCategory;
  isActive: boolean;
  images: AdminProductImage[];
  variants: AdminProductVariant[];
  createdAt: string;
};

type ProductPayload = {
  name: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  images: Array<Omit<AdminProductImage, "id"> & { id?: string }>;
  variants: Array<Omit<AdminProductVariant, "id"> & { id?: string }>;
};

const now = new Date();
const dayMs = 24 * 60 * 60 * 1000;

function isoDaysAgo(days: number) {
  const date = new Date(now.getTime() - days * dayMs);
  return date.toISOString();
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const adminCategories: AdminCategory[] = [
  { id: "cat_outerwear", name: "Outerwear" },
  { id: "cat_knitwear", name: "Knitwear" },
  { id: "cat_dresses", name: "Dresses" },
  { id: "cat_shirts", name: "Shirts" },
];

const productSeed: AdminProduct[] = [
  {
    id: "prod_linen_blazer",
    name: "Ivory Linen Blazer",
    description: "Structured linen blazer with a relaxed summer fit.",
    categoryId: "cat_outerwear",
    category: adminCategories[0],
    isActive: true,
    createdAt: isoDaysAgo(24),
    images: [
      { id: "img_blazer_1", url: "/product-coat.svg", isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: "var_blazer_s", name: "Small", price: 6499, stock: 8, sku: "BLZ-IV-S" },
      { id: "var_blazer_m", name: "Medium", price: 6499, stock: 3, sku: "BLZ-IV-M" },
    ],
  },
  {
    id: "prod_waffle_knit",
    name: "Waffle Knit Top",
    description: "Soft textured knit top in warm off-white.",
    categoryId: "cat_knitwear",
    category: adminCategories[1],
    isActive: true,
    createdAt: isoDaysAgo(18),
    images: [
      { id: "img_knit_1", url: "/product-knit.svg", isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: "var_knit_xs", name: "XS", price: 2999, stock: 12, sku: "KNT-WF-XS" },
      { id: "var_knit_m", name: "M", price: 2999, stock: 2, sku: "KNT-WF-M" },
    ],
  },
  {
    id: "prod_column_dress",
    name: "Pearl Column Dress",
    description: "Minimal column silhouette with clean panel lines.",
    categoryId: "cat_dresses",
    category: adminCategories[2],
    isActive: true,
    createdAt: isoDaysAgo(14),
    images: [
      { id: "img_dress_1", url: "/product-dress.svg", isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: "var_dress_s", name: "Small", price: 5499, stock: 7, sku: "DRS-PR-S" },
      { id: "var_dress_l", name: "Large", price: 5499, stock: 4, sku: "DRS-PR-L" },
    ],
  },
  {
    id: "prod_poplin_shirt",
    name: "Crisp Poplin Shirt",
    description: "Everyday cotton poplin shirt with a polished collar.",
    categoryId: "cat_shirts",
    category: adminCategories[3],
    isActive: false,
    createdAt: isoDaysAgo(7),
    images: [
      { id: "img_shirt_1", url: "/product-shirt.svg", isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: "var_shirt_m", name: "Medium", price: 2499, stock: 16, sku: "SHT-CP-M" },
      { id: "var_shirt_xl", name: "XL", price: 2499, stock: 1, sku: "SHT-CP-XL" },
    ],
  },
];

const orderSeed: AdminOrder[] = [
  {
    id: "ord_7c1a9f20b4",
    customerName: "Neha Kapoor",
    customerEmail: "neha.kapoor@example.com",
    address: {
      line1: "14 Palm Grove",
      line2: "Apartment 6B",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400050",
      country: "India",
    },
    totalAmount: 12998,
    status: "DELIVERED",
    createdAt: isoDaysAgo(0),
    adminNote: "Gift wrap requested.",
    items: [
      {
        id: "item_001",
        productId: "prod_linen_blazer",
        variantId: "var_blazer_s",
        productName: "Ivory Linen Blazer",
        variantName: "Small",
        quantity: 2,
        unitPrice: 6499,
      },
    ],
  },
  {
    id: "ord_9b67e31a10",
    customerName: "Rahul Mehta",
    customerEmail: "rahul.mehta@example.com",
    address: {
      line1: "88 Residency Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560025",
      country: "India",
    },
    totalAmount: 2999,
    status: "PENDING",
    createdAt: isoDaysAgo(0),
    items: [
      {
        id: "item_002",
        productId: "prod_waffle_knit",
        variantId: "var_knit_xs",
        productName: "Waffle Knit Top",
        variantName: "XS",
        quantity: 1,
        unitPrice: 2999,
      },
    ],
  },
  {
    id: "ord_510fdedc21",
    customerName: "Aisha Khan",
    customerEmail: "aisha.khan@example.com",
    address: {
      line1: "22 Lake View Lane",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500081",
      country: "India",
    },
    totalAmount: 5499,
    status: "DELIVERED",
    createdAt: isoDaysAgo(1),
    items: [
      {
        id: "item_003",
        productId: "prod_column_dress",
        variantId: "var_dress_s",
        productName: "Pearl Column Dress",
        variantName: "Small",
        quantity: 1,
        unitPrice: 5499,
      },
    ],
  },
  {
    id: "ord_8ca25bf0a2",
    customerName: "Kabir Sethi",
    customerEmail: "kabir.sethi@example.com",
    address: {
      line1: "5 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700016",
      country: "India",
    },
    totalAmount: 8998,
    status: "SHIPPED",
    createdAt: isoDaysAgo(2),
    items: [
      {
        id: "item_004",
        productId: "prod_waffle_knit",
        variantId: "var_knit_m",
        productName: "Waffle Knit Top",
        variantName: "M",
        quantity: 3,
        unitPrice: 2999,
      },
    ],
  },
  {
    id: "ord_3d4f89aa51",
    customerName: "Mira Das",
    customerEmail: "mira.das@example.com",
    address: {
      line1: "31 Civil Lines",
      city: "Delhi",
      state: "Delhi",
      postalCode: "110054",
      country: "India",
    },
    totalAmount: 2499,
    status: "CONFIRMED",
    createdAt: isoDaysAgo(3),
    items: [
      {
        id: "item_005",
        productId: "prod_poplin_shirt",
        variantId: "var_shirt_m",
        productName: "Crisp Poplin Shirt",
        variantName: "Medium",
        quantity: 1,
        unitPrice: 2499,
      },
    ],
  },
  {
    id: "ord_479adf18c9",
    customerName: "Dev Nair",
    customerEmail: "dev.nair@example.com",
    address: {
      line1: "9 Marine Drive",
      city: "Kochi",
      state: "Kerala",
      postalCode: "682031",
      country: "India",
    },
    totalAmount: 10998,
    status: "DELIVERED",
    createdAt: isoDaysAgo(4),
    items: [
      {
        id: "item_006",
        productId: "prod_column_dress",
        variantId: "var_dress_l",
        productName: "Pearl Column Dress",
        variantName: "Large",
        quantity: 2,
        unitPrice: 5499,
      },
    ],
  },
  {
    id: "ord_c21b03dc72",
    customerName: "Tara Bose",
    customerEmail: "tara.bose@example.com",
    address: {
      line1: "76 Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500033",
      country: "India",
    },
    totalAmount: 6499,
    status: "CANCELLED",
    createdAt: isoDaysAgo(5),
    adminNote: "Customer requested cancellation before dispatch.",
    items: [
      {
        id: "item_007",
        productId: "prod_linen_blazer",
        variantId: "var_blazer_m",
        productName: "Ivory Linen Blazer",
        variantName: "Medium",
        quantity: 1,
        unitPrice: 6499,
      },
    ],
  },
  {
    id: "ord_ae41c72102",
    customerName: "Ishaan Rao",
    customerEmail: "ishaan.rao@example.com",
    address: {
      line1: "102 Cathedral Road",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600086",
      country: "India",
    },
    totalAmount: 5499,
    status: "DELIVERED",
    createdAt: isoDaysAgo(6),
    items: [
      {
        id: "item_008",
        productId: "prod_column_dress",
        variantId: "var_dress_s",
        productName: "Pearl Column Dress",
        variantName: "Small",
        quantity: 1,
        unitPrice: 5499,
      },
    ],
  },
  {
    id: "ord_5cb783910a",
    customerName: "Riya Menon",
    customerEmail: "riya.menon@example.com",
    address: {
      line1: "44 MG Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
      country: "India",
    },
    totalAmount: 5998,
    status: "PENDING",
    createdAt: isoDaysAgo(8),
    items: [
      {
        id: "item_009",
        productId: "prod_waffle_knit",
        variantId: "var_knit_xs",
        productName: "Waffle Knit Top",
        variantName: "XS",
        quantity: 2,
        unitPrice: 2999,
      },
    ],
  },
  {
    id: "ord_f3bb891d50",
    customerName: "Arjun Gill",
    customerEmail: "arjun.gill@example.com",
    address: {
      line1: "18 Sector 17",
      city: "Chandigarh",
      state: "Chandigarh",
      postalCode: "160017",
      country: "India",
    },
    totalAmount: 2499,
    status: "DELIVERED",
    createdAt: isoDaysAgo(10),
    items: [
      {
        id: "item_010",
        productId: "prod_poplin_shirt",
        variantId: "var_shirt_xl",
        productName: "Crisp Poplin Shirt",
        variantName: "XL",
        quantity: 1,
        unitPrice: 2499,
      },
    ],
  },
];

const store = globalThis as typeof globalThis & {
  __adminProducts?: AdminProduct[];
  __adminOrders?: AdminOrder[];
};

const products = (store.__adminProducts ??= productSeed);
const orders = (store.__adminOrders ??= orderSeed);

function hydrateProduct(product: AdminProduct): AdminProduct {
  return {
    ...product,
    category: adminCategories.find((category) => category.id === product.categoryId) ?? adminCategories[0],
    images: [...product.images].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export function getCategories() {
  return adminCategories;
}

export function getOrders({ limit = 10 }: { limit?: number } = {}) {
  return listOrders({ limit }).orders;
}

export function formatOrderAddress(order: AdminOrder) {
  if (!order.address) {
    return "";
  }

  return [
    order.address.line1,
    order.address.line2,
    order.address.city,
    order.address.state,
    order.address.postalCode,
    order.address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function listOrders(params: {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}) {
  const search = params.search?.trim().toLowerCase() ?? "";
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 20);
  const from = params.from ? new Date(`${params.from}T00:00:00`) : null;
  const to = params.to ? new Date(`${params.to}T23:59:59`) : null;

  const filtered = [...orders]
    .filter((order) => !params.status || order.status === params.status)
    .filter(
      (order) =>
        !search ||
        order.id.toLowerCase().includes(search) ||
        (order.customerEmail ?? "").toLowerCase().includes(search)
    )
    .filter((order) => {
      const createdAt = new Date(order.createdAt);
      if (from && createdAt < from) return false;
      if (to && createdAt > to) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((order) => ({ ...order, addressText: formatOrderAddress(order) }));

  return {
    orders: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
  };
}

export function getOrder(id: string) {
  const order = orders.find((item) => item.id === id);
  return order ? { ...order, addressText: formatOrderAddress(order) } : null;
}

export function getValidNextStatuses(status: OrderStatus): OrderStatus[] {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  return transitions[status];
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const order = orders.find((item) => item.id === id);
  if (!order) return null;
  if (!getValidNextStatuses(order.status).includes(status)) return null;

  const previousStatus = order.status;
  order.status = status;

  if (status === "CANCELLED" && previousStatus !== "CANCELLED") {
    order.items.forEach((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const variant = product?.variants.find((entry) => entry.id === item.variantId);
      if (variant) {
        variant.stock += item.quantity;
      }
    });
  }

  return {
    order: getOrder(id),
    notifications: [
      {
        type: status === "CANCELLED" ? "ORDER_CANCELLED" : `ORDER_${status}`,
        recipient: "user",
        orderId: id,
      },
      ...(status === "CONFIRMED" ? [{ type: "NEW_ORDER", recipient: "admin", orderId: id }] : []),
    ],
  };
}

export function updateOrderNote(id: string, note: string) {
  const order = orders.find((item) => item.id === id);
  if (!order) return null;
  order.adminNote = note;
  return getOrder(id);
}

export function getStats() {
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "PENDING").length,
    revenue: orders
      .filter((order) => order.status === "DELIVERED")
      .reduce((sum, order) => sum + order.totalAmount, 0),
    lowStockCount: products.flatMap((product) => product.variants).filter((variant) => variant.stock < 5).length,
  };
}

export function getRevenueByDay(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now.getTime() - (days - index - 1) * dayMs);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + dayMs);
    const revenue = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        return order.status === "DELIVERED" && orderDate >= dayStart && orderDate < dayEnd;
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      date: date.toISOString().slice(0, 10),
      revenue,
    };
  });
}

export function getTopProducts() {
  const totals = new Map<string, { name: string; unitsSold: number; revenue: number }>();

  orders
    .filter((order) => order.status === "DELIVERED")
    .flatMap((order) => order.items)
    .forEach((item) => {
      const current = totals.get(item.productId) ?? { name: item.productName, unitsSold: 0, revenue: 0 };
      current.unitsSold += item.quantity;
      current.revenue += item.quantity * item.unitPrice;
      totals.set(item.productId, current);
    });

  return [...totals.values()].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);
}

export function listProducts(params: {
  search?: string;
  category?: string;
  active?: string;
  page?: number;
  limit?: number;
}) {
  const search = params.search?.trim().toLowerCase() ?? "";
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 20);

  const filtered = products
    .map(hydrateProduct)
    .filter((product) => !search || product.name.toLowerCase().includes(search))
    .filter((product) => !params.category || product.categoryId === params.category)
    .filter((product) => {
      if (params.active === "true") return product.isActive;
      if (params.active === "false") return !product.isActive;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    products: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    page,
    limit,
    categories: adminCategories,
  };
}

export function getProduct(id: string) {
  const product = products.find((item) => item.id === id);
  return product ? hydrateProduct(product) : null;
}

export function saveProduct(payload: ProductPayload, id?: string) {
  const category = adminCategories.find((item) => item.id === payload.categoryId) ?? adminCategories[0];
  const normalized: AdminProduct = {
    id: id ?? uid("prod"),
    name: payload.name.trim(),
    description: payload.description?.trim() ?? "",
    categoryId: category.id,
    category,
    isActive: payload.isActive,
    createdAt: id ? products.find((product) => product.id === id)?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
    images: payload.images.map((image, index) => ({
      id: image.id ?? uid("img"),
      url: image.url,
      isPrimary: image.isPrimary,
      sortOrder: index,
    })),
    variants: payload.variants.map((variant) => ({
      id: variant.id ?? uid("var"),
      name: variant.name,
      price: Number(variant.price),
      stock: Number(variant.stock),
      sku: variant.sku,
    })),
  };

  if (id) {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return null;
    products[index] = normalized;
    return hydrateProduct(products[index]);
  }

  products.unshift(normalized);
  return hydrateProduct(normalized);
}

export function patchProduct(id: string, payload: Partial<ProductPayload>) {
  const existing = products.find((product) => product.id === id);
  if (!existing) return null;

  return saveProduct(
    {
      name: payload.name ?? existing.name,
      description: payload.description ?? existing.description,
      categoryId: payload.categoryId ?? existing.categoryId,
      isActive: payload.isActive ?? existing.isActive,
      images: payload.images ?? existing.images,
      variants: payload.variants ?? existing.variants,
    },
    id
  );
}

export function softDeleteProduct(id: string) {
  const product = products.find((item) => item.id === id);
  if (!product) return null;
  product.isActive = false;
  return hydrateProduct(product);
}

export function duplicateProduct(id: string) {
  const product = getProduct(id);
  if (!product) return null;
  return saveProduct({
    name: `${product.name} Copy`,
    description: product.description,
    categoryId: product.categoryId,
    isActive: false,
    images: product.images.map(({ url, isPrimary, sortOrder }) => ({ url, isPrimary, sortOrder })),
    variants: product.variants.map((variant) => ({
      name: variant.name,
      price: variant.price,
      stock: variant.stock,
      sku: `${variant.sku}-copy`,
    })),
  });
}

export function listVariantsForStock() {
  return products.flatMap((product) =>
    product.variants.map((variant) => ({
      variantId: variant.id,
      productName: product.name,
      variantName: variant.name,
      stock: variant.stock,
    }))
  );
}

export function updateBulkStock(updates: Array<{ variantId: string; stock: number }>) {
  const stockById = new Map(updates.map((update) => [update.variantId, Number(update.stock)]));

  products.forEach((product) => {
    product.variants = product.variants.map((variant) =>
      stockById.has(variant.id) ? { ...variant, stock: stockById.get(variant.id) ?? variant.stock } : variant
    );
  });

  return listVariantsForStock();
}

export function isSkuUnique(sku: string, excludeVariantId?: string) {
  const normalized = sku.trim().toLowerCase();
  return !products
    .flatMap((product) => product.variants)
    .some((variant) => variant.sku.toLowerCase() === normalized && variant.id !== excludeVariantId);
}
