# DESIGN.md — Hero Section Portfolio

Dokumen ini adalah **sumber kebenaran visual dan motion** untuk hero section. Claude Code wajib mengikutinya. Jika ada konflik dengan PRD.md soal perilaku, PRD menang. Jika konflik soal tampilan, DESIGN.md menang.

---

## 1. Prinsip Desain

1. **Tenang dan lega.** Banyak whitespace, hanya satu fokus: headline dan kepala di tengah.
2. **Editorial + modern.** Serif elegan untuk headline, sans bersih untuk UI. Kontras ukuran yang tegas.
3. **Kedalaman lewat lapisan.** Kartu kaca berputar di depan dan di belakang subjek. Kedalaman datang dari skala, blur, dan opacity, bukan dari warna ramai.
4. **Gerak hidup tapi tidak kaku.** Tidak ada gerakan linear mekanis. Selalu ada drift kecil, easing halus, dan variasi per elemen.
5. **Konsisten dengan shadcn/ui.** Semua UI standar (button, badge, avatar, nav, sheet, tooltip) memakai komponen shadcn dan token CSS variable-nya, tanpa komponen custom yang menduplikasi.

---

## 2. Stack UI

| Kebutuhan | Pilihan |
|---|---|
| Komponen | **shadcn/ui** (style `new-york`, base color `neutral`, CSS variables aktif) |
| Styling | Tailwind CSS v4, token via `@theme` |
| Ikon | `lucide-react` |
| Font | `next/font`: **Instrument Serif** (display), **Inter** (UI) |
| Motion | `motion` (`motion/react`) |
| Smooth scroll | `lenis` (opsional, dengan fallback native) |
| Utility | `clsx`, `tailwind-merge`, `class-variance-authority` (bawaan shadcn) |

Komponen shadcn yang dipakai di hero: `Button`, `Badge`, `Avatar`, `Separator`, `Tooltip`, `Sheet` (menu mobile), `NavigationMenu`.

---

## 3. Design Tokens

Letakkan di `app/globals.css`. Nilai memakai `oklch` sesuai konvensi shadcn. Hex disertakan sebagai referensi.

### 3.1 Warna (light, default)

| Token | Hex | Pemakaian |
|---|---|---|
| `--background` | `#F6F4EF` | Latar hero (warm off-white) |
| `--foreground` | `#111111` | Headline, teks utama |
| `--muted-foreground` | `#8A8780` | Subheadline, caption |
| `--card` | `rgba(255,255,255,.55)` | Kartu kaca orbit |
| `--card-border` | `rgba(255,255,255,.80)` | Border kartu kaca |
| `--primary` | `#111111` | Tombol utama |
| `--primary-foreground` | `#FFFFFF` | Teks tombol utama |
| `--border` | `rgba(0,0,0,.08)` | Garis tipis, ring orbit |
| `--ring` | `#111111` | Focus ring |

**Aksen kartu** (hanya untuk kotak ikon kecil di kartu, jangan dipakai di tempat lain):

| Nama | Hex |
|---|---|
| lime | `#D7F56B` |
| violet | `#B9A2FF` |
| peach | `#FFB98A` |
| sky | `#8FD3FF` |
| sun | `#FFD36B` |
| rose | `#FF9FC0` |

**Warna blob ambient** (sangat pucat, blur tinggi): `#DFE3FF`, `#FFE4D3`, `#E3F5D8`.

### 3.2 Dark mode
Hero dirancang light-first. Dark mode **di luar scope tahap ini**. Token tetap disiapkan lewat `.dark` kosong agar bisa ditambah nanti, tanpa mengubah komponen.

### 3.3 Radius
Base `--radius: 0.75rem`. Skala shadcn: `sm` 8px, `md` 10px, `lg` 12px, `xl` 16px. Kartu orbit memakai `rounded-3xl` (24px). Tombol dan pill memakai `rounded-full`.

### 3.4 Shadow
- Kartu orbit: `0 24px 48px -12px rgb(0 0 0 / 0.15)`
- Kartu samping: `0 16px 40px -12px rgb(0 0 0 / 0.10)`
- Nav pill: `0 1px 2px rgb(0 0 0 / 0.04)` + border 1px

---

## 4. Tipografi

| Peran | Font | Ukuran (desktop) | Berat | Line-height | Tracking |
|---|---|---|---|---|---|
| Headline baris 1 | Instrument Serif regular | `clamp(3.5rem, 9vw, 8.5rem)` | 400 | 0.95 | -0.02em |
| Headline baris 2 | Instrument Serif *italic* | sama | 400 | 0.95 | -0.02em |
| Subheadline | Inter | `clamp(0.95rem, 1.2vw, 1.125rem)` | 400 | 1.55 | 0 |
| Judul kartu | Inter | 0.95rem | 500 | 1.3 | -0.01em |
| Caption kartu | Inter | 0.75rem | 400 | 1.4 | 0 |
| Nav dan tombol | Inter | 0.875rem | 500 | 1 | 0 |

Aturan: headline selalu center, `text-balance`. Baris kedua italic. Jangan memakai lebih dari dua font family.

---

## 5. Layout dan Spacing

- Container: `max-w-[1280px]`, padding horizontal `px-6 md:px-10 lg:px-16`.
- Hero tinggi: **sticky stage `100svh`** di dalam wrapper scroll setinggi `300vh` (lihat PRD §5).
- Grid spacing: kelipatan 4px (Tailwind default).
- Urutan vertikal dari atas: Navbar → Headline → Subheadline → CTA → (subjek + orbit di bagian bawah, overlap ke atas).
- Kepala (subjek) menempel di bawah stage, lebar ±34% stage (desktop), sedikit terpotong di tepi bawah.
- Pusat orbit: x = 50%, y = ±66% tinggi stage.

### Breakpoint

| Breakpoint | Perilaku |
|---|---|
| `≥1024px` | Layout penuh: 6 kartu orbit, 2 kartu samping, trust badge, sticker bintang |
| `768–1023px` | 5 kartu orbit, kartu samping lebih kecil |
| `<768px` | 4 kartu orbit, kartu samping disembunyikan, nav jadi `Sheet`, headline `text-5xl`, radius orbit dikecilkan |

---

## 6. Komponen

### 6.1 Navbar
- Kiri: wordmark `Nama°` (Inter 600).
- Tengah (desktop): `NavigationMenu` shadcn berbentuk pill — border 1px, `bg-white/60`, `backdrop-blur-md`, item aktif memiliki latar `bg-white` + shadow halus.
- Kanan: `Button` varian default, `rounded-full`, label + ikon `ArrowUpRight` (lucide).
- Mobile: tombol ikon `Menu` membuka `Sheet` dari kanan.
- Posisi: `absolute top-6`, z-index di atas semua layer.

### 6.2 Tombol
- **Primary**: `Button` default, `rounded-full`, `h-12 px-7`, ikon `ArrowRight` di kanan.
- **Secondary**: `Button variant="outline"`, `rounded-full`, `h-12 px-6`, `bg-white/60 backdrop-blur`, ikon `Play` (fill) di kiri dalam lingkaran hitam kecil.
- Hover: primary naik 1px dan shadow bertambah; ikon panah bergeser 2px ke kanan. Durasi 200ms, `ease-out`.
- Focus: `ring-2 ring-ring ring-offset-2`.

### 6.3 Kartu Orbit (glass card)
- Ukuran dasar: lebar `clamp(9.5rem, 15vw, 14rem)`.
- Style: `bg-card backdrop-blur-xl border border-[--card-border] rounded-3xl p-4`, shadow §3.4.
- Isi: kotak ikon 40×40 `rounded-xl` berwarna aksen (ikon lucide putih/hitam di dalamnya) → judul → caption.
- Highlight tepi atas: gradient `from-white/70 to-transparent` setinggi 1px.
- Konten default: `Focus`, `Ideas`, `Plan`, `Work`, `Notes`, `Craft` (placeholder, lihat PRD §8).

### 6.4 Kartu Samping (floating note)
- Dua kartu besar di kiri atas dan kanan tengah, `rounded-[28px]`, `bg-white/80`, sedikit miring (-3° dan +3°).
- Kiri: ikon waveform, judul 2 baris, caption.
- Kanan: `Avatar` group (3 avatar + tombol `+`), judul, caption.
- Disembunyikan di mobile.

### 6.5 Trust Badge (kiri bawah)
- `Separator` pendek (24px) di atas, teks muted "Dipercaya 50.000+ …", lalu stack `Avatar` (overlap `-space-x-3`, ring putih 2px) dengan tombol bulat `+`.

### 6.6 Tagline kanan bawah
Ikon bintang ✦ + dua baris teks muted: "Less chaos. / More clarity." (placeholder).

### 6.7 Sticker bulat kanan atas
Teks melingkar (SVG `textPath`) mengelilingi bintang 4 sisi di tengah. Berputar lambat 40 detik/putaran, linear (satu-satunya gerak linear yang diizinkan).

---

## 7. Layering (z-index)

Dari belakang ke depan:

| Layer | z-index | Isi |
|---|---|---|
| 0 | `z-0` | Background `--background` |
| 1 | `z-[1]` | Blob ambient + ring orbit tipis |
| 2 | `z-[2]` | **Kartu orbit belakang** (sin(angle) ≤ 0) |
| 3 | `z-[3]` | Headline, subheadline, CTA |
| 4 | `z-[4]` | **Gambar kepala (cutout PNG)** |
| 5 | `z-[5]` | **Kartu orbit depan** (sin(angle) > 0) |
| 6 | `z-[6]` | Kartu samping, trust badge, tagline, sticker |
| 7 | `z-[7]` | Navbar |

Pergantian z-index kartu dilakukan saat kartu melewati sisi kiri/kanan kepala, bukan di tengah, supaya perpindahan tidak terlihat melompat. Gunakan hysteresis kecil (±0.05).

---

## 8. Spesifikasi Motion

Semua animasi **hanya** memakai `transform` dan `opacity` (plus `filter: blur` untuk kartu belakang). Dilarang menganimasikan `top/left/width/height`.

### 8.1 Orbit kartu (digerakkan scroll)

`p` = progress scroll hero, 0 → 1, di-ease dengan `easeInOutCubic`.

```
spin    = easeInOut(p) * 2π * 1.5          // 1,5 putaran total
angle_i = spin + i * (2π / N) + wobble_i   // wobble_i = sin(t*0.8 + i) * 0.08
layer_i = i % 2                            // 0 = orbit dalam, 1 = orbit luar
R_i     = W * (layer_i ? 0.27 : 0.21) + sin(t*0.9 + i*2) * W * 0.008
x_i     = cx + cos(angle_i) * R_i
z_i     = sin(angle_i)                     // -1 (belakang) … +1 (depan)
y_i     = cy - H*0.10 + z_i * H*0.07
          + sin(t*1.1 + i*1.7) * H*0.012
          + (layer_i ? -H*0.05 : +H*0.03)
scale_i = 0.78 + 0.28 * z_i
rotY_i  = -cos(angle_i) * 38°
rotZ_i  = cos(angle_i + 1) * 5°
opacity = 0.55 + 0.45 * (z_i + 1) / 2
blur    = z_i > 0 ? 0 : (1 - z_i) * 0.6px
```

`t` adalah waktu dalam detik (untuk gerak ambient yang terus jalan walau scroll berhenti). Container kartu memakai `perspective: 1200px`.

### 8.2 Elemen lain terhadap scroll
- Kepala: naik ±3% tinggi stage dan miring ±1,5° mengikuti `sin(p·2π)`.
- Kartu samping: naik ±5% tinggi stage saat `p` 0→1.
- Ring orbit: dua ellipse tipis (`rotateX(72deg)`), berputar berlawanan arah mengikuti `spin`.
- Headline: parallax halus, bergeser ke atas ±40px dan fade ke 0.6 opacity di `p` > 0.8.

### 8.3 Ambient (jalan terus, tidak bergantung scroll)

| Elemen | Gerak | Durasi/frekuensi |
|---|---|---|
| Blob warna | translate ±6–8% + scale 1 ± 0.1, blur 50px | periode 18–28 dtk, offset berbeda |
| Bintang ✦ | rotate terus + pulse scale 1 ± 0.15 | 12 dtk/putaran, pulse 3 dtk |
| Kartu samping | float Y ±1,2% + rotate ±1.2° | periode 6–8 dtk |
| Kartu orbit | wobble sudut/radius/Y (rumus §8.1) | periode 4–7 dtk |
| Sticker melingkar | rotate linear | 40 dtk/putaran |

Gunakan `useTime` / `useMotionValue` dari Motion, bukan `setInterval`.

### 8.4 Intro (load)
Urutan masuk, total ≤ 1.4 dtk, `ease: [0.22, 1, 0.36, 1]`:

1. Navbar fade-down (0 → 0.3 dtk)
2. Headline baris 1 lalu baris 2, mask reveal dari bawah, stagger 0.12 dtk
3. Subheadline + CTA fade-up
4. Kepala fade-in + scale 0.96 → 1
5. Kartu orbit muncul satu per satu (stagger 0.08 dtk) dari scale 0.6 dan opacity 0
6. Kartu samping, badge, sticker fade

### 8.5 Easing
- UI micro-interaction: `ease-out`, 150–250 ms.
- Scroll-linked: tidak ada easing tambahan di luar §8.1; haluskan dengan `useSpring({ stiffness: 90, damping: 22, mass: 0.6 })`.
- Dilarang: bounce berlebihan, durasi > 1.5 dtk untuk gerak satu kali.

### 8.6 Reduced motion
Jika `prefers-reduced-motion: reduce`: matikan orbit scroll-driven (kartu diam di posisi `p = 0.15`), matikan ambient dan sticker berputar, intro diganti fade 200 ms.

---

## 9. Aset

| Aset | Path | Spesifikasi |
|---|---|---|
| Cutout kepala | `/public/images/hero-head.png` | PNG/WebP transparan, ≥1600px tinggi, kepala sedikit menengadah, pencahayaan monokrom. **Jika belum ada**, pakai `HeroHeadPlaceholder` (SVG siluet abu-abu dengan label) |
| Avatar | `/public/images/avatars/1–3.jpg` | 96×96, placeholder dari inisial jika kosong |
| Ikon | `lucide-react` | stroke 1.75 |

Gambar kepala dimuat dengan `next/image`, `priority`, `sizes="(min-width:1024px) 34vw, 70vw"`.

---

## 10. Aksesibilitas

- Kontras teks ≥ 4.5:1 (cek `muted-foreground` terhadap background; gelapkan ke `#6F6C66` jika gagal).
- Semua elemen dekoratif (`kartu orbit`, blob, ring, sticker, bintang) memakai `aria-hidden="true"`; informasi penting tidak boleh hanya ada di kartu orbit.
- Headline adalah satu `<h1>`.
- Fokus keyboard terlihat di semua tombol dan link; `Sheet` shadcn menangani focus trap.
- Target sentuh ≥ 44×44px.
