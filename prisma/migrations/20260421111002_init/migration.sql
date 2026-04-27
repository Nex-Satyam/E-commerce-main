CREATE TYPE mini_e_commerce."Role" AS ENUM (
    'USER',
    'ADMIN',
);

CREATE TABLE mini_e_commerce."User" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT,

    "role" mini_e_commerce."Role" NOT NULL DEFAULT 'USER',

    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT UNIQUE,

    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP,

    "image" TEXT,
    "phone" TEXT,

    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "isBanned" BOOLEAN NOT NULL DEFAULT false,

    "address" TEXT
);