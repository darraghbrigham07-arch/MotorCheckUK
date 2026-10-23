import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import StaffPortal from "./portal";
import StaffLogin from "./staff-login";
export const dynamic = "force-dynamic";
export default async function StaffPage() {
 const secret = process.env.STAFF_SESSION_SECRET; const cookieStore = await cookies(); const token = cookieStore.get("mc_staff_session")?.value ?? "";
 const expected = secret ? createHmac("sha256", secret).update("motorcheck-staff-session-v1").digest("hex") : "";
 const a=Buffer.from(token), b=Buffer.from(expected); const valid=!!secret && a.length===b.length && a.length>0 && timingSafeEqual(a,b);
 return valid ? <StaffPortal /> : <StaffLogin />;
}
