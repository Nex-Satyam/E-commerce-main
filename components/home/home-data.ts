export type NavItem = {
  label: string;
  href: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  skuError?: string;
};

export type CategoryItem = {
  name: string;
  description: string;
  accent: string;
};

export type ProductItem = {
  id: string;
  slug: string;
  name: string;
  price: string;
  tag: string;
  image: string;
  images: string[];
  variants?: ProductVariant[];
  description: string;
  longDescription: string;
  details: string[];
  sizes: string[];
  colors: Array<{
    name: string;
    swatch: string;
  }>;
  rating: number;
  reviewCount: number;
  sku: string;
  category: string;
  material: string;
  fit: string;
  reviews: Array<{
    author: string;
    date: string;
    rating: number;
    title: string;
    comment: string;
  }>;
};

  export type SlideItem = {
    title: string;
    subtitle: string;
    image: string;
    href: string;
  };

  export type FooterLinkItem = {
    label: string;
    href: string;
  };

  export type FooterSection = {
    title: string;
    links: FooterLinkItem[];
  };

  export type CartItem = {
    productSlug: string;
    size: string;
    color: string;
    quantity: number;
  };

  export type WishlistItem = {
    productSlug: string;
  };

  export const navItems: NavItem[] = [
    { label: "Home", href: "/#slider" },
    { label: "Categories", href: "/#categories" },
    { label: "Products", href: "/#products" },
    { label: "Contact", href: "/#footer" },
  ];

  export const categories: CategoryItem[] = [
    {
      name: "Women",
      description: "Draped shirts, tailored dresses, and soft seasonal layers.",
      accent: "Sand Edit",
    },
    {
      name: "Men",
      description: "Relaxed overshirts, sharp trousers, and neutral staples.",
      accent: "Tailored Ease",
    },
    {
      name: "Kids",
      description: "Comfort-first sets in breathable fabrics and playful tones.",
      accent: "Soft Motion",
    },
    {
      name: "Accessories",
      description: "Belts, bags, and layered details to finish every look.",
      accent: "Final Touch",
    },
  ];

 

  export const slides: SlideItem[] = [
    {
      title: "Quiet luxury for everyday wear",
      subtitle:
        "Crisp silhouettes in warm off-white tones, built for all-day styling.",
      image: "/hero-slide-1.svg",
      href: "/products/ivory-flow-dress",
    },
    {
      title: "Soft layers, sharper details",
      subtitle:
        "Discover fluid tailoring, textured cotton, and calm seasonal palettes.",
      image: "/hero-slide-2.svg",
      href: "/products/stone-linen-shirt",
    },
    {
      title: "Modern essentials for every closet",
      subtitle:
        "From elevated basics to statement outerwear, curated for repeat wear.",
      image: "/hero-slide-3.svg",
      href: "/products/sand-trench-coat",
    },
  ];

  export const footerLinks = [
    { label: "Policy", href: "/policy" },
    { label: "How To Use", href: "/how-to-use" },
    { label: "Terms", href: "/terms-and-conditions" },
    { label: "hello@offwhiteatelier.com", href: "mailto:hello@offwhiteatelier.com" },
  ];

  export const footerSections: FooterSection[] = [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "#products" },
        { label: "Women", href: "/#categories" },
        { label: "Men", href: "/#categories" },
        { label: "Accessories", href: "/#categories" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "mailto:hello@offwhiteatelier.com" },
        { label: "How To Use", href: "/how-to-use" },
        { label: "Shipping & Returns", href: "/policy" },
        { label: "Track Order", href: "/policy" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Atelier", href: "/#slider" },
        { label: "Journal", href: "/#footer" },
        { label: "Store Appointments", href: "/#footer" },
        { label: "Careers", href: "/#footer" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/policy" },
        { label: "Terms & Conditions", href: "/terms-and-conditions" },
        { label: "Cookies", href: "/#footer" },
        { label: "Accessibility", href: "/#footer" },
      ],
    },
  ];

  export const socialLinks: FooterLinkItem[] = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ];

  export const cartItems: CartItem[] = [
    {
      productSlug: "ivory-flow-dress",
      size: "S",
      color: "Ivory",
      quantity: 1,
    },
    {
      productSlug: "stone-linen-shirt",
      size: "M",
      color: "Stone",
      quantity: 2,
    },
    {
      productSlug: "sand-trench-coat",
      size: "L",
      color: "Sand",
      quantity: 1,
    },
  ];

  export const wishlistItems: WishlistItem[] = [
    { productSlug: "classic-knit-set" },
    { productSlug: "ivory-flow-dress" },
    { productSlug: "sand-trench-coat" },
  ];

  

  export function getCartItemCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  export function getWishlistItemCount() {
    return wishlistItems.length;
  }
