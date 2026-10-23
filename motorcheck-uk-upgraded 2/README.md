# MotorCheck UK — Scorecard launch preview

A Next.js 15 project with a redesigned homepage, sample vehicle report, five-factor scorecard, traffic-light indicator, damage illustration gallery, customer pages, and a Stripe Checkout scaffold.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

Sample registrations: `DEMO001` and `DEMO002`.

## Important: development preview only
- All demo vehicle details, MOT rows, and example scores are fictional. No official vehicle checks are being performed.
- Damage images are local vector illustrations, not photos of the searched vehicle.
- The paid report needs authorised commercial data providers before launch.
- Do not enable live payments until the advertised report is delivered and tested.
- Reviews/contact/issue forms are still preview UI unless a delivery service is configured.
- Legal pages are drafts and need business details and legal review.

## Pricing and intro offer
The enhanced report is planned at a permanent £6.48 for one registration, as a one-off payment with no subscription. Checkout and verification now use the same fixed amount.

## Extended vehicle detail page
The report UI includes engine and performance details (BHP, torque, 0–60 mph, top speed), drivetrain, transmission/gears, combustion and fuel type, registration/manufacture years, tax status fields, valuation, keeper/plate-change placeholders, insurance group/write-off category, finance status, feature list, safety rating, dimensions, weights, seats, doors, boot capacity, CO₂ emissions, Euro standard, fuel-economy note, recall placeholder and added notes. Demo values are clearly illustrative and must be replaced with source-backed variant-level data before launch. Brand mark is a neutral initials placeholder, not an official manufacturer logo.

## Five-factor scorecard (planned)
1. Mileage pattern
2. MOT history
3. Service & upkeep
4. Damage & write-off history
5. Identity & finance checks

Each factor should be scored out of five only when enough relevant data is available. Unknown or disconnected data must display “Not checked”, never zero or a green pass. The overall score should include a data coverage indicator and remain provisional when important factors are missing. Publish exact scoring rules before launch; the score is a screening aid, not a safety guarantee.

## Stripe configuration
Copy `.env.example` to `.env.local` and use Stripe test keys only during development. Keep secret keys server-side. Live payments are intentionally blocked unless `ENABLE_LIVE_PAYMENTS=true` and `VEHICLE_REPORT_DATA_READY=true`. Do not set those flags until live data is integrated and independently tested.

Required environment variables are listed in `.env.example`. Apple Pay availability depends on Stripe, the verified production domain, the browser/device and payment configuration.


## Redesign update (October 2026)
- Replaced the yellow lettermark with a custom MotorCheck UK SVG brand mark and browser favicon.
- Added locally bundled Ford and Volkswagen logo artwork to the included demo reports. Other makes currently show a styled fallback until their logo assets are added.
- Restructured report content into a more vertical, single-column reading flow, including full-width stacked score factors.
- Added prominent, honest calls to explore enhanced checks and clarified the pre-launch state.
- Added page metadata and Open Graph metadata.

Important: this remains a development preview. Demo report details are fictional, and enhanced vehicle data / live payments must not be enabled until real, authorised data sources are integrated and tested.


## Current pre-launch behaviour

- `DEMO001` and `DEMO002` are fictional examples and are labelled as demo data.
- Other registrations open a live-lookup state. The server route returns an explicit not-configured response until DVSA credentials are added.
- The DVSA route is prepared for the current MOT History API (OAuth client credentials, API key header, `/v1/trade/vehicles/registration/{registration}`) and normalizes returned vehicle and MOT test records. Do not add credentials to client-side code or commit `.env.local`.
- The live scorecard intentionally does not invent a score. A published scoring methodology and verified inputs are required before scores are calculated.
- Finance, insurance write-off, stolen status, service history and valuation checks are not supplied by the MOT History API and require separate authorised sources.
- The one-off report price is £6.48. Stripe checkout is blocked by default until report data and delivery are ready. To test Stripe in test mode only, set `ENABLE_TEST_CHECKOUT=true` while using an `sk_test_...` key. Never enable live payments until `VEHICLE_REPORT_DATA_READY=true` and the live-payment guard has been reviewed.
- Payment verification uses the Stripe Checkout Session and an HTTP-only access cookie. This project does not yet have a durable order database or automated report-delivery workflow; those remain launch requirements.

### Configure DVSA after approval

Copy `.env.example` to `.env.local` and fill in the exact values supplied by DVSA:

- `DVSA_API_KEY`
- `DVSA_CLIENT_ID`
- `DVSA_CLIENT_SECRET`
- `DVSA_TOKEN_URL`
- `DVSA_SCOPE`

Keep all values private in `.env.local`. Restart the development server after changing environment variables. Do not paste keys or secrets into chat or source files.


## Manufacturer logos and MOT quick filters
- Uses the `simple-icons` package to render real, recognisable manufacturer brand marks locally at build/runtime (no third-party image-host requests). The logos remain trademarks of their respective owners; availability in the icon library does not imply endorsement.
- Includes aliases for a broad set of makes, including Audi, BMW, Mercedes-Benz, Ford, Vauxhall/Opel, Toyota, Nissan, Honda, Hyundai, Kia, Peugeot, Renault, Citroën, Škoda, SEAT, CUPRA, Fiat, Volvo, Tesla, Porsche, Jaguar, Land Rover, Mazda, Suzuki, Subaru, Mitsubishi, Lexus, Dacia, MG, Polestar, Alfa Romeo, Ferrari and others. Some makes may not have an icon in the installed library and will use the fallback.
- MOT timeline filters can quickly show all tests, passes, failures or tests with defects/advisories. Search and quick filters work together, and the visible result count updates.
- Install the added dependency with `npm install` after extracting this update.

## Staff portal setup
The internal workspace is available at `/staff`. Configure `STAFF_PORTAL_PASSWORD` and a unique, random `STAFF_SESSION_SECRET` (32+ characters) in `.env.local`, then restart the server. Never commit `.env.local`. The initial portal includes a password-gated session and a browser-local task list. Enquiries, vehicle lookup analytics, team contacts, jobs/incidents and shared multi-user tasks are intentionally labelled as not connected; these require a shared database, role permissions and audit logging before storing real customer/staff records.

## Shared staff portal database setup

The staff portal now supports centrally stored tasks, enquiries, team contacts and jobs/incidents through a server-only API. These records are shared by users of the same deployed instance and Supabase project. Vehicle lookup analytics are not implemented yet. The directory's role field is descriptive only; it does not yet authorize different permissions. Staff sign-in is still a shared password and must be replaced with individual accounts before production use.

1. Create a Supabase project at https://supabase.com/.
2. Open SQL Editor and run the complete file `supabase/staff-portal-schema.sql` from this project.
3. In Supabase Project Settings → API, copy the Project URL and `service_role` key into your local `.env.local` as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never use a `NEXT_PUBLIC_` variable for the service role key and never commit it.
4. Keep the existing `STAFF_PORTAL_PASSWORD` and `STAFF_SESSION_SECRET` values configured, restart Next.js, then sign in at `/staff`.
5. Test task creation, status changes, deletion and enquiries/contacts/jobs from two browser sessions to confirm records are shared.

Security note: the server API checks the current staff session and keeps the Supabase service-role key on the server. Because the current staff login is still a single shared password, do not expose the portal publicly or treat the directory role labels as access control. Before production, migrate to individual Supabase Auth users, enforce role-based authorization, add audit logging/rate limiting, and connect the public contact form to the enquiries table. Existing `.env.local` values are not included in the ZIP.
