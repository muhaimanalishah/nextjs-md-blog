"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Languages } from "lucide-react";

interface LangToggleProps {
  hasUrdu: boolean;
}

export function LangToggle({ hasUrdu }: LangToggleProps) {
  const pathname = usePathname();

  // Logic to determine current language and toggle route
  const isUrdu = pathname.endsWith("/ur");

  if (!hasUrdu && !isUrdu) return null;

  const toggleHref = isUrdu ? pathname.replace(/\/ur$/, "") : `${pathname}/ur`;

  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="border-primary/20 hover:bg-primary/5 w-full gap-2 rounded-none px-4 sm:w-auto"
    >
      <Link href={toggleHref}>
        <Languages className="h-4 w-4" />
        <span className="text-xs font-medium">
          {isUrdu ? "Switch to English" : "Urdu mein parhain"}
        </span>
      </Link>
    </Button>
  );
}
