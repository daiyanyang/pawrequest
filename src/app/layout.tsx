import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PawRequest",
  description: "Post a pet-sitting request, or lend a hand to someone else's.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50 text-stone-800 antialiased">
        <header className="border-b border-amber-200 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
            <a href="/" className="text-lg font-semibold text-amber-700">
              🐾 PawRequest
            </a>
            <div className="flex items-center gap-4">
              <a
                href="/my-requests"
                className="text-sm font-medium text-amber-700 hover:underline"
              >
                My requests
              </a>
              <a
                href="/post"
                className="rounded-full bg-amber-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
              >
                Post a request
              </a>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
