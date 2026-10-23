 "use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const factors = [
  { n: "01", title: "Mileage pattern", desc: "Look for consistent recorded mileage and unusual gaps." },
  { n: "02", title: "MOT history", desc: "Understand passes, failures, advisories and recurring issues." },
  { n: "03", title: "Service & upkeep", desc: "Review service evidence when records are available." },
  { n: "04", title: "Damage & write-off", desc: "See available damage and insurance write-off records." },
  { n: "05", title: "Identity & finance", desc: "Check registration details and relevant history sources." },
];

export default function Home() {
  const [reg, setReg] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  function submit(e: FormEvent) {
    e.preventDefault();
    const plate = reg.toUpperCase().replace(/[\s-]/g, "");
    if (!plate) { setMessage("Enter a registration to continue."); return; }
    if (plate.length < 2 || plate.length > 8 || !/^[A-Z0-9]+$/.test(plate)) {
      setMessage("Enter a registration using 2–8 letters and numbers, without symbols.");
      return;
    }
    router.push(`/report/${encodeURIComponent(plate)}`);
  }
  return <main className="mc-home">
    <section className="mc-hero">
      <div className="container mc-hero-grid">
        <div className="mc-hero-copy">
          <div className="mc-kicker"><span className="mc-kicker-dot" /> UK vehicle history reports</div>
          <h1>Look beyond the paintwork<span>.</span></h1>
          <p className="mc-hero-lead">A clearer picture before you buy. Start with vehicle details and MOT history, then use enhanced history checks to investigate the risks a test drive cannot reveal.</p>
          <form id="check" className="mc-search" onSubmit={submit}>
            <label htmlFor="registration">Start with a registration</label>
            <div className="mc-plate">
              <div className="mc-plate-country"><span>UK</span><small>GB</small></div>
              <input id="registration" value={reg} onChange={e => setReg(e.target.value.toUpperCase())} placeholder="NE14ABJ" autoComplete="off" spellCheck={false} />
              <button type="submit">Check vehicle <span aria-hidden="true">↗</span></button>
            </div>
            <div className="mc-search-bottom"><span>Try a sample report:</span><button type="button" onClick={() => setReg("DEMO001")}>DEMO001</button><button type="button" onClick={() => setReg("DEMO002")}>DEMO002</button></div>
            {message && <div className="notice" role="status">{message}</div>}
          </form>
          <div className="mc-trust"><span><b>✓</b> One-off pricing planned</span><span><b>✓</b> Clear, readable reports</span><span><b>✓</b> Missing checks shown honestly</span></div>
          <a className="mc-hero-paid-link" href="#enhanced-checks"><span className="mc-hero-paid-lock">⌑</span><span><strong>Want the checks that matter most?</strong><small>Explore enhanced history checks for finance, write-offs and more</small></span><b aria-hidden="true">↓</b></a>
        </div>
        <aside className="mc-hero-report">
          <div className="mc-report-top"><div><span className="mc-small-label">REPORT PREVIEW</span><h2>At a glance</h2></div><span className="mc-demo-chip">DEMO</span></div>
          <div className="mc-score-preview">
            <div className="mc-score-ring"><div><strong>4.2</strong><span>/ 5</span></div></div>
            <div><span className="mc-traffic mc-traffic-amber"></span><strong>Promising, with checks outstanding</strong><p>Illustrative score only — sample data, not a live vehicle assessment.</p></div>
          </div>
          <div className="mc-mini-factors">
            <div><span>Mileage pattern</span><strong>4.5 <small>/ 5</small></strong><i><em style={{width:"90%"}} /></i></div>
            <div><span>MOT history</span><strong>4.0 <small>/ 5</small></strong><i><em style={{width:"80%"}} /></i></div>
            <div><span>Damage history</span><strong className="mc-unchecked">Locked</strong><i><em style={{width:"20%"}} /></i></div>
          </div>
          <div className="mc-preview-note"><span aria-hidden="true">ⓘ</span> Scores are only as reliable as the records available. Missing information is never treated as a clean result.</div>
        </aside>
      </div>
      <div className="mc-hero-gridline" />
    </section>

    <section className="mc-proof-strip"><div className="container mc-proof-inner"><div><strong>01</strong><span>Vehicle identity</span></div><div><strong>02</strong><span>MOT & mileage</span></div><div><strong>03</strong><span>Five-factor score</span></div><div><strong>04</strong><span>Enhanced history</span></div></div></section>

    <section className="section mc-section"><div className="container">
      <div className="mc-section-heading"><div><p className="eyebrow">A score with context</p><h2>Five factors. One clearer picture.</h2></div><p>We organise the available evidence into five understandable areas. If a check hasn't been completed, we'll say so — not guess.</p></div>
      <div className="mc-factor-grid">{factors.map(f => <article className="mc-factor-card" key={f.n}><span className="mc-factor-number">{f.n}</span><h3>{f.title}</h3><p>{f.desc}</p><span className="mc-factor-link">Included in report <span>↗</span></span></article>)}</div>
      <p className="mc-method-note"><b>How scoring works:</b> Each factor is scored from 1–5 only when enough relevant data is available. The overall score uses assessed factors only and displays a data-coverage indicator. It is a screening aid, not a guarantee of safety, condition or future reliability.</p>
    </div></section>

    <section className="mc-enhanced-section" id="enhanced-checks"><div className="container mc-enhanced-grid"><div><p className="eyebrow">Enhanced history · one vehicle</p><h2>Some things need a closer look.</h2><p>Go beyond the basics. Enhanced checks are designed to help you investigate outstanding finance, insurance write-offs, stolen status and registration changes — where licensed, authorised records are available.</p><div className="mc-price-row"><strong>£6.48</strong><span>one-off · per registration · no subscription</span></div><p className="mc-price-explainer">One straightforward price. No introductory offer and no recurring subscription.</p><a href="#check" className="button button-yellow">Preview a vehicle report <span>↗</span></a><div className="mc-prelaunch-callout"><strong>Early-access preview</strong><span>Enhanced checks and checkout are being prepared. Payments are disabled until real, authorised data sources are connected.</span></div></div>
      <div className="mc-damage-preview mc-copart-preview"><div className="mc-damage-head"><div><span className="mc-small-label">REAL SALVAGE VEHICLE PHOTOS</span><h3>See actual damaged cars</h3></div><span className="mc-copart-tag">COPART UK</span></div><p>Browse genuine vehicle photographs and reported damage from Copart UK’s salvage listings. These are real listing photos, not AI-generated examples.</p><a className="mc-copart-link" href="https://www.copart.co.uk/vehicle-search-featured/" target="_blank" rel="noreferrer">View real damaged vehicles on Copart UK <span aria-hidden="true">↗</span></a><p className="mc-image-disclaimer">Copart vehicle photos are not embedded here because Copart requires use of its image/data licensing process for website reuse. We can add an actual listing photo once the appropriate permission or licensed image feed is available.</p></div>
    </div></section>

    <section className="section section-white"><div className="container mc-how-grid"><div><p className="eyebrow">Simple by design</p><h2>From number plate to informed questions.</h2><p className="mc-body-copy">MotorCheck UK helps you understand the available information before you commit. Always inspect the car and verify important facts with official sources.</p></div><div className="mc-steps"><div><span>01</span><div><h3>Enter a registration</h3><p>Open the vehicle report and review identity details.</p></div></div><div><span>02</span><div><h3>Review the five factors</h3><p>See what looks consistent, what needs attention and what hasn't been checked.</p></div></div><div><span>03</span><div><h3>Unlock enhanced history</h3><p>Pay once per vehicle for available enhanced checks when live data is ready.</p></div></div></div></div></section>

    <section className="section mc-tools-section"><div className="container"><div className="mc-section-heading"><div><p className="eyebrow">Useful tools & support</p><h2>More help, all in one place.</h2></div><p>Useful tools for buyers and straightforward ways to contact the team.</p></div><div className="mc-tools-grid"><a href="/tax-calculator"><span>£</span><h3>Car tax calculator</h3><p>Estimate a vehicle's tax using the details you have.</p><b>Open calculator ↗</b></a><a href="/reviews"><span>☆</span><h3>Customer reviews</h3><p>Read genuine feedback as the service launches.</p><b>Read reviews ↗</b></a><a href="/report-issue"><span>!</span><h3>Report an issue</h3><p>Tell us if a page or report doesn't look right.</p><b>Get help ↗</b></a><a href="/contact"><span>↗</span><h3>Contact us</h3><p>Questions about reports, data or payments.</p><b>Contact the team ↗</b></a></div></div></section>


    <section className="section section-white mc-faq-section" id="faqs">
      <div className="container">
        <div className="mc-section-heading"><div><p className="eyebrow">Straight answers</p><h2>Frequently asked questions.</h2></div><p>Clear information about what MotorCheck UK can show and what still needs an official or specialist check.</p></div>
        <div className="mc-faq-list">
          <details><summary>Does an MOT pass mean a car is in good condition?</summary><p>No. An MOT is a test of specific legal safety and environmental standards at the time of the test. It is not a full mechanical inspection and does not guarantee a vehicle's current condition.</p></details>
          <details><summary>What information will a MotorCheck UK report include?</summary><p>Available vehicle and MOT details will be shown when an authorised data source returns them. Finance, insurance write-off, stolen status, service history and valuation checks require separate suitable sources and will be marked unavailable until connected.</p></details>
          <details><summary>Are the sample reports real?</summary><p>No. DEMO001 and DEMO002 are fictional development examples. They are clearly labelled and must not be used to make a vehicle purchase decision.</p></details>
          <details><summary>Why might a report have missing information?</summary><p>Data sources cover different fields and time periods. A missing result does not mean a vehicle has a clean history; it means that particular check has not returned verified information.</p></details>
          <details><summary>Is the £6.48 payment a subscription?</summary><p>No. The planned price is £6.48 for one report for one registration, as a single payment. Live payments will remain disabled until the advertised report data and delivery process are ready.</p></details>
        </div>
      </div>
    </section>\n  </main>;
}
