# Next.js

Next 16, App Router. **Searching online: ignore anything mentioning `pages/`,
`getServerSideProps` or `getStaticProps`** — that's the old Pages Router and
none of it applies here.

---

## Routing is folders

A folder under `app/` is a URL segment. A `page.js` inside it makes that segment
a real page.

```
app/page.js                      →  /
app/profile/page.js              →  /profile
app/stats/page.js                →  /stats
app/trainings/[id]/page.js       →  /trainings/1
app/trainings/[id]/edit/page.js  →  /trainings/1/edit
```

No route config anywhere. The file tree *is* the routing table.

A folder without a `page.js` is just organisation — it doesn't create a route.

### Special filenames

| File | What it does |
|---|---|
| `page.js` | the page for that route |
| `layout.js` | wraps the page and everything below it |
| `loading.js` | shown while the page loads |
| `error.js` | shown if the page throws |
| `not-found.js` | 404 |

Only `page.js` and `layout.js` are in use here so far.

### `[id]` — dynamic segments

Square brackets make a segment a variable. Next passes it in as `params`:

```jsx
export default async function TrainingPage({ params }) {
  const { id } = await params;
  ...
}
```

**`params` is a Promise**, so the function must be `async` and you `await` it.
That surprises everyone — it's a change in recent Next versions.

`id` arrives as a **string**, always. `'1'`, not `1`. Convert with `Number(id)`
before comparing to `t.id`.

---

## Only `page.js` and `layout.js` become pages

Which is why `lib/` lives **outside** `app/`. Plain JavaScript modules —
`mockData.js`, helpers, future database code — belong outside the routing tree.
`app/` is routes.

---

## Server and Client Components

**Every component is a Server Component by default.** It runs on the server, and
its JavaScript is never sent to the browser.

`'use client'` at the top of a file switches it — that component and everything
it imports gets bundled and shipped to the browser.

```jsx
'use client';
import { useState } from 'react';
```

**You need `'use client'` for:**

- `useState`, `useEffect`, any hook
- `onClick`, `onChange`, any event handler
- browser APIs — `window`, `localStorage`

**Server Components can:**

- read files, query the database directly, hold secrets
- be `async` and `await` data with no `useEffect`
- ship zero JavaScript

`app/page.js` is a Client Component because the month buttons need `useState`.
That's the correct trade. But note the granularity: you can keep a page on the
server and mark only the interactive **child** as client, so you're not shipping
the whole page. Worth doing once a page has a lot of static content around a
small interactive bit.

`app/layout.js` has no `'use client'` — it stays a Server Component.

---

## Layouts

`app/layout.js` wraps every page. It's where `<html>` and `<body>` live, and
it's the only place they appear.

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={...}>
      <body className="bg-bg text-ink min-h-screen">{children}</body>
    </html>
  );
}
```

`children` is whatever page is currently active. Anything you put here — a nav
bar, the profile avatar — appears on every page without repeating it.

Layouts **don't re-render** when you navigate between pages inside them. State
in a layout survives navigation; state in a page doesn't.

You can add a `layout.js` in any folder to wrap just that section.

---

## `<Link>`, not `<a>`

```jsx
import Link from 'next/link';

<Link href={`/trainings/${training.id}`}>…</Link>
```

`<Link>` swaps only what changed and prefetches the target while it's on screen.
A plain `<a>` throws away the whole page and rebuilds it — slower, and it loses
React state.

Use `<a>` only for external URLs.

**Gotcha:** it renders an `<a>`, which is `display: inline`. Inside a grid or
flex layout that can collapse the box — add `block` or `flex` to its className.
In `page.js` the `flex` in `cellClass` already handles it.

For navigation from code (after saving a form, say):

```jsx
'use client';
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/trainings/1');
```

Note `next/navigation`, not `next/router` — the latter is the old API.

---

## `@/` imports

```js
import { trainings } from '@/lib/mockData';
```

`@/` means "project root," defined in `jsconfig.json`:

```json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```

It's not built into JavaScript — it's a mapping this project declares. Saves
writing `../../../lib/mockData` from deep files.

If `Module not found: Can't resolve '@/lib/...'` appears, check in this order:

1. Is the folder where you think it is? (`lib/` next to `app/`, not inside it)
2. Does `jsconfig.json` exist at the root with that `paths` block?
3. Restart the dev server — it reads `jsconfig.json` at startup
4. **Filename case.** `mockData.js` ≠ `mockdata.js`. Windows won't care; the
   Linux box that builds your deployment will.

---

## Fonts

`app/layout.js` loads fonts with `next/font`, which self-hosts them — no request
to Google at runtime, no layout shift.

```js
import { Geist } from "next/font/google";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
```

It exposes a CSS variable you attach to `<html>`. To add the pixel font later,
import `Silkscreen` the same way and give it its own variable.

---

## `npm` commands

| Command | What it does |
|---|---|
| `npm run dev` | dev server with hot reload — the one you live in |
| `npm run build` | production build; catches errors dev mode tolerates |
| `npm start` | serves the production build |
| `npm run lint` | ESLint |

Run `npm run build` before deploying. Some things — unused imports, bad hook
usage, missing `key`s — only surface there.

---

## Deploying

Vercel watches the GitHub repo: push to `main` and it builds and deploys.
Feature branches get their own preview URL.

Two things that pass locally and fail on Vercel:

- **Filename case**, as above. Linux is case-sensitive.
- **Anything using `window` outside a `useEffect`** — it doesn't exist during
  the server render. Guard with `typeof window !== 'undefined'`, which is why
  the `window.mock` block in `mockData.js` has that check.

---

## Hydration errors

"Text content does not match server-rendered HTML" means the server and browser
produced different output. Nearly always dates, locales, `Math.random()`, or
`window`. See [dates.md](./dates.md#hydration-mismatches).
