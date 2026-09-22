"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addRequest } from "@/lib/storage";
import { getDeviceId } from "@/lib/device";

export default function PostRequestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [petType, setPetType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [posterName, setPosterName] = useState("");
  const [posterContact, setPosterContact] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addRequest({
      id: crypto.randomUUID(),
      title,
      petType,
      description,
      price: Number(price) || 0,
      posterName,
      posterContact,
      ownerId: getDeviceId(),
      createdAt: new Date().toISOString(),
      status: "open",
    });
    router.push("/");
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

        <button
          type="submit"
          className="w-full rounded-full bg-amber-600 px-4 py-2.5 font-medium text-white hover:bg-amber-700"
        >
          Post request
        </button>
      </form>
    </div>
  );
}
