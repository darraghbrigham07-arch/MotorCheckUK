import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";
const allowed = new Set(["staff_tasks", "staff_enquiries", "staff_directory", "staff_jobs"]);
function authorized(request: Request) {
  const secret = process.env.STAFF_SESSION_SECRET;
  const token = request.headers.get("cookie")?.split(";").map(x => x.trim()).find(x => x.startsWith("mc_staff_session="))?.slice("mc_staff_session=".length) ?? "";
  if (!secret || !token) return false;
  const expected = createHmac("sha256", secret).update("motorcheck-staff-session-v1").digest("hex");
  const a = Buffer.from(token), b = Buffer.from(expected);
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}
function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}
export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Sign in to the staff portal." }, { status: 401 });
  const cfg = config(); if (!cfg) return NextResponse.json({ error: "Shared database is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local and run the SQL setup file in Supabase." }, { status: 503 });
  const url = new URL(request.url); const table = url.searchParams.get("table") ?? "";
  if (!allowed.has(table)) return NextResponse.json({ error: "Unknown staff data table." }, { status: 400 });
  try {
    const response = await fetch(`${cfg.url}/rest/v1/${table}?select=*&order=created_at.desc`, { headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` }, cache: "no-store" });
    const data = await response.json().catch(() => []);
    if (!response.ok) return NextResponse.json({ error: typeof data?.message === "string" ? data.message : "Database request failed. Check the SQL setup." }, { status: 502 });
    return NextResponse.json({ data });
  } catch { return NextResponse.json({ error: "Could not reach the shared database." }, { status: 502 }); }
}
export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Sign in to the staff portal." }, { status: 401 });
  const cfg = config(); if (!cfg) return NextResponse.json({ error: "Shared database is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local and run the SQL setup file in Supabase." }, { status: 503 });
  const body = await request.json().catch(() => null); const table = body?.table; const record = body?.record;
  if (!allowed.has(table) || !record || typeof record !== "object") return NextResponse.json({ error: "Invalid staff record." }, { status: 400 });
  const fields: Record<string, string[]> = {
    staff_tasks: ["title", "owner", "status", "priority", "due_date"],
    staff_enquiries: ["customer_name", "email", "registration", "subject", "message", "status", "assigned_to", "priority"],
    staff_directory: ["full_name", "email", "phone", "role", "active"],
    staff_jobs: ["title", "description", "status", "priority", "assigned_to", "due_date", "category"]
  };
  const clean: Record<string, unknown> = {};
  for (const field of fields[table as string]) if (record[field] !== undefined) clean[field] = record[field];
  if (table === "staff_tasks" && !String(clean.title ?? "").trim()) return NextResponse.json({ error: "Task title is required." }, { status: 400 });
  if (table === "staff_jobs" && !String(clean.title ?? "").trim()) return NextResponse.json({ error: "Job title is required." }, { status: 400 });
  try {
    const response = await fetch(`${cfg.url}/rest/v1/${table}`, { method: "POST", headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(clean), cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: typeof data?.message === "string" ? data.message : "Could not save this record." }, { status: 502 });
    return NextResponse.json({ data: Array.isArray(data) ? data[0] : data });
  } catch { return NextResponse.json({ error: "Could not reach the shared database." }, { status: 502 }); }
}
export async function PATCH(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Sign in to the staff portal." }, { status: 401 });
  const cfg = config(); if (!cfg) return NextResponse.json({ error: "Shared database is not configured." }, { status: 503 });
  const body = await request.json().catch(() => null); const table = body?.table; const id = Number(body?.id); const record = body?.record;
  if (!allowed.has(table) || !Number.isInteger(id) || !record || typeof record !== "object") return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const fields: Record<string, string[]> = { staff_tasks: ["title", "owner", "status", "priority", "due_date"], staff_enquiries: ["customer_name", "email", "registration", "subject", "message", "status", "assigned_to", "priority"], staff_directory: ["full_name", "email", "phone", "role", "active"], staff_jobs: ["title", "description", "status", "priority", "assigned_to", "due_date", "category"] };
  const clean: Record<string, unknown> = {}; for (const field of fields[table as string]) if (record[field] !== undefined) clean[field] = record[field];
  const response = await fetch(`${cfg.url}/rest/v1/${table}?id=eq.${id}`, { method: "PATCH", headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(clean), cache: "no-store" });
  const data = await response.json().catch(() => ({})); if (!response.ok) return NextResponse.json({ error: data?.message ?? "Update failed." }, { status: 502 }); return NextResponse.json({ data: Array.isArray(data) ? data[0] : data });
}
export async function DELETE(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Sign in to the staff portal." }, { status: 401 });
  const cfg = config(); if (!cfg) return NextResponse.json({ error: "Shared database is not configured." }, { status: 503 });
  const url = new URL(request.url); const table = url.searchParams.get("table") ?? ""; const id = Number(url.searchParams.get("id"));
  if (!allowed.has(table) || !Number.isInteger(id)) return NextResponse.json({ error: "Invalid delete request." }, { status: 400 });
  const response = await fetch(`${cfg.url}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` }, cache: "no-store" });
  if (!response.ok) return NextResponse.json({ error: "Delete failed." }, { status: 502 }); return NextResponse.json({ ok: true });
}
