"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";

export function CopyCodeButton({ onClick }: { onClick: () => void }) {
  const [copied, setCopied] = React.useState(false);

  const handleClick = () => {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleClick}
      className="text-muted-foreground hover:text-foreground h-7 w-7"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span className="sr-only">Copy code</span>
    </Button>
  );
}
