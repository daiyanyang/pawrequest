import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { PetRequest } from "@/lib/types";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const result = await pool.query<PetRequest>(
    "select * from requests where poster_id = $1 order by created_at desc",
    [user.id]
  );
  return NextResponse.json({ requests: result.rows });
}
