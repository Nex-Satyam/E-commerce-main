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

  export const products: ProductItem[] = [
    {
      slug: "ivory-flow-dress",
      name: "Ivory Flow Dress",
      price: "₹84",
      tag: "New Arrival",
      image: "/product-dress.svg",
      description: "Premium cotton blend with a soft hand-feel finish.",
      images: ["/product-dress.svg", "/hero-slide-1.svg", "/hero-slide-2.svg"],
      longDescription:
        "The Ivory Flow Dress is cut for light movement and easy layering, with a fluid drape that works across daytime events, dinners, and travel wardrobes.",
      details: [
        "Soft cotton-blend fabrication with breathable lining.",
        "Relaxed midi silhouette designed for all-day wear.",
        "Finished with minimal seams and a clean neckline for a polished look.",
      ],
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Ivory", swatch: "#efe2cf" },
        { name: "Oat", swatch: "#d9c3a2" },
        { name: "Stone", swatch: "#bda27f" },
      ],
      rating: 4.8,
      reviewCount: 128,
      sku: "ASR-DR-101",
      category: "Women",
      material: "Cotton Blend",
      fit: "Relaxed Fit",
      reviews: [
        {
          author: "Rhea S.",
          date: "April 12, 2026",
          rating: 5,
          title: "Elegant and easy to wear",
          comment:
            "The fabric feels premium and the fall of the dress is very clean. It works for both office lunches and evening plans.",
        },
        {
          author: "Megha R.",
          date: "March 28, 2026",
          rating: 4,
          title: "Minimal in the best way",
          comment:
            "Loved the neutral tone and cut. I would size up only if you want an extra loose shape.",
        },
      ],
    },
    {
      slug: "stone-linen-shirt",
      name: "Stone Linen Shirt",
      price: "₹52",
      tag: "Best Seller",
      image: "/product-shirt.svg",
      description: "Relaxed tailoring designed for easy everyday layering.",
      images: ["/product-shirt.svg", "/hero-slide-2.svg", "/hero-slide-3.svg"],
      longDescription:
        "A lightweight shirt with a softer structure, built to be worn open over tees or buttoned for a sharper neutral look.",
      details: [
        "Breathable linen-rich weave for warmer days.",
        "Straight hem and relaxed shoulder for casual layering.",
        "Neutral stone shade pairs well with darker trousers and light denim.",
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Stone", swatch: "#c8b08f" },
        { name: "Sand", swatch: "#dbc7aa" },
        { name: "Ink", swatch: "#56473a" },
      ],
      rating: 4.7,
      reviewCount: 96,
      sku: "ASR-SH-204",
      category: "Men",
      material: "Linen Blend",
      fit: "Regular Relaxed",
      reviews: [
        {
          author: "Aditya K.",
          date: "April 5, 2026",
          rating: 5,
          title: "Great summer staple",
          comment:
            "Very easy shirt to style and the fabric has a nice airy feel without looking too casual.",
        },
        {
          author: "Nitin P.",
          date: "March 17, 2026",
          rating: 4,
          title: "Clean fit and color",
          comment:
            "The stone tone is exactly what I wanted. Sleeves sit well and the length works untucked.",
        },
      ],
    },
    {
      slug: "sand-trench-coat",
      name: "Sand Trench Coat",
      price: "₹118",
      tag: "Limited Drop",
      image: "/product-coat.svg",
      description: "Lightweight outerwear with sharp structure and fluid movement.",
      images: ["/product-coat.svg", "/hero-slide-3.svg", "/hero-slide-1.svg"],
      longDescription:
        "The Sand Trench Coat sharpens any basic layer underneath and brings a tailored line without feeling heavy or rigid.",
      details: [
        "Lightweight structure suited for transitional weather.",
        "Extended front line and minimal fastening for a clean finish.",
        "Ideal over knits, shirts, and monochrome layering pieces.",
      ],
      sizes: ["M", "L", "XL"],
      colors: [
        { name: "Sand", swatch: "#d9c3a1" },
        { name: "Clay", swatch: "#b89469" },
      ],
      rating: 4.9,
      reviewCount: 62,
      sku: "ASR-CT-309",
      category: "Outerwear",
      material: "Structured Twill",
      fit: "Tailored Relaxed",
      reviews: [
        {
          author: "Karan V.",
          date: "April 9, 2026",
          rating: 5,
          title: "Refined and practical",
          comment:
            "The coat sits beautifully and elevates even the simplest outfit. Lightweight but still substantial.",
        },
        {
          author: "Sara L.",
          date: "March 30, 2026",
          rating: 5,
          title: "Best outerwear purchase this season",
          comment:
            "Very clean profile. The color works with nearly everything in my wardrobe.",
        },
      ],
    },
    {
      slug: "classic-knit-set",
      name: "Classic Knit Set",
      price: "₹69",
      tag: "Editor Pick",
      image: "/product-knit.svg",
      description: "A soft knit pairing made for clean styling across seasons.",
      images: ["/product-knit.svg", "/hero-slide-2.svg", "/hero-slide-1.svg"],
      longDescription:
        "A coordinated knit set with a polished texture and relaxed silhouette, designed for comfortable dressing that still feels elevated.",
      details: [
        "Soft-touch knit with gentle stretch and shape retention.",
        "Balanced proportions for lounging, travel, and casual city wear.",
        "Works well as a full set or as separate styling pieces.",
      ],
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Cream", swatch: "#e8dbc6" },
        { name: "Taupe", swatch: "#baa182" },
      ],
      rating: 4.6,
      reviewCount: 74,
      sku: "ASR-KN-412",
      category: "Sets",
      material: "Fine Knit",
      fit: "Soft Relaxed",
      reviews: [
        {
          author: "Ishita M.",
          date: "April 3, 2026",
          rating: 5,
          title: "Comfort without looking lazy",
          comment:
            "This set feels comfortable enough for travel but still looks considered and polished.",
        },
        {
          author: "Tanvi B.",
          date: "March 14, 2026",
          rating: 4,
          title: "Very versatile",
          comment:
            "I wear the top and bottom separately too. Great texture and not too bulky.",
        },
      ],
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

  export function getProductBySlug(slug: string) {
    return products.find((product) => product.slug === slug);
  }

  export function getCartItemCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  export function getWishlistItemCount() {
    return wishlistItems.length;
  }
