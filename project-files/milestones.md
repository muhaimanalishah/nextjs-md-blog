## 🏁 Milestones

### Milestone 1 — Project Setup ✅

- [x] Init Next.js 16.1 with TypeScript + Turbopack
- [x] Install & configure Tailwind CSS v4
- [x] Install & configure shadcn/ui (new-york style)
- [x] Set up `next-themes` for dark mode
- [x] Set up folder structure (all empty files/folders in place)

---

### Milestone 2 — Content Layer ✅

- [x] Set up `content/posts/` folder structure
- [x] Write `lib/posts.ts` (scan folders, parse frontmatter via `gray-matter`, strip date prefix, `hasUrdu` flag, reading time, `older`/`newer` adjacent posts)
- [x] Write `lib/rss.ts`
- [x] ~~Write `lib/lang.ts` (cookie logic)~~ — **Removed.** Language switching handled via separate static routes, no cookies needed
- [x] Create 2-3 sample posts to test against (updated to YAML frontmatter)

---

### Milestone 3 — MDX Pipeline ✅

- [x] Install MDX packages (`@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`)
- [x] Configure `@next/mdx` in `next.config.ts`
- [x] Add `remark-gfm`
- [x] Set up `rehype-pretty-code` + `shiki` (github-dark / github-light, dual theme via CSS variables)
- [x] Add line numbers via CSS counters
- [x] Add file name label support in code fences
- [x] Set up `mdx-components.tsx` with all overrides (`pre`, `a`, `img`, `h2`, `h3`)
- [x] Verify MDX renders correctly with syntax highlighting in both light and dark mode

---

### Milestone 4 — Core Pages (Static) ✅

- [x] `app/layout.tsx` — ThemeProvider, Header (no LangProvider needed)
- [x] `app/page.tsx` — Homepage, first 10 posts SSG
- [x] `app/not-found.tsx` — Custom 404 (handles bad slugs, bad tags, missing `/ur` routes)
- [x] `app/blog/[slug]/page.tsx` — English post page (SSG via `generateStaticParams`)
- [x] `app/blog/[slug]/ur/page.tsx` — Roman Urdu post page (SSG, only for posts where `hasUrdu: true`, `notFound()` otherwise)
- [x] `app/tags/page.tsx` — All tags index, sorted by post count
- [x] `app/tags/[tag]/page.tsx` — Posts by tag (SSG via `generateStaticParams`)
- [x] `app/about/page.tsx` — Renders `content/about.mdx`

---

### Milestone 5 — Components

- [ ] `Header.tsx` — Nav, dark mode toggle, lang toggle, hamburger menu
- [ ] `MobileNav.tsx` — Sheet drawer for mobile
- [ ] `PostCard.tsx` — Cover image, title, date, excerpt, tags
- [ ] `TagBadge.tsx` — Clickable tag pill linking to `/tags/[tag]`
- [ ] `LangToggle.tsx` — Plain `next/link`: `/blog/[slug]` ↔ `/blog/[slug]/ur`. Hidden if `hasUrdu: false`
- [ ] `InfinitePostList.tsx` — Client component, infinite scroll with Skeleton loading state
- [ ] `TableOfContents.tsx` — Sticky on desktop, hidden on mobile, auto-generated from `h2`/`h3`
- [ ] `ReadingTime.tsx` — Displays `readingTime` from post metadata
- [ ] `PostNavigation.tsx` — Older / Newer post links
- [ ] `CopyCodeButton.tsx` — Client component, injected into every `<pre>` block
- [ ] `ShareButtons.tsx` — Share to X, copy link to clipboard
- [ ] `MDXComponents.tsx` — All element overrides (`pre`, `a`, `img`, `h2`, `h3`)

---

### Milestone 6 — Infinite Scroll

- [ ] `app/api/posts/route.ts` — batch fetcher (`?page=2&limit=10`), returns posts as JSON
- [ ] `InfinitePostList.tsx` — client component, intersection observer to trigger next fetch, Skeleton while loading
- [ ] Wire `InfinitePostList.tsx` into `app/page.tsx` — first 10 posts passed as props from SSG, client fetches the rest

---

### Milestone 7 — Feeds & SEO

- [ ] `app/feed.xml/route.ts` — RSS feed, English only, 10 most recent posts, excerpt only
- [ ] `app/sitemap.xml/route.ts` — includes all `/blog/[slug]` and `/blog/[slug]/ur` routes (only where `hasUrdu: true`)
- [ ] `app/robots.txt/route.ts`
- [ ] `generateMetadata()` on every page (`/`, `/blog/[slug]`, `/blog/[slug]/ur`, `/tags`, `/tags/[tag]`, `/about`)
- [ ] Auto-discover RSS via `<link rel="alternate">` in `app/layout.tsx`

---

### Milestone 8 — Polish & QA

- [ ] Dark mode testing across all pages
- [ ] Mobile responsiveness across all pages
- [ ] Bilingual toggle testing — verify `/blog/[slug]/ur` works, lang toggle hidden when `hasUrdu: false`, 404 on missing `/ur` routes
- [ ] 404 page testing — bad slugs, bad tags, `/ur` on English-only posts
- [ ] Infinite scroll testing — correct batch order, Skeleton state, end of list behavior
- [ ] RSS feed validation — test in an actual RSS reader
- [ ] Lighthouse audit (performance, SEO, accessibility)
- [ ] Write real `content/about.mdx`
