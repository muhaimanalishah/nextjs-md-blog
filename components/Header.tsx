"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Tags", href: "/tags" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-6 md:px-12">
      <div className="flex h-16 items-center justify-between w-full">
        <div className="flex-1">
          <Link href="/" className="flex items-center space-x-2 w-fit">
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              MD BLOG
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
