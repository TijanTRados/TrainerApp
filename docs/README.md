# Trainer App — Learning Notes

A reference library for this project. Everything here is grounded in code that
actually exists in `app/` and `lib/` — no abstract examples.

## Contents

| File | What's in it |
|---|---|
| [javascript.md](./javascript.md) | Array methods, spread, destructuring, template literals, truthiness |
| [dates.md](./dates.md) | The `Date` traps, 0-indexed months, `Intl` formatting, timezones |
| [react.md](./react.md) | Components, JSX, props, state, keys, conditional rendering, hooks |
| [nextjs.md](./nextjs.md) | App Router, file conventions, server vs client, `Link`, `params` |
| [tailwind.md](./tailwind.md) | The sushi-dev theme, pixel-art conventions, class patterns |

## How to use these

**Search across all of them** with `Ctrl+Shift+F` in VS Code. Faster than
scrolling — search for `.filter` or `key` or `hydration` and jump straight there.

**Add your own notes.** These are your files, in your repo, in git. When you
work something out, write it down here. The act of writing it is most of the
learning.

**Try things in the browser console.** `lib/mockData.js` exposes the data on
`window.mock` in development, so you can experiment against real data:

```js
mock.trainings
mock.trainings.filter(t => t.packageId === 2)
console.table(mock.trainings)
```

Remove that block before deploying.

## Versions in this project

- Next.js `16.2.12` (App Router)
- React `19.2.4`
- Tailwind CSS `v4` (theme lives in `app/globals.css`, not a config file)
- JavaScript, no TypeScript

Version matters when you search online. Tailwind v3 answers won't work here, and
a lot of Next tutorials still describe the old Pages Router.

## Where things live

```
app/
  layout.js              wraps every page — <html>, <body>, fonts
  globals.css            Tailwind import + @theme colour tokens
  page.js                / — calendar + list
  profile/page.js        /profile
  stats/page.js          /stats
  trainings/[id]/page.js /trainings/1 — workout mode
  trainings/[id]/edit/   /trainings/1/edit — trainer editor
lib/
  mockData.js            hardcoded data, stands in for the database
docs/                    you are here
```

## Project conventions

- **Dates are strings**, always `YYYY-MM-DD`. Never store a `Date` object.
  See [dates.md](./dates.md) for why.
- **Colours come from the theme.** Use role names (`bg-surface`, `text-ink`) in
  components, never raw hex. See [tailwind.md](./tailwind.md).
- **Derived values are computed, not stored.** A training's number in its
  package is calculated from date order — it isn't a field.
- **Build order:** routes → static UI → state → database last.
