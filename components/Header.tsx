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
    <header className="bg-background/80 border-border/40 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:h-20 md:px-12">
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-primary font-sans text-[12px] tracking-[0.2em] transition-colors",
                pathname === item.href
                  ? "text-foreground font-bold"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-none items-center justify-center">
          <Link href="/" className="flex items-center">
            <span className="text-foreground font-serif text-xl font-black tracking-widest md:text-2xl">
              muhaiman.dev
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
