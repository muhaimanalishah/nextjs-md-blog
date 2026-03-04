"use client";

import * as React from "react";
import { CopyCodeButton } from "./CopyCodeButton";
import { ComponentPropsWithoutRef } from "react";

export function PreWithCopy({ children, className, ...props }: ComponentPropsWithoutRef<"pre">) {
  const preRef = React.useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    const text = preRef.current?.innerText ?? "";
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative group my-6">
      <pre
        ref={preRef}
        {...props}
        className={`overflow-x-auto bg-zinc-950 p-4 py-6 text-sm leading-relaxed font-mono ${className || ""}`}
      >
        {children}
      </pre>
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyCodeButton onClick={handleCopy} />
      </div>
    </div>
  );
}