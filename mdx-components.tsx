import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h2: (props: ComponentPropsWithoutRef<"h2">) => (
      <h2 {...props} className="group flex whitespace-pre-wrap">
        <a
          href={`#${props.id}`}
          className="mr-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          #
        </a>
        {props.children}
      </h2>
    ),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (
      <h3 {...props} className="group flex whitespace-pre-wrap">
        <a
          href={`#${props.id}`}
          className="mr-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          #
        </a>
        {props.children}
      </h3>
    ),
    a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
      const isInternal = href?.startsWith("/");
      if (isInternal && href) {
        return (
          <Link href={href} {...(props as any)}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    img: (props: ComponentPropsWithoutRef<"img">) => (
      <Image
        src={props.src as string}
        alt={props.alt || ""}
        width={800}
        height={450}
        className="rounded-lg border font-serif"
        {...(props as any)}
      />
    ),
    pre: (props: ComponentPropsWithoutRef<"pre">) => {
      return (
        <pre {...props} className="relative rounded-lg border bg-muted p-4">
          {props.children}
        </pre>
      );
    },
  };
}
