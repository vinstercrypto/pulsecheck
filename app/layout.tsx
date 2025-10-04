
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
// Fix: Import ReactNode type to resolve the "Cannot find namespace 'React'" error.
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulseCheck",
  description: "Daily, one-human-one-vote polling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-brand-gray-950 text-brand-gray-100`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6">
            {children}
          </main>
          <footer className="text-center p-4 text-brand-gray-500 text-sm">
            © {new Date().getFullYear()} PulseCheck
          </footer>
        </div>
      </body>
    </html>
  );
}