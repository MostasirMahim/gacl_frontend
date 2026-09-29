# GACL Enterprise Dashboard — Comprehensive Design System Guide

> **Purpose**: This document is the single source of truth for building, improving, and extending
> UI across the entire GACL platform. Every page and component must reference and follow
> these conventions to maintain a consistent, premium enterprise experience.

---

## 1. Typography System

### Font Families
| Role | Font | Tailwind Class |
|---|---|---|
| **Primary (UI text)** | `Plus Jakarta Sans` | `font-primary` |
| **Secondary (mono, data)** | `Manrope` | `font-secondary` |

### Text Scale
| Use Case | Class | Weight | Notes |
|---|---|---|---|
| Page Hero / H1 | `text-2xl sm:text-[26px]` | `font-medium` | Not bold — refined editorial |
| Section Heading (H2) | `text-sm` | `font-semibold` | Used in `SectionTitle` |
| Card Title | `text-xs` | `font-semibold` | Max 2 lines, truncate |
| Sub-label / Caption | `text-xs` | `font-medium` | `text-muted-foreground` |
| Data Values / Numbers | `text-2xl–text-3xl` | `font-bold` or `font-extrabold` | Animated via `AnimatedNumber` |
| Badge / Pill Text | `text-[10px]–text-xs` | `font-semibold` | PX spacing, rounded |
| Nav Items (top-level) | `text-xs` | `font-semibold` | |
| Nav Items (child) | `text-xs` | `font-medium` | |
| Table Body | `text-xs` | `font-normal` | |
| Timestamps / Meta | `text-[10px]–text-xs` | `font-medium` | `text-muted-foreground` |

### Typography Rules
- **Never use `font-black` for UI labels** — reserve it for gauges/meters center values
- **Letter spacing**: Use `tracking-tight` for headings/numbers, `tracking-normal` for body
- **Line height**: `leading-none` for number values, `leading-snug` for hero text
- **All numbers that change** → use `<AnimatedNumber>` from `DashAtoms.tsx`

---

## 2. Color System & Tokens

### Core Semantic Tokens
The entire system is theme-aware via CSS custom properties. **Never hardcode hex values.**

```css
/* Background hierarchy (dark → light elevation) */
--background   → Page canvas (lowest / darkest in dark mode)
--card         → Surface elevation (elevated above background)
--muted        → Inner wells, table rows, input bg
--popover      → Dropdown, tooltip, dialog surface
```

```css
/* Foreground hierarchy */
--foreground            → Primary text (headings, important labels)
--muted-foreground      → Secondary text (sub-labels, placeholders)
text-foreground/75      → Inactive nav items
text-foreground/50      → Inactive icons, disabled hints
text-foreground/30      → Decorative / barely visible hints
```

```css
/* Brand accent — adapts to active theme */
--primary               → Brand color (buttons, active states, highlights)
--primary-foreground    → Text on primary backgrounds
```

### Semantic Colors (Fixed, Non-Themed)
| Meaning | Color | Class |
|---|---|---|
| **Success / Active / Online** | Emerald 500 | `text-emerald-500` / `bg-emerald-500` |
| **Warning / Pending** | Amber 500 | `text-amber-500` / `bg-amber-500` |
| **Danger / Error** | Destructive token | `text-destructive` |
| **Info / Accent** | Sky 500 | `text-sky-500` |
| **Online status dot** | Emerald 500 | `bg-emerald-500` |
| **Offline / Closed** | `muted-foreground` | `bg-muted-foreground` |

### Alpha / Opacity Layering Pattern
```
bg-primary/5    → Subtle page-level tint (dashboard content wrapper)
bg-primary/8    → Header hero background gradient
bg-primary/10   → Icon container backgrounds, active nav pill
bg-primary/12   → Active nav item background (leaf links)
bg-primary/15   → Slightly more visible active/hover
bg-primary/20   → Badge backgrounds
bg-primary/25   → Border on active card / pill
border-primary/20–/35 → Glow borders on icon containers
```

### Border Conventions
```
border-border/50      → Sidebar dividers
border-border/60      → Header bottom, content wrapper
border-border/70–/80  → Card borders, input borders
border-border/90      → Strong context, table cell borders
```

---

## 3. Motion & Animation

### Animation Library
**Framer Motion** (`framer-motion`). All primary dashboard components animate on mount.

### Standard Entrance Animation
```tsx
// Universal card/section entrance — use for ALL new cards
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
  whileHover={{ y: -2 }}
>
```
- `ease: [0.22, 1, 0.36, 1]` = custom ease-out-expo — smooth, organic, premium
- `delay` = staggered (0, 0.05, 0.1, 0.15...) for grid items
- `whileHover={{ y: -2 }}` = subtle lift on hover (cards only, not table rows)

### Section-Level Entrance
Use the `<SectionMotion>` atom from `DashAtoms.tsx`:
```tsx
<SectionMotion delay={0.3} className="lg:col-span-2">
  <DashCard>...</DashCard>
</SectionMotion>
```

### Spring Animation (Tab Indicators)
```tsx
<motion.div
  layoutId="active-section-indicator"
  transition={{ type: "spring", stiffness: 450, damping: 32 }}
/>
```

### Number Counting Animation
```tsx
import { AnimatedNumber } from "@/components/DashBoard/ui/DashAtoms"
<AnimatedNumber value={value} prefix="$" suffix="%" decimals={2} />
```

### Transitions
| Scenario | Class |
|---|---|
| Color/bg hover | `transition-colors duration-200` |
| All properties hover | `transition-all duration-200` |
| Long glow/color shifts | `transition-colors duration-500` |
| Scale on hover | `transition-transform duration-200` |
| Shadow on card hover | `transition-shadow duration-300` |

---

## 4. Component Patterns

### 4.1 KpiCard
**File**: `src/components/DashBoard/ui/KpiCard.tsx`
```
┌──────────────────────────────────┐
│ [HexIcon]      [TrendBadge ↑4%] │
│                                  │
│  3,421                           │  ← AnimatedNumber (2xl bold)
│  Total Members                   │  ← label (xs muted)
│  Sub-note if any                 │  ← sub (xs muted/60)
│──────────────────  ←border-l-primary
└──────────────────────────────────┘
```
- `border-l-2 border-l-primary` — always on left
- Glow orb: `absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-xl`
- On hover: orb becomes `bg-primary/10`

### 4.2 MockupKpiCard (Overview Top Row)
**File**: `src/components/DashBoard/sections/OverviewSectionPanel.tsx`
```
┌──────────────────────────────────┐
│ [HexIcon]               [⋯ menu]│
│  Label text                      │
│  $12,450       [TrendingUp +8%] │
│  ← 3px glowing primary bar      │
└──────────────────────────────────┘
```
- `border border-border/80 shadow-sm hover:shadow-md rounded-2xl`
- Glow bar: `absolute top-3 left-0 w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_12px_hsl(var(--primary))]`
- `⋯ DropdownMenu` with contextual navigation links

### 4.3 DashCard (Section Content Shell)
```tsx
<DashCard className="p-4" accent={false}>
  <SectionTitle title="..." subtitle="..." action={...} />
</DashCard>
```
- Base: `bg-card border border-border rounded-xl overflow-hidden`
- `accent`: adds `border-l-2 border-l-primary`

### 4.4 SectionTitle
```tsx
<SectionTitle
  title="Pending Approvals"
  subtitle="12 applications awaiting review"
  action={<Link href="..." className="text-xs text-primary hover:underline">View all →</Link>}
/>
```

### 4.5 HexIcon (Icon Container)
```tsx
<HexIcon size={44}><Icon size={18} /></HexIcon>
```
- Hexagonal clip-path
- `bg-primary/10 text-primary`
- Sizes: 40 (KpiCard), 44–46 (MockupKpiCard)

**Square icon container** (detail panels):
```tsx
<div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
  <Icon size={14} />
</div>
```

### 4.6 Status Atoms
```tsx
<StatusDot status="active" />    // green
<StatusDot status="pending" />   // amber
<StatusDot status="cancelled" /> // red
<TrendBadge value={4.2} label="vs last month" />  // green ↑
<TrendBadge value={-1.5} />                        // red ↓
<LivePulse />   // animated emerald ping
<Skeleton className="w-20 h-4" />  // shimmer placeholder
<EmptyState message="No data available" />
```

### 4.7 Skeleton Loading
```tsx
{isLoading ? (
  <div className="grid grid-cols-4 gap-3">
    {Array(4).fill(null).map((_, i) => <KpiCardSkeleton key={i} />)}
  </div>
) : (
  <div className="grid grid-cols-4 gap-3">
    {kpiCards.map((c, i) => <KpiCard {...c} delay={i * 0.05} />)}
  </div>
)}
```

---

## 5. Layout Architecture

```
DashboardLayout
├── <aside>              ← w-56 sticky sidebar
│   └── Sidebar.tsx
│       ├── Brand Header (Link href="/")
│       ├── <ScrollArea> nav items
│       └── Settings footer
└── <main> flex-col
    ├── Navbar.tsx        ← h-14 sticky top
    └── Content wrapper   ← bg-primary/5, p-4, rounded-xl
        └── {children}
```

### Content Wrapper (Applied in DashboardLayout — don't repeat in pages)
```tsx
<div className="bg-primary/5 dark:bg-card/40 w-full h-full p-2 sm:p-3 lg:p-4 rounded-xl shadow-sm border border-primary/15 dark:border-border/60">
```

### Standard Page Header
```tsx
<div className="space-y-1 border-b border-border/60 pb-5">
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
    <SomeIcon className="w-3 h-3" /> Section Label
  </div>
  <h1 className="text-2xl font-bold tracking-tight text-foreground">Page Title</h1>
  <p className="text-sm text-muted-foreground">Brief description.</p>
</div>
```

### Grid Layouts
| Use Case | Grid Class |
|---|---|
| KPI cards (many) | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3` |
| KPI cards (overview) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| Two-column content | `grid grid-cols-1 lg:grid-cols-2 gap-4` |
| Chart + detail (2:1) | `grid grid-cols-1 lg:grid-cols-3 gap-4` (chart = `lg:col-span-2`) |
| Settings cards | `grid grid-cols-1 sm:grid-cols-3 gap-3.5` |

---

## 6. Navbar Design System

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡]  [Search bar ⌘K]          [flex-1]  [🔔]  [☀️]  [⛶]  [user▾] │
└─────────────────────────────────────────────────────────────────┘
```

### Icon Button Base Class
```tsx
className="h-9 w-9 rounded-lg border border-border/80 dark:border-border/60 bg-card/90
           shadow-xs hover:bg-muted/70 dark:hover:bg-accent hover:border-border
           text-foreground/75 hover:text-foreground transition-all cursor-pointer"
```

### Search Bar
```tsx
className="h-9 bg-card/90 border border-border/85 rounded-lg pl-9 pr-12 text-xs
           placeholder:text-muted-foreground/70 focus:ring-1.5 focus:ring-primary/40
           focus:border-primary shadow-xs transition-all"
```

### Avatar Pill
```tsx
className="flex items-center gap-2.5 h-9 pl-1.5 pr-3 rounded-lg border border-border/80
           bg-card/90 shadow-xs hover:bg-muted/70 dark:hover:bg-accent
           hover:border-border transition-all cursor-pointer group"
```

---

## 7. Sidebar Design System

### Active Left Accent Bar (all active top-level items)
```tsx
<span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full shadow-[0_0_6px_hsl(var(--primary)/0.6)]" />
```

### Item State Table
| State | Background | Text | Border |
|---|---|---|---|
| **Inactive** | transparent | `text-foreground/75` | none |
| **Hover** | `bg-accent/70 dark:bg-accent/40` | `text-foreground` | none |
| **Active** | `bg-primary/12` | `text-primary` | `border border-primary/25` |

### Brand Header
- Full section is `<Link href="/">` with group hover
- Decorative: gradient wash + 2 blurred primary circles
- Logo: `bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20`
- Hover: logo scales `group-hover:scale-105`, title → `text-primary`

---

## 8. Dashboard Header (DashHeader)

### Hero Section
- **No card/border** — open canvas with SVG wave shapes
- Ambient blur blobs + SVG gradient waves
- Right illustration: `/assets/dashboard_right.png`

### Section Tabs
- Active: `bg-primary/10 text-primary border border-primary/20 font-medium rounded-md`
- Inactive: `text-muted-foreground hover:text-foreground hover:bg-muted/40`
- Spring-animated `layoutId="active-section-indicator"` background pill

---

## 9. Charts (Recharts)

### Gradient Area Fill
```tsx
<defs>
  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
  </linearGradient>
</defs>
<Area fill="url(#areaGrad)" stroke="hsl(var(--primary))" strokeWidth={2} />
```

### Custom Tooltip
```tsx
<div className="bg-card/95 backdrop-blur-md border border-border px-3 py-2 rounded-xl shadow-2xl text-xs space-y-1">
  <p className="font-semibold text-muted-foreground">{label}</p>
  <div className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
    <span className="text-foreground font-bold">{value}</span>
  </div>
</div>
```

### Axes & Grid
```tsx
<XAxis tick={{ fontSize: 11 }} stroke="hsl(var(--border))" />
<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
```

---

## 10. Hover & Interactive States

| Element | Normal | Hover |
|---|---|---|
| KpiCard | `shadow-xs` | `y: -2`, `shadow-md`, orb → `bg-primary/10` |
| Sidebar item | transparent | `bg-accent/70` |
| ⋯ menu button | `text-muted-foreground/35` | `text-foreground bg-muted/50` |
| Table row | transparent | `hover:bg-muted/30` |
| Section link | `text-primary` | `hover:underline` |
| Action arrow | `text-muted-foreground/60` | `text-primary translate-x-0.5 -translate-y-0.5` |

---

## 11. Multi-Theme Compatibility Rules

### ✅ DO — Theme-Safe
```tsx
bg-primary / text-primary / border-primary/25 / bg-card / bg-muted
text-foreground / hsl(var(--primary))  // in SVG or inline styles
```

### ❌ DON'T — Breaks Non-Blue Themes
```tsx
bg-blue-500 / text-indigo-600 / #3b82f6 / bg-sky-500 (semantic use)
```

### Exceptions (Semantic Fixed Colors — intentionally non-themed)
```tsx
bg-emerald-500 / text-emerald-500   // success, positive, online
bg-amber-500 / text-amber-500       // warning, pending
bg-rose-500                         // notifications dot
text-destructive                    // errors (IS theme-aware token)
```

---

## 12. Decorative Graphic Conventions

### Glow Blobs
```tsx
// Card corner orb
<div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

// Hero large blob
<div className="absolute -top-12 left-6 w-80 h-48 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
```

### SVG Wave Backgrounds
- Start gradient at `stopOpacity="0"` at 0% offset — prevents hard edges
- Extend paths to `-300 … 1800` — prevents clipping
- Use `hsl(var(--primary))` for theme-aware, `#38bdf8` for sky accent pops

### Card Left Accent Bar
```tsx
// Simple
className="border-l-2 border-l-primary"

// Glowing (featured cards)
<div className="absolute top-3 left-0 w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_12px_hsl(var(--primary))]" />
```

### Sidebar Brand Decorative Circles
```tsx
<div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-primary/6 blur-md pointer-events-none" />
<div className="absolute -bottom-4 -right-1 w-10 h-10 rounded-full bg-primary/8 blur-sm pointer-events-none" />
```

---

## 13. Badges & Pills

```tsx
// Primary badge (filled)
<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">Active</span>

// Subtle pill
<span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">Pending</span>

// Status pill (emerald)
<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Online</span>

// Page header label
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-2xs">
  <Icon className="w-3.5 h-3.5" /> Label
</div>
```

---

## 14. Table Design Pattern

```tsx
<div className="overflow-x-auto rounded-xl border border-border/70">
  <table className="w-full text-xs">
    <thead>
      <tr className="border-b border-border/60 bg-muted/30">
        <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground tracking-tight">Column</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border/40">
      <tr className="hover:bg-muted/30 transition-colors cursor-pointer">
        <td className="px-4 py-3 font-medium text-foreground">Value</td>
        <td className="px-4 py-3 text-muted-foreground">Secondary</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 15. Empty States

### Atom (simple)
```tsx
<EmptyState message="No data available" />
```

### Custom (new pages)
```tsx
<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
  <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
    <SomeIcon className="w-5 h-5 opacity-50" />
  </div>
  <p className="text-sm font-medium">Nothing here yet</p>
  <p className="text-xs mt-1">Descriptive action text</p>
  <Button variant="outline" size="sm" className="mt-4 cursor-pointer">Take Action</Button>
</div>
```

---

## 16. New Page Construction Checklist

- [ ] `font-primary` class on top-level wrapper
- [ ] Page header: label pill + `<h1>` + description + `border-b border-border/60 pb-5`
- [ ] KPI row (if data page): `<KpiCard>` or `<MockupKpiCard>`
- [ ] Staggered entry animation with incremental `delay`
- [ ] All data numbers → `<AnimatedNumber>`
- [ ] Loading states → `<KpiCardSkeleton>` + `<Skeleton>` atoms
- [ ] Empty states → `<EmptyState>` or custom pattern
- [ ] Status indicators → `<StatusDot>`, `<TrendBadge>`, `<LivePulse>` where relevant
- [ ] Card shells → `<DashCard>` (not bare divs)
- [ ] Section headings → `<SectionTitle>` with optional action link
- [ ] Section links → `text-xs text-primary hover:underline`
- [ ] No hardcoded colors — semantic tokens only
- [ ] Test: blue/dark, blue/light, any non-blue theme
- [ ] `cursor-pointer` on all interactive elements

---

## 17. CSS Class Reference

```
rounded-xl    → 0.75rem  (cards, inputs)
rounded-2xl   → 1rem     (featured/overview cards)
rounded-full  → pills, dots, avatar

shadow-xs     → barely-there (most cards, inputs)
shadow-sm     → soft lift (featured cards)
shadow-md     → hover/elevated state
shadow-2xl    → tooltips, popovers

backdrop-blur-md → header, popover, tooltip bg

p-4  → card padding (compact)
p-5  → card padding (spacious, overview cards)
p-6  → settings, form cards

gap-3    → KPI grid
gap-4    → content grid
space-y-4  → section vertical rhythm
space-y-6  → page section rhythm
space-y-8  → settings page sections
```

---

*GACL v2 Enterprise Dashboard — Design System v1.0 | 2026-09-29*
