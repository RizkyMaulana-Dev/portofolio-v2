# PRD.md — Hero Section Portfolio (Fase 1)

> **Untuk Claude Code.** Baca `DESIGN.md` terlebih dahulu, lalu dokumen ini. Kerjakan **hanya hero section** (Fase 1). Jangan membuat section lain. Ikuti urutan tugas di §10 dan berhenti setelah checklist §11 terpenuhi.

---

## 1. Ringkasan

Website portofolio pribadi dengan hero section interaktif: headline editorial di tengah, foto subjek (cutout) di bawah, dan **kartu kaca yang berputar mengelilingi kepala subjek mengikuti scroll**, dapat saling tumpang tindih, melewati depan dan belakang kepala. Latar memiliki elemen ambient yang bergerak halus. UI memakai **shadcn/ui** agar tampak modern, profesional, dan konsisten.

Referensi visual: layout hero dengan headline serif besar (baris kedua italic), dua kartu melayang di kiri dan kanan, cincin kartu kaca di sekitar kepala, trust badge kiri bawah, tagline kanan bawah, sticker bintang melingkar kanan atas.
Referensi gerak: file `hero-motion.html` (prototipe) jika disediakan. Rumus gerak final ada di `DESIGN.md §8`.

## 2. Tujuan dan Non-Tujuan

**Tujuan**
- Kesan pertama yang kuat, premium, dan memorable bagi calon klien/recruiter.
- Animasi orbit yang halus (target 60 fps) dan terasa "hidup" walau pengunjung tidak scroll.
- Basis kode bersih, mudah diubah kontennya, siap dilanjutkan ke section berikutnya.

**Non-Tujuan (Fase 1)**
- Section lain (Work, About, Contact, Footer).
- CMS, backend, autentikasi, analytics.
- Dark mode.
- Halaman multi-bahasa.

## 3. Target Pengguna

Calon klien, recruiter, dan sesama kreator yang membuka di desktop (utama) dan mobile (wajib berfungsi baik).

## 4. Tech Stack (wajib)

- **Next.js 15** (App Router) + **TypeScript** strict
- **Tailwind CSS v4**
- **shadcn/ui** (inisialisasi dengan `npx shadcn@latest init`, style `new-york`, base `neutral`, CSS variables)
- **motion** (`motion/react`) untuk animasi
- **lenis** untuk smooth scroll (dengan fallback native jika gagal)
- `lucide-react`, `next/font` (Instrument Serif + Inter)
- Package manager: **pnpm**
- Linting: ESLint + Prettier (bawaan Next, plus `prettier-plugin-tailwindcss`)

Komponen shadcn yang di-install: `button badge avatar separator tooltip sheet navigation-menu`.

## 5. Arsitektur Hero

### 5.1 Struktur scroll
Hero terdiri dari **wrapper tinggi** dan **stage sticky**:

```
<section id="hero" class="relative h-[300vh]">      ← wrapper scroll
  <div class="sticky top-0 h-svh overflow-hidden">  ← stage (semua layer di sini)
     ...
  </div>
</section>
```

`scrollYProgress` dari `useScroll({ target: heroRef, offset: ["start start", "end end"] })` menghasilkan progress `p` ∈ [0,1] yang menggerakkan orbit. Setelah `p = 1`, stage lepas dan halaman lanjut normal (section berikutnya nanti).

Di mobile, wrapper `h-[220vh]` agar scroll tidak terlalu panjang.

### 5.2 Struktur file

```
src/
  app/
    layout.tsx            # font, metadata, <SmoothScroll>
    page.tsx              # render <Hero /> saja
    globals.css           # token shadcn + token hero (DESIGN.md §3)
  components/
    ui/                   # hasil shadcn (jangan diedit manual kecuali perlu)
    hero/
      hero.tsx            # wrapper scroll + stage, orkestrasi
      hero-navbar.tsx
      hero-copy.tsx       # headline, subheadline, CTA
      hero-head.tsx       # gambar kepala + placeholder
      orbit-cards.tsx     # render N kartu + hitung transform
      orbit-card.tsx      # satu kartu kaca
      orbit-rings.tsx
      side-notes.tsx      # dua kartu samping
      trust-badge.tsx
      corner-tagline.tsx
      sticker-badge.tsx   # teks melingkar SVG
      ambient-background.tsx
    providers/
      smooth-scroll.tsx
  lib/
    utils.ts              # cn() dari shadcn
    orbit.ts              # fungsi murni rumus orbit (DESIGN.md §8.1)
    use-stage-size.ts     # ResizeObserver → {W,H}
  content/
    hero.ts               # SEMUA teks dan data kartu (satu file)
public/images/
  hero-head.png           # diganti pengguna
  avatars/
```

### 5.3 Pemisahan tanggung jawab
- `lib/orbit.ts` berisi **fungsi murni** `computeCard(i, p, t, size, cfg)` → `{x,y,scale,rotY,rotZ,opacity,blur,front}`. Tidak ada React di dalamnya, sehingga mudah diuji.
- `orbit-cards.tsx` memakai `useScroll` + `useSpring` + `useTime`, lalu menulis transform ke setiap kartu lewat `motion values` (`useTransform`/`useMotionTemplate`), **tanpa** `setState` per frame.
- Semua konten (teks, ikon, warna aksen) di `content/hero.ts` dengan tipe TypeScript.

## 6. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F1 | Navbar: wordmark, pill nav 4 item (anchor), tombol CTA kanan. Mobile: ikon menu membuka `Sheet`. | Must |
| F2 | Headline dua baris (baris 2 italic), subheadline 2 baris, dua tombol (primary "Get started"-style, secondary "Watch video"-style dengan ikon play). | Must |
| F3 | Gambar kepala cutout di tengah bawah; bila file tidak ada, tampilkan `HeroHeadPlaceholder`. | Must |
| F4 | 6 kartu orbit (desktop), 5 (tablet), 4 (mobile). Berputar 1,5 putaran saat scroll hero. Dua radius (dalam/luar) sehingga saling overlap. | Must |
| F5 | Kartu di belakang kepala berada di bawah gambar kepala (z-index §DESIGN.7), lebih kecil, lebih transparan, sedikit blur. Kartu di depan sebaliknya. | Must |
| F6 | Ambient: blob warna, ring orbit, bintang, kartu samping mengambang. Berjalan terus tanpa scroll. | Must |
| F7 | Intro animation saat load (DESIGN.md §8.4). | Should |
| F8 | Dua kartu samping (kiri atas, kanan tengah) dengan avatar group; sembunyikan di mobile. | Should |
| F9 | Trust badge kiri bawah, tagline kanan bawah, sticker melingkar kanan atas. | Should |
| F10 | Smooth scroll (Lenis) yang tidak mengganggu `useScroll`. | Should |
| F11 | Dukungan `prefers-reduced-motion` (DESIGN.md §8.6). | Must |
| F12 | Pause semua animasi ambient saat hero di luar viewport atau tab tidak aktif. | Should |

## 7. Kebutuhan Non-Fungsional

- **Performa**: animasi hanya `transform`/`opacity`/`filter`; tidak ada layout thrash; tidak ada `setState` per frame; `will-change: transform` hanya pada elemen bergerak. Target Lighthouse Performance ≥ 90 desktop, ≥ 80 mobile; LCP < 2.5 dtk; CLS < 0.05.
- **Aksesibilitas**: sesuai DESIGN.md §10; Lighthouse Accessibility ≥ 95.
- **Responsif**: tidak ada horizontal scroll di lebar 360px ke atas.
- **Kualitas kode**: TypeScript strict tanpa `any`; tanpa error ESLint; komponen dipecah sesuai §5.2; tidak ada warna/ukuran hard-coded jika sudah ada token.
- **SEO dasar**: `<title>`, meta description, Open Graph, satu `<h1>`.
- **Browser**: Chrome, Safari (iOS 16+), Firefox, Edge versi terbaru. `backdrop-filter` harus punya fallback (`bg-white/80` tanpa blur).

## 8. Konten Default (placeholder, mudah diganti di `content/hero.ts`)

```ts
export const hero = {
  brand: "Nama Anda°",
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
  navCta: { label: "Hire me", href: "#contact" },
  headline: ["A clearer mind", "for a brighter you."],
  subheadline:
    "Designer & developer yang membuat pengalaman digital yang tenang, fokus, dan berkesan.",
  ctaPrimary: { label: "View work", href: "#work" },
  ctaSecondary: { label: "Watch showreel", href: "#showreel" },
  cards: [
    { title: "Focus", caption: "Deep work, bigger results.", accent: "lime",   icon: "Target" },
    { title: "Ideas", caption: "Capture everything.",        accent: "violet", icon: "MessageCircle" },
    { title: "Plan",  caption: "Turn ideas into action.",    accent: "peach",  icon: "Layers" },
    { title: "Work",  caption: "Selected projects.",         accent: "sky",    icon: "Briefcase" },
    { title: "Notes", caption: "Think in public.",           accent: "sun",    icon: "NotebookPen" },
    { title: "Craft", caption: "Details that matter.",       accent: "rose",   icon: "PenTool" },
  ],
  sideNotes: [
    { title: "Turn thoughts into progress.", caption: "Capture, organise and do more." },
    { title: "Ideas, anytime, anywhere.",    caption: "Sync across all your devices." },
  ],
  trust: "Dipercaya 50+ klien di seluruh dunia.",
  tagline: ["Less chaos.", "More clarity."],
  sticker: "A MORE FOCUSED YOU • EVERYDAY • ",
} as const;
```

## 9. Aset dan Placeholder

- Jika `public/images/hero-head.png` belum ada: render `HeroHeadPlaceholder` (siluet SVG abu-abu bergradien + label kecil "Ganti dengan hero-head.png"). Jangan gagal build.
- Avatar: gunakan `AvatarFallback` dengan inisial jika gambar tidak ada.
- Tulis `README.md` singkat berisi cara mengganti gambar kepala, teks, dan jumlah kartu.

## 10. Rencana Pengerjaan (urutkan, commit per tahap)

1. **Setup**: `create-next-app` (TS, Tailwind, App Router, src dir, pnpm) → `shadcn init` → install komponen §4 → font → token `globals.css` dari DESIGN.md §3.
2. **Konten dan tipe**: `content/hero.ts`, `lib/utils.ts`.
3. **Statis dulu**: `hero.tsx` + navbar, copy, head (placeholder), kartu orbit dalam posisi diam, side notes, badge, tagline, sticker. Pastikan layout dan layering cocok dengan DESIGN.md §5–7 di 1440px, 768px, 390px.
4. **Orbit**: `lib/orbit.ts` + `orbit-cards.tsx` terhubung ke `useScroll`/`useSpring`. Verifikasi depan/belakang kepala dan overlap.
5. **Ambient**: blob, ring, bintang, float kartu samping, wobble kartu, pause saat off-screen.
6. **Intro** dan **smooth scroll (Lenis)**.
7. **Reduced motion, a11y, fallback `backdrop-filter`**.
8. **Polish dan QA**: jalankan checklist §11, `pnpm lint`, `pnpm build`, Lighthouse.
9. **README**.

## 11. Kriteria Penerimaan (Definition of Done)

- [ ] `pnpm build` dan `pnpm lint` bersih tanpa error/warning.
- [ ] Di 1440×900: tampilan menyerupai referensi — headline serif dengan baris kedua italic, kartu samping kiri/kanan, cincin kartu di sekitar kepala.
- [ ] Scroll hero dari atas ke bawah membuat kartu berputar ±1,5 putaran; scroll balik memutar mundur dengan mulus.
- [ ] Kartu terlihat melewati **depan dan belakang** kepala; ada momen dua kartu saling tumpang tindih.
- [ ] Saat scroll berhenti, kartu, blob, bintang, dan kartu samping tetap bergerak halus (tidak diam kaku).
- [ ] Tidak ada jank terlihat; panel Performance Chrome menunjukkan ~60 fps di desktop.
- [ ] Di 390px: tidak ada horizontal scroll, nav memakai `Sheet`, 4 kartu orbit, kartu samping tersembunyi.
- [ ] `prefers-reduced-motion` mematikan orbit dan ambient.
- [ ] Hanya satu `<h1>`; elemen dekoratif `aria-hidden`; navigasi keyboard berfungsi.
- [ ] Semua teks dan data kartu hanya diubah lewat `content/hero.ts`.
- [ ] Tanpa dependensi di luar daftar §4 kecuali benar-benar perlu (jelaskan di README).

## 12. Aturan untuk Claude Code

- Jangan mengubah desain di luar DESIGN.md. Bila ada hal yang tidak tercakup, pilih opsi paling sederhana dan catat di README bagian "Keputusan".
- Jangan menambahkan section, halaman, atau fitur di luar hero.
- Jangan memakai `localStorage`, analytics, atau network request eksternal selain Google Fonts via `next/font`.
- Gunakan komponen shadcn untuk semua UI standar; jangan menulis ulang tombol/avatar/sheet sendiri.
- Tulis komentar singkat hanya untuk rumus orbit dan keputusan non-obvious.
- Setelah selesai, jelaskan: cara menjalankan, struktur file, dan daftar hal yang perlu diganti pengguna (foto, teks, avatar).

## 13. Fase Berikutnya (info saja, jangan dikerjakan)

Work/Projects grid, About, Process, Contact + footer, dark mode, halaman detail proyek, blog/notes.
