import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    // isSuperAdmin?: boolean;
    isBanned?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      // isSuperAdmin?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    // isSuperAdmin?: boolean;
  }
}
