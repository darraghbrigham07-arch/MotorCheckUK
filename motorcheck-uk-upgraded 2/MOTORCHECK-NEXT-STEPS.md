# MotorCheck UK: API and launch readiness

## What this update changes
- The live MOT report plots numeric readings in chronological order against the actual MOT test dates.
- It shows the total recorded mileage change and a simple average per year across the available readings.
- It flags decreases between adjacent numeric MOT readings for review. A decrease is a prompt to investigate, not proof of odometer tampering.
- The live report continues to show the returned MOT timeline, pass/fail result, expiry date, and defect/advisory text.
- Live payments now require both `VEHICLE_REPORT_DATA_READY=true` and `PREMIUM_REPORT_PROVIDER_READY=true`, as well as `ENABLE_LIVE_PAYMENTS=true` and a Stripe live secret key. Keep all of these false until the advertised paid checks are genuinely delivered.
- The checkout API verifies Stripe payment status, currency, amount, registration and product metadata server-side before creating the access cookie.

## DVSA setup
Keep the existing `.env.local` file in the project root and preserve the working DVSA credentials already configured there. Do not copy `.env.example` over `.env.local`. Never commit `.env.local` or expose its values in client-side code.

## Still required before taking real customer payments
The DVSA MOT History API does not provide finance, insurance write-off, stolen-vehicle, accident-damage, service-history or valuation checks. Choose and contract with authorised providers for the premium checks you intend to sell, integrate their APIs server-side, test positive/negative/no-record/error cases, and only then evaluate the two readiness flags and live-payment switch. Do not turn the flags on merely to bypass the guard.

## Local verification
From the project directory:
1. `npm run dev` for local testing.
2. `npm run lint`
3. `npx tsc --noEmit`
4. `npm run build`

Use a registration for which you are authorised to view the returned MOT history. Confirm that the graph uses the returned readings, the report states the source and retrieval time, and failed lookups never silently display demo data as real.
