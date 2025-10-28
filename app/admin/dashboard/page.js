import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { redirect } from "next/navigation";
import supabaseServer from "../../../utils/supabase/server";

export default async function AdminDashboardPage() {
  // Get access token from cookies (set by Supabase client after login)
  const cookieStore = cookies();
  const token = cookieStore.get("sb-access-token")?.value || cookieStore.get("supabase-auth-token")?.value;
  if (!token) {
    redirect("/admin/login");
  }

  // Decode JWT to get user role
  let role = null;
  try {
    const payload = decodeJwt(token);
    role = payload.role || (payload.user_metadata && payload.user_metadata.role);
  } catch (e) {
    // Invalid token
    redirect("/admin/login");
  }

  // Only allow admins
  if (!role || (role !== "super_admin" && role !== "content_manager")) {
    redirect("/admin/login");
  }

  // Optionally, fetch more user info from Supabase
  // const { data: user } = await supabaseServer.auth.getUser(token);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <h2>Welcome, Admin!</h2>
      <p>Your role: <b>{role}</b></p>
      <p>This is a protected admin dashboard page.</p>
    </div>
  );
}
