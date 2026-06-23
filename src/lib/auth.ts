import { cookies } from "next/headers";

const SESSION_COOKIE = "ageman_admin_session";
const SESSION_SECRET = "ageman_owner_2026"; // simple shared secret

export async function getAdminSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return null;

  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const [sig, username] = decoded.split(":");
    // Verify simple signature
    if (sig !== Buffer.from(SESSION_SECRET + username).toString("base64").slice(0, 16)) {
      return null;
    }
    return { username };
  } catch {
    return null;
  }
}

export function createSessionToken(username: string): string {
  const sig = Buffer.from(SESSION_SECRET + username).toString("base64").slice(0, 16);
  return Buffer.from(`${sig}:${username}`).toString("base64");
}
