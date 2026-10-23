# Real data, reviews and tax update

- Removed the Buyer action plan link from the site navigation/footer and removed its page.
- The Car tax calculator remains linked in the header/footer and links to official GOV.UK tax rates and tax-status lookup. Its calculator is an estimate, not an official tax calculation.
- Added `GET /api/dvla-vehicle?registration=AB12CDE`, a server-side integration with the official DVLA Vehicle Enquiry Service. It returns tax status/due date, MOT status/expiry, make, first-registration/manufacture dates, engine capacity, fuel, CO2, weight, Euro status and other fields returned by DVLA.
- To activate the DVLA endpoint, add `DVLA_VES_API_KEY` to `.env.local` using an API key issued to you by DVLA. Never put it in a `NEXT_PUBLIC_` variable. DVLA currently says new VES registrations may be closed during system upgrades; check the official portal. This ZIP does not bypass that access requirement.
- Reviews are NOT made live/persistent by this patch: the existing form correctly warns that submissions are not sent/stored. To make public reviews work, connect a persistent database (e.g. Supabase) and moderation flow, or a secure form/email service. Do not show unmoderated user-submitted text as verified.
- Finance, stolen, write-off, accident and full service-history data require an authorised provider; they cannot be supplied by DVLA/DVSA MOT APIs alone. Premium payments should remain disabled until those data sources are integrated and verified.
