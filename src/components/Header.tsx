"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="border-b border-amber-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-amber-700">
          🐾 PawRequest
        </Link>

        <div className="flex items-center gap-4">
          {!loading && user && (
            <>
              <Link
                href="/my-requests"
                className="text-sm font-medium text-amber-700 hover:underline"
              >
                My requests
              </Link>
              <span className="hidden text-sm text-stone-500 sm:inline">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm font-medium text-stone-600 hover:underline"
              >
                Sign out
              </button>
              <Link
                href="/post"
                className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
              >
                Post a request
              </Link>
            </>
          )}

          {!loading && !user && (
            <Link
              href="/login"
              className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
