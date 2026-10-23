"use client";
import { FormEvent, useState } from "react";

type MotTest = { date?: string | null; completedDate?: string | null; result?: string | null; expiryDate?: string | null; mileage?: string | null; mileageUnit?: string | null; defects?: {text?: string; type?: string; dangerous?: boolean}[] };
type VehicleResponse = { status?: string; message?: string; registration?: string; source?: string; vehicle?: {registration?: string; make?: string | null; model?: string | null; firstUsedDate?: string | null; manufactureDate?: string | null; registrationDate?: string | null; fuelType?: string | null; colour?: string | null; engineSizeCc?: string | null}; motTests?: MotTest[] };
type Lookup = { reg: string; loading: boolean; error: string; data: VehicleResponse | null };
const blank: Lookup = { reg: "", loading: false, error: "", data: null };
function latestMileage(tests: MotTest[] = []) { const withMileage = tests.find(t => t.mileage && /^\d[\d,]*$/.test(t.mileage.replace(/\s/g, ""))); return withMileage ? `${withMileage.mileage} ${withMileage.mileageUnit || "mi"}` : "Not recorded"; }
function vehicleName(data: VehicleResponse | null) { const v = data?.vehicle; return [v?.make, v?.model].filter(Boolean).join(" ") || "Vehicle details unavailable"; }
export default function ComparePage() {
  const [a, setA] = useState<Lookup>({...blank}); const [b, setB] = useState<Lookup>({...blank});
  async function lookup(which: "a" | "b", e: FormEvent) {
    e.preventDefault(); const current = which === "a" ? a : b; const set = which === "a" ? setA : setB;
    const reg = current.reg.toUpperCase().replace(/[\s-]/g, "");
    if (!reg || !/^[A-Z0-9]{2,8}$/.test(reg)) { set({...current, error: "Enter a valid registration (letters and numbers only).", data: null}); return; }
    set({...current, reg, loading: true, error: "", data: null});
    try { const res = await fetch(`/api/vehicle?registration=${encodeURIComponent(reg)}`, {cache:"no-store"}); const data = await res.json() as VehicleResponse; if (!res.ok || data.status !== "ok") throw new Error(data.message || "Could not retrieve live MOT data for this registration."); set({reg, loading:false,error:"",data}); }
    catch (err) { set({reg, loading:false,error:err instanceof Error ? err.message : "Lookup failed. Please try again.",data:null}); }
  }
  const rows: [string, (d: VehicleResponse | null) => string][] = [
    ["Registration", d => d?.vehicle?.registration || d?.registration || "—"],
    ["Make and model", d => vehicleName(d)],
    ["First used / registered", d => d?.vehicle?.firstUsedDate || d?.vehicle?.registrationDate || d?.vehicle?.manufactureDate || "Not returned"],
    ["Colour", d => d?.vehicle?.colour || "Not returned"],
    ["Fuel type", d => d?.vehicle?.fuelType || "Not returned"],
    ["Engine size", d => d?.vehicle?.engineSizeCc ? `${Number(d.vehicle.engineSizeCc).toLocaleString("en-GB")} cc` : "Not returned"],
    ["MOT tests returned", d => d?.motTests ? String(d.motTests.length) : "—"],
    ["Latest recorded mileage", d => latestMileage(d?.motTests)],
    ["Latest MOT result", d => d?.motTests?.[0]?.result || "Not returned"],
    ["Latest MOT date", d => d?.motTests?.[0]?.date || d?.motTests?.[0]?.completedDate || "Not returned"],
    ["Latest MOT expiry", d => d?.motTests?.[0]?.expiryDate || "Not returned"],
    ["Latest test defects/advisories", d => { const items=d?.motTests?.[0]?.defects || []; return items.length ? items.map(x=>x.text).filter(Boolean).join("; ") : "None returned on latest test"; }],
  ];
  return <main className="mc-feature-page">
    <section className="mc-feature-hero"><div className="container"><p className="eyebrow">MOTORCHECK UK · FREE BUYER TOOL</p><h1>Compare cars by registration<span>.</span></h1><p>Enter two UK number plates to compare vehicle details and MOT history side by side using the connected DVSA MOT history lookup. Only data returned by the source is shown; missing fields are not guessed.</p></div></section>
    <div className="container mc-feature-content">
      <div className="mc-compare-reg-grid">
        {([{label:"Car A",value:a,set:setA,key:"a" as const},{label:"Car B",value:b,set:setB,key:"b" as const}] as const).map(car=><section className="mc-feature-card" key={car.key}><h2>{car.label}</h2><form onSubmit={e=>lookup(car.key,e)}><label htmlFor={`compare-reg-${car.key}`}>Registration plate</label><div className="mc-compare-reg-input"><input id={`compare-reg-${car.key}`} value={car.value.reg} onChange={e=>car.set({...car.value,reg:e.target.value.toUpperCase(),data:null,error:""})} placeholder={car.key === "a" ? "NE14ABJ" : "XY34 ZZZ"} autoComplete="off" maxLength={10}/><button className="button button-dark" type="submit" disabled={car.value.loading}>{car.value.loading ? "Checking…" : "Look up"}</button></div></form>{car.value.error && <p className="notice" role="alert">{car.value.error}</p>}{car.value.data && <div className="mc-compare-vehicle-found"><strong>{vehicleName(car.value.data)}</strong><span>{car.value.data.vehicle?.registration || car.value.reg} · Live MOT data loaded</span></div>}<p className="mc-compare-source-note">{car.value.data ? `Source: ${car.value.data.source || "vehicle lookup"}` : "Lookup retrieves available live vehicle and MOT details."}</p></section>)}
      </div>
      <section className="mc-feature-card"><div className="mc-compare-heading"><div><h2>Side-by-side comparison</h2><p>Compare the available official lookup results. Finance, write-off, stolen status, service history, performance and valuation are not included in this DVSA response.</p></div><button className="button button-light" onClick={()=>{setA({...blank});setB({...blank});}}>Clear cars</button></div><div className="mc-feature-table-wrap"><table className="mc-feature-table"><thead><tr><th>Detail</th><th>{a.data ? a.data.vehicle?.registration || a.reg : "Car A"}</th><th>{b.data ? b.data.vehicle?.registration || b.reg : "Car B"}</th></tr></thead><tbody>{rows.map(([label,get])=><tr key={label}><th>{label}</th><td>{a.data ? get(a.data) : "Enter a registration above"}</td><td>{b.data ? get(b.data) : "Enter a registration above"}</td></tr>)}</tbody></table></div><div className="mc-feature-actions"><button className="button button-dark" onClick={()=>window.print()}>Print / Save PDF</button></div><p className="mc-compare-disclaimer">MOT history is not a full vehicle inspection and does not establish accident, finance, theft or write-off status. Verify important details independently before purchase.</p></section>
    </div>
  </main>;
}
