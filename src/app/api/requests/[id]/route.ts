import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import type { PetRequest } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await pool.query<PetRequest>(
    "select * from requests where id = $1",
    [id]
  );
  const request = result.rows[0];
  if (!request) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ request });
}
