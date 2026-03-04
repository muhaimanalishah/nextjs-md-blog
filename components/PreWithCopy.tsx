"use client";

import * as React from "react";
import { CopyCodeButton } from "./CopyCodeButton";
import { ComponentPropsWithoutRef } from "react";

export function PreWithCopy({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const preRef = React.useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    const text = preRef.current?.innerText ?? "";
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="group relative my-6">
      <pre
        ref={preRef}
        {...props}
        className={`overflow-x-auto bg-zinc-950 p-4 py-6 font-mono text-sm leading-relaxed ${className || ""}`}
      >
        {children}
      </pre>
      <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyCodeButton onClick={handleCopy} />
      </div>
    </div>
  );
}
