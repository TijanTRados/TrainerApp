# React

React 19. Examples are from `app/page.js`.

---

## The core idea

**A component is a function that returns markup.** React calls it, gets a
description of the UI, and updates the DOM to match.

```jsx
export default function Home() {
  return <h1>Trainer</h1>;
}
```

The mental model that makes everything else make sense:

> Your component is not a thing that exists and changes. It's a function that
> gets **called again** every time something changes, and returns what the UI
> should look like *for that data*.

You never reach into the page and update an element. You change data and let
React re-run the function.

---

## JSX

Markup inside JavaScript. It's not HTML — it compiles to function calls.

```jsx
return (
  <main className="p-4">
    <h1>{monthLabel} {year}</h1>
  </main>
);
```

Rules:

- **`className`, not `class`** — `class` is a reserved word in JavaScript
- **`{ }` switches back to JavaScript.** Anything inside is an *expression*
  whose result gets rendered
- **One root element per return.** Wrap siblings in a `<div>` or a Fragment
- **Self-close empty tags:** `<div />`, `<br />`
- **`{/* comments look like this */}`**

### Fragments

When you need to group elements without adding a wrapper to the DOM:

```jsx
const content = (
  <>
    <span>{day}</span>
    <span>{marker}</span>
  </>
);
```

Used in `page.js` because an extra `<div>` between the flex container and the
spans would break the centering.

### Expressions, not statements

`{ }` takes an *expression* — something with a value. No `if`, no `for`.

```jsx
{days.map(day => <div key={day}>{day}</div>)}   // ✅ map returns a value
{if (x) { ... }}                                 // ❌ not an expression
```

That's why lists are built with `.map()` rather than a loop, and why conditions
use `&&` or a ternary. Anything more complex goes **above the `return`**.

---

## Keep logic above the return

```jsx
export default function Home() {
  const daysInMonth = ...;      // calculations here
  const monthLabel = ...;

  return (
    <main>{monthLabel}</main>   // markup reads like markup
  );
}
```

Long method chains inside JSX get unreadable fast, and you can't put a comment
or a breakpoint in the middle of one. Compute above, name the result, use the
name below.

Same rule inside `.map()`: anything that doesn't change per iteration belongs
outside the loop.

---

## Lists and keys

```jsx
{days.map((day) => (
  <div key={day}>{day}</div>
))}
```

**Every item in a list needs a `key`** — a stable identifier React uses to track
which item is which between renders.

- Use the item's **id**: `key={t.id}` — best
- Use a stable value: `key={day}` — fine, day numbers don't move
- Use the index: `key={i}` — only when items have no identity (the blank cells
  before the 1st of the month)

Index keys break when the list reorders: React reuses the wrong DOM node, and
state attached to a row follows the wrong row.

The key goes on the **outermost element returned by the map** — including inside
an `if`/`else`, where both branches need it:

```jsx
if (training) {
  return <Link key={day} ...>{content}</Link>;
}
return <div key={day} ...>{content}</div>;
```

---

## Conditional rendering

**Ternary** — one of two things:

```jsx
{isOpen ? <Panel /> : <Placeholder />}
```

**`&&`** — a thing or nothing:

```jsx
{list.length > 0 && <List items={list} />}
```

> Use `list.length > 0`, not `list.length`. React renders `0` as the text "0".

**`if` above the return** — clearest for three or more cases. This is what
`page.js` uses for cell styling:

```js
let cellStyle = 'text-ink border-raised';
let marker = '';
if (training)           { cellStyle = '...'; marker = trainingNumber(training); }
else if (isUnavailable) { cellStyle = '...'; marker = 'x'; }
else if (isMeasurement) { cellStyle = '...'; marker = '!'; }
```

Start with the default, let each condition override it. Adding a state is one
line instead of another level of nesting. **The order of the branches is a
product decision** — it decides what wins when a training and a measurement fall
on the same day.

### Conditional classes

```jsx
className={`aspect-square border-2 ${cellStyle}`}
```

Constant classes first, the variable part interpolated at the end. When you add
a state, only the variable part changes.

⚠️ Tailwind **silently ignores class names it doesn't recognise**. A typo or an
undefined colour produces no error, no warning — it just does nothing. If styling
"isn't working," inspect the element and check whether the class is even there.

---

## State

```js
const [cursor, setCursor] = useState({ year: 2026, month: 6 });
```

- `cursor` — the current value
- `setCursor` — schedules a re-render with a new value
- the argument is the **initial value, used only on the first render**

On every later render React ignores that argument and hands back the stored
value.

### `cursor` is a snapshot

Within one render it never changes. `setCursor(...)` does not modify it — the
next line still sees the old value. It tells React "run this component again
with this new value."

That's why it's `const`: each render is a **fresh function call** with fresh
variables. `cursor` in render #1 and render #2 aren't one variable that changed;
they're two variables in two calls. React remembers the value in between.

### Updating from the previous value

```js
function shiftMonth(delta) {
  setCursor(({ year, month }) => {
    const d = new Date(year, month + delta, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
}
```

Passing a **function** to the setter gives you the current value as an argument.
Safer than `setCursor({ ...cursor, month: cursor.month + 1 })` when the new
value depends on the old one.

### Replace, don't mutate

```js
cursor.month = 7;                  // ❌ React never notices
setCursor({ ...cursor, month: 7 }); // ✅ new object
```

React compares by identity. Editing the object in place leaves the identity
unchanged, so nothing re-renders. Always create a new object or array.

### Why it doesn't loop forever

Rendering does not cause rendering. Only calling a setter does.

```
setCursor(...) → render → (nothing) → stop
```

It loops if you call a setter **during render**, or in a `useEffect` with no
dependency array. React throws "Maximum update depth exceeded" when that happens.

---

## Events

```jsx
<button type="button" onClick={() => shiftMonth(-1)}>‹</button>
```

- camelCase: `onClick`, `onChange`, `onSubmit`
- pass a **function**, not a call: `onClick={handleClick}` or
  `onClick={() => handleClick(arg)}`
- `onClick={handleClick()}` runs it immediately during render — a common bug
- `type="button"` on buttons that aren't submitting a form, otherwise they
  submit and reload the page

---

## Rules of hooks

Hooks are the `use*` functions. Two rules:

1. **Only at the top level of a component.** Never inside `if`, loops, or
   nested functions.
2. **Always in the same order on every render.**

React tracks hooks by call order, so a skipped hook corrupts its bookkeeping.
This is why any early return goes *below* all the hooks:

```jsx
const [cursor, setCursor] = useState(null);   // hooks first
if (!cursor) return <Skeleton />;             // returns after
```

### `useEffect`

Runs *after* render, in the browser only. For things outside React's world —
timers, subscriptions, direct DOM access.

```js
useEffect(() => { ... }, []);       // once, after mount
useEffect(() => { ... }, [value]);  // whenever value changes
useEffect(() => { ... });           // after every render ← usually a bug
```

The array is the **dependency list**. Omitting it plus setting state inside is
the classic infinite loop.

You need `useEffect` less than you'd think. Anything derivable from existing
state should just be computed during render — `daysInMonth`, `monthLabel` and
`offset` are all recalculated on every render, and that's correct.

---

## Props (coming next)

Passing data into a component, like HTML attributes:

```jsx
// parent
<TrainingRow training={t} number={3} />

// child
function TrainingRow({ training, number }) {
  return <div>{number}. {training.type}</div>;
}
```

`{ training, number }` in the parameter list is object destructuring — props
always arrive as a single object.

**Props are read-only.** A child never modifies them. To let a child change
something, pass a *function* down:

```jsx
<Row training={t} onToggle={handleToggle} />
```

Data flows down, events flow up.

### When to extract a component

Not by line count — by whether it has a **name and a job**. `TrainingRow`,
`CalendarCell`, `PackageHeader`. If you're passing eight props to it, it
probably wants to be two components, or shouldn't be extracted at all.

`page.js` is fine as one file today. It'll want splitting when the list, header
and grid all live in it.

---

## Controlled inputs (coming with the editor screen)

```jsx
const [name, setName] = useState('');

<input value={name} onChange={(e) => setName(e.target.value)} />
```

React state is the source of truth; the input just displays it. Set `value`
without `onChange` and the field appears frozen — the classic first form bug.

For checkboxes it's `checked` and `e.target.checked`.

---

## Debugging

- **`console.log` at the top of the component** — see every render and its data
- **React DevTools** (browser extension) — inspect the component tree, see props
  and state live. This is why components should have real names, not four
  functions all called `Home`
- **Inspect element** — check whether the rendered `class` attribute is what you
  expected. Separates "my JavaScript produced the wrong class" from "my CSS
  isn't defined," which is most of front-end debugging
