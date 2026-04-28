-- Ensure schema exists
CREATE SCHEMA IF NOT EXISTS mini_e_commerce;

-- ENUMS
CREATE TYPE mini_e_commerce."Role" AS ENUM (
    'USER',
    'ADMIN',
    'SELLER'
);

CREATE TYPE mini_e_commerce."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);

CREATE TYPE mini_e_commerce."NotifType" AS ENUM (
    'ORDER_PLACED',
    'ORDER_CONFIRMED',
    'ORDER_SHIPPED',
    'ORDER_DELIVERED',
    'ORDER_CANCELLED',
    'NEW_ORDER',
    'LOW_STOCK'
);

-- USER
CREATE TABLE mini_e_commerce."User" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT,
    "password" TEXT,
    "role" mini_e_commerce."Role" NOT NULL DEFAULT 'USER',
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT UNIQUE,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP,
    "address" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "User_email_idx" ON mini_e_commerce."User"("email");
CREATE INDEX "User_role_idx" ON mini_e_commerce."User"("role");

-- ADDRESS
CREATE TABLE mini_e_commerce."Address" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "label" TEXT NOT NULL DEFAULT 'Home',
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Address_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES mini_e_commerce."User"("id")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX "Address_userId_idx"
ON mini_e_commerce."Address"("userId");

CREATE UNIQUE INDEX "one_default_address_per_user"
ON mini_e_commerce."Address"("userId")
WHERE "isDefault" = true;

-- CATEGORY
CREATE TABLE mini_e_commerce."Category" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE
);

-- PRODUCT
CREATE TABLE mini_e_commerce."Product" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "slug" TEXT NOT NULL UNIQUE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_categoryId_fkey"
        FOREIGN KEY ("categoryId")
        REFERENCES mini_e_commerce."Category"("id")
);

CREATE INDEX "Product_categoryId_idx" ON mini_e_commerce."Product"("categoryId");
CREATE INDEX "Product_isActive_idx" ON mini_e_commerce."Product"("isActive");

-- PRODUCT VARIANT
CREATE TABLE mini_e_commerce."ProductVariant" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL UNIQUE,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_productId_fkey"
        FOREIGN KEY ("productId")
        REFERENCES mini_e_commerce."Product"("id")
        ON DELETE CASCADE
);

CREATE INDEX "ProductVariant_productId_idx" ON mini_e_commerce."ProductVariant"("productId");
CREATE INDEX "ProductVariant_stock_idx" ON mini_e_commerce."ProductVariant"("stock");

-- PRODUCT IMAGE
CREATE TABLE mini_e_commerce."ProductImage" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductImage_productId_fkey"
        FOREIGN KEY ("productId")
        REFERENCES mini_e_commerce."Product"("id")
        ON DELETE CASCADE
);

CREATE INDEX "ProductImage_productId_idx" ON mini_e_commerce."ProductImage"("productId");

-- REVIEW
CREATE TABLE mini_e_commerce."Review" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Review_user_fkey"
        FOREIGN KEY ("userId")
        REFERENCES mini_e_commerce."User"("id")
        ON DELETE CASCADE,

    CONSTRAINT "Review_product_fkey"
        FOREIGN KEY ("productId")
        REFERENCES mini_e_commerce."Product"("id")
        ON DELETE CASCADE,

    CONSTRAINT "Review_unique_user_product"
        UNIQUE ("userId", "productId")
);

-- CART ITEM
CREATE TABLE mini_e_commerce."CartItem" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "addedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,

    CONSTRAINT "CartItem_user_fkey"
        FOREIGN KEY ("userId")
        REFERENCES mini_e_commerce."User"("id")
        ON DELETE CASCADE,

    CONSTRAINT "CartItem_variant_fkey"
        FOREIGN KEY ("variantId")
        REFERENCES mini_e_commerce."ProductVariant"("id")
        ON DELETE CASCADE,

    CONSTRAINT "CartItem_unique_user_variant"
        UNIQUE ("userId", "variantId")
);

-- ORDER
CREATE TABLE mini_e_commerce."Order" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "status" mini_e_commerce."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "Order_user_fkey"
        FOREIGN KEY ("userId")
        REFERENCES mini_e_commerce."User"("id"),

    CONSTRAINT "Order_address_fkey"
        FOREIGN KEY ("addressId")
        REFERENCES mini_e_commerce."Address"("id")
);

-- ORDER ITEM
CREATE TABLE mini_e_commerce."OrderItem" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "quantity" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "variantName" TEXT NOT NULL,
    "priceAtOrder" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_order_fkey"
        FOREIGN KEY ("orderId")
        REFERENCES mini_e_commerce."Order"("id")
        ON DELETE CASCADE,

    CONSTRAINT "OrderItem_variant_fkey"
        FOREIGN KEY ("variantId")
        REFERENCES mini_e_commerce."ProductVariant"("id")
);

-- NOTIFICATION
CREATE TABLE mini_e_commerce."Notification" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "type" mini_e_commerce."NotifType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "orderId" TEXT,

    CONSTRAINT "Notification_user_fkey"
        FOREIGN KEY ("userId")
        REFERENCES mini_e_commerce."User"("id")
        ON DELETE CASCADE,

    CONSTRAINT "Notification_order_fkey"
        FOREIGN KEY ("orderId")
        REFERENCES mini_e_commerce."Order"("id")
        ON DELETE SET NULL
);

-- WISHLIST
CREATE TABLE mini_e_commerce."Wishlist" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_user_fkey"
        FOREIGN KEY ("userId")
        REFERENCES mini_e_commerce."User"("id")
        ON DELETE CASCADE,

    CONSTRAINT "Wishlist_product_fkey"
        FOREIGN KEY ("productId")
        REFERENCES mini_e_commerce."Product"("id")
        ON DELETE CASCADE,

    CONSTRAINT "Wishlist_unique_user_product"
        UNIQUE ("userId", "productId")
);

CREATE INDEX "Wishlist_userId_idx" ON mini_e_commerce."Wishlist"("userId");
CREATE INDEX "Wishlist_productId_idx" ON mini_e_commerce."Wishlist"("productId");