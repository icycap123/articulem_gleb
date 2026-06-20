import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "articulem_session";

async function readSession(req: NextRequest): Promise<{ uid: string; role: string } | null> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return { uid: payload.uid as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await readSession(req);

  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(new URL("/login?next=/admin", req.url));
    if (session.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/create") || pathname.startsWith("/profile")) {
    if (!session) return NextResponse.redirect(new URL(`/login?next=${pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/create/:path*", "/profile/:path*"],
};
