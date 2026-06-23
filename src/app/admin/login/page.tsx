import { LoginClient } from "./LoginClient";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Already logged in → go straight to dashboard
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return <LoginClient />;
}
