# Design Brief

## Direction

Aymara Yatiqaña — a warm, modern, mobile-first language-learning PWA whose identity is woven from Andean textiles and altiplano landscapes, not a museum or tourist page.

## Tone

Premium, friendly, and respectful — bold Andean color accents on calm crema/warm-white surfaces with subtle weaving textures, balancing cultural pride with clean educational clarity.

## Differentiation

Signature stepped-diamond "chakana" weaving pattern applied as a whisper across backgrounds, separators, and special cards — a quiet cultural fingerprint that no generic ed-tech app has.

## Color Palette

| Token      | OKLCH            | Role                          |
| ---------- | ---------------- | ----------------------------- |
| background | 0.98 0.012 92    | Blanco cálido base            |
| foreground | 0.24 0.01 30     | Negro carbón text             |
| card       | 0.99 0.01 94     | Warm white surface            |
| primary    | 0.5 0.19 25      | Rojo profundo — CTAs/active   |
| accent     | 0.5 0.09 155     | Verde andino — highlights     |
| secondary  | 0.93 0.03 88     | Crema surfaces                |
| muted      | 0.93 0.03 88     | Crema muted zones             |
| warning    | 0.75 0.15 80     | Amarillo dorado — progress    |
| destructive| 0.42 0.15 25     | Rojo tierra — errors          |

## Typography

- Display: Bricolage Grotesque — titles, unit names, hero, personality
- Body: DM Sans — UI, labels, lesson text, extremely legible on small phones
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-2xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Layered warm surfaces (card on background) with soft, low-chroma shadows; depth comes from layering and the weave texture, not heavy drop shadows.

## Structural Zones

| Zone    | Background            | Border        | Notes                                  |
| ------- | --------------------- | ------------- | -------------------------------------- |
| Header  | bg-card               | border-b      | Elevated, weave accent strip           |
| Content | bg-background         | —             | Alternate bg-muted/30 per section      |
| Footer  | bg-muted/40           | border-t      | Weave-soft texture, community tone     |

## Spacing & Rhythm

Mobile-first with generous tap targets (min 44px), section gaps of 24–32px, tight 8px micro-grid for hierarchy and rhythm.

## Component Patterns

- Buttons: rounded-2xl, primary=rojo profundo, large pill CTA, hover darkens + subtle lift
- Cards: rounded-3xl, warm white bg, shadow-subtle, optional weave-soft texture on special cards
- Badges: rounded-full, accent=verde andino for progress, warning=amarillo for streaks

## Motion

- Entrance: fade + 8px rise, 300ms ease-out, staggered on lesson lists
- Hover: gentle lift + shadow deepen, 200ms
- Decorative: slow floating on mascot/avatar, breathing pulse on active path node

## Constraints

- Use crema/blanco cálido as main backgrounds; Andean colors only as accents
- Never use all Andean colors on one screen — max 2–3 accents per view
- Keep weave patterns subtle (low opacity) to preserve readability and AA contrast
- No Duolingo characters, logos, or protected assets; original Andean-inspired avatars only
- Mobile-first for Android PWA; large buttons, legible text, simple navigation

## Signature Detail

The chakana-style stepped-diamond weave — a quiet, repeating cultural motif that ties every screen together without ever shouting.
