import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { getSiteSettings } from "@/sanity/lib/queries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteTitle = settings?.siteTitle ?? "Rob Wills Portfolio";
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
