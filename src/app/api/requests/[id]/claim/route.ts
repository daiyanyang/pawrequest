import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { PetRequest } from "@/lib/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const { id } = await params;
  const { responderName, responderContact } = await request.json();

  if (!responderName || !responderContact) {
    return NextResponse.json(
      { error: "Your name and contact are required." },
      { status: 400 }
    );
  }

  // Only updates a row that is still open, so two people can't both claim it.
  const result = await pool.query<PetRequest>(
    `update requests
     set status = 'claimed', responder_id = $1, responder_name = $2, responder_contact = $3
     where id = $4 and status = 'open'
     returning *`,
    [user.id, responderName, responderContact, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: "This request has already been claimed." },
      { status: 409 }
    );
  }

  return NextResponse.json({ request: result.rows[0] });
}
