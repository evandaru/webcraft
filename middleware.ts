import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Halaman yang butuh login
const protectedPaths = ["/dashboard", "/generate", "/projects"];

// Halaman auth — jika sudah login, redirect ke dashboard
const authPaths = ["/login", "/register"];

// Halaman admin — butuh role admin
const adminPaths = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session?.user;

  // 1. Admin routes — harus login dan role admin
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url),
      );
    }
    if (session?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 2. Protected routes — harus login
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url),
      );
    }
  }

  // 3. Auth pages — jika sudah login, redirect ke dashboard
  //    (biar user tidak buka /login atau /register saat sudah masuk)
  if (authPaths.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 4. Semua halaman lain (termasuk landing page /, /pricing, dll.)
  //    bebas diakses oleh siapa saja — login atau tidak
  return NextResponse.next();
});

export const config = {
  // Jalankan middleware di semua path kecuali:
  // - /api (API routes)
  // - /_next/static & /_next/image (Next.js assets)
  // - /favicon.ico
  // - /p/ (published landing pages — akses publik)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|p/).*)"],
};
