import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
<<<<<<< HEAD
    isSuperAdmin?: boolean;
=======
    // isSuperAdmin?: boolean;
>>>>>>> origin/main
    isBanned?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
<<<<<<< HEAD
      isSuperAdmin?: boolean;
=======
      // isSuperAdmin?: boolean;
>>>>>>> origin/main
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
<<<<<<< HEAD
    isSuperAdmin?: boolean;
=======
    // isSuperAdmin?: boolean;
>>>>>>> origin/main
  }
}
