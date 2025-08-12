import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // if (
  //   !protectedRoutes.some((route) => pathname.startsWith(route)) &&
  //   pathname !== "/login"
  // ) {
  //   return NextResponse.next();
  // }

  // const session = await auth();
  // const isLoggedin = !!session?.user;

  // if (
  //   !isLoggedin &&
  //   protectedRoutes.some((route) => pathname.startsWith(route))
  // ) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // if (isLoggedin && pathname === "/login") {
  //   return NextResponse.redirect(new URL("/admin", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
