import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import { PreWithCopy } from "./components/PreWithCopy";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // ... headings and links remain same
    h2: (props: ComponentPropsWithoutRef<"h2">) => (
      <h2 {...props} className="group flex whitespace-pre-wrap">
        {props.children}
      </h2>
    ),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (
      <h3 {...props} className="group flex whitespace-pre-wrap">
        {props.children}
      </h3>
    ),
    a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
      const isInternal = href?.startsWith("/");
      if (isInternal && href) {
        return (
          <Link href={href} {...(props as Record<string, unknown>)}>
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
        className="rounded-none border font-serif"
        {...(props as Record<string, unknown>)}
      />
    ),
    figure: (props: ComponentPropsWithoutRef<"figure">) => {
      if (
        (props as Record<string, unknown>)["data-rehype-pretty-code-figure"] !==
        undefined
      ) {
        return (
          <figure
            {...props}
            className="group relative my-6 overflow-hidden rounded-none border border-border bg-zinc-950 dark:bg-zinc-900"
          >
            {props.children}
          </figure>
        );
      }
      return <figure {...props} />;
    },
    figcaption: (props: ComponentPropsWithoutRef<"figcaption">) => {
      if (
        (props as Record<string, unknown>)["data-rehype-pretty-code-title"] !==
        undefined
      ) {
        return (
          <figcaption
            {...props}
            className="border-b border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-medium text-zinc-300"
          >
            {props.children}
          </figcaption>
        );
      }
      return <figcaption {...props} />;
    },
    pre: (props) => <PreWithCopy {...props} />,
    code: (props: ComponentPropsWithoutRef<"code">) => {
      return <code {...props} />;
    },
  };
}
