"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";

interface CopyCodeButtonProps {
  code: string;
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      size="icon-xs"
      variant="ghost"
      onClick={copy}
      className="absolute right-3 top-3 h-8 w-8 text-muted-foreground/50 hover:bg-muted/50 hover:text-foreground"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">Copy code</span>
    </Button>
  );
}
