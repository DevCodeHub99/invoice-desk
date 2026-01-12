import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { SeedLoader } from "@/components/SeedLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvoiceDesk - B2B Billing & Invoice Management",
  description: "Professional billing and invoice management for businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SeedLoader />
        <Sidebar />
        <main className="min-h-screen pt-16 px-4 pb-6 lg:pt-8 lg:ml-60 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
