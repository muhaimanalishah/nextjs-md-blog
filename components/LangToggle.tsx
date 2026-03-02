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
      className="gap-2 rounded-full px-4 border-primary/20 hover:bg-primary/5"
    >
      <Link href={toggleHref}>
        <Languages className="w-4 h-4" />
        <span className="font-medium">
          {isUrdu ? "Switch to English" : "Urdu mein parhain"}
        </span>
      </Link>
    </Button>
  );
}
