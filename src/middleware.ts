import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  // if (req.nextUrl.pathname === "/") {
  //   if (token && token.value !== "") {
  //     return NextResponse.redirect(new URL("/assistencias", req.url));
  //   }
  //   return NextResponse.next();
  // }
  if (
    (!token || token.value === "") &&
    (req.nextUrl.pathname.startsWith("/assistencias") ||
      req.nextUrl.pathname.startsWith("/ver_assistencias"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/assistencias/:path*", "/ver_assistencias/:path*", "/"],
};
