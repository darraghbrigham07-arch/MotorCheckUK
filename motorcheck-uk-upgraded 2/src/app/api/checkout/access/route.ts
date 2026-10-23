import { NextRequest, NextResponse } from "next/server";
import { accessCookieName, isValidRegistration, normalizeRegistration, verifyAccessToken } from "@/lib/payment-access";

export async function GET(request: NextRequest) {
  const registration = normalizeRegistration(request.nextUrl.searchParams.get("registration") ?? "");
  const secret = process.env.PAYMENT_ACCESS_SECRET;
  if (!isValidRegistration(registration) || !secret) return NextResponse.json({ paid: false });
  const token = request.cookies.get(accessCookieName(registration))?.value;
  return NextResponse.json({ paid: verifyAccessToken(token, registration, secret) });
}
