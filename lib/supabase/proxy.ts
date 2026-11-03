import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

function copySession(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  const cacheControl = from.headers.get("cache-control");
  if (cacheControl) to.headers.set("cache-control", cacheControl);
  return to;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  if (!isSupabaseConfigured()) return supabaseResponse;

  const supabase = createServerClient(supabaseUrl(), supabaseKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        supabaseResponse.headers.set("Cache-Control", "private, no-store");
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isAdmin =
    (data?.claims?.app_metadata as { role?: string } | undefined)?.role === "admin";
  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";

  if (path.startsWith("/admin") && !isLogin && !isAdmin) {
    const redirect = NextResponse.redirect(new URL("/admin/login", request.url));
    return copySession(supabaseResponse, redirect);
  }

  if (isLogin && isAdmin) {
    const redirect = NextResponse.redirect(new URL("/admin", request.url));
    return copySession(supabaseResponse, redirect);
  }

  return supabaseResponse;
}
