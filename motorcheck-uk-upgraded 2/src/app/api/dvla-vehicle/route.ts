import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const registration = (request.nextUrl.searchParams.get("registration") || "").toUpperCase().replace(/[\s-]/g, "");
  if (!/^[A-Z0-9]{2,8}$/.test(registration)) return NextResponse.json({ status: "invalid", message: "Enter a valid vehicle registration." }, { status: 400 });
  const key = process.env.DVLA_VES_API_KEY;
  if (!key) return NextResponse.json({ status: "not_configured", registration, message: "DVLA vehicle enquiry is not connected. Add your authorised DVLA VES API key as DVLA_VES_API_KEY on the server." }, { status: 503 });
  try {
    const response = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", { method: "POST", headers: { "x-api-key": key, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ registrationNumber: registration }), cache: "no-store", signal: AbortSignal.timeout(10000) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ status: response.status === 404 ? "not_found" : "provider_error", registration, message: response.status === 404 ? "DVLA returned no vehicle for this registration." : "DVLA vehicle enquiry could not complete the lookup.", details: response.status === 400 ? data : undefined }, { status: response.status === 404 ? 404 : 502 });
    return NextResponse.json({ status: "ok", source: "DVLA Vehicle Enquiry Service", retrievedAt: new Date().toISOString(), vehicle: data });
  } catch { return NextResponse.json({ status: "provider_error", registration, message: "DVLA vehicle enquiry timed out or was unavailable." }, { status: 502 }); }
}
