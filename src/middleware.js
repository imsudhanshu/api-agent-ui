import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;

  // Check if user is hitting /dashboard
  if (url.pathname.startsWith("/dashboard")) {
    const protocol = request.headers.get("x-forwarded-proto") || "http";

    // If HTTPS → redirect to coming soon page
    if (protocol === "https") {
      return NextResponse.redirect(new URL("/coming-soon", request.url));
    }
  }

  return NextResponse.next();
}