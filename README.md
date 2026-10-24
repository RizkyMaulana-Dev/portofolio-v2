# Portfolio V2

Hero section interaktif dengan Astro, shadcn/ui style, dan motion/react.

## Quick Start

```bash
pnpm install
pnpm dev
```

Buka http://localhost:4321

## Build

```bash
pnpm build
```

## Struktur File

```
src/
├── layouts/
│   └── Layout.astro    # Font, metadata, OG tags
├── pages/
│   └── index.astro     # Render <Hero />
├── styles/
│   └── globals.css     # Design tokens dari DESIGN.md §3
├── content/
│   └── hero.ts         # SEMUA teks & data kartu (ganti di sini)
├── lib/
│   ├── utils.ts        # cn() helper
│   ├── orbit.ts        # Pure orbit math (DESIGN.md §8.1)
│   └── use-stage-size.ts
├── components/
│   ├── ui/             # shadcn-style komponen (button, avatar, sheet, etc.)
│   ├── providers/
│   │   └── smooth-scroll.tsx  # Lenis smooth scroll
│   └── hero/
│       ├── hero.tsx            # Wrapper scroll + stage
│       ├── hero-navbar.tsx
│       ├── hero-copy.tsx       # Headline, subheadline, CTA
│       ├── hero-head.tsx       # Cutout kepala / placeholder
│       ├── orbit-cards.tsx     # 6 kartu kaca berputar
│       ├── orbit-card.tsx      # Satu kartu kaca
│       ├── ambient-background.tsx  # Blob, ring, bintang
│       ├── side-notes.tsx      # 2 kartu mengambang
│       ├── trust-badge.tsx
│       ├── corner-tagline.tsx
│       └── sticker-badge.tsx   # Teks melinggar SVG
public/
└── images/
    └── avatars/          # Avatar tim (opsional)
```

## Apa yang Perlu Diganti Pengguna

1. **Foto kepala**: Salin file PNG/WebP transparan (≥1600px tinggi) ke `public/images/hero-head.png`, lalu ubah `hasImage = true` di `src/components/hero/hero-head.tsx`.

2. **Teks**: Semua teks dan data kartu ada di `src/content/hero.ts`.

3. **Avatar**: Letakkan foto di `public/images/avatars/1.jpg`, `2.jpg`, `3.jpg`. Jika tidak ada, fallback ke inisial.

4. **Warna aksen**: Di `src/content/hero.ts`, ubah nilai `accent` pada tiap kartu (`lime | violet | peach | sky | sun | rose`).

## Tech Stack

- **Astro 5** — SSG + Islands untuk performa maksimal
- **React 19** — Client-side interactivity (motion, lenis)
- **motion/react** — Animasi berbasis spring & scroll
- **lenis** — Smooth scroll
- **Tailwind CSS v4** — Utility-first styling
- **shadcn/ui-style** — Component design system

## Keputusan (decisions)

- Navigation menu pakai pill `<a>` sederhana, bukan shadcn `NavigationMenu` (lebih ringan, cukup untuk anchor navigation sederhana).
- Font loading pakai Google Fonts link (bukan next/font) karena Astro. Gunakan `font-display: swap` untuk LCP.
- `prefers-reduced-motion` mematikan semua animasi orbit dan ambient, menggantinya dengan posisi statis.
- `backdrop-filter` fallback: `bg-white/80` dipakai di semua glass card untuk Safari/non-supporting browsers.
- Semua motion values di-update via `requestAnimationFrame` (bukan `setState` per frame) untuk 60fps.
