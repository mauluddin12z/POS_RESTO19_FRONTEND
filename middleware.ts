import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
   const token = req.cookies.get("accessToken")?.value;
   const isLoggedIn = !!token;
   const { pathname } = req.nextUrl;

   // If no token and accessing protected routes, redirect to login
   if (
      !isLoggedIn &&
      ["/home", "/orders", "/menus", "/categories", "/users"].includes(pathname)
   ) {
      return NextResponse.redirect(new URL("/login", req.url));
   }

   // If user is logged in but trying to access the login page, redirect to home
   if (isLoggedIn && pathname === "/login") {
      return NextResponse.redirect(new URL("/home", req.url));
   }

   // Check the user's role if they are logged in
   if (isLoggedIn) {
      let userRole = null;

      // Decode the token and extract the user's role
      try {
         const decodedToken = jwt.decode(token) as { role: string };
         userRole = decodedToken?.role;
      } catch (error) {
         console.error("Token decoding failed:", error);
      }

      // Role-based authorization: Only allow access to superadmin users for certain routes
      if (userRole && pathname === "/users" && userRole !== "superadmin") {
         return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
   }

   // Otherwise, allow the request to continue
   return NextResponse.next();
}

export const config = {
   matcher: ["/home", "/orders", "/menus", "/categories", "/users", "/login"],
};
