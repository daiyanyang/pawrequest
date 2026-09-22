import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Email and a password of at least 6 characters are required." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  try {
    const result = await pool.query<{ id: string; email: string }>(
      "insert into users (email, password_hash) values ($1, $2) returning id, email",
      [email.toLowerCase().trim(), passwordHash]
    );
    const user = result.rows[0];
    await createSession(user.id);
    return NextResponse.json({ user });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }
    throw err;
  }
}
