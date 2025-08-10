import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This is a simple example of checking auth via cookies
export function middleware(req: NextRequest) {
   // Extract the token from the cookies
   const token = req.cookies.get("accessToken")?.value;

   // Log token value and cookies to check if it's being received correctly
   console.log("Token from cookies:", token);
   console.log("All cookies:", req.cookies);

   const isLoggedIn = !!token;
   const { pathname } = req.nextUrl;

   // Log the path the user is trying to access
   console.log("Requested Path:", pathname);

   // If user is not logged in and tries to access a protected route
   if (
      !isLoggedIn &&
      ["/home", "/orders", "/menus", "/categories", "/users"].includes(pathname)
   ) {
      console.log("User is not logged in. Redirecting to login page.");
      return NextResponse.redirect(new URL("/login", req.url));
   }

   // If user is logged in and tries to access login page
   if (isLoggedIn && pathname === "/login") {
      console.log("User is already logged in. Redirecting to home page.");
      return NextResponse.redirect(new URL("/home", req.url));
   }

   // Otherwise, allow the request to continue
   return NextResponse.next();
}

export const config = {
   matcher: ["/home", "/orders", "/menus", "/categories", "/users", "/login"],
};
