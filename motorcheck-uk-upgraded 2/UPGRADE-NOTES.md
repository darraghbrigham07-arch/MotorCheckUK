# MotorCheck UK upgrade notes

This package preserves the existing navy/cyan redesign and sample report pages while adding:

- Registration searches now open a live lookup page for non-demo registrations instead of stopping on the homepage.
- The vehicle API route is prepared for the current DVSA MOT History API, including server-side OAuth token retrieval/caching, API-key header, normalized MOT records, mileage, test outcomes and defect/advisory entries.
- The report page displays returned DVSA data and an MOT timeline/mileage chart when the API is configured. It does not invent a score; live scoring remains unassessed until a published methodology is implemented.
- Clear status handling for missing credentials, missing history and provider errors.
- Homepage FAQs and responsive styles for the new live-report screens.
- Pricing is consistently set to a one-off £6.48.
- Stripe checkout is blocked by default until data/report delivery are ready. Explicit test checkout requires an `sk_test_...` key and `ENABLE_TEST_CHECKOUT=true`.

- Finance, crash damage/write-off, and identity checks are presented as locked premium cards; the report does not display underlying results in the free preview. Each card links to the enhanced checkout section.
- Displayed checkout price and Stripe amount/verification are aligned at £6.48 (648 pence).

## Before running

1. Extract this ZIP to a new folder or make a backup before replacing files.
2. Run `npm install`, then `npm run dev`.
3. Try `DEMO001` and `DEMO002` to preview fictional sample reports.
4. Try another registration to see the live lookup state. Until DVSA approval and credentials are configured, the route deliberately reports that live access is not configured.
5. Once DVSA approves access, copy `.env.example` to `.env.local` and use the exact `DVSA_TOKEN_URL` and `DVSA_SCOPE` supplied with your credentials. Keep secrets server-side.
6. Do not enable live payments until real data coverage, legal terms, customer support, and reliable report delivery are ready.

## Not yet launch-ready

The MOT API only provides the vehicle/MOT fields returned by DVSA. It does not itself provide outstanding finance, insurance write-off, stolen status, service history or market valuation. These require separate authorised data sources. The current checkout verifies Stripe sessions and issues a browser access cookie, but it does not yet have a durable order database or automated report delivery. A full `next build` was not run in this environment because npm dependencies could not be installed from the package registry; TypeScript/TSX syntax transpilation passed.


## Recommended next features (once core data and fulfilment are ready)

1. A buyer action plan generated from actual MOT advisories and failures, with clear source/date labels.
2. A printable/downloadable PDF report and an email receipt/report link after verified payment.
3. A side-by-side comparison of two vehicles using only fields available for both.
4. A VIN and V5C matching checklist to help users inspect the vehicle in person.
5. MOT expiry reminders and a saved-report area, with clear consent and privacy controls.
6. Running-cost estimates (tax, fuel, insurance-group information) only where sourced inputs and assumptions are shown.
7. A clear report coverage indicator: checked, unavailable, not included, and not yet connected must be distinct states.

The premium cards are currently a preview UI. Do not enable payments until each advertised paid check has a real authorised provider, the verified results are actually revealed after payment, and report delivery/support/refunds have been tested.

## Brand and feature suite update

- Replaced the header/footer's old SVG mark with the supplied MotorCheck UK shield logo at `public/motorcheck-shield.jpg`; full supplied artwork is included at `public/motorcheck-logo-full.jpg`.
- Added `/buyer-checklist`: interactive checklist, progress, print/save-to-PDF.
- Added `/compare`: manual side-by-side comparison; values are user-entered and not verified.
- Added `/buyer-action-plan`: general evidence-led questions and next steps based on a selected concern.
- Added `/mot-reminders`: downloads a local calendar event using a user-entered MOT expiry date; it does not send server/email/push reminders.
- Added a print/save button to report pages.
- Added navigation links and print-responsive styling for the new pages.
- These tools are guidance features, not substitutes for official checks, professional inspection or connected data providers.

## Vehicle lookup experience update
- Registration lookups now show a searching state while the configured source is queried.
- Once a response contains vehicle details, the user must confirm make, model, colour and door count before the report opens.
- If details are wrong, users can submit a corrected registration or inspect the VIN option. VIN lookups are clearly marked as unavailable until a compatible authorised provider is connected; no false VIN search is claimed.
- Mileage history uses a line chart with years on the horizontal axis and recorded miles on the vertical axis. The graph only plots returned/demo readings and demo reports remain labelled fictional.
- Live DVSA MOT records do not always include a door count, so unavailable fields are explicitly labelled rather than guessed.
