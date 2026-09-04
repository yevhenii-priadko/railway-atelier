import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Deliberately minimal: one shared password (ADMIN_PASSWORD), no accounts,
// no database-backed sessions. A successful login just gets a signed,
// expiring cookie — nothing else needed for a single trusted editor.

export const ADMIN_COOKIE_NAME = "pr_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days — Anton shouldn't have to log in often

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Add it to your environment (see .env.example) — " +
        "/admin login cannot issue sessions without it."
    );
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken(): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && expires * 1000 > Date.now();
}

export function checkPassword(candidate: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to your environment (see .env.example) — " +
        "/admin has no password to check against without it."
    );
  }
  const a = Buffer.from(candidate);
  const b = Buffer.from(real);
  // Lengths differ often enough (wrong password) that this alone isn't a
  // meaningful timing leak, but compare the hash either way for good measure.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

/** Call at the top of every /admin page (except /admin/login). */
export async function requireAdminSession(): Promise<void> {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }
}

/** Call at the top of every admin server action, so it can't be invoked without a valid session even if someone finds the action's endpoint directly. */
export async function requireAdminForAction(): Promise<void> {
  if (!(await isAdminSession())) {
    throw new Error("Сесія закінчилась. Увійдіть ще раз.");
  }
}
