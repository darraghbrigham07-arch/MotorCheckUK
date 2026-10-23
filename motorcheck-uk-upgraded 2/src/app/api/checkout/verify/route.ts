import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { accessCookieName, createAccessToken, isValidRegistration, normalizeRegistration } from "@/lib/payment-access";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const accessSecret = process.env.PAYMENT_ACCESS_SECRET;
  if (!secretKey || !accessSecret) return NextResponse.json({ error: "Payment verification is not configured." }, { status: 503 });
  let body: { registration?: string; sessionId?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const registration = normalizeRegistration(body.registration ?? "");
  const sessionId = body.sessionId ?? "";
  if (!isValidRegistration(registration) || !sessionId.startsWith("cs_")) return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const valid = session.payment_status === "paid" && session.status === "complete" && session.currency === "gbp" && session.amount_total === 648 && session.metadata?.product === "enhanced_vehicle_report" && session.metadata?.price === "648" && normalizeRegistration(session.metadata?.registration ?? "") === registration && session.client_reference_id === registration;
    if (!valid) return NextResponse.json({ error: "Payment has not been confirmed for this vehicle." }, { status: 402 });
    const response = NextResponse.json({ paid: true, registration });
    response.cookies.set(accessCookieName(registration), createAccessToken(registration, session.id, accessSecret), { httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: `/report/${registration}`, maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (error) {
    console.error("Stripe payment verification failed", error);
    return NextResponse.json({ error: "We could not verify that payment yet. Refresh in a moment or contact support." }, { status: 502 });
  }
}
