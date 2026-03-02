## 🏁 Milestones

### Milestone 1 — Project Setup

[x] Init Next.js 16.1 with TypeScript + Turbopack
[x] Install & configure Tailwind CSS v4
[x] Install & configure shadcn/ui (new-york style)
[x] Set up folder structure (all empty files/folders in place)

---

### Milestone 2 — Content Layer

[x] Set up `content/posts/` folder structure
[x] Write `lib/posts.ts` (scan folders, read metadata, strip date prefix, `hasUrdu` flag, reading time, prev/next)
[x] Write `lib/rss.ts`
[x] Write `lib/lang.ts` (cookie logic)
[x] Create 2-3 sample posts to test against

---

### Milestone 3 — MDX Pipeline

- Configure `@next/mdx` in `next.config.ts`
- Add `remark-gfm`
- Set up `rehype-pretty-code` + `shiki` (github-dark / github-light)
- Set up `mdx-components.tsx` with all overrides (`pre`, `a`, `img`, `h2`, `h3`)
- Verify MDX renders correctly with syntax highlighting

---

### Milestone 4 — Core Pages (Static)

- `app/layout.tsx` — ThemeProvider, LangProvider, Header
- `app/page.tsx` — Homepage (first 10 posts, SSG)
- `app/blog/[slug]/page.tsx` — Single post page
- `app/tags/page.tsx` — All tags index
- `app/tags/[tag]/page.tsx` — Posts by tag
- `app/about/page.tsx` — Renders `content/about.mdx`
- `app/not-found.tsx` — Custom 404

---

### Milestone 5 — Components

- `Header.tsx` + `MobileNav.tsx` (Sheet drawer)
- `PostCard.tsx` (cover image, title, date, excerpt, tags)
- `TagBadge.tsx`
- `LangToggle.tsx`
- `TableOfContents.tsx`
- `ReadingTime.tsx`
- `PostNavigation.tsx`
- `CopyCodeButton.tsx`
- `ShareButtons.tsx`

---

### Milestone 6 — Infinite Scroll

- `app/api/posts/route.ts` — batch fetcher (`?page=&limit=10`)
- `InfinitePostList.tsx` — client component, `Skeleton` loading state
- Wire into homepage

---

### Milestone 7 — Feeds & SEO

- `app/feed.xml/route.ts` — RSS feed
- `app/sitemap.xml/route.ts` — auto-generated sitemap
- `app/robots.txt/route.ts`
- `generateMetadata()` on every page
- Auto-discover RSS via `<link>` in `layout.tsx`

---

### Milestone 8 — Polish & QA

- Dark mode testing across all pages
- Mobile responsiveness
- Bilingual toggle testing (with and without `ur.mdx`)
- 404 page testing (bad slugs, bad tags)
- Lighthouse audit (performance, SEO, accessibility)
- Final content — write real `about.mdx`
