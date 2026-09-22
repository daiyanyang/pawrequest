"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { PetRequest } from "@/lib/types";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [request, setRequest] = useState<PetRequest | null | undefined>(undefined);
  const [responderName, setResponderName] = useState("");
  const [responderContact, setResponderContact] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/requests/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRequest(data?.request ?? null));
  }, [id]);

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch(`/api/requests/${id}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responderName, responderContact }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setRequest(data.request);
  }

  if (request === undefined || authLoading) return null;

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
              {request.pet_type} · posted by {request.poster_name}
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
            <span className="font-medium">{request.responder_name}</span>.
          </p>
          <p className="text-sm">
            <span className="font-medium">{request.poster_name}</span>&apos;s contact:{" "}
            {request.poster_contact}
          </p>
          <p className="text-sm">
            <span className="font-medium">{request.responder_name}</span>&apos;s contact:{" "}
            {request.responder_contact}
          </p>
        </div>
      ) : !user ? (
        <p className="rounded-lg border border-dashed border-amber-300 bg-white px-4 py-6 text-center text-stone-500">
          You&apos;ll need to{" "}
          <Link href="/login" className="text-amber-700 underline">
            sign in
          </Link>{" "}
          before you can respond.
        </p>
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-amber-600 px-4 py-2.5 font-medium text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {submitting ? "Claiming…" : "I'll take it"}
          </button>
        </form>
      )}
    </div>
  );
}
