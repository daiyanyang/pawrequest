"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PetRequest } from "@/lib/types";

export default function HomePage() {
  const [requests, setRequests] = useState<PetRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data.requests ?? []))
      .finally(() => setLoading(false));
  }, []);

  const open = requests.filter((r) => r.status === "open");
  const claimed = requests.filter((r) => r.status === "claimed");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Open requests</h1>
        <p className="mt-1 text-sm text-stone-500">
          Someone&apos;s out and their pet needs a hand. Browse what&apos;s open, or lend a paw.
        </p>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : open.length === 0 ? (
        <p className="rounded-lg border border-dashed border-amber-300 bg-white px-4 py-8 text-center text-stone-500">
          No open requests yet.{" "}
          <Link href="/post" className="text-amber-700 underline">
            Post the first one
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {open.map((r) => (
            <li key={r.id}>
              <Link
                href={`/request/${r.id}`}
                className="block rounded-lg border border-amber-200 bg-white p-4 shadow-sm transition hover:border-amber-400 hover:shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-900">{r.title}</p>
                    <p className="text-sm text-stone-500">
                      {r.pet_type} · posted by {r.poster_name}
                    </p>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                    ${r.price}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {claimed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-stone-700">Already claimed</h2>
          <ul className="mt-3 space-y-3">
            {claimed.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-stone-200 bg-stone-100 p-4 opacity-70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-700">{r.title}</p>
                    <p className="text-sm text-stone-500">
                      {r.pet_type} · {r.responder_name} is on it
                    </p>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-stone-200 px-3 py-1 text-sm font-medium text-stone-600">
                    ${r.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
