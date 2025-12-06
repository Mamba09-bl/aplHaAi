import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("MY_SUPER_SECRET_123");

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const nextAuthSession = req.cookies.get("next-auth.session-token")?.value;

  if (!token && !nextAuthSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    if (token) {
      await jwtVerify(token, SECRET);
    }
    // no need to verify NextAuth session cookie manually
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/chat/:path*", "/about/:path*"],
};
