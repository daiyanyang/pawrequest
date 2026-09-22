"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRequest, claimRequest } from "@/lib/storage";
import { PetRequest } from "@/lib/types";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<PetRequest | null | undefined>(undefined);
  const [responderName, setResponderName] = useState("");
  const [responderContact, setResponderContact] = useState("");

  useEffect(() => {
    setRequest(getRequest(id) ?? null);
  }, [id]);

  function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    claimRequest(id, responderName, responderContact);
    setRequest(getRequest(id) ?? null);
  }

  if (request === undefined) return null;

  if (request === null) {
    return <p className="text-stone-500">Couldn&apos;t find that request.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-stone-900">{request.title}</h1>
            <p className="text-sm text-stone-500">
              {request.petType} · posted by {request.posterName}
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            ${request.price}
          </span>
        </div>
        <p className="mt-4 text-stone-700">{request.description}</p>
      </div>

      {request.status === "claimed" ? (
        <div className="space-y-2 rounded-lg bg-stone-100 p-4 text-stone-700">
          <p>
            This one&apos;s already been picked up by{" "}
            <span className="font-medium">{request.responderName}</span>.
          </p>
          <p className="text-sm">
            <span className="font-medium">{request.posterName}</span>&apos;s contact:{" "}
            {request.posterContact}
          </p>
          <p className="text-sm">
            <span className="font-medium">{request.responderName}</span>&apos;s contact:{" "}
            {request.responderContact}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleRespond}
          className="space-y-3 rounded-lg border border-amber-200 bg-white p-5"
        >
          <p className="font-medium text-stone-800">Can you help out?</p>
          <input
            required
            value={responderName}
            onChange={(e) => setResponderName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
          <input
            required
            value={responderContact}
            onChange={(e) => setResponderContact(e.target.value)}
            placeholder="Your phone or email"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-amber-600 px-4 py-2.5 font-medium text-white hover:bg-amber-700"
          >
            I&apos;ll take it
          </button>
        </form>
      )}
    </div>
  );
}
