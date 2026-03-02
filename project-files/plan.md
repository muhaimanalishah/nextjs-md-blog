# Markdown Blog

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.1 (App Router, TypeScript) |
| Bundler | Turbopack |
| Styling | Tailwind CSS v4 (CSS-first, `@theme` in globals.css) |
| UI Components | **shadcn/ui** (new-york style, Radix primitives) |
| Animation | **`tw-animate-css`** (replaces `tailwindcss-animate`) |
| Icons | **`lucide-react`** (ships with shadcn) |
| Dark mode | `next-themes` + Tailwind v4 `dark:` variant |
| MDX | `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` |
| Frontmatter | Exported `metadata` object from MDX |
| Markdown extras | `remark-gfm` |
| Syntax highlighting | `rehype-pretty-code` + `shiki` |
| RSS | `rss` npm package |

---

### App Folder — Fully Finalized

```
app/
├── layout.tsx                    ← Root layout (ThemeProvider, LangProvider, Header)
├── page.tsx                      ← Homepage (SSG, infinite scroll via client component)
├── about/
│   └── page.tsx                  ← Renders content/about.mdx
├── blog/
│   └── [slug]/
│       └── page.tsx              ← Single post (SSG via generateStaticParams)
├── tags/
│   ├── page.tsx                  ← All tags index (SSG)
│   └── [tag]/
│       └── page.tsx              ← Posts by tag (SSG via generateStaticParams)
├── api/
│   └── posts/
│       └── route.ts              ← Infinite scroll batch fetcher
├── feed.xml/
│   └── route.ts                  ← RSS feed
├── sitemap.xml/
│   └── route.ts                  ← Auto-generated sitemap
└── robots.txt/
    └── route.ts                  ← robots.txt
```

**Key notes locked in:**

- All post/tag pages are **fully static** — `generateStaticParams()` pre-builds every route at deploy time
- **Infinite scroll** works by pre-rendering the first batch statically, then the client fetches subsequent batches from `api/posts/route.ts`
- `content/about.mdx` sits outside `posts/` — it's a one-off page, not a blog post
- `sitemap.xml` and `robots.txt` are Route Handlers that read your posts at build time

---

### Content & Bilingual Strategy

**Folder structure:**

```
content/
  posts/
    2025-03-01-my-first-post/
      en.mdx        ← owns the metadata for both languages
      ur.mdx        ← content only, no metadata
  about.mdx
```

**`en.mdx` (source of truth):**

```tsx
export const metadata = {
  title: "My First Post",
  date: "2025-03-01",
  tags: ["tech", "life"],
  excerpt: "A short summary...",
}

Your English content here...
```

**`ur.mdx` (content only):**

```tsx
Yahan aap ka Roman Urdu content hai...
```

---

**Key decisions locked in:**

- `en.mdx` is the **single source of truth** for all metadata — title, date, tags, excerpt
- `ur.mdx` has **no metadata** — `lib/posts.ts` always reads metadata from `en.mdx` regardless of active language
- Title and tags are **shared** — no translation needed
- If `ur.mdx` doesn't exist → lang toggle is hidden, only English shown
- `about.mdx` follows the same pattern — single file, English only, no bilingual needed

---

**Summary of how `lib/posts.ts` will work:**

1. Scan `content/posts/` for folders
2. For each folder, read metadata from `en.mdx`
3. Strip date prefix from folder name to generate slug
4. Check if `ur.mdx` exists — store a `hasUrdu: boolean` flag
5. At render time, serve `en.mdx` or `ur.mdx` based on language cookie

---

### Routing

| Route | Type | Description |
| --- | --- | --- |
| `/` | SSG | First 10 posts pre-rendered, client fetches next batches |
| `/blog/[slug]` | SSG | Single post, language-aware via cookie |
| `/tags` | SSG | All tags with post counts, sorted by count |
| `/tags/[tag]` | SSG | Posts filtered by tag, most recent first |
| `/about` | SSG | About page from `content/about.mdx` |
| `/api/posts` | Dynamic | Accepts `?page=2&limit=10`, returns next batch |
| `/feed.xml` | Dynamic | RSS feed |
| `/sitemap.xml` | Dynamic | Auto-generated from all post slugs |
| `/robots.txt` | Dynamic | robots.txt |

---

**Key decisions locked in:**

- **Infinite scroll** — first 10 posts baked into the static HTML, subsequent batches fetched from `/api/posts?page=2&limit=10` by a client component. No layout shift on first load.
- **404 page** — Next.js 16 `app/not-found.tsx` handles both invalid slugs and invalid tags. `generateStaticParams()` + `notFound()` in each dynamic route
- **Sort order** — most recent first everywhere (homepage, tag pages). Achieved by sorting on the `date` field from metadata, descending
- `/api/posts` is the only **dynamic** route in the whole app — everything else is fully static

---

### Components & shadcn Usage

**Custom components (`components/`):**

```
components/
├── ui/                        ← shadcn auto-generated
├── Header.tsx                 ← Nav, dark mode toggle, lang toggle, hamburger
├── MobileNav.tsx              ← Sheet drawer for mobile
├── PostCard.tsx               ← Cover image, title, date, excerpt, tags
├── TagBadge.tsx               ← Clickable tag pill
├── LangToggle.tsx             ← EN / Roman Urdu switcher
├── InfinitePostList.tsx       ← Client component, infinite scroll
├── TableOfContents.tsx        ← Sticky TOC, auto-generated from headings
├── ReadingTime.tsx            ← Estimated read time from word count
├── PostNavigation.tsx         ← Previous / Next post links
├── CopyCodeButton.tsx         ← Client component, injected into code blocks
├── ShareButtons.tsx           ← Share to X, copy link, etc.
└── MDXComponents.tsx          ← Custom MDX overrides (pre, a, h1-h4, img...)
```

**shadcn components to install:**

| shadcn Component | Used In |
| --- | --- |
| `Button` | Header, LangToggle, ShareButtons |
| `Badge` | TagBadge, tags index |
| `Card` | PostCard |
| `Separator` | Post page sections |
| `Sheet` | MobileNav |
| `Skeleton` | Infinite scroll loading state |
| `Toggle` | LangToggle |
| `ScrollArea` | TableOfContents |

---

**Key decisions locked in:**

- **Cover image** — stored inside the post folder alongside MDX files. Path referenced in `en.mdx` metadata as `cover: "./cover.jpg"`. Rendered via Next.js `<Image />` with `priority` on the post page
- **Reading time** — calculated at build time from word count in `lib/posts.ts`, stored as `readingTime: number` (minutes) in post metadata
- **Table of contents** — auto-generated by parsing heading elements (`h2`, `h3`) from the MDX at build time. Sticky on desktop, hidden on mobile
- **Copy code button** — `CopyCodeButton.tsx` is a client component injected into `MDXComponents.tsx` as a wrapper around every `<pre>` block
- **Share buttons** — share to X (Twitter), copy link to clipboard. No third-party SDK needed
- **Prev/Next navigation** — `lib/posts.ts` returns adjacent posts by date when fetching a single post

**Updated post folder structure:**

```
content/posts/
  2025-03-01-my-first-post/
    en.mdx
    ur.mdx
    cover.jpg        ← cover image lives here
```

---

### MDX + Syntax Highlighting

**Packages:**

```
@next/mdx
@mdx-js/loader
@mdx-js/react
remark-gfm
rehype-pretty-code
shiki
```

**Shiki configuration:**

- Dark mode theme: `github-dark`
- Light mode theme: `github-light`
- Both themes loaded simultaneously — `rehype-pretty-code` handles the switch via CSS variables, Tailwind's `dark:` variant toggles them. Zero flash on theme change.

**Code block features:**

- **Line numbers** — added via CSS counters, no extra JS
- **File name label** — specified in the MDX code fence like this:

```
```ts filename="lib/posts.ts"
// your code here
```
```

- **Copy code button** — `CopyCodeButton.tsx` injected via `MDXComponents.tsx` as a wrapper around every `<pre>` block (carried over from Section 4)

---

**How MDX rendering pipeline works end-to-end:**

```
.mdx file
  → remark-gfm        (GFM markdown: tables, strikethrough, task lists)
  → rehype-pretty-code (syntax highlighting, line numbers, file labels)
  → @next/mdx          (compiles to React Server Component)
  → MDXComponents.tsx  (maps elements to custom components)
  → rendered HTML      (zero syntax highlighting JS sent to client)
```

**What `MDXComponents.tsx` overrides:**

| Element | Custom Component |
| --- | --- |
| `pre` | Wraps with `CopyCodeButton` + file label |
| `a` | Opens external links in new tab, internal links use `next/link` |
| `img` | Replaced with Next.js `<Image />` for optimization |
| `h2`, `h3` | Adds `id` attribute for TOC anchor links |

---

### RSS Feed

**Route:** `app/feed.xml/route.ts`**Package:** `rss`

**Each feed item includes:**

- Post title
- Post URL (`yourblog.com/blog/[slug]`)
- Publish date
- Excerpt only (from `en.mdx` metadata)
- Tags as RSS categories

**Feed settings:**

- English only, 10 most recent posts
- Feed linked in `app/layout.tsx` via `<link>` tag in `<head>` so RSS readers auto-discover it
- Regenerated on every deployment (dynamic route, but cheap — just reads metadata)

---

**Additions:**

- `app/not-found.tsx` — custom 404 page
- `app/about/page.tsx` renders `content/about.mdx`