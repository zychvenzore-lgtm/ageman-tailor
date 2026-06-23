"use server";

import { db } from "@/lib/db";
import { createSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import crypto from "crypto";
import { redirect } from "next/navigation";

export async function loginAction(formData: { username: string; password: string }) {
  try {
    const user = await db.adminUser.findUnique({
      where: { username: formData.username.trim() },
    });

    if (!user) {
      return { success: false, error: "Invalid username or password." };
    }

    // Verify password: stored as `salt:hash`
    const [salt, storedHash] = user.passwordHash.split(":");
    const attemptHash = crypto
      .pbkdf2Sync(formData.password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (attemptHash !== storedHash) {
      return { success: false, error: "Invalid username or password." };
    }

    // Set session cookie (7 day expiry)
    const token = createSessionToken(user.username);
    const cookieStore = await cookies();
    cookieStore.set("ageman_admin_session", token, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("ageman_admin_session");
  redirect("/admin/login");
}
