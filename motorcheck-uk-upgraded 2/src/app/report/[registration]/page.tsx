 "use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import * as SimpleIcons from "simple-icons";

type Test = { date: string; result: string; miles: string; note: string };
type DemoReport = { plate: string; make: string; model: string; year: number; registrationYear: number; firstRegistered: string; colour: string; fuel: string; combustion: string; engine: string; engineType: string; bhp: string; torque: string; zeroToSixty: string; topSpeed: string; transmission: string; gears: string; drivetrain: string; mileage: number; motExpiry: string; taxStatus: string; taxDue: string; taxAnnual: string; insuranceGroup: string; writeOffCategory: string; valuation: string; owners: string; plateChanges: string; safetyRating: string; length: string; width: string; height: string; wheelbase: string; kerbWeight: string; grossWeight: string; cylinders: string; seats: string; doors: string; bootCapacity: string; co2: string; euroStatus: string; fuelEconomy: string; safetyRecall: string; features: string[]; addedInfo: string[]; tests: Test[]; scores: { mileage: number; mot: number; service: number; damage: number; identity: number } };
const reports: Record<string, DemoReport> = {
  DEMO001: { plate:"DEMO 001",make:"Ford",model:"Fiesta ST-Line",year:2018,registrationYear:2018,firstRegistered:"June 2018 (example)",colour:"Blue",fuel:"Petrol",combustion:"Internal combustion (petrol)",engine:"1.0L EcoBoost",engineType:"Turbocharged inline-3",bhp:"100 bhp (illustrative)",torque:"170 Nm (illustrative)",zeroToSixty:"10.5 sec (illustrative)",topSpeed:"112 mph (illustrative)",transmission:"Manual",gears:"5-speed",drivetrain:"FWD · Front-wheel drive",mileage:68420,motExpiry:"Not verified",taxStatus:"Not connected",taxDue:"Not connected",taxAnnual:"Check current DVLA rate",insuranceGroup:"Not verified",writeOffCategory:"Not checked",valuation:"£6,000–£7,200 (illustrative only)",owners:"Not available in demo",plateChanges:"Not checked",safetyRating:"Euro NCAP rating not verified",length:"4,040 mm (illustrative)",width:"1,735 mm (illustrative)",height:"1,476 mm (illustrative)",wheelbase:"2,493 mm (illustrative)",cylinders:"3",seats:"5",doors:"3",bootCapacity:"292 litres (illustrative)",co2:"99 g/km (illustrative)",euroStatus:"Euro 6 (illustrative)",fuelEconomy:"Varies by test cycle and driving",safetyRecall:"Not checked",kerbWeight:"1,165 kg (illustrative)",grossWeight:"1,575 kg (illustrative)",features:["ST-Line styling (illustrative)","Air conditioning — verify trim","Bluetooth / smartphone connectivity — verify trim","Parking sensors — verify trim","Cruise control — verify trim"],addedInfo:["Sample data only; not linked to DVLA or DVSA.","Performance and dimensions can vary by engine, trim and model year.","Vehicle-specific valuation requires a suitable live valuation source."],tests:[
    {date:"18 June 2026",result:"PASS",miles:"68,420",note:"Example record — not an official MOT result"},
    {date:"12 June 2025",result:"PASS",miles:"61,105",note:"Example record — not an official MOT result"},
    {date:"7 June 2024",result:"PASS",miles:"53,870",note:"Example record — not an official MOT result"},
    {date:"2 June 2023",result:"PASS",miles:"46,220",note:"Example record — not an official MOT result"}],scores:{mileage:4.5,mot:4.2,service:3.2,damage:0,identity:0}},
  DEMO002: { plate:"DEMO 002",make:"Volkswagen",model:"Golf",year:2020,registrationYear:2020,firstRegistered:"March 2020 (example)",colour:"Grey",fuel:"Petrol",combustion:"Internal combustion (petrol)",engine:"1.5L TSI",engineType:"Turbocharged inline-4",bhp:"150 bhp (illustrative)",torque:"250 Nm (illustrative)",zeroToSixty:"8.5 sec (illustrative)",topSpeed:"134 mph (illustrative)",transmission:"Manual",gears:"6-speed",drivetrain:"FWD · Front-wheel drive",mileage:42100,motExpiry:"Not verified",taxStatus:"Not connected",taxDue:"Not connected",taxAnnual:"Check current DVLA rate",insuranceGroup:"Not verified",writeOffCategory:"Not checked",valuation:"£12,000–£14,000 (illustrative only)",owners:"Not available in demo",plateChanges:"Not checked",safetyRating:"Euro NCAP rating not verified",length:"4,284 mm (illustrative)",width:"1,789 mm (illustrative)",height:"1,456 mm (illustrative)",wheelbase:"2,619 mm (illustrative)",cylinders:"4",seats:"5",doors:"5",bootCapacity:"380 litres (illustrative)",co2:"118 g/km (illustrative)",euroStatus:"Euro 6 (illustrative)",fuelEconomy:"Varies by test cycle and driving",safetyRecall:"Not checked",kerbWeight:"1,300 kg (illustrative)",grossWeight:"1,800 kg (illustrative)",features:["Adaptive cruise control — verify trim","Air conditioning — verify trim","Bluetooth / smartphone connectivity — verify trim","Lane assist — verify trim","Parking sensors — verify trim"],addedInfo:["Sample data only; not linked to DVLA or DVSA.","Performance and dimensions can vary by engine, trim and model year.","Vehicle-specific valuation requires a suitable live valuation source."],tests:[
    {date:"10 March 2026",result:"PASS",miles:"42,100",note:"Example record — not an official MOT result"},
    {date:"5 March 2025",result:"PASS",miles:"34,900",note:"Example record — not an official MOT result"},
    {date:"1 March 2024",result:"PASS",miles:"27,500",note:"Example record — not an official MOT result"}],scores:{mileage:4.6,mot:4.0,service:3.0,damage:0,identity:0}}
};
const factors = [
  {key:"mileage",label:"Mileage pattern",desc:"How consistent the recorded mileage appears"},
  {key:"mot",label:"MOT history",desc:"Passes, failures, advisories and recurring issues"},
  {key:"service",label:"Service & upkeep",desc:"Service records and maintenance evidence"},
  {key:"damage",label:"Damage & write-off",desc:"Available accident and insurance write-off records"},
  {key:"identity",label:"Identity & finance",desc:"Registration details and available history checks"},
] as const;

function Plate({value}:{value:string}) { return <div className="mc-plate mc-report-plate"><div className="mc-plate-country"><span>UK</span><small>GB</small></div><strong>{value}</strong></div>; }
type SimpleBrandIcon = { title: string; hex: string; path: string };
const brandIconExports: Record<string, string> = {
  "audi":"siAudi", "bmw":"siBmw", "mini":"siMini", "mini cooper":"siMini", "mercedes":"siMercedesbenz", "mercedes-benz":"siMercedesbenz", "mercedes benz":"siMercedesbenz",
  "volkswagen":"siVolkswagen", "vw":"siVolkswagen", "ford":"siFord", "vauxhall":"siVauxhall", "vauxhall motors":"siVauxhall", "opel":"siOpel", "toyota":"siToyota", "nissan":"siNissan",
  "honda":"siHonda", "hyundai":"siHyundai", "kia":"siKia", "peugeot":"siPeugeot", "renault":"siRenault", "citroen":"siCitroen", "citroën":"siCitroen",
  "skoda":"siSkoda", "škoda":"siSkoda", "škoda auto":"siSkoda", "seat":"siSeat", "cupra":"siCupra", "fiat":"siFiat", "abarth":"siAbarth", "volvo":"siVolvo", "tesla":"siTesla",
  "porsche":"siPorsche", "jaguar":"siJaguar", "land rover":"siLandrover", "land-rover":"siLandrover", "landrover":"siLandrover", "range rover":"siLandrover", "range-rover":"siLandrover", "mazda":"siMazda",
  "suzuki":"siSuzuki", "subaru":"siSubaru", "mitsubishi":"siMitsubishi", "lexus":"siLexus", "infiniti":"siInfiniti", "dacia":"siDacia", "mg":"siMg", "mg motor":"siMg", "mg motor uk":"siMg",
  "polestar":"siPolestar", "smart":"siSmart", "alfa romeo":"siAlfaromeo", "alfa-romeo":"siAlfaromeo", "maserati":"siMaserati", "lamborghini":"siLamborghini",
  "ferrari":"siFerrari", "bentley":"siBentley", "rolls-royce":"siRollsroyce", "rolls royce":"siRollsroyce", "aston martin":"siAstonmartin", "aston-martin":"siAstonmartin",
  "chevrolet":"siChevrolet", "jeep":"siJeep", "chrysler":"siChrysler", "dodge":"siDodge", "ram":"siRam", "buick":"siBuick", "cadillac":"siCadillac",
  "genesis":"siGenesis", "byd":"siByd", "ora":"siOra", "great wall":"siGreatwall", "xpeng":"siXpeng", "nio":"siNio"
};
function BrandMark({make}:{make:string}) {
  const normalized = make.trim().toLocaleLowerCase("en-GB").replace(/[®™]/g, "").replace(/\s+/g, " ").replace(/\.$/, "");
  const exportName = brandIconExports[normalized];
  const icon = exportName ? (SimpleIcons as unknown as Record<string, SimpleBrandIcon | undefined>)[exportName] : undefined;
  const localAssets: Record<string,string> = { ford: "/brands/ford.svg", volkswagen: "/brands/volkswagen.svg" };
  const asset = localAssets[normalized];
  return <div className="mc-brand-mark" aria-label={`${make} logo`} title={`${make} logo`}>
    {icon ? <svg className="mc-brand-svg" role="img" aria-label={`${make} logo`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill={`#${icon.hex}`} d={icon.path}/></svg> : asset ? <img src={asset} alt={`${make} logo`} /> : <><span className="mc-brand-generic-icon" aria-hidden="true">{make.slice(0,1).toUpperCase()}</span><small>{make}</small></>}
  </div>;
}
function DetailGrid({items}:{items:{label:string;value:string}[]}) { return <div className="mc-detail-grid">{items.map(item=><div className="mc-detail-cell" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>; }
function Traffic({score, unknown=false}:{score:number;unknown?:boolean}) {
  if (unknown) return <span className="mc-status mc-status-grey"><i/>Not enough data</span>;
  if (score >= 4) return <span className="mc-status mc-status-green"><i/>Looks positive</span>;
  if (score >= 2.5) return <span className="mc-status mc-status-amber"><i/>Review carefully</span>;
  return <span className="mc-status mc-status-red"><i/>Needs attention</span>;
}
function ScoreBar({value}:{value:number|null}) { return <div className="mc-score-bar"><span><i style={{width:value===null?"0%":`${value*20}%`,background:value===null?"#dfe4e8":value>=4?"#1f9a69":value>=2.5?"#e5a126":"#d94b4b"}}/></span></div>; }

function EnhancedCheckout({registration}:{registration:string}) {
  const [paid,setPaid] = useState(false);
  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");
  useEffect(() => {
    let active=true;
    const params=new URLSearchParams(window.location.search);
    const sessionId=params.get("session_id"), paymentState=params.get("payment");
    if(paymentState==="cancelled") setMessage("No payment was taken. You can try again whenever you're ready.");
    async function checkAccess() {
      if(sessionId && paymentState==="success") {
        setLoading(true);
        try {
          const response=await fetch("/api/checkout/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({registration,sessionId})});
          const result=await response.json();
          if(!response.ok) throw new Error(result.error||"Payment verification failed.");
          if(active){setPaid(true);setMessage("Payment confirmed. This report is unlocked for this browser.");}
          window.history.replaceState({},"",`/report/${encodeURIComponent(registration)}`);
        } catch(error) { if(active) setMessage(error instanceof Error?error.message:"Could not verify payment."); }
        finally { if(active) setLoading(false); }
      } else {
        try { const response=await fetch(`/api/checkout/access?registration=${encodeURIComponent(registration)}`); const result=await response.json(); if(active&&result.paid)setPaid(true); } catch {}
      }
    }
    checkAccess();
    return ()=>{active=false;};
  },[registration]);
  async function beginCheckout() {
    setLoading(true);setMessage("");
    try {
      const response=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({registration})});
      const result=await response.json();
      if(!response.ok) throw new Error(result.error||"Could not start checkout.");
      if(typeof result.url!=="string"||!result.url.startsWith("https://checkout.stripe.com/")) throw new Error("The secure checkout link was not valid.");
      window.location.assign(result.url);
    } catch(error) {setMessage(error instanceof Error?error.message:"Something went wrong. Please try again.");setLoading(false);}
  }
  return <section className="mc-checkout" id="enhanced-checkout">
    <div className="mc-checkout-top"><span className="mc-small-label">ENHANCED REPORT</span><span className="mc-lock-pill">🔒 One vehicle only</span><h2>Unlock the full vehicle check.</h2><p>Get access to finance, crash damage and write-off history, plus identity and registration checks — only where authorised records are available.</p>
      <div className="mc-price-display"><strong>£6.48</strong><span>one-off payment</span></div>
    </div>
    <div className="mc-checkout-body">
      <div className="mc-unlock-list">{["Crash damage & insurance write-off records","Vehicle identity and registration history","Outstanding finance, where supported","Stolen / import-export markers, where supported","Enhanced report summary and buyer guidance"].map(t=><div key={t}><span className="mc-padlock">⌑</span><span>{t}</span><b>🔒</b></div>)}</div>
      <div className="mc-data-warning"><strong>Pre-launch notice</strong><p>These commercial checks are not connected yet. Real payments must stay disabled until authorised data sources are connected and the report can deliver what is advertised.</p></div>
      {paid?<div className="mc-paid-state"><strong>Payment verified for {registration}</strong><p>This purchase applies to this registration only. Live provider data still needs to be connected.</p></div>:<button className="mc-pay-button" type="button" disabled={loading} onClick={beginCheckout}>{loading?"Connecting securely…":"Unlock a full check · £6.48"} <span>↗</span></button>}
      <p className="mc-payment-methods">🔒 Secure Stripe Checkout · Card · Apple Pay where available</p>
      {message&&<p role="status" className="mc-inline-message">{message}</p>}
      <p className="mc-checkout-fineprint">One-time payment for one registration only. A different vehicle requires another purchase. The price is £6.48 per registration, paid once. Live payments remain disabled until authorised data and report delivery are ready.</p>
    </div>
  </section>;
}



function PremiumChecksSection({registration}:{registration:string}) {
  const checks = [
    {number:"01",title:"Outstanding finance",subtitle:"Finance & lender interest",description:"See whether a finance interest is recorded, with agreement details only where the authorised source provides them."},
    {number:"02",title:"Crash damage & write-off",subtitle:"Damage & insurance history",description:"Review recorded insurance write-off categories and damage-related records where available. This is not a physical inspection."},
    {number:"03",title:"Vehicle identity",subtitle:"Identity, theft & registration",description:"Check available stolen markers, registration changes, import/export flags and identity matches from authorised sources."},
  ];
  return <>
    <section className="mc-report-section mc-premium-section" aria-labelledby="mc-premium-checks-title">
      <div className="mc-section-heading"><div><p className="eyebrow">PREMIUM HISTORY CHECKS</p><h2 id="mc-premium-checks-title">The important checks, kept private.</h2></div><p>The sections below show what a full check covers. Results stay hidden in the preview and are only displayed after a verified purchase when the relevant authorised data source is available.</p></div>
      <div className="mc-premium-grid">{checks.map(check=><article className="mc-premium-card" key={check.number}>
        <div className="mc-premium-card-top"><span className="mc-premium-number">{check.number}</span><span className="mc-lock-pill">🔒 LOCKED</span></div>
        <p className="mc-small-label">{check.subtitle}</p><h3>{check.title}</h3><p className="mc-premium-description">{check.description}</p>
        <div className="mc-premium-hidden"><span>Report result</span><strong><span aria-hidden="true">••••••••</span> <em>Hidden</em></strong></div>
        <a className="button button-yellow mc-premium-card-cta" href="#enhanced-checkout">Unlock a full check · £6.48 <span aria-hidden="true">↗</span></a>
        <small className="mc-premium-card-note">A hidden or unavailable result does not mean the vehicle is clear.</small>
      </article>)}</div>
    </section>
    <EnhancedCheckout registration={registration}/>
  </>;
}

type LiveDefect = { text: string; type: string; dangerous: boolean };
type LiveMotTest = {
  date: string | null;
  completedDate: string | null;
  result: string;
  expiryDate: string | null;
  mileage: string | null;
  mileageUnit: string;
  mileageResultType: string | null;
  testNumber: string | null;
  defects: LiveDefect[];
};
type LiveVehicleData = {
  registration: string;
  make: string | null;
  model: string | null;
  firstUsedDate: string | null;
  manufactureDate: string | null;
  registrationDate: string | null;
  fuelType: string | null;
  colour: string | null;
  engineSizeCc: string | null;
};
type VehicleLookupResponse = {
  status: string;
  registration?: string;
  message?: string;
  error?: string;
  source?: string;
  fetchedAt?: string;
  vehicle?: LiveVehicleData;
  motTests?: LiveMotTest[];
  notes?: string[];
};

function MileageLineChart({ records }: { records: { label: string; miles: number }[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sorted = [...records]
    .filter((record) => Number.isFinite(record.miles) && record.miles >= 0)
    .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());
  if (!sorted.length) return <p className="mc-live-empty">No numeric mileage readings were returned for the chart.</p>;

  const width = 680, height = 290, left = 76, right = 22, top = 24, bottom = 52;
  const values = sorted.map((record) => record.miles);
  const min = Math.max(0, Math.floor(Math.min(...values) / 5000) * 5000 - 5000);
  const max = Math.max(min + 5000, Math.ceil(Math.max(...values) / 5000) * 5000);
  const timestamps = sorted.map((record) => {
    const time = new Date(record.label).getTime();
    return Number.isFinite(time) ? time : 0;
  });
  const minTime = Math.min(...timestamps), maxTime = Math.max(...timestamps);
  const x = (index: number) => left + (maxTime === minTime ? (width - left - right) / 2 : ((timestamps[index] - minTime) / (maxTime - minTime)) * (width - left - right));
  const y = (value: number) => top + ((max - value) / (max - min)) * (height - top - bottom);
  const path = sorted.map((record, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(record.miles)}`).join(" ");
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => min + (max - min) * fraction);
  const totalChange = sorted[sorted.length - 1].miles - sorted[0].miles;
  const firstDate = new Date(sorted[0].label), lastDate = new Date(sorted[sorted.length - 1].label);
  const yearsElapsed = (lastDate.getTime() - firstDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const averagePerYear = yearsElapsed > 0 ? totalChange / yearsElapsed : null;

  return <div className="mc-mileage-line-chart">
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label="MOT mileage history line chart, showing recorded miles against test date">
      {ticks.map((value, index) => <g key={index}>
        <line x1={left} y1={y(value)} x2={width - right} y2={y(value)} stroke="#e5eaf0" strokeDasharray="4 5" />
        <text x={left - 12} y={y(value) + 4} textAnchor="end" fontSize="11" fill="#637386">{Math.round(value).toLocaleString("en-GB")}</text>
      </g>)}
      {sorted.length > 1 && <path d={path} fill="none" stroke="#0c9fb5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}
      {sorted.map((record, index) => {
        const recordDate = new Date(record.label);
        const year = Number.isFinite(recordDate.getTime()) ? String(recordDate.getFullYear()) : record.label.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? "Year unavailable";
        const dateText = Number.isFinite(recordDate.getTime()) ? recordDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : record.label;
        const tooltipWidth = 174, tooltipHeight = 58;
        const tooltipX = Math.max(4, Math.min(width - tooltipWidth - 4, x(index) - tooltipWidth / 2));
        const tooltipY = y(record.miles) - tooltipHeight - 13 < 4 ? y(record.miles) + 14 : y(record.miles) - tooltipHeight - 13;
        return <g key={`${record.label}-${index}`} style={{ cursor: "pointer" }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onFocus={() => setHoveredIndex(index)} onBlur={() => setHoveredIndex(null)} tabIndex={0} role="button" aria-label={`${record.miles.toLocaleString("en-GB")} miles, ${year}, ${dateText}`}>
          <circle cx={x(index)} cy={y(record.miles)} r={hoveredIndex === index ? 8 : 6} fill={hoveredIndex === index ? "#0c9fb5" : "#fff"} stroke="#0c9fb5" strokeWidth="3">
            <title>{`Mileage: ${record.miles.toLocaleString("en-GB")} miles\nYear: ${year}\nMOT test date: ${dateText}`}</title>
          </circle>
          {hoveredIndex === index && <g pointerEvents="none">
            <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipHeight} rx="7" fill="#10212b" stroke="#0c9fb5" strokeWidth="1" />
            <text x={tooltipX + 10} y={tooltipY + 17} fontSize="11" fontWeight="700" fill="#ffffff">{record.miles.toLocaleString("en-GB")} miles</text>
            <text x={tooltipX + 10} y={tooltipY + 33} fontSize="10" fill="#d8e8ed">Year: {year}</text>
            <text x={tooltipX + 10} y={tooltipY + 47} fontSize="9" fill="#d8e8ed">{dateText}</text>
          </g>}
        </g>;
      })}
      {[0, sorted.length - 1].filter((index, position, indexes) => indexes.indexOf(index) === position).map((index) => <text key={index} x={x(index)} y={height - 18} textAnchor={index === 0 ? "start" : index === sorted.length - 1 ? "end" : "middle"} fontSize="11" fill="#637386">{new Date(sorted[index].label).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</text>)}
      <text x="12" y="14" fontSize="11" fill="#637386">Miles</text>
    </svg>
    <div className="mc-chart-summary">
      <span>{sorted.length} recorded readings</span>
      <strong>{sorted[0].miles.toLocaleString("en-GB")} → {sorted[sorted.length - 1].miles.toLocaleString("en-GB")} miles</strong>
    </div>
    <div className="mc-chart-stats">
      <div><span>Recorded change</span><strong>{totalChange > 0 ? "+" : ""}{totalChange.toLocaleString("en-GB")} mi</strong></div>
      <div><span>Average per year*</span><strong>{averagePerYear === null ? "Not enough dates" : `${Math.round(averagePerYear).toLocaleString("en-GB")} mi`}</strong></div>
    </div>
    <p className="mc-chart-note">*Simple average across the earliest and latest numeric readings, not a prediction of future use. Readings reflect MOT test dates and may be incomplete.</p>
  </div>;
}


function VehicleConfirmation({ registration, make, model, colour, doors, onConfirm }: { registration:string; make:string; model:string; colour:string; doors:string; onConfirm:()=>void }) {
  const [choice,setChoice]=useState<'yes'|'no'|''>('');
  const [newRegistration,setNewRegistration]=useState('');
  const [vin,setVin]=useState('');
  const [vinMessage,setVinMessage]=useState('');
  const router=useRouter();
  function searchRegistration(e:FormEvent<HTMLFormElement>){e.preventDefault();const plate=newRegistration.toUpperCase().replace(/[\s-]/g,'');if(!plate||plate.length<2||plate.length>8||!/^[A-Z0-9]+$/.test(plate))return;router.push(`/report/${encodeURIComponent(plate)}`);}
  return <main className="mc-report-page"><div className="mc-report-topline"><div className="container"><span>MOTORCHECK UK <b>/</b> VEHICLE LOOKUP</span><span>IDENTITY CONFIRMATION</span></div></div><div className="container mc-report-container"><div className="mc-breadcrumb"><Link href="/">← All vehicle checks</Link><span>Registration: {registration}</span></div><section className="mc-confirm-card"><div className="mc-confirm-icon">✓</div><p className="eyebrow">STEP 2 · CHECK THE IDENTITY</p><h1>Are these vehicle details correct?</h1><p className="mc-confirm-intro">We found the following details for this registration. Please check them against the vehicle or its V5C log book before opening the report.</p><div className="mc-confirm-plate">{registration}</div><div className="mc-confirm-details"><div><span>Make</span><strong>{make || 'Not returned by source'}</strong></div><div><span>Model</span><strong>{model || 'Not returned by source'}</strong></div><div><span>Colour</span><strong>{colour || 'Not returned by source'}</strong></div><div><span>Number of doors</span><strong>{doors || 'Not supplied by this data source'}</strong></div></div><p className="mc-confirm-note">Door count is not always available from MOT records. Any missing field is shown as unavailable, not guessed.</p><div className="mc-confirm-choice"><button type="button" className="button button-yellow" onClick={onConfirm}>Yes, these details are correct <span>↗</span></button><button type="button" className="button button-light" onClick={()=>setChoice('no')}>No, these are incorrect</button></div>{choice==='no'&&<div className="mc-correct-details"><h2>Correct the vehicle search</h2><p>Re-enter the registration, or enter a VIN if you have it.</p><form onSubmit={searchRegistration}><label htmlFor="correct-reg">Registration number</label><div className="mc-correct-form-row"><input id="correct-reg" value={newRegistration} onChange={e=>setNewRegistration(e.target.value.toUpperCase())} placeholder="NE14ABJ" autoComplete="off"/><button className="button button-dark" type="submit">Search plate</button></div></form><form onSubmit={e=>{e.preventDefault();setVinMessage(vin.trim().length===17?'VIN search is not connected yet. This site currently looks up records by registration only; no VIN database has been queried. Please use the corrected registration or try again when VIN lookup is enabled.':'Enter the full 17-character VIN to check its format. No database search has been run.')}}><label htmlFor="correct-vin">Vehicle Identification Number (VIN)</label><div className="mc-correct-form-row"><input id="correct-vin" value={vin} onChange={e=>{setVin(e.target.value.toUpperCase());setVinMessage('')}} placeholder="17-character VIN" maxLength={17} autoComplete="off"/><button className="button button-dark" type="submit">Check VIN option</button></div>{vinMessage&&<p className="mc-vin-message" role="status">{vinMessage}</p>}</form><p className="mc-confirm-note">VIN lookup will become a real search only after a compatible authorised data provider is connected.</p></div>}</section></div></main>;
}

function AdvancedCheckPrompt() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("mc-advanced-prompt-dismissed") !== "1") {
        const timer = window.setTimeout(() => setOpen(true), 650);
        return () => window.clearTimeout(timer);
      }
    } catch {
      const timer = window.setTimeout(() => setOpen(true), 650);
      return () => window.clearTimeout(timer);
    }
  }, []);
  function dismiss() {
    setOpen(false);
    try { window.sessionStorage.setItem("mc-advanced-prompt-dismissed", "1"); } catch {}
  }
  if (!open) return null;
  return <div className="mc-advanced-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
    <section className="mc-advanced-modal" role="dialog" aria-modal="true" aria-labelledby="mc-advanced-modal-title">
      <button type="button" className="mc-advanced-modal-close" aria-label="Close advanced check offer" onClick={dismiss}>×</button>
      <div className="mc-advanced-modal-icon" aria-hidden="true">✓</div>
      <p className="mc-small-label">VEHICLE SEARCH COMPLETE</p>
      <h2 id="mc-advanced-modal-title">Go beyond the free MOT check</h2>
      <p>When connected to licensed data providers, the advanced report is intended to add finance, insurance write-off, stolen-status, valuation and vehicle-specification checks.</p>
      <div className="mc-advanced-modal-price"><strong>£6.48</strong><span>planned one-off price per vehicle</span></div>
      <p className="mc-advanced-modal-note">Paid advanced checks are not available yet because the required providers are not connected. We won't take payment for data we cannot supply.</p>
      <a href="#enhanced-checkout" className="button button-yellow mc-advanced-modal-cta" onClick={dismiss}>View advanced report options <span aria-hidden="true">↗</span></a>
      <button type="button" className="mc-advanced-modal-later" onClick={dismiss}>Maybe later</button>
    </section>
  </div>;
}

function LiveVehicleReport({ registration, data }: { registration: string; data: VehicleLookupResponse }) {
  const vehicle = data.vehicle!;
  const tests = data.motTests ?? [];
  const [resultsSearch, setResultsSearch] = useState("");
  const [resultFilter, setResultFilter] = useState<"ALL" | "PASS" | "FAIL" | "ADVISORIES">("ALL");
  const normalizedSearch = resultsSearch.trim().toLocaleLowerCase("en-GB");
  const filteredTests = tests.filter((test) => {
    const matchesSearch = !normalizedSearch || [test.date, test.completedDate, test.result, test.mileage, test.mileageUnit, test.expiryDate, ...(test.defects ?? []).flatMap((defect) => [defect.type, defect.text, defect.dangerous ? "dangerous" : ""])].some((value) => String(value ?? "").toLocaleLowerCase("en-GB").includes(normalizedSearch));
    const matchesFilter = resultFilter === "ALL" || (resultFilter === "PASS" && test.result === "PASS") || (resultFilter === "FAIL" && test.result === "FAIL") || (resultFilter === "ADVISORIES" && (test.defects ?? []).length > 0);
    return matchesSearch && matchesFilter;
  });
  const latest = tests[0];
  const mileageRecords = tests.filter((test) => test.mileage && Number.isFinite(Number(test.mileage.replace(/,/g, ""))) && Number(test.mileage.replace(/,/g, "")) >= 0);
  const mileageChronological = [...mileageRecords].sort((a, b) => new Date(a.completedDate || a.date || "").getTime() - new Date(b.completedDate || b.date || "").getTime());
  const mileageDecreases = mileageChronological.slice(1).flatMap((test, index) => {
    const previous = mileageChronological[index];
    const currentMiles = Number(test.mileage!.replace(/,/g, ""));
    const previousMiles = Number(previous.mileage!.replace(/,/g, ""));
    return currentMiles < previousMiles ? [{ date: test.date || "Date not returned", miles: currentMiles, previousDate: previous.date || "previous test", previousMiles }] : [];
  });
  const formatMileage = (test: LiveMotTest) => test.mileage ? `${Number(test.mileage.replace(/,/g, "")).toLocaleString("en-GB")} ${test.mileageUnit || "mi"}` : "Not recorded";

  return <main className="mc-report-page">
    <div className="mc-report-topline"><div className="container"><span>MOTORCHECK UK <b>/</b> VEHICLE REPORT</span><span>LIVE DVSA MOT DATA</span></div></div>
    <div className="container mc-report-container">
      <div className="mc-breadcrumb"><Link href="/">← All vehicle checks</Link><span>Report reference: {registration}</span></div>
      <div className="mc-report-heading">
        <div className="mc-report-title-wrap"><BrandMark make={vehicle.make || "Vehicle"} /><div><span className="eyebrow">Vehicle overview · DVSA data</span><h1>{[vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle details"}</h1><p>{vehicle.registration} {vehicle.firstUsedDate ? `· First used ${vehicle.firstUsedDate}` : ""} {vehicle.fuelType ? `· ${vehicle.fuelType}` : ""}</p></div></div>
        <Plate value={registration} />
      </div>
      <div className="mc-report-alert"><span>✓</span><div><strong>Official MOT history data returned</strong><p>Vehicle and test details below are from the DVSA MOT History API. This is not a full mechanical inspection and does not include finance, write-off, stolen-status or valuation checks.</p></div></div>

      <section className="mc-live-summary-grid">
        <article className="mc-live-summary-card"><span>Most recent MOT result</span><strong>{latest?.result || "No tests returned"}</strong><small>{latest?.date || "No test date returned"}</small></article>
        <article className="mc-live-summary-card"><span>MOT expiry shown</span><strong>{latest?.expiryDate || "Not returned"}</strong><small>Based on the latest record supplied</small></article>
        <article className="mc-live-summary-card"><span>Latest recorded mileage</span><strong>{latest ? formatMileage(latest) : "Not returned"}</strong><small>Mileage is recorded at test time, not live odometer data</small></article>
        <article className="mc-live-summary-card"><span>MOT tests returned</span><strong>{tests.length}</strong><small>Available records from the data source</small></article>
      </section>

      <section className="mc-report-section">
        <div className="mc-section-heading"><div><p className="eyebrow">MOT HISTORY</p><h2>Test timeline</h2></div><p>Results are shown in date order using the records returned by DVSA.</p></div>
        <div className="mc-report-card mc-live-timeline-card">
          {tests.length > 0 && <div className="mc-results-search-wrap"><label htmlFor="mc-results-search">Search MOT results</label><div className="mc-results-search"><span aria-hidden="true">⌕</span><input id="mc-results-search" type="search" value={resultsSearch} onChange={(event) => setResultsSearch(event.target.value)} placeholder="Search date, pass/fail, mileage, advisory…" /><button type="button" onClick={() => { setResultsSearch(""); setResultFilter("ALL"); }} disabled={!resultsSearch && resultFilter === "ALL"}>Clear</button></div><div className="mc-result-filter-row" role="group" aria-label="Filter MOT results">{([{value:"ALL",label:`All (${tests.length})`},{value:"PASS",label:`Pass (${tests.filter(t=>t.result === "PASS").length})`},{value:"FAIL",label:`Fail (${tests.filter(t=>t.result === "FAIL").length})`},{value:"ADVISORIES",label:`Advisories (${tests.filter(t=>(t.defects ?? []).length>0).length})`}] as const).map(option=><button key={option.value} type="button" className={resultFilter === option.value ? "is-active" : ""} aria-pressed={resultFilter === option.value} onClick={() => setResultFilter(option.value)}>{option.label}</button>)}</div><small>Showing {filteredTests.length} of {tests.length} MOT tests. Search dates, mileage, results, expiry dates, defects and advisories.</small></div>}
          {tests.length ? filteredTests.length ? <div className="mc-timeline">{filteredTests.map((test, index) => <div className="mc-timeline-item" key={test.testNumber || `${test.completedDate || test.date}-${index}`}>
            <div className={`mc-timeline-marker ${test.result === "PASS" ? "mc-live-pass" : test.result === "FAIL" ? "mc-live-fail" : ""}`}>{test.result === "PASS" ? "✓" : test.result === "FAIL" ? "!" : "·"}</div>
            <div className="mc-timeline-body">
              <div><strong>{test.date || "Date not returned"}</strong><span className={test.result === "PASS" ? "mc-test-pass" : "mc-live-result-other"}>{test.result}</span></div>
              <p>Recorded mileage: {formatMileage(test)}{test.expiryDate ? ` · Expiry shown: ${test.expiryDate}` : ""}</p>
              {test.defects.length ? <ul className="mc-live-defects">{test.defects.map((defect, defectIndex) => <li key={`${defect.type}-${defectIndex}`}><b>{defect.type}{defect.dangerous ? " · Dangerous" : ""}</b> — {defect.text}</li>)}</ul> : <small>No defect or advisory entries were included in this test response.</small>}
            </div>
          </div>)}</div> : <p className="mc-live-empty">No MOT results match the current search and filter. Try another keyword or select All.</p> : <p className="mc-live-empty">The DVSA response did not include MOT test records for this vehicle.</p>}
        </div>
      </section>

      <section className="mc-report-section">
        <div className="mc-section-heading"><div><p className="eyebrow">TECHNICAL SPECIFICATIONS</p><h2>Performance & engine data</h2></div><p>These details require a vehicle-specification data source matched to the exact model and derivative.</p></div>
        <div className="mc-report-card">
          <DetailGrid items={[
            { label: "Engine power", value: "Not supplied by DVSA" },
            { label: "Torque", value: "Not supplied by DVSA" },
            { label: "0–60 mph", value: "Not supplied by DVSA" },
            { label: "Top speed", value: "Not supplied by DVSA" },
            { label: "Cylinders", value: "Not supplied by DVSA" },
            { label: "Transmission", value: "Not supplied by DVSA" },
            { label: "Drive type", value: "Not supplied by DVSA" },
            { label: "CO₂ emissions", value: "Not supplied by DVSA" },
            { label: "Fuel economy", value: "Not supplied by DVSA" },
            { label: "Euro emissions class", value: "Not supplied by DVSA" },
            { label: "Kerb weight", value: "Not supplied by DVSA" },
            { label: "Dimensions & boot", value: "Not supplied by DVSA" },
          ]} />
          <p className="mc-chart-note">The current DVSA MOT History API provides MOT records and a limited set of vehicle details. It does not provide BHP, torque or acceleration. These figures are deliberately not guessed. A licensed specification provider must be connected to return verified values for the exact derivative.</p>
        </div>
      </section>

      <section className="mc-report-section mc-report-two-col">
        <div className="mc-report-card">
          <div className="mc-section-heading compact"><div><p className="eyebrow">MILEAGE</p><h2>Recorded mileage trend</h2></div></div>
          <MileageLineChart records={mileageRecords.map(test=>({label:test.completedDate || test.date || 'Year unknown',miles:Number(test.mileage!.replace(/,/g,''))}))}/>
          <p className="mc-chart-note">A recorded mileage decrease can be a reason to investigate, but gaps or unusual readings alone do not prove tampering. Some tests may not contain a readable mileage.</p>
          {mileageDecreases.length > 0 && <div className="mc-mileage-warning" role="status">
            <strong>Review mileage sequence</strong>
            <p>{mileageDecreases.length} reading{mileageDecreases.length === 1 ? "" : "s"} {mileageDecreases.length === 1 ? "is" : "are"} lower than the preceding numeric MOT reading. This can have several explanations and is not, by itself, proof of odometer tampering.</p>
            <ul>{mileageDecreases.map((item, index) => <li key={`${item.date}-${index}`}>{item.date}: {item.miles.toLocaleString("en-GB")} miles, compared with {item.previousDate}: {item.previousMiles.toLocaleString("en-GB")} miles.</li>)}</ul>
          </div>}
        </div>
        <div className="mc-report-card">
          <div className="mc-section-heading compact"><div><p className="eyebrow">VEHICLE DETAILS</p><h2>Information returned</h2></div></div>
          <DetailGrid items={[
            { label: "Registration", value: vehicle.registration || registration },
            { label: "Make", value: vehicle.make || "Not returned" },
            { label: "Model", value: vehicle.model || "Not returned" },
            { label: "First used", value: vehicle.firstUsedDate || "Not returned" },
            { label: "Manufactured", value: vehicle.manufactureDate || "Not returned" },
            { label: "Registered", value: vehicle.registrationDate || "Not returned" },
            { label: "Fuel type", value: vehicle.fuelType || "Not returned" },
            { label: "Colour", value: vehicle.colour || "Not returned" },
            { label: "Engine size", value: vehicle.engineSizeCc ? `${vehicle.engineSizeCc} cc` : "Not returned" },
          ]} />
        </div>
      </section>

      <section className="mc-report-section">
        <div className="mc-section-heading"><div><p className="eyebrow">SCORECARD</p><h2>Assessment status</h2></div><p>We will not assign an overall score until a published scoring method can be applied consistently to verified evidence.</p></div>
        <div className="mc-score-factor-grid">{[
          ["MOT history", "DVSA test records returned"],
          ["Mileage pattern", mileageRecords.length ? `${mileageRecords.length} numeric readings available; review required` : "Not enough mileage readings"],
          ["Service & upkeep", "Service records are not included in this MOT response"],
          ["Damage & write-off", "Requires a separate authorised source"],
          ["Identity & finance", "Requires separate authorised sources"],
        ].map(([label, status]) => <article className="mc-score-factor" key={label}><div className="mc-factor-card-top"><span>{label}</span><span className="mc-status mc-status-grey"><i />Not scored</span></div><p>{status}</p><small>Unassessed does not mean clear.</small></article>)}</div>
      </section>

      <PremiumChecksSection registration={registration}/>

      <section className="mc-report-section mc-live-source-note">
        <div><strong>Source: {data.source || "DVSA MOT History API"}</strong><p>Retrieved {data.fetchedAt ? new Date(data.fetchedAt).toLocaleString("en-GB") : "during this lookup"}. MOT data may not include all details needed to judge a vehicle's current condition.</p></div>
        <ul>{(data.notes || []).map((note) => <li key={note}>{note}</li>)}</ul>
      </section>
      <div className="mc-report-end"><p>Use this report as a starting point, not a substitute for a physical inspection or official checks.</p><button type="button" className="button button-light" onClick={() => window.print()}>Print / Save PDF</button><Link className="button button-dark" href="/">← Check another vehicle</Link></div>
    </div>
    <AdvancedCheckPrompt />
  </main>;
}

export default function VehicleReportPage() {
  const params=useParams<{registration:string}>();
  const key=decodeURIComponent(params.registration||"").toUpperCase().replace(/[\s-]/g,"");
  const report=reports[key];
  const [lookup, setLookup] = useState<VehicleLookupResponse | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [identityConfirmed, setIdentityConfirmed] = useState(false);

  useEffect(() => {
    if (report) return;
    let active = true;
    setLookupLoading(true);
    setLookup(null);
    fetch(`/api/vehicle?registration=${encodeURIComponent(key)}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as VehicleLookupResponse;
        if (active) setLookup(result);
      })
      .catch(() => {
        if (active) setLookup({ status: "provider_error", registration: key, message: "We couldn't reach the vehicle-data service. Check your connection and try again." });
      })
      .finally(() => { if (active) setLookupLoading(false); });
    return () => { active = false; };
  }, [key, report]);

  if (report && !identityConfirmed) return <VehicleConfirmation registration={report.plate} make={report.make} model={report.model} colour={report.colour} doors={report.doors} onConfirm={()=>setIdentityConfirmed(true)} />;
  if (!report) {
    if (lookup?.status === "ok" && lookup.vehicle) {
      if (!identityConfirmed) return <VehicleConfirmation registration={key} make={lookup.vehicle.make || ""} model={lookup.vehicle.model || ""} colour={lookup.vehicle.colour || ""} doors={""} onConfirm={()=>setIdentityConfirmed(true)} />;
      return <LiveVehicleReport registration={key} data={lookup} />;
    }
    const title = lookupLoading ? "Searching available vehicle records…" :
      lookup?.status === "not_found" ? "No MOT history returned" :
      lookup?.status === "not_configured" ? "Live checks are being prepared" :
      lookup?.status === "invalid" ? "Check the registration" :
      "We couldn't complete that lookup";
    const message = lookupLoading ? "We’re checking the registration against the vehicle-data sources currently connected to MotorCheck UK. This usually takes a few seconds." :
      lookup?.message || lookup?.error || "The vehicle-data service is not available right now.";
    return <main className="mc-report-page">
      <div className="mc-report-topline"><div className="container"><span>MOTORCHECK UK <b>/</b> VEHICLE REPORT</span><span>LIVE LOOKUP</span></div></div>
      <div className="container mc-report-container">
        <div className="mc-breadcrumb"><Link href="/">← All vehicle checks</Link><span>Report reference: {key}</span></div>
        <section className="mc-live-lookup-card" aria-live="polite">
          <div className={`mc-live-lookup-icon ${lookupLoading ? "mc-searching-pulse" : ""}`}>{lookupLoading ? "⌕" : lookup?.status === "ok" ? "✓" : "!"}</div>
          <p className="eyebrow">REGISTRATION LOOKUP</p>
          <h1>{title}</h1>
          <p>{message}</p>
          <div className="mc-live-status-list">
            <div><span>Official MOT history</span><strong>{lookup?.status === "ok" ? "Returned" : lookup?.status === "not_found" ? "No records returned" : "Not available yet"}</strong></div>
            <div><span>Finance / write-off / stolen checks</span><strong>Not connected</strong></div>
            <div><span>Vehicle score</span><strong>Not assessed</strong></div>
          </div>
          {lookup?.status === "not_configured" && <p className="mc-live-help">We're waiting for DVSA access to be approved and configured. No paid data provider is being used.</p>}
          {lookup?.status === "not_found" && <p className="mc-live-help">A missing MOT response does not prove the vehicle has no history or that the vehicle itself does not exist. Check the registration carefully.</p>}
          <div className="mc-live-lookup-actions"><button type="button" className="button button-dark" onClick={() => window.location.reload()} disabled={lookupLoading}>{lookupLoading ? "Checking…" : "Try again"}</button><Link className="button button-yellow" href="/">Back to homepage</Link></div>
          <p className="mc-live-footnote">Demo reports remain available with DEMO001 and DEMO002. They contain fictional sample data and are not official checks.</p>
        </section>
      </div>
    </main>;
  }
  const assessed=[report.scores.mileage,report.scores.mot,report.scores.service].filter(n=>n>0);
  const average=assessed.reduce((a,b)=>a+b,0)/assessed.length;
  const rating=average.toFixed(1);
  const band=average>=4?"green":average>=2.5?"amber":"red";
  return <main className="mc-report-page">
    <div className="mc-report-topline"><div className="container"><span>MOTORCHECK UK <b>/</b> VEHICLE REPORT</span><span>DEMO DATA · NOT AN OFFICIAL CHECK</span></div></div>
    <div className="container mc-report-container">
      <div className="mc-breadcrumb"><Link href="/">← All vehicle checks</Link><span>Report reference: {key}</span></div>
      <div className="mc-report-heading"><div className="mc-report-title-wrap"><BrandMark make={report.make}/><div><span className="eyebrow">Vehicle overview</span><h1>{report.make} {report.model}</h1><p>Year of manufacture: {report.year} <span>·</span> Registered: {report.registrationYear} <span>·</span> {report.engine} <span>·</span> {report.fuel}</p></div></div><Plate value={report.plate}/></div>
      <div className="mc-report-alert"><span>!</span><div><strong>Sample report — not a real vehicle assessment</strong><p>All details and scores below are fictional examples for development. No official vehicle checks have been performed. Do not use this report to make a purchase decision.</p></div></div>

      <section className="mc-score-overview">
        <div className="mc-score-main">
          <div className={`mc-score-large mc-score-${band}`}><div><strong>{rating}</strong><span>/5</span></div></div>
          <div className="mc-score-explain"><span className="mc-small-label">ILLUSTRATIVE VEHICLE SCORE</span><h2>Some positive signs, checks still outstanding</h2><Traffic score={average}/><p>This example score uses three sample factors only. Damage and identity checks are not assessed, so the overall rating is provisional and must not be read as a verified safety or condition judgement.</p><div className="mc-score-coverage"><span>Data coverage</span><strong>3 of 5 factors illustrated</strong><div><i style={{width:"60%"}}/></div></div></div>
        </div>
        <div className="mc-score-legend"><span><i className="mc-dot-green"/>4.0–5.0 · Green</span><span><i className="mc-dot-amber"/>2.5–3.9 · Amber</span><span><i className="mc-dot-red"/>Below 2.5 · Red</span></div>
      </section>

      <section className="mc-paid-teaser" aria-label="Enhanced checks preview">
        <div className="mc-paid-teaser-icon" aria-hidden="true">⌑</div>
        <div className="mc-paid-teaser-copy"><span className="mc-small-label">THE IMPORTANT CHECKS</span><h2>Don't stop at the basics.</h2><p>Outstanding finance, insurance write-offs, stolen status and registration changes can matter just as much as the car's specifications.</p><span className="mc-paid-teaser-note">One-off price: £6.48</span></div>
        <a href="#enhanced-checkout" className="button button-yellow">Explore enhanced checks <span aria-hidden="true">↓</span></a>
      </section>

      <section className="mc-report-section">
        <div className="mc-section-heading"><div><p className="eyebrow">VEHICLE SPECIFICATIONS</p><h2>Know the car itself.</h2></div><p>Specifications below are illustrative demo values. Live specifications must be matched to the exact variant and verified against an appropriate source.</p></div>
        <div className="mc-spec-overview">
          <article><span className="mc-spec-icon">HP</span><div><span>Power</span><strong>{report.bhp}</strong></div></article>
          <article><span className="mc-spec-icon">↗</span><div><span>0–60 mph</span><strong>{report.zeroToSixty}</strong></div></article>
          <article><span className="mc-spec-icon">◉</span><div><span>Top speed</span><strong>{report.topSpeed}</strong></div></article>
          <article><span className="mc-spec-icon">↻</span><div><span>Torque</span><strong>{report.torque}</strong></div></article>
          <article><span className="mc-spec-icon">⚙</span><div><span>Drivetrain</span><strong>{report.drivetrain}</strong></div></article>
          <article><span className="mc-spec-icon">▤</span><div><span>Transmission</span><strong>{report.transmission} · {report.gears}</strong></div></article>
        </div>
        <div className="mc-report-card mc-spec-card"><div className="mc-section-heading compact"><div><p className="eyebrow">ENGINE & DIMENSIONS</p><h2>Technical details</h2></div><span className="mc-mini-badge">DEMO VALUES</span></div>
          <DetailGrid items={[
            {label:"Engine",value:report.engine},{label:"Engine type",value:report.engineType},{label:"Fuel type",value:report.fuel},{label:"Combustion type",value:report.combustion},
            {label:"Year of manufacture",value:String(report.year)},{label:"Year of registration",value:String(report.registrationYear)},{label:"Exterior colour",value:report.colour},{label:"Mileage shown",value:`${report.mileage.toLocaleString("en-GB")} miles`},
            {label:"Length",value:report.length},{label:"Width (excluding mirrors)",value:report.width},{label:"Height",value:report.height},{label:"Wheelbase",value:report.wheelbase},
            {label:"Kerb weight",value:report.kerbWeight},{label:"Gross vehicle weight",value:report.grossWeight},{label:"Cylinders",value:report.cylinders},{label:"Seats",value:report.seats},{label:"Doors",value:report.doors},{label:"Boot capacity",value:report.bootCapacity},{label:"CO₂ emissions",value:report.co2},{label:"Emissions standard",value:report.euroStatus},{label:"Fuel economy",value:report.fuelEconomy},{label:"Safety rating",value:report.safetyRating},{label:"Safety recalls",value:report.safetyRecall}
          ]}/>
        </div>
      </section>

      <section className="mc-report-section">
        <div className="mc-section-heading"><div><p className="eyebrow">TAX, VALUE & OWNERSHIP</p><h2>Costs and history at a glance.</h2></div><p>These fields will be populated only when supported by an authorised source. Keeper identities are not displayed.</p></div>
        <div className="mc-info-panels">
          <article className="mc-info-panel"><div className="mc-info-panel-head"><span>£</span><div><h3>Vehicle valuation</h3><p>Indicative market range</p></div></div><strong className="mc-valuation">{report.valuation}</strong><small>Illustrative only — not a live valuation. A real estimate should consider trim, mileage, condition, history and current market data.</small></article>
          <article className="mc-info-panel"><div className="mc-info-panel-head"><span>↻</span><div><h3>Vehicle tax</h3><p>Current tax status and history</p></div></div><DetailGrid items={[{label:"Current status",value:report.taxStatus},{label:"Tax due date",value:report.taxDue},{label:"Annual rate",value:report.taxAnnual}]}/><small>Full tax history may not be available from a standard vehicle lookup. We will show dated, sourced information only.</small></article>
          <article className="mc-info-panel mc-info-panel-locked"><div className="mc-info-panel-head"><span>🔒</span><div><h3>Ownership & registration</h3><p>Keeper count and plate history</p></div><span className="mc-lock-pill">LOCKED</span></div><p className="mc-locked-panel-copy">Keeper-change dates, registration changes and identity results are hidden in the free preview.</p><a href="#enhanced-checkout" className="mc-inline-unlock">Unlock a full check · £6.48 ↗</a><small>Personal keeper names and addresses are never displayed.</small></article>
          <article className="mc-info-panel mc-info-panel-locked"><div className="mc-info-panel-head"><span>🔒</span><div><h3>Risk & insurance</h3><p>Finance, damage and theft history</p></div><span className="mc-lock-pill">LOCKED</span></div><p className="mc-locked-panel-copy">Finance interest, write-off categories and stolen markers are hidden in the free preview.</p><a href="#enhanced-checkout" className="mc-inline-unlock">Unlock a full check · £6.48 ↗</a><small>Results depend on authorised source coverage; locked does not mean clear.</small></article>
        </div>
      </section>

      <section className="mc-report-section">
        <div className="mc-section-heading"><div><p className="eyebrow">FEATURES & ADDED INFORMATION</p><h2>Equipment and useful details.</h2></div><p>Equipment varies by trim, options and market. Every feature must be verified for the exact vehicle before being presented as confirmed.</p></div>
        <div className="mc-report-two-col">
          <div className="mc-report-card"><div className="mc-section-heading compact"><div><p className="eyebrow">FEATURE LIST</p><h2>Car features</h2></div></div><div className="mc-feature-list">{report.features.map(feature=><div key={feature}><span>✓</span>{feature}</div>)}</div></div>
          <div className="mc-report-card"><div className="mc-section-heading compact"><div><p className="eyebrow">NOTES & SOURCES</p><h2>Added information</h2></div></div><div className="mc-feature-list">{report.addedInfo.map(info=><div key={info}><span>i</span>{info}</div>)}</div><div className="mc-source-status"><strong>Data source status</strong><span>Demo mode · no live lookups performed</span></div></div>
        </div>
      </section>

      <section className="mc-report-section">
        <div className="mc-section-heading"><div><p className="eyebrow">01 / THE FIVE FACTORS</p><h2>What the score is built on</h2></div><p>Each factor is scored out of five only when there is enough evidence. Missing checks remain unassessed — they are not treated as a pass.</p></div>
        <div className="mc-score-factor-grid">{factors.map(f=>{const value=report.scores[f.key];const unknown=value===0;return <article className="mc-score-factor" key={f.key}><div className="mc-factor-card-top"><span>{f.label}</span>{unknown?<span className="mc-status mc-status-grey"><i/>Not checked</span>:<Traffic score={value}/>}</div><div className="mc-factor-score"><strong>{unknown?"—":value.toFixed(1)}</strong><span>/ 5</span></div><ScoreBar value={unknown?null:value}/><p>{f.desc}</p>{unknown&&<small>Requires an authorised data source.</small>}</article>})}</div>
        <p className="mc-method-note"><b>Scoring method (planned):</b> verified records will be assessed against published rules, with severity and recency considered where relevant. No data is not the same as no issue. We will publish the exact scoring methodology before launch.</p>
      </section>

      <section className="mc-report-section mc-report-two-col">
        <div className="mc-report-card"><div className="mc-section-heading compact"><div><p className="eyebrow">02 / MOT HISTORY</p><h2>Test timeline</h2></div><span className="mc-mini-badge">EXAMPLE</span></div><div className="mc-stat-row"><div><span>Current MOT</span><strong>Not verified</strong></div><div><span>Expiry</span><strong>Not verified</strong></div><div><span>Tests shown</span><strong>{report.tests.length}</strong></div></div>
          <div className="mc-timeline">{report.tests.map((test,index)=><div className="mc-timeline-item" key={test.date}><div className="mc-timeline-marker">{test.result==="PASS"?"✓":"!"}</div><div className="mc-timeline-body"><div><strong>{test.date}</strong><span className="mc-test-pass">{test.result} · EXAMPLE</span></div><p>Recorded mileage: {test.miles} miles</p><small>{test.note}</small></div></div>)}</div>
        </div>
        <div className="mc-report-card"><div className="mc-section-heading compact"><div><p className="eyebrow">03 / MILEAGE</p><h2>Recorded mileage trend</h2></div></div><MileageLineChart records={report.tests.map(t=>({label:t.date.slice(-4),miles:Number(t.miles.replace(/,/g,""))}))}/><p className="mc-chart-note">Fictional sample readings. A real mileage score will consider available readings and unusual decreases or gaps, not mileage alone.</p>
          <div className="mc-vehicle-specs"><div><span>First registered</span><strong>{report.firstRegistered}</strong></div><div><span>Colour</span><strong>{report.colour}</strong></div><div><span>Transmission</span><strong>{report.transmission}</strong></div><div><span>Current sample mileage</span><strong>{report.mileage.toLocaleString("en-GB")} mi</strong></div></div>
        </div>
      </section>

      <section className="mc-report-section">
        <div className="mc-section-heading"><div><p className="eyebrow">06 / DAMAGE EXAMPLES</p><h2>What damage records can show</h2></div><p>Examples of common impact areas. These illustrations are not photographs of the vehicle shown above.</p></div>
        <div className="mc-damage-gallery"><article><img src="/damage-front.svg" alt="Illustration showing a damaged front bumper" /><div><span>01 · FRONT</span><h3>Bumper & front panel</h3><p>Impact marks, panel alignment and repair evidence can warrant a closer inspection.</p></div></article><article><img src="/damage-side.svg" alt="Illustration showing damage to a side door" /><div><span>02 · SIDE</span><h3>Doors & side panels</h3><p>Look for uneven gaps, paint mismatch and signs of previous panel repair.</p></div></article><article><img src="/damage-rear.svg" alt="Illustration showing a damaged rear bumper" /><div><span>03 · REAR</span><h3>Rear bumper & boot</h3><p>Rear impacts can affect hidden structure; a professional inspection may be needed.</p></div></article></div>
        <p className="mc-image-disclaimer">Vehicle-specific damage photos will only be displayed if a connected, licensed source supplies them for that registration. A clean database result cannot prove that a car has never been damaged.</p>
      </section>

      <PremiumChecksSection registration={key}/>
      <div className="mc-report-end"><p>Use this report as a starting point, not a substitute for a physical inspection or official checks.</p><button type="button" className="button button-light" onClick={() => window.print()}>Print / Save PDF</button><Link className="button button-dark" href="/">← Check another vehicle</Link></div>
    </div>
    <AdvancedCheckPrompt />
  </main>;
}
