import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin pages
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Prevent logged-in admins from accessing the login page
  if (pathname === "/admin/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token && token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Protect /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
