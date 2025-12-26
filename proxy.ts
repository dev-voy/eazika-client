import { type NextRequest, NextResponse } from "next/server";

type UserRoleType = "admin" | "user" | "delivery_boy" | "shopkeeper";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/contact-us", "/privacy-policy", "/terms-and-condition"];

export async function proxy(req: NextRequest) {
  const token = (await req.cookies.get("accessToken")?.value) || null;
  const userRole: UserRoleType =
    ((await req.cookies.get("userRole")?.value) as UserRoleType) || "user";
  const pathname = req.nextUrl.pathname;

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If user is logged in and trying to access auth pages, redirect to home
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    // Allow role-specific login pages like /login/admin to pass through for redirect handling
    if (pathname === "/login/admin") return NextResponse.next();
    return NextResponse.redirect(new URL("/?msg=already_logged_in", req.url));
  }

  // If no token and trying to access protected routes, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url));
  }

  // If user has token, check role-based access
  if (token) {
    // ADMIN ROUTES - Only admin can access
    if (pathname.startsWith("/admin")) {
      if (userRole !== "admin") {
        return NextResponse.redirect(
          new URL("/?msg=unauthorized_access", req.url)
        );
      }
      return NextResponse.next();
    }

    // SHOP ROUTES - Only shopkeeper can access (except registration)
    if (pathname.startsWith("/shop")) {
      // Allow users to register as shopkeeper
      if (pathname === "/shop/register" && userRole === "user") {
        return NextResponse.next();
      }
      // Shopkeepers who try to register again, redirect to shop dashboard
      if (pathname === "/shop/register" && userRole === "shopkeeper") {
        return NextResponse.redirect(new URL("/shop", req.url));
      }
      // All other shop routes require shopkeeper role
      if (userRole !== "shopkeeper") {
        return NextResponse.redirect(
          new URL("/?msg=unauthorized_access", req.url)
        );
      }
      return NextResponse.next();
    }

    // RIDER ROUTES - Only delivery_boy can access (except registration)
    if (pathname.startsWith("/rider")) {
      // Allow users to register as rider
      if (pathname === "/rider/register" && userRole === "user") {
        return NextResponse.next();
      }
      // Riders who try to register again, redirect to rider dashboard
      if (pathname === "/rider/register" && userRole === "delivery_boy") {
        return NextResponse.redirect(new URL("/rider", req.url));
      }
      // All other rider routes require delivery_boy role
      if (userRole !== "delivery_boy") {
        return NextResponse.redirect(
          new URL("/?msg=unauthorized_access", req.url)
        );
      }
      return NextResponse.next();
    }

    // CUSTOMER ROUTES - Accessible by regular users only
    // Admin, shopkeeper, and delivery_boy shouldn't access customer-specific pages
    const customerOnlyRoutes = ["/cart", "/checkout", "/wishlist"];
    if (customerOnlyRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== "user") {
        return NextResponse.redirect(
          new URL("/?msg=unauthorized_access", req.url)
        );
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
    "/admin/:path*",
    "/shop/:path*",
    "/delivery/:path*",
  ],
};
