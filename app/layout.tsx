import type { Metadata } from "next";
import { Lora, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Markdown Blog",
    template: "%s | Markdown Blog",
  },
  description: "A bilingual blog built with Next.js, MDX, and Tailwind CSS.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lora.variable} ${geistMono.variable} ${geistSans.variable} selection:bg-primary/20 antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="text-muted-foreground border-t py-12 text-center font-sans text-sm">
              © {new Date().getFullYear()} Markdown Blog. All rights reserved.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
