import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { isValidRegistration, normalizeRegistration } from "@/lib/payment-access";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Payments are not configured yet. Add your Stripe test keys to .env.local first." }, { status: 503 });

  let body: { registration?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const registration = normalizeRegistration(body.registration ?? "");
  if (!isValidRegistration(registration)) return NextResponse.json({ error: "Enter a valid registration before checkout." }, { status: 400 });

  const amount = 648;
  const isLiveKey = secretKey.startsWith("sk_live_");
  const motReportReady = process.env.VEHICLE_REPORT_DATA_READY === "true";
  const premiumProviderReady = process.env.PREMIUM_REPORT_PROVIDER_READY === "true";
  const dataReady = motReportReady && premiumProviderReady;
  const testCheckoutEnabled = process.env.ENABLE_TEST_CHECKOUT === "true" && secretKey.startsWith("sk_test_");
  if (!dataReady && !testCheckoutEnabled) {
    return NextResponse.json({ error: "Checkout is in preview mode. Live payments require verified MOT report delivery and a connected authorised premium-data provider. Test payments can be enabled explicitly with a Stripe test key." }, { status: 403 });
  }
  if (isLiveKey && (process.env.ENABLE_LIVE_PAYMENTS !== "true" || !dataReady)) {
    return NextResponse.json({ error: "Live payments are disabled until real MOT report delivery and authorised premium-data provider results are connected and verified." }, { status: 403 });
  }

  const stripe = new Stripe(secretKey);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).replace(/\/$/, "");
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price_data: { currency: "gbp", unit_amount: amount, product_data: { name: "MotorCheck UK Enhanced Vehicle Report", description: `One vehicle only: ${registration}. One-time payment; no subscription.` } }, quantity: 1 }],
      client_reference_id: registration,
      metadata: { registration, product: "enhanced_vehicle_report", version: "2", price: "648" },
      success_url: `${siteUrl}/report/${encodeURIComponent(registration)}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/report/${encodeURIComponent(registration)}?payment=cancelled`,
      billing_address_collection: "auto",
      // Stripe-hosted Checkout can display Apple Pay / other supported wallets automatically.
    });
    if (!session.url) return NextResponse.json({ error: "Stripe did not return a checkout URL. Please try again." }, { status: 502 });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout session creation failed", error);
    return NextResponse.json({ error: "Could not start secure checkout. Check your Stripe test keys and try again." }, { status: 502 });
  }
}
