import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { PetRequest } from "@/lib/types";

export async function GET() {
  const result = await pool.query<PetRequest>(
    "select * from requests order by created_at desc"
  );
  return NextResponse.json({ requests: result.rows });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const { title, petType, description, price, posterName, posterContact } =
    await request.json();

  if (!title || !petType || !description || !posterName || !posterContact) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const result = await pool.query<PetRequest>(
    `insert into requests
      (title, pet_type, description, price, poster_id, poster_name, poster_contact)
     values ($1, $2, $3, $4, $5, $6, $7)
     returning *`,
    [title, petType, description, Number(price) || 0, user.id, posterName, posterContact]
  );

  return NextResponse.json({ request: result.rows[0] });
}
