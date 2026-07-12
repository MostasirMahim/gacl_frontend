import { protected_routes } from "@/lib/protected_routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface PermissionCache {
  permissions: string[];
  timestamp: number;
  role?: string;
  mustChangePassword?: boolean;
}

const permissionCache = new Map<string, PermissionCache>();
const CACHE_TTL = 60 * 1000;

function cleanupExpiredCache() {
  const now = Date.now();
  const entries = Array.from(permissionCache.entries());

  for (const [key, value] of entries) {
    if (now - value.timestamp > CACHE_TTL) {
      permissionCache.delete(key);
    }
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredCache, 5 * 60 * 1000);
}
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  // Allow public access to resturent routes
  if (pathname === "/restaurant" || pathname.startsWith("/restaurant/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let user_permissions: string[] = [];
  let role = "";
  let mustChangePassword = false;
  const cacheKey = `user_${token}`;

  const cachedData = permissionCache.get(cacheKey);
  const now = Date.now();
  const oneMinute = 60 * 1000;

  if (cachedData && now - cachedData.timestamp < oneMinute) {
    user_permissions = cachedData.permissions;
    role = cachedData.role || "";
    mustChangePassword = cachedData.mustChangePassword || false;
  } else {
    try {
      const baseURL =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";
      const apiRes = await fetch(
        `${baseURL}/api/account/v1/authorization/get_user_all_permissions/`,
        {
          headers: {
            cookie: `access_token=${token};`,
          },
          cache: "no-store",
          credentials: "include",
        },
      );

      const json = await apiRes.json();
      console.log("Middleware auth check response:", JSON.stringify(json));
      if (json.code !== 200) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      const data = json.data[0];
      user_permissions = data.permissions.map((p: any) => p.permission_name);
      role = data.role || "";
      mustChangePassword = data.must_change_password === true;

      permissionCache.set(cacheKey, {
        permissions: user_permissions,
        timestamp: now,
        role,
        mustChangePassword,
      });
    } catch (err) {
      console.log("Middleware fetch error:", err);
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // ---- Mandatory password change ----
  // Freshly-approved members (and any other account an admin flags) must
  // set a real password before doing anything else. Only enforced here
  // for non-MEMBER roles for now: the /reset-password page lives in the
  // (dashboard) route group and hasn't been verified to render sanely
  // inside the member /portal experience yet. MEMBER accounts still get
  // must_change_password=True and are prompted immediately after login
  // (see the login page), but aren't hard-gated by middleware here --
  // flagging this as a known gap rather than risking a redirect loop
  // between /portal and /reset-password.
  if (
    mustChangePassword &&
    role !== "MEMBER" &&
    pathname !== "/reset-password"
  ) {
    url.pathname = "/reset-password";
    return NextResponse.redirect(url);
  }

  // ---- Member portal routing ----
  // A club member is confined to the /portal area. Any attempt to reach the
  // admin dashboard is redirected to their portal. Conversely, staff/admin
  // hitting /portal are sent to the admin dashboard.
  const isPortalPath =
    pathname === "/portal" || pathname.startsWith("/portal/");
  const isMemberRole = role === "MEMBER";
  if (isMemberRole) {
    if (!isPortalPath) {
      url.pathname = "/portal";
      return NextResponse.redirect(url);
    }
    // members are allowed anywhere under /portal without further perm checks
    return NextResponse.next();
  }
  if (isPortalPath) {
    // staff/admin don't use the member portal
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const matchedRoute = protected_routes.find(
    (route) => pathname === route.path || pathname.startsWith(`${route.path}/`),
  );

  if (
    matchedRoute?.permission_name &&
    !user_permissions.includes(matchedRoute.permission_name)
  ) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|assets|login|forget-password|restaurant).*)",
  ],
};
