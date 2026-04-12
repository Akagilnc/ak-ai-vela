# Design System — Vela

## Product Context
- **What this is:** AI college planning tool for Chinese families targeting US university admissions
- **Who it's for:** Mainland Chinese parents planning their child's path to top 30 US universities (seed user: pre-vet/animal science track)
- **Space/industry:** EdTech, cross-border education planning. Replaces expensive study-abroad agencies.
- **Project type:** Full-stack web app (questionnaire + interactive assessment report + school database)

## Aesthetic Direction
- **Direction:** Organic/Natural
- **Decoration level:** Intentional (subtle texture, warm surfaces, not minimal-cold or noisy)
- **Mood:** Warm, trustworthy, professional but approachable. Like sitting across from a knowledgeable advisor who genuinely cares. Not cold SaaS, not noisy Chinese EdTech. A "third visual language" that bridges both cultures.
- **Reference sites:** None (first-principles direction, deliberate departure from both US and CN EdTech norms)

## Typography
- **Display/Hero:** Fraunces — warm serif with personality. Academic feel without being stuffy. Pairs beautifully with forest green for that "trusted institution" energy.
- **Body:** Plus Jakarta Sans — modern geometric sans-serif. Clean readability for both English and Chinese-adjacent layouts. Good weight range.
- **UI/Labels:** Plus Jakarta Sans (same as body, medium/semibold weight)
- **Data/Tables:** Geist Mono — clean monospace with tabular-nums. Makes numbers, percentages, and GPA data scannable.
- **Code:** Geist Mono
- **Loading:** Google Fonts CDN
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
  ```
  Geist Mono: self-hosted or via `@fontsource/geist-mono`
- **Scale:**
  - `text-xs`: 12px / 0.75rem
  - `text-sm`: 14px / 0.875rem
  - `text-base`: 16px / 1rem
  - `text-lg`: 18px / 1.125rem
  - `text-xl`: 20px / 1.25rem
  - `text-2xl`: 24px / 1.5rem
  - `text-3xl`: 30px / 1.875rem
  - `text-4xl`: 36px / 2.25rem
  - `text-5xl`: 48px / 3rem

## Color
- **Approach:** Balanced (primary + secondary + semantic colors for hierarchy)
- **Primary:** `#2D6A4F` (Deep Forest Green) — trust, professionalism, natural science connection. Used for headers, primary buttons, active states, key UI anchors.
- **Secondary:** `#E9C46A` (Warm Gold) — warmth, action, optimism. Used for CTAs, highlights, badges, progress indicators.
- **Accent:** `#E76F51` (Terracotta) — energy, urgency. Used sparingly for important alerts and attention-grabbing elements.
- **Neutrals (warm gray):**
  - `#FEFAE0` — Page background (cream)
  - `#F5F0E1` — Card/surface background
  - `#E8E0D0` — Borders, dividers
  - `#B8B0A0` — Muted text, placeholders
  - `#6B6560` — Secondary text
  - `#3D3835` — Primary text
  - `#1A1715` — Heading text
- **Semantic:**
  - Success: `#2D6A4F` (same as primary, natural fit)
  - Warning: `#E9C46A` (same as secondary)
  - Error: `#E63946` (clear red, distinct from terracotta)
  - Info: `#457B9D` (calm blue)
- **Gap severity (5-level, report-specific):**
  - Excellent (far above target): `#E9C46A` (gold, same as secondary) with ★ icon, pill text `#8B6914`
  - Green (on track): `#2D6A4F`
  - Yellow (needs attention): `#B8860B` (deep goldenrod, distinct from gold excellent)
  - Red (gap): `#E63946`
  - No data: `#B8B0A0`
- **Dark mode strategy:**
  - Background: `#1A1715` → `#252220`
  - Surfaces: `#2D2A27` → `#3D3835`
  - Reduce primary/secondary saturation by 10-15%
  - Text: invert neutral scale
  - Semantic colors: keep hue, reduce brightness slightly

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:**
  - `2xs`: 2px
  - `xs`: 4px
  - `sm`: 8px
  - `md`: 16px
  - `lg`: 24px
  - `xl`: 32px
  - `2xl`: 48px
  - `3xl`: 64px

## Layout
- **Approach:** Grid-disciplined (data-heavy product needs predictable structure)
- **Grid:** 12 columns on desktop (1024px+), 8 columns on tablet (768px), 4 columns on mobile (<768px)
- **Max content width:** 1200px
- **Border radius:**
  - `sm`: 4px (inputs, small elements)
  - `md`: 8px (cards, buttons)
  - `lg`: 12px (modals, large cards)
  - `full`: 9999px (pills, avatars)

## Motion
- **Approach:** Minimal-functional (transitions that aid comprehension only)
- **Easing:**
  - Enter: `ease-out` (elements arriving)
  - Exit: `ease-in` (elements leaving)
  - Move: `ease-in-out` (repositioning)
- **Duration:**
  - Micro: 50-100ms (hover states, toggles)
  - Short: 150-250ms (button feedback, tooltips)
  - Medium: 250-400ms (card expand, panel slide)
  - Long: 400-700ms (page transitions, chart animations)

## Component Patterns
- **Buttons:** `md` border-radius, primary uses forest green bg + white text, secondary uses outlined, ghost uses text-only. All have subtle hover darkening (5%).
- **Cards:** `lg` border-radius, cream surface `#F5F0E1`, light border `#E8E0D0`, subtle shadow `0 1px 3px rgba(0,0,0,0.08)`.
- **Inputs:** `sm` border-radius, border `#E8E0D0`, focus ring `#2D6A4F` with 2px offset.
- **Tooltips (glossary):** Desktop hover, mobile tap overlay. Dark bg `#3D3835`, white text, `md` border-radius. Chinese explanation text in `text-sm`.
- **Gap cards (report):** Left border 4px colored by severity. Clickable to expand. Show current value, target range, action recommendation.
- **Radar chart:** Forest green fill with 20% opacity, gold accent for comparison school. Labels in Plus Jakarta Sans `text-sm`.

## Tailwind Config Notes
When implementing, extend `tailwind.config.ts`:
- Add custom colors under `colors.vela.*`
- Add Fraunces to `fontFamily.display`
- Add Plus Jakarta Sans to `fontFamily.sans`
- Add Geist Mono to `fontFamily.mono`
- Set default background to cream `#FEFAE0`

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-08 | Initial design system created | Created by /design-consultation. Organic/Natural direction chosen as "third visual language" bridging US and CN EdTech aesthetics. |
| 2026-04-08 | Fraunces + Plus Jakarta Sans + Geist Mono | Warm serif for trust, modern sans for readability, clean mono for data. Avoids overused Inter/Roboto. |
| 2026-04-08 | Forest green primary | Natural science connection (pre-vet seed user), trust signal, distinct from both US SaaS blue and CN EdTech red. |
| 2026-04-08 | Cream background over pure white | Reduces screen fatigue, adds warmth, signals "this is not generic software." |
