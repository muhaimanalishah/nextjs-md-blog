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
  title: { default: "miloasdev", template: "%s - miloasdev" },
  description: "Muhaiman Ali Shah. Writing about what I build and learn.",
  metadataBase: new URL(SITE_URL),
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    siteName: "miloasdev",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/opengraph-image.png` }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@muhaiman_as",
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
              © {new Date().getFullYear()} Muhaiman Ali Shah.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
