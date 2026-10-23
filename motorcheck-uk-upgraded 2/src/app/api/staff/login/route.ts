import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  const expected = process.env.STAFF_PORTAL_PASSWORD;
  const secret = process.env.STAFF_SESSION_SECRET;
  if (!expected || !secret) return NextResponse.json({ error: "Staff portal is not configured. Add STAFF_PORTAL_PASSWORD and STAFF_SESSION_SECRET to .env.local, then restart the server." }, { status: 503 });
  const a = Buffer.from(String(password ?? "")); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  const token = createHmac("sha256", secret).update("motorcheck-staff-session-v1").digest("hex");
  const response = NextResponse.json({ ok: true });
  response.cookies.set("mc_staff_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
