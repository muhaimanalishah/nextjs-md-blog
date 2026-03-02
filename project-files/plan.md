## Updated Plan Document

markdown

# Markdown Blog

## Tech Stack

| Layer               | Choice                                                |
| ------------------- | ----------------------------------------------------- |
| Framework           | Next.js 16.1 (App Router, TypeScript)                 |
| Bundler             | Turbopack                                             |
| Styling             | Tailwind CSS v4 (CSS-first, `@theme` in globals.css)  |
| UI Components       | **shadcn/ui** (new-york style, Radix primitives)      |
| Animation           | **`tw-animate-css`** (replaces `tailwindcss-animate`) |
| Icons               | **`lucide-react`** (ships with shadcn)                |
| Dark mode           | `next-themes` + Tailwind v4 `dark:` variant           |
| MDX                 | `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react`      |
| Frontmatter         | `gray-matter` (YAML frontmatter in MDX files)         |
| Markdown extras     | `remark-gfm`                                          |
| Syntax highlighting | `rehype-pretty-code` + `shiki`                        |
| RSS                 | `rss` npm package                                     |

---

### App Folder — Fully Finalized

app/
├── layout.tsx ← Root layout (ThemeProvider, Header)
├── page.tsx ← Homepage (SSG, infinite scroll via client component)
├── not-found.tsx ← Custom 404 page
├── about/
│ └── page.tsx ← Renders content/about.mdx
├── blog/
│ └── [slug]/
│ ├── page.tsx ← Single post, English (SSG via generateStaticParams)
│ └── ur/
│ └── page.tsx ← Single post, Roman Urdu (SSG via generateStaticParams)
├── tags/
│ ├── page.tsx ← All tags index (SSG)
│ └── [tag]/
│ └── page.tsx ← Posts by tag (SSG via generateStaticParams)
├── api/
│ └── posts/
│ └── route.ts ← Infinite scroll batch fetcher
├── feed.xml/
│ └── route.ts ← RSS feed
├── sitemap.xml/
│ └── route.ts ← Auto-generated sitemap
└── robots.txt/
└── route.ts ← robots.txt

**Key notes locked in:**

- All post/tag pages are **fully static** — `generateStaticParams()` pre-builds every route at deploy time
- **Infinite scroll** works by pre-rendering the first batch statically, then the client fetches subsequent batches from `api/posts/route.ts`
- `content/about.mdx` sits outside `posts/` — it's a one-off page, not a blog post
- `sitemap.xml` and `robots.txt` are Route Handlers that read your posts at build time
- `/blog/[slug]/ur/page.tsx` only generates static pages for posts where `hasUrdu: true` — if a user visits a `/ur` route that doesn't exist, `not-found.tsx` handles it

---

### Content & Bilingual Strategy

**Folder structure:**

content/
posts/
2025-03-01-my-first-post/
en.mdx ← owns the metadata for both languages
ur.mdx ← content only, no metadata
cover.jpg ← cover image
about.mdx

**`en.mdx` (source of truth) — YAML frontmatter:**
mdx

---

title: "My First Post"
date: "2025-03-01"
tags: ["tech", "life"]
excerpt: "A short summary..."
cover: "./cover.jpg"

---

Your English content here...

**`ur.mdx` (content only, no frontmatter):**
mdx
Yahan aap ka Roman Urdu content hai...

**Key decisions locked in:**

- `en.mdx` is the **single source of truth** for all metadata — title, date, tags, excerpt, cover
- `ur.mdx` has **no frontmatter** — `lib/posts.ts` always reads metadata from `en.mdx` regardless of active language
- Metadata is parsed using `gray-matter` — robust, handles edge cases like nested quotes and multiline values
- Title and tags are **shared** — no translation needed
- If `ur.mdx` doesn't exist → `hasUrdu: false` → the lang toggle is hidden, `/blog/[slug]/ur` returns 404
- `about.mdx` is English only — single file, no bilingual needed

**Summary of how `lib/posts.ts` works:**

1. Scan `content/posts/` for folders
2. For each folder, read and parse frontmatter from `en.mdx` using `gray-matter`
3. Strip date prefix from folder name to generate slug
4. Check if `ur.mdx` exists — store a `hasUrdu: boolean` flag
5. Calculate reading time from word count of `en.mdx` content
6. Sort all posts by date descending
7. `getPostBySlug()` returns the post + `older`/`newer` adjacent posts

---

### Routing

| Route             | Type    | Description                                              |
| ----------------- | ------- | -------------------------------------------------------- |
| `/`               | SSG     | First 10 posts pre-rendered, client fetches next batches |
| `/blog/[slug]`    | SSG     | Single post, English                                     |
| `/blog/[slug]/ur` | SSG     | Single post, Roman Urdu (only if `hasUrdu: true`)        |
| `/tags`           | SSG     | All tags with post counts, sorted by count               |
| `/tags/[tag]`     | SSG     | Posts filtered by tag, most recent first                 |
| `/about`          | SSG     | About page from `content/about.mdx`                      |
| `/api/posts`      | Dynamic | Accepts `?page=2&limit=10`, returns next batch           |
| `/feed.xml`       | Dynamic | RSS feed                                                 |
| `/sitemap.xml`    | Dynamic | Auto-generated from all post slugs                       |
| `/robots.txt`     | Dynamic | robots.txt                                               |

**Key decisions locked in:**

- **Infinite scroll** — first 10 posts baked into the static HTML, subsequent batches fetched from `/api/posts?page=2&limit=10` by a client component. No layout shift on first load.
- **404 page** — `app/not-found.tsx` handles invalid slugs, invalid tags, and `/blog/[slug]/ur` visits where `ur.mdx` doesn't exist
- **Sort order** — most recent first everywhere (homepage, tag pages), sorted on the `date` field descending
- `/api/posts` is the only **dynamic** route in the whole app — everything else is fully static
- Both `/blog/[slug]` and `/blog/[slug]/ur` are included in `sitemap.xml` — but only `/blog/[slug]/ur` routes where `hasUrdu: true`

---

### Components & shadcn Usage

**Custom components (`components/`):**

components/
├── ui/ ← shadcn auto-generated
├── Header.tsx ← Nav, dark mode toggle, lang toggle, hamburger
├── MobileNav.tsx ← Sheet drawer for mobile
├── PostCard.tsx ← Cover image, title, date, excerpt, tags
├── TagBadge.tsx ← Clickable tag pill
├── LangToggle.tsx ← EN / Roman Urdu switcher (next/link, no cookies)
├── InfinitePostList.tsx ← Client component, infinite scroll
├── TableOfContents.tsx ← Sticky TOC, auto-generated from headings
├── ReadingTime.tsx ← Estimated read time from word count
├── PostNavigation.tsx ← Older / Newer post links
├── CopyCodeButton.tsx ← Client component, injected into code blocks
├── ShareButtons.tsx ← Share to X, copy link, etc.
└── MDXComponents.tsx ← Custom MDX overrides (pre, a, h1-h4, img...)

**shadcn components to install:**

| shadcn Component | Used In                          |
| ---------------- | -------------------------------- |
| `Button`         | Header, LangToggle, ShareButtons |
| `Badge`          | TagBadge, tags index             |
| `Card`           | PostCard                         |
| `Separator`      | Post page sections               |
| `Sheet`          | MobileNav                        |
| `Skeleton`       | Infinite scroll loading state    |
| `Toggle`         | LangToggle                       |
| `ScrollArea`     | TableOfContents                  |

**Key decisions locked in:**

- **Cover image** — stored inside the post folder. Path referenced in frontmatter as `cover: "./cover.jpg"`. Rendered via Next.js `<Image />` with `priority` on the post page
- **Reading time** — calculated at build time from word count in `lib/posts.ts`, stored as `readingTime: number` (minutes)
- **Table of contents** — auto-generated by parsing `h2`, `h3` elements from MDX at build time. Sticky on desktop, hidden on mobile
- **Copy code button** — `CopyCodeButton.tsx` is a client component injected into `MDXComponents.tsx` as a wrapper around every `<pre>` block
- **Share buttons** — share to X (Twitter), copy link to clipboard. No third-party SDK needed
- **Older/Newer navigation** — `lib/posts.ts` returns adjacent posts by date. Named `older`/`newer` (not `prev`/`next`) for clarity
- **LangToggle** — a simple `next/link`. On `/blog/[slug]` it links to `/blog/[slug]/ur` and vice versa. No cookies, no JS, no server round-trip. Hidden if `hasUrdu: false`

---

### MDX + Syntax Highlighting

**Packages:**

@next/mdx
@mdx-js/loader
@mdx-js/react
remark-gfm
rehype-pretty-code
shiki

**Shiki configuration:**

- Dark mode theme: `github-dark`
- Light mode theme: `github-light`
- Both themes loaded simultaneously — `rehype-pretty-code` handles the switch via CSS variables, Tailwind's `dark:` variant toggles them. Zero flash on theme change.

**Code block features:**

- **Line numbers** — added via CSS counters, no extra JS
- **File name label** — specified in the MDX code fence:
  `ts filename="lib/posts.ts"
// your code here`

- **Copy code button** — `CopyCodeButton.tsx` injected via `MDXComponents.tsx` as a wrapper around every `<pre>` block

**MDX rendering pipeline:**

.mdx file
→ gray-matter (strips and parses YAML frontmatter)
→ remark-gfm (GFM markdown: tables, strikethrough, task lists)
→ rehype-pretty-code (syntax highlighting, line numbers, file labels)
→ @next/mdx (compiles to React Server Component)
→ MDXComponents.tsx (maps elements to custom components)
→ rendered HTML (zero syntax highlighting JS sent to client)

**What `MDXComponents.tsx` overrides:**

| Element    | Custom Component                                                |
| ---------- | --------------------------------------------------------------- |
| `pre`      | Wraps with `CopyCodeButton` + file label                        |
| `a`        | Opens external links in new tab, internal links use `next/link` |
| `img`      | Replaced with Next.js `<Image />` for optimization              |
| `h2`, `h3` | Adds `id` attribute for TOC anchor links                        |

---

### RSS Feed

**Route:** `app/feed.xml/route.ts`
**Package:** `rss`

**Each feed item includes:**

- Post title
- Post URL (`yourblog.com/blog/[slug]`)
- Publish date
- Excerpt only (from `en.mdx` frontmatter)
- Tags as RSS categories

**Feed settings:**

- English only, 10 most recent posts
- Feed linked in `app/layout.tsx` via `<link>` tag in `<head>` so RSS readers auto-discover it
- Regenerated on every deployment (dynamic route, but cheap — just reads metadata)

---

### lib/ folder

lib/
├── posts.ts ← Scan folders, parse frontmatter via gray-matter, generate slugs,
│ hasUrdu flag, reading time, sort, older/newer adjacent posts
└── rss.ts ← RSS XML generation

Note: `lib/lang.ts` was removed — language switching is handled entirely via
URL (`/blog/[slug]` vs `/blog/[slug]/ur`). No cookies or server actions needed.

---

### Updates

#### Milestone 2 — Changes Made After Review

**`lib/posts.ts`**

- Switched from regex-based metadata parsing to `gray-matter` — more robust, handles edge cases like nested quotes and multiline values
- MDX frontmatter format changed from `export const metadata = {}` to YAML frontmatter (`---` block)
- Renamed `prev`/`next` to `older`/`newer` in `getPostBySlug` for clarity

**`lib/lang.ts` — Removed**

- Originally planned as a server action for reading/setting a language cookie
- Removed entirely — language switching is now handled via two separate static routes (`/blog/[slug]` and `/blog/[slug]/ur`)
- No cookies, no server actions, no client-side JS needed for language switching

**Bilingual routing — Rearchitected**

- Original plan used a single route + cookie to serve EN or UR content
- This conflicted with SSG — cookies are only available at request time, not build time
- New approach: two fully static routes per post. `LangToggle.tsx` is a plain `next/link` between them
