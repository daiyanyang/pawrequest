import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";

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
        <AuthProvider>
          <Header />
          <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
