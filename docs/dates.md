# Dates

JavaScript's `Date` API is from 1995 and it shows. Most of this file is traps.

---

## Project rule: dates are strings

Store and compare dates as `'YYYY-MM-DD'` strings. Only build a `Date` object at
the last moment, to format something for display.

```js
{ id: 1, packageId: 1, date: '2026-07-02', time: '18:00' }
```

Why:

- **Comparison is free.** `a.date === b.date`, and `localeCompare` sorts them
  correctly because alphabetical order equals chronological order in this format.
- **No timezone.** A `Date` is a moment in time; `'2026-07-02'` is a calendar
  day. A training on the 2nd is on the 2nd regardless of where you open the app.
- **It matches the database.** Postgres `date` columns come back like this.

`time` stays a separate `'18:00'` string. Combining date and time into one
`Date` invites timezone problems for no benefit.

---

## Trap 1: months are 0-indexed

January is `0`. December is `11`.

```js
const month = 6;   // July
```

Days are 1-indexed. Years are normal. Only months are off by one.

```js
new Date(2026, 6, 2)    // 2 July 2026
```

When converting from a date string, subtract one:

```js
const [y, m, d] = '2026-07-02'.split('-').map(Number);
new Date(y, m - 1, d);
```

---

## Trap 2: string parsing is UTC, number parsing is local

```js
new Date('2026-07-02')   // ❌ UTC midnight
new Date(2026, 6, 2)     // ✅ local midnight
```

The string form is parsed as UTC. In Zagreb (UTC+2) that's 02:00 local — fine.
But west of UTC it's the *previous evening*, so `.getDate()` returns 1 instead
of 2. Calendars break in exactly this way.

**Always build from parts.**

```js
const [y, m, d] = training.date.split('-').map(Number);
const dateObj = new Date(y, m - 1, d);
```

---

## Trap 3: `getDay()` starts on Sunday

```js
new Date(2026, 6, 1).getDay()   // 3 = Wednesday
```

`0` is Sunday through `6` is Saturday. This calendar starts weeks on Monday, so
the columns need rotating:

```js
const offset = (new Date(year, month, 1).getDay() + 6) % 7;
```

Adding 6 and taking the remainder shifts everything one place: Sunday's `0`
becomes `6` (last column), Monday's `1` becomes `0` (first column).

Don't confuse `getDay()` (day of week) with `getDate()` (day of month).

---

## Useful trick: day 0 of next month

```js
const daysInMonth = new Date(year, month + 1, 0).getDate();
```

Day `0` of August means "one day before 1 August" — so 31 July. JavaScript rolls
out-of-range values automatically, which handles leap years for free.

The same rolling makes month navigation trivial:

```js
new Date(year, month + delta, 1)   // December + 1 → January of next year
```

No wrap-around logic needed.

---

## Formatting with `Intl`

`toLocaleDateString(locale, options)` handles names, order, and language.

```js
new Date(2026, 6, 1).toLocaleDateString('en-GB', { month: 'long' });
// "July"

new Date(2026, 6, 2).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
// "Thu 2"
```

Options you'll use: `weekday` (`'short'` | `'long'`), `day` (`'numeric'` |
`'2-digit'`), `month` (`'numeric'` | `'2-digit'` | `'short'` | `'long'`), `year`.

### Always pass an explicit locale

```js
.toLocaleDateString()            // ❌ runtime default
.toLocaleDateString('default')   // ❌ also the runtime default
.toLocaleDateString('en-GB')     // ✅
```

`'default'` is not a locale — it's a keyword meaning "whatever this machine
uses." The server and the browser can differ, which causes the hydration error
below.

`'en-EN'` is not a locale either. The second part is a **region**: `en-GB`,
`en-US`. `en-GB` gives day-first dates and Monday-first weeks, which matches
this app.

`toLocaleUpperCase()` takes a locale too, for the same reason.

### Locale quirks

Slavic languages decline month names. Croatian gives `srpanj` on its own but
`31. srpnja` in a full date. Let `Intl` format the whole date rather than
gluing pieces together.

---

## Hydration mismatches

Next renders your page twice: once on the server, once in the browser. If the
two produce different HTML, React throws a hydration error.

Date code is the usual cause:

- **Locale** — server `en-US`, browser `hr-HR` → "July" vs "srpanj"
- **Timezone** — server UTC, browser UTC+2 → different day near midnight
- **`new Date()` / `Date.now()`** — different values by definition

Fixes:

1. **Pass explicit locales** everywhere.
2. **Don't compute "today" during render.** Use a fixed initial state:
   ```js
   const [cursor, setCursor] = useState({ year: 2026, month: 6 });
   ```
   Both sides compute the same thing, and the server sends real HTML.
3. Only if you truly need the visitor's clock, set it in a `useEffect` after
   mount — at the cost of a flash of empty state on every load.

---

## GitHub's contribution graph uses UTC

Not a code issue, but it caught us. A commit at 01:46 in Zagreb (UTC+2) is
23:46 the *previous day* in UTC, so the green square lands a day earlier than
you expect. Nothing is broken — the graph and your clock just disagree.

---

## Quick reference

```js
// build (from parts, never a string)
const [y, m, d] = '2026-07-02'.split('-').map(Number);
const date = new Date(y, m - 1, d);

// month facts
new Date(year, month + 1, 0).getDate();     // days in month
(new Date(year, month, 1).getDay() + 6) % 7; // Monday-first offset

// back to a string
`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

// display
date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
```

If dates ever get genuinely complicated, `date-fns` is the library people reach
for. Not needed here — everything above is enough for a calendar.
