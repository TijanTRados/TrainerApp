# JavaScript

Everything here is in `app/page.js` right now, or about to be.

---

## Array methods

**They are all `for` loops in a costume.** These two do exactly the same thing:

```js
for (let index = 0; index < trainings.length; index++) {
  const training = trainings[index];
  console.log(index, training.date);
}

trainings.forEach((training, index) => {
  console.log(index, training.date);
});
```

Each method loops over the array and calls your function once per item, passing
`(item, index)`. The names `item`/`index`/`t`/`i` are **yours to choose** —
there's nothing magic about them. Prefer full words while learning.

The only difference between the methods is what they do with your return value.

| Method | Returns | Use it when |
|---|---|---|
| `forEach` | nothing | you want a side effect |
| `map` | new array, same length | transforming every item |
| `filter` | new array, fewer items | keeping some items |
| `find` | the first matching **item**, or `undefined` | you want one object |
| `some` | `true` / `false` | you only need to know *if* one exists |
| `sort` | **the same array, reordered** | ⚠️ mutates — see below |
| `indexOf` | position of an item, or `-1` | you have the item, need its place |

### In this project

```js
// find — I want the training object itself
const training = trainings.find(t => t.date === dateStr);

// some — I only need yes/no
const isUnavailable = unavailableDates.some(d => d.date === dateStr);

// filter + sort + indexOf — this package's sessions in date order
trainings
  .filter(t => t.packageId === training.packageId)
  .sort((a, b) => a.date.localeCompare(b.date))
  .indexOf(training) + 1;
```

`find` vs `some`: same test, different answer. Use `find` when you need the
object (to read `t.id`), `some` when a boolean is enough.

### Chaining

Because `filter` and `map` return new arrays, you can chain them. Read left to
right as a sentence:

> take the trainings → keep this package's → put them in date order → find where
> this one sits

```js
trainings.filter(...).sort(...).indexOf(training)
```

Each step hands its result to the next. `find` and `some` end a chain (they
return an item or a boolean, not an array).

---

## `.sort()` mutates

This is the one that bites hardest.

```js
const a = [3, 1, 2];
const b = a;      // NOT a copy — two names, one array
b.sort();
a;                // [1, 2, 3]  ← a changed too
```

`=` copies the *reference*, not the array. And `sort` rearranges in place rather
than returning a new array.

**Fix: copy first with spread.**

```js
const c = [3, 1, 2];
const d = [...c];
d.sort();
c;                // [3, 1, 2]  ← untouched
```

**Why it matters here:** `trainings` is imported from `lib/mockData.js`, shared
by every component. Sorting it directly reorders the data for the whole app, and
the bug surfaces somewhere unrelated.

**When you don't need the spread:** `.filter()` already returns a new array, so
`.filter(...).sort(...)` is safe. Only `[...trainings].sort()` needs it.

### Comparator functions

`sort` takes a function returning a negative number, zero, or positive:

```js
.sort((a, b) => a.date.localeCompare(b.date))   // strings
.sort((a, b) => a.id - b.id)                    // numbers
```

`localeCompare` compares strings alphabetically. It works perfectly on
`YYYY-MM-DD` because that format sorts alphabetically *and* chronologically —
one reason we chose it.

Default `.sort()` with no function converts everything to strings, so
`[10, 9, 1].sort()` gives `[1, 10, 9]`. Always pass a comparator for numbers.

---

## Spread `...`

"Unpack the contents here."

```js
[...array]        // new array, same items
{...object}       // new object, same properties
f(...args)        // spread an array into function arguments
```

**It's shallow.** The container is new; the things inside are the same things.

```js
const copy = [...mock.trainings];
copy[0].time = '23:00';
mock.trainings[0].time;   // '23:00' — same object inside
```

So spread protects you from reordering, not from editing items.

---

## Destructuring

Pulling values out by position (arrays) or name (objects).

```js
// array — by position
const [cursor, setCursor] = useState(null);

// object — by name
const { year, month } = cursor;

// in a parameter list
function shiftMonth({ year, month }) { ... }
```

`useState` returns a two-item array; that first line names both items in one go.
The names are yours — `[cursor, setCursor]` could be `[a, b]`, but
`[thing, setThing]` is the universal convention.

Object destructuring matches by **name**, so order doesn't matter:

```js
const { month, year } = cursor;   // same as { year, month }
```

---

## Template literals

Backticks instead of quotes, with `${...}` holes for JavaScript:

```js
const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
```

Used constantly here for building date strings, hrefs, and conditional
classNames:

```jsx
className={`aspect-square border-2 ${cellStyle}`}
href={`/trainings/${training.id}`}
```

They can also span multiple lines, unlike regular strings.

> On a German keyboard the backtick is `Shift` + the key left of Backspace, then
> `Space` (it's a dead key).

---

## Strings

```js
String(day).padStart(2, '0')     // 2 → "02"
'2026-07-02'.split('-')          // ['2026', '07', '02']  — strings!
'2026-07-02'.startsWith('2026-07')
'upper'.toUpperCase()            // 'UPPER'
Number('07')                     // 7
```

`split` gives you **strings**, not numbers. Passing `'07'` where a number is
expected usually works by coercion, but not always — convert with `Number()`.

---

## Truthiness

Every value is either truthy or falsy in an `if`.

**Falsy:** `false`, `0`, `''`, `null`, `undefined`, `NaN`. Everything else is
truthy — including `[]` and `{}`.

```js
if (training) { ... }   // an object is truthy; undefined is falsy
```

That's why `.find()` works so neatly in a condition: it returns an object or
`undefined`.

### `||` for defaults

```js
(counts[id] || 0) + 1
```

Returns the right side when the left is falsy. Careful: `0 || 5` gives `5`,
which is wrong if `0` is a legitimate value. `??` (nullish coalescing) only
falls back on `null`/`undefined`:

```js
count ?? 0       // 0 stays 0
```

### `&&` in JSX

```jsx
{list.length === 0 && <p>No trainings this month</p>}
```

Renders the element when the left side is true, nothing when false.

**Gotcha:** don't use a bare number on the left.

```jsx
{list.length && <p>…</p>}    // ❌ renders "0" when empty
{list.length > 0 && <p>…</p>} // ✅
```

React renders `0` as the text "0" rather than treating it as nothing.

---

## `const` vs `let`

- `const` — the name never gets reassigned
- `let` — you will reassign it

```js
const dateStr = `...`;      // fixed
let cellStyle = 'text-ink border-raised';
if (training) cellStyle = 'bg-sakura';   // reassigned → let
```

`const` on an object or array still lets you *change the contents* — it only
stops the name pointing somewhere else. `const arr = []; arr.push(1)` is legal.

Default to `const`. Switch to `let` only when the reassignment appears.

---

## Objects as lookup tables

```js
const counts = {};
counts[training.packageId] = 1;
```

`counts[1]` on an **object** means "the property named `1`" — a labelled box.
`arr[1]` on an **array** means "position 1". Same brackets, different structure.

Use an object when your keys are *identities* (ids), an array when they're
*positions*. Database ids have gaps and arbitrary values, so they're identities.

Building a lookup once and reading it many times is O(1) per read, versus
re-scanning the array each time. With 20 items it doesn't matter; the habit does.

---

## Arrow functions

```js
t => t.date === dateStr           // one arg, one expression, implicit return
(t, i) => t.id + i                // multiple args need parens
(day) => { return <div/>; }       // braces → explicit return required
```

The switch from `(` to `{` is where people trip: with parentheses the value is
returned automatically, with braces you must write `return`.

```jsx
{days.map((day) => (
  <div>{day}</div>          // implicit return
))}

{days.map((day) => {
  const x = something;      // need statements first
  return <div>{x}</div>;    // so explicit return
})}
```

---

## The console is your playground

`lib/mockData.js` puts the data on `window.mock` in development:

```js
mock.trainings
mock.trainings.filter(t => t.packageId === 2)
mock.trainings.map(t => t.date)
console.table(mock.trainings)
```

Work out the expression in the console first, then move it into the file. Much
faster than editing, saving, and squinting at the page.
