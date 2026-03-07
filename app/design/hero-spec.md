# Admin Hero UI Spec

## Color Tokens
- Primary: #2563eb
- Primary Hover: #1d4ed8
- Gradient Light: from #2563eb to #7c3aed
- Gradient Dark: from #1d4ed8 to #6d28d9
- Text Default: #111827
- Text Muted: #4b5563
- Link: #1d4ed8
- Link Hover: #1e3a8a
- Surface Base: #ffffff
- Surface Subtle: #f9fafb
- Border: #e5e7eb

## Typography
- Headline: 28px/1.1, weight 800
- Sub‑headline: 18px/1.5, weight 500–600
- Body: 16px/1.5, weight 400–500
- Caption: 12px/1.5

## Spacing (8‑pt grid)
- XS: 4px
- S: 8px
- M: 12–16px
- L: 20–24px
- XL: 32px
- XXL: 40px

## Components
### Hero Container
- Background: Surface Base
- Shadow: subtle card
- Radius: 16px
- Padding: 32–40px responsive

### Headline
- Font: headline
- Color: Text Default

### Sub‑headline
- Font: sub‑headline
- Color: Text Muted

### Primary Button
- BG: Primary
- Text: White
- Hover: Primary Hover
- Focus: 2px ring, ring color Primary Hover, offset 2px

### Secondary Link
- Color: Link
- Decoration: Underline
- Hover: Link Hover

## Layout
- Two‑column on ≥768px: content + quick stats
- Single‑column on <768px
- Responsive from 320px to 1920px

## Accessibility
- Minimum contrast: 4.5:1 for text vs background
- Focus indicators: visible 2px rings on actionable elements

## Handoff
- Tokens JSON: `app/design/hero.tokens.json`
- Implemented in code at: `app/dashboard/_components/pages/AdminDashboarPage.js`
