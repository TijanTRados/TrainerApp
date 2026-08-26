# Tailwind & the sushi-dev theme

Tailwind **v4**. The theme lives in `app/globals.css` — there is no
`tailwind.config.js`. Most tutorials online describe v3; if an answer tells you
to edit a config file, it's for the old version.

---

## The theme

`app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* palette */
  --color-sakura:  #F7C1D0;
  --color-blossom: #E68CA8;
  --color-momiji:  #E58358;
  --color-yuzu:    #F5D48A;
  --color-matcha:  #A9C79C;
  --color-ramune:  #A6C9E2;
  --color-taro:    #C1A9D9;

  /* roles */
  --color-bg:      #221F2A;
  --color-surface: #2A2732;
  --color-raised:  #39333F;
  --color-outline: #16141C;
  --color-ink:     #F0E9E0;
  --color-muted:   #8B8194;
}
```

Every `--color-x` becomes usable as `bg-x`, `text-x`, `border-x` automatically.

### Palette vs roles

**Use role names in components. Never palette names, never raw hex.**

```jsx
className="bg-surface text-ink border-raised"   // ✅
className="bg-rice text-nori"                   // ✗ palette
className="bg-[#2A2732]"                        // ✗ hex
```

The palette is the paint set; the roles are what you paint with. When the
background turns out too purple, you change one line instead of hunting through
forty files.

| Role | Used for |
|---|---|
| `bg` | page background (on `<body>` in `layout.js`) |
| `surface` | cards and list rows (calendar cells currently sit on `bg`) |
| `raised` | borders, and the "unavailable" cell state |
| `outline` | the hard dark edge on bright cells |
| `ink` | body text |
| `muted` | secondary text, day-name headers |

### Meanings in the calendar

| State | Classes |
|---|---|
| normal day | `text-ink border-raised` (no background — the page `bg` shows through) |
| training | `bg-sakura text-outline border-outline` |
| unavailable | `bg-raised text-muted border-raised` |
| measurement | `bg-yuzu text-outline border-outline font-bold` |

Note that text flips to `text-outline` (dark) on the pastel cells. **Pastels are
background colours only** — cream text on sakura is unreadable. This is the
main contrast rule for this palette.

---

## Pixel-art conventions

Three things carry the aesthetic:

1. **No rounded corners.** Never `rounded-*`. Pixel art is square.
2. **Chunky borders** — `border-2` or `border-4`. Plain `border` (1px) looks
   soft and breaks the effect.
3. **Bright fill + hard dark outline** — `bg-sakura border-outline`. That's
   literally how a sprite is drawn, and it's why the theme reads as pixel art
   rather than as a generic wellness app.

Fonts, when we get to them: Silkscreen or Press Start 2P for headings only, body
text stays normal. Pixel fonts are unreadable in paragraphs.

---

## Tailwind fails silently

**An unrecognised class name does nothing. No error, no warning.**

`bg-destructive`, `bg-emerald`, `text-primary` — all of these look plausible and
all do nothing here. (`bg-destructive` and friends come from shadcn/ui;
`bg-emerald` isn't valid Tailwind at all, the real class is `bg-emerald-500`.)

A specific trap: `border-2` sets the border *width*. Without a colour class the
colour falls back to `currentColor` — the text colour. So a missing
`border-raised` shows up as cream borders rather than as no borders.

**Debugging:** inspect the element. If the class isn't in the rendered `class`
attribute, it's your JavaScript. If it's there but has no effect, the class name
is wrong or the colour isn't defined in `@theme`.

If you've just added a colour to `@theme` and it isn't working, restart the dev
server — v4 doesn't always pick up theme changes through hot reload.

---

## Class patterns in this project

```
p-4 max-w-md mx-auto        page container — mobile-first width, centred
grid grid-cols-7 gap-1      the calendar grid
aspect-square               forces height to equal width
flex items-center justify-center   centre content both ways
relative / absolute         corner day number inside a cell
space-y-2                   vertical gap between children
mt-4 pt-4 border-t-2        section divider
flex-1                      "take the remaining space" in a flex row
```

### Centring

`flex items-center justify-center` is the standard. In a row, `items-center` is
vertical and `justify-center` is horizontal. (They swap with `flex-col`.)

### Absolute positioning

```jsx
<div className="relative ...">
  <span className="absolute top-0.5 left-1">{day}</span>
</div>
```

`absolute` positions against the nearest ancestor with `relative`. **Forget
`relative` on the parent and the child flies to the corner of the page** — the
most common mistake with absolute positioning.

### Arbitrary values

```jsx
className="text-[10px]"
```

Square brackets for a value not in Tailwind's scale. Fine occasionally; if
you're using them everywhere, add a token to `@theme` instead.

---

## Mobile-first

Unprefixed classes apply at all sizes. Prefixes apply **from that width up**:

```jsx
className="grid-cols-1 md:grid-cols-2"
```

One column everywhere, two from medium screens up. So write the phone layout
first and add prefixes for bigger screens — never the reverse.

`max-w-md mx-auto` on `<main>` means the app is a phone-width column that stays
centred on desktop. Design at phone width.

---

## Conditional classes

```jsx
className={`aspect-square border-2 ${cellStyle}`}
```

Constants first, variable part interpolated at the end.

Tailwind scans your source for **complete class strings**, so never build them
from pieces:

```jsx
className={`bg-${color}`}          // ✗ never generated
className={isX ? 'bg-sakura' : 'bg-surface'}   // ✅ both strings visible
```

This is why the `if/else` chain assigns whole class strings rather than
assembling them.

---

## Formatting

`Shift+Alt+F` formats the current file. Turn on format-on-save:

```json
"editor.formatOnSave": true
```

Long className strings are normal in Tailwind and don't need breaking up. If one
genuinely gets unmanageable, pull it into a named constant above the return —
`navButtonClass` in `page.js` does exactly that.
