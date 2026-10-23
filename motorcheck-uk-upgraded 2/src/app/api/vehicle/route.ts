import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DvsaTokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
};

type DvsaDefect = {
  text?: string;
  type?: string;
  dangerous?: boolean;
};

type DvsaMotTest = {
  completedDate?: string;
  testResult?: string;
  expiryDate?: string;
  odometerValue?: string;
  odometerUnit?: string;
  odometerResultType?: string;
  motTestNumber?: string;
  defects?: DvsaDefect[];
  rfrAndComments?: DvsaDefect[];
};

type DvsaVehicle = {
  registration?: string;
  make?: string;
  model?: string;
  firstUsedDate?: string;
  manufactureDate?: string;
  registrationDate?: string;
  fuelType?: string;
  primaryColour?: string;
  engineSize?: string;
  motTests?: DvsaMotTest[];
};

let cachedToken: { value: string; expiresAt: number } | null = null;

function normalizeRegistration(value: string) {
  return value.toUpperCase().replace(/[\s-]/g, "");
}

function displayDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

function textOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function getDvsaAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.value;

  const tokenUrl = process.env.DVSA_TOKEN_URL;
  const scope = process.env.DVSA_SCOPE;
  const clientId = process.env.DVSA_CLIENT_ID;
  const clientSecret = process.env.DVSA_CLIENT_SECRET;

  if (!tokenUrl || !scope || !clientId || !clientSecret) {
    throw new Error("DVSA credentials are not fully configured.");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`DVSA authentication returned ${response.status}.`);
  const data = (await response.json()) as DvsaTokenResponse;
  if (!data.access_token) throw new Error("DVSA authentication did not return an access token.");

  cachedToken = {
    value: data.access_token,
    expiresAt: now + Math.max(60, data.expires_in ?? 300) * 1000,
  };
  return cachedToken.value;
}

export async function GET(request: NextRequest) {
  const registration = normalizeRegistration(request.nextUrl.searchParams.get("registration") ?? "");

  if (!registration) {
    return NextResponse.json({ status: "invalid", error: "Enter a vehicle registration." }, { status: 400 });
  }
  if (registration.length < 2 || registration.length > 8 || !/^[A-Z0-9]+$/.test(registration)) {
    return NextResponse.json({ status: "invalid", error: "That registration format doesn't look right." }, { status: 400 });
  }

  const apiKey = process.env.DVSA_API_KEY;
  const baseUrl = (process.env.DVSA_API_BASE_URL || "https://history.mot.api.gov.uk").replace(/\/$/, "");
  if (!apiKey || !process.env.DVSA_CLIENT_ID || !process.env.DVSA_CLIENT_SECRET || !process.env.DVSA_SCOPE || !process.env.DVSA_TOKEN_URL) {
    return NextResponse.json({
      status: "not_configured",
      registration,
      message: "DVSA MOT history access is not configured yet. No live vehicle database was queried.",
      nextStep: "Wait for DVSA approval, then add the credentials to the server-side .env.local file.",
    }, { status: 503 });
  }

  try {
    const token = await getDvsaAccessToken();
    const url = `${baseUrl}/v1/trade/vehicles/registration/${encodeURIComponent(registration)}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-Key": apiKey,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (response.status === 404) {
      return NextResponse.json({
        status: "not_found",
        registration,
        message: "No MOT history was returned for this registration. Check the registration and try again.",
      }, { status: 404 });
    }
    if (response.status === 401 || response.status === 403) {
      cachedToken = null;
      return NextResponse.json({
        status: "provider_unavailable",
        registration,
        message: "DVSA did not authorise this lookup. Check that your approval and server-side credentials are active.",
      }, { status: 503 });
    }
    if (response.status === 429) {
      return NextResponse.json({
        status: "provider_unavailable",
        registration,
        message: "The DVSA service rate limit was reached. Please wait a moment before trying again.",
      }, { status: 503 });
    }
    if (!response.ok) {
      return NextResponse.json({
        status: "provider_error",
        registration,
        message: "The DVSA service could not complete this lookup. Please try again later.",
      }, { status: 502 });
    }

    const payload: unknown = await response.json();
    if (Array.isArray(payload) && payload.length === 0) {
      return NextResponse.json({
        status: "not_found",
        registration,
        message: "No MOT history was returned for this registration. Check the registration and try again.",
      }, { status: 404 });
    }
    const first = Array.isArray(payload) ? payload[0] : payload;
    const candidate = first && typeof first === "object" && "vehicle" in first
      ? (first as { vehicle?: unknown }).vehicle
      : first;

    if (!candidate || typeof candidate !== "object") {
      return NextResponse.json({
        status: "provider_error",
        registration,
        message: "The DVSA response did not contain vehicle details in the expected format.",
      }, { status: 502 });
    }

    const vehicle = candidate as DvsaVehicle;
    const tests = Array.isArray(vehicle.motTests) ? vehicle.motTests : [];
    const normalizedTests = tests.map((test) => {
      const defects = Array.isArray(test.defects) ? test.defects : Array.isArray(test.rfrAndComments) ? test.rfrAndComments : [];
      const result = (test.testResult ?? "").toUpperCase();
      return {
        date: displayDate(test.completedDate),
        completedDate: test.completedDate ?? null,
        result: result === "PASSED" || result === "PASS" ? "PASS" : result === "FAILED" || result === "FAIL" ? "FAIL" : result || "UNKNOWN",
        expiryDate: displayDate(test.expiryDate),
        mileage: textOrNull(test.odometerValue),
        mileageUnit: textOrNull(test.odometerUnit) || "mi",
        mileageResultType: textOrNull(test.odometerResultType),
        testNumber: textOrNull(test.motTestNumber),
        defects: defects.map((defect) => ({
          text: textOrNull(defect.text) || "Defect/advisory text not provided",
          type: textOrNull(defect.type) || "UNSPECIFIED",
          dangerous: defect.dangerous === true,
        })),
      };
    }).sort((a, b) => (b.completedDate || "").localeCompare(a.completedDate || ""));

    return NextResponse.json({
      status: "ok",
      registration,
      source: "DVSA MOT History API",
      fetchedAt: new Date().toISOString(),
      vehicle: {
        registration: textOrNull(vehicle.registration) || registration,
        make: textOrNull(vehicle.make),
        model: textOrNull(vehicle.model),
        firstUsedDate: displayDate(vehicle.firstUsedDate),
        manufactureDate: displayDate(vehicle.manufactureDate),
        registrationDate: displayDate(vehicle.registrationDate),
        fuelType: textOrNull(vehicle.fuelType),
        colour: textOrNull(vehicle.primaryColour),
        engineSizeCc: textOrNull(vehicle.engineSize),
      },
      motTests: normalizedTests,
      notes: [
        "This response contains MOT history and vehicle fields supplied by DVSA only.",
        "An MOT result is not a guarantee of current roadworthiness or overall vehicle condition.",
        "Finance, insurance write-off, stolen status, service history and valuation are not included in this MOT lookup.",
      ],
    }, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("credentials are not fully configured")) {
      return NextResponse.json({
        status: "not_configured",
        registration,
        message: "DVSA MOT history access is not configured yet. No live vehicle database was queried.",
      }, { status: 503 });
    }
    console.error("DVSA MOT history lookup failed", error);
    return NextResponse.json({
      status: "provider_error",
      registration,
      message: "The DVSA service could not complete this lookup. Please try again later.",
    }, { status: 502 });
  }
}
