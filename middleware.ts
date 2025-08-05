import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This is a simple example of checking auth via cookies
export function middleware(req: NextRequest) {
   const token = req.cookies.get("accessToken")?.value;
   const isLoggedIn = !!token;
   const { pathname } = req.nextUrl;

   // If user is not logged in and tries to access a protected route
   if (
      !isLoggedIn &&
      ["/home", "/menus", "/categories"].includes(pathname)
   ) {
      return NextResponse.redirect(new URL("/login", req.url));
   }

   // If user is logged in and tries to access login page
   if (isLoggedIn && pathname === "/login") {
      return NextResponse.redirect(new URL("/home", req.url));
   }

   // Otherwise, allow request to continue
   return NextResponse.next();
}

export const config = {
   matcher: ["/home", "/menus", "/categories", "/login"],
};
