"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function PostRequestPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [petType, setPetType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [posterName, setPosterName] = useState("");
  const [posterContact, setPosterContact] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        petType,
        description,
        price,
        posterName,
        posterContact,
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/");
  }

  if (loading) return null;

  if (!user) {
    return (
      <p className="rounded-lg border border-dashed border-amber-300 bg-white px-4 py-8 text-center text-stone-500">
        You&apos;ll need to{" "}
        <Link href="/login" className="text-amber-700 underline">
          sign in
        </Link>{" "}
        before posting a request.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Post a request</h1>
      <p className="mt-1 text-sm text-stone-500">
        Let your community know your pet needs a hand while you&apos;re out.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Feed Biscuit while I'm at the airport"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Pet</label>
          <input
            required
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
            placeholder="Dog, cat, fish..."
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Details</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Once a day, food's in the pantry, key's under the mat..."
            rows={4}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            Price offered ($)
          </label>
          <input
            required
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="20"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Your name</label>
          <input
            required
            value={posterName}
            onChange={(e) => setPosterName(e.target.value)}
            placeholder="Anna"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            Your phone or email
          </label>
          <input
            required
            value={posterContact}
            onChange={(e) => setPosterContact(e.target.value)}
            placeholder="So whoever helps out can reach you"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-amber-600 px-4 py-2.5 font-medium text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post request"}
        </button>
      </form>
    </div>
  );
}
