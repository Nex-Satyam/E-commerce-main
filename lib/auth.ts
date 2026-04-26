import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";


import { resend } from "@/lib/mail";
import type { AuthOptions, Session, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      isSuperAdmin?: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role?: string;
    isSuperAdmin?: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string | null;
  }
}

const authOptions: AuthOptions = {
  session: { strategy: "jwt" as const },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return user as any;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    
  async signIn({ user }) {
    if (!user.email) return false;

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name || "",
          image: user.image || "",
        },
      });
    }

    return true;
  },
    async jwt({ token, user }) {
  if (user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (dbUser) {
      token.id = dbUser.id;
      token.role = dbUser.role;
    }
  }
  return token;
},

   async session({ session, token }) {
  if (session.user) {
    session.user.id = String(token.id);
    session.user.role = token.role;
  }
  return session;
},

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl + "/";
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.email) {
        await resend.emails.send({
          from: "no-reply@yourdomain.com",
          to: user.email,
          subject: "Login Notification",
          html: `<p>Hello ${user.name || ""},<br>Your account was just logged in. If this wasn't you, please secure your account.</p>`,
        });
      }
    },
    async createUser({ user }) {
      if (user?.email) {
        await resend.emails.send({
          from: "no-reply@yourdomain.com",
          to: user.email,
          subject: "Welcome to Offwhite Atelier!",
          html: `<p>Hello ${user.name || ""},<br>Thank you for signing up at Offwhite Atelier. We're excited to have you!</p>`,
        });
      }
    },
  },
};

export { authOptions };