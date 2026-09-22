"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequests } from "@/lib/storage";
import { getDeviceId } from "@/lib/device";
import { PetRequest } from "@/lib/types";

export default function MyRequestsPage() {
  const [mine, setMine] = useState<PetRequest[]>([]);

  useEffect(() => {
    const deviceId = getDeviceId();
    setMine(getRequests().filter((r) => r.ownerId === deviceId));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">My requests</h1>
        <p className="mt-1 text-sm text-stone-500">
          Everything you&apos;ve posted from this device, and whether anyone&apos;s picked it up.
        </p>
      </div>

      {mine.length === 0 ? (
        <p className="rounded-lg border border-dashed border-amber-300 bg-white px-4 py-8 text-center text-stone-500">
          You haven&apos;t posted anything yet.{" "}
          <Link href="/post" className="text-amber-700 underline">
            Post a request
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {mine.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-stone-900">{r.title}</p>
                  <p className="text-sm text-stone-500">{r.petType}</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                  ${r.price}
                </span>
              </div>

              {r.status === "open" ? (
                <p className="mt-3 text-sm font-medium text-amber-700">
                  Still waiting for someone to help out.
                </p>
              ) : (
                <div className="mt-3 rounded-md bg-stone-50 p-3 text-sm text-stone-700">
                  <p className="font-medium">
                    {r.responderName} said they&apos;ll take it!
                  </p>
                  <p className="mt-1 text-stone-500">
                    Reach them at {r.responderContact}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
