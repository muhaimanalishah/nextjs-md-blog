"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "WRITING", href: "/" },
  { name: "TOPICS", href: "/tags" },
  { name: "ABOUT", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="flex h-16 md:h-20 items-center justify-between w-full max-w-6xl mx-auto px-6 md:px-12">
        <nav className="hidden md:flex flex-1 items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[12px] font-sans tracking-[0.2em] transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground font-bold"
                  : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex-none flex items-center justify-center">
          <Link href="/" className="flex items-center">
            <span className="md:text-2xl font-serif font-black tracking-widest text-foreground text-xl">
              miloasdev.
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}