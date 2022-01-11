import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  //Allow request pass through
  //1. Its a request to the server for auth
  //2. If token exists

  if (token && pathname === "/login") {
    return NextResponse.redirect("/");
  }

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  //If no token exists, redirect to login
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
