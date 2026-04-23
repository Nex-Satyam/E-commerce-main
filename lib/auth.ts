import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";


import type { AuthOptions, Session, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role: string;
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


    async signIn({ user, account }) {
    if (account?.provider === "google") {
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name ?? "",
            image: user.image ?? "",
            role: "USER", 
          },
        });
      }

      user.id = existingUser.id;
      user.role = existingUser.role;
    }
    return true;
  },
    async jwt({ token, user }) {
  if (user) {

    token.id = user.id;
    token.role = user.role;
    token.email = user.email;
    token.name = user.name;
    token.image = user.image;
  }
  return token;
},

      async session({ session, token }: { session: any; token: any }) {
        if (session.user) {
          (session.user as any).id = token.id as string;
          (session.user as any).role = token.role as string;
          (session.user as any).email = token.email as string;
          (session.user as any).name = token.name as string;
          (session.user as any).image = token.image as string;
        }
      return session;
    },
  },
};

export { authOptions };