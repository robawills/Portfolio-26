import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { client } from "@/sanity/lib/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch<{
    siteTitle?: string;
    defaultMetaDescription?: string;
  } | null>(
    `*[_type == "siteSettings"][0]{siteTitle, defaultMetaDescription}`,
  );
  const siteTitle = settings?.siteTitle ?? "Folio";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: siteTitle, template: `%s · ${siteTitle}` },
    description: settings?.defaultMetaDescription,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
