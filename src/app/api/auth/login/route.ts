import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const result = await pool.query<{
    id: string;
    email: string;
    password_hash: string;
  }>("select id, email, password_hash from users where email = $1", [
    email.toLowerCase().trim(),
  ]);
  const user = result.rows[0];

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  await createSession(user.id);
  return NextResponse.json({ user: { id: user.id, email: user.email } });
}
