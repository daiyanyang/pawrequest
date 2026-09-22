import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { pool } from "./db";

const SESSION_COOKIE = "session_token";
const SESSION_LENGTH_DAYS = 30;

export type SessionUser = {
  id: string;
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const expiresAt = new Date(
    Date.now() + SESSION_LENGTH_DAYS * 24 * 60 * 60 * 1000
  );
  const result = await pool.query<{ token: string }>(
    "insert into sessions (user_id, expires_at) values ($1, $2) returning token",
    [userId, expiresAt]
  );
  const token = result.rows[0].token;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await pool.query("delete from sessions where token = $1", [token]);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const result = await pool.query<SessionUser>(
    `select users.id, users.email
     from sessions
     join users on users.id = sessions.user_id
     where sessions.token = $1 and sessions.expires_at > now()`,
    [token]
  );
  return result.rows[0] ?? null;
}
