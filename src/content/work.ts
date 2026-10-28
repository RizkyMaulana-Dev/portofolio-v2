export type WorkAccent = "violet" | "sky" | "peach" | "lime";

export type WorkVisual = "halo" | "arch" | "stack" | "bars";

export type ProjectStatus = "completed" | "in-progress" | "planned";

export interface Project {
  title: string;
  category: string;
  year: string;
  summary: string;
  tags: string[];
  mark: string;
  href: string;
  accent: WorkAccent;
  visual: WorkVisual;

  // Case-study detail fields. They are optional so older CMS snapshots and
  // simple projects can still be rendered as cards without a detail page.
  slug?: string;
  cover?: string;
  gallery?: string[];
  video?: string;
  videos?: string[];
  role?: string;
  description?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  challenges?: string[];
  approach?: string[];
  results?: string[];
  liveUrl?: string;
  githubUrl?: string;
  status?: ProjectStatus;
  duration?: string;
}

export interface WorkContent {
  eyebrow: string;
  heading: [string, string];
  intro: string;
  period: string;
  projects: Project[];
}

const image = (slug: string, file: string) => `/images/work/${slug}/${file}.webp`;

export const work: WorkContent = {
  eyebrow: "Selected work — 2024–2026",
  heading: ["Work worth", "a closer look."],
  intro:
    "Case studies from full-stack products, internal tools, and game development — built from schema to screen, with the screenshots to show it.",
  period: "2024–2026",
  projects: [
    {
      title: "School Management System API",
      slug: "school-management-system",
      category: "Full-stack / API",
      year: "2026",
      summary:
        "A centralized school administration API with granular RBAC, strict validation, and real-time inventory and library automation.",
      tags: ["Node.js", "TypeScript", "PostgreSQL", "Prisma"],
      mark: "S",
      href: "/work/school-management-system/",
      accent: "violet",
      visual: "halo",
      cover: image("school-management-system", "cover"),
      gallery: [
        image("school-management-system", "01-admin-manajemen-buku"),
        image("school-management-system", "02-presensi-siswa"),
        image("school-management-system", "03-rekap-kehadiran"),
        image("school-management-system", "04-kelola-siswa"),
        image("school-management-system", "05-kelola-guru"),
        image("school-management-system", "06-perpustakaan"),
        image("school-management-system", "07-inventaris"),
        image("school-management-system", "08-portal-siswa"),
      ],
      role: "Fullstack Developer",
      description:
        "Centralized REST API service for school administration with granular role-based access control and realtime relational automation.",
      problem:
        "Pengelolaan administrasi sekolah yang mencakup data akademik, presensi, perpustakaan, dan inventaris seringkali tidak terpusat, rentan terhadap inkonsistensi data, serta memiliki sistem manajemen hak akses (otorisasi) yang tidak terstruktur untuk berbagai entitas pengguna (Siswa, Guru, Admin).",
      solution:
        "Membangun layanan Backend REST API yang terpusat dan modular dengan menerapkan Role-Based Access Control (RBAC) yang granular. Sistem ini dilengkapi validasi data yang ketat (Zod), keamanan token (JWT), serta otomatisasi relasional seperti pembaruan stok inventaris dan perhitungan denda perpustakaan secara realtime.",
      features: [
        "Role-Based Access Control (RBAC) granular untuk Siswa, Guru, dan Admin",
        "Validasi data ketat dengan Zod di setiap endpoint",
        "Keamanan token berbasis JWT",
        "Otomatisasi relasional: pembaruan stok inventaris realtime",
        "Perhitungan denda perpustakaan secara realtime",
      ],
      approach: [
        "Arsitektur REST API terpusat dan modular",
        "Pemisahan otorisasi per entitas pengguna",
        "Relasional automation untuk stok & denda",
      ],
      liveUrl: "https://rizkymaulana-dev.github.io/school-dashboard-starter/",
      githubUrl: "https://github.com/RizkyMaulana-Dev/school-dashboard-starter",
      status: "completed",
    },
    {
      title: "Platform Pre-Order & Sistem Manajemen Pesanan Kuliner",
      slug: "web-preorder-system",
      category: "Full-stack / Commerce",
      year: "2025",
      summary:
        "A full-stack food-ordering platform with an interactive product catalog and a Filament admin panel for real-time order tracking.",
      tags: ["Laravel", "Filament", "PHP", "MySQL"],
      mark: "P",
      href: "/work/web-preorder-system/",
      accent: "sky",
      visual: "arch",
      cover: image("web-preorder-system", "cover"),
      gallery: [
        image("web-preorder-system", "01-admin-orders"),
        image("web-preorder-system", "02-admin-dashboard"),
        image("web-preorder-system", "03-admin-products"),
        image("web-preorder-system", "04-admin-users"),
        image("web-preorder-system", "05-admin-waktu-pos"),
        image("web-preorder-system", "06-admin-income"),
        image("web-preorder-system", "07-mobile-invoice"),
        image("web-preorder-system", "08-mobile-menu"),
        image("web-preorder-system", "09-mobile-hero"),
        image("web-preorder-system", "10-mobile-keranjang"),
        image("web-preorder-system", "11-mobile-checkout"),
        image("web-preorder-system", "12-mobile-order"),
      ],
      role: "Fullstack Developer",
      description:
        "Full-stack food-ordering platform with an interactive product catalog for buyers and a dedicated admin panel for real-time delivery tracking.",
      problem:
        "Usaha kuliner kelas membutuhkan sistem terpusat untuk menampilkan katalog produk yang siap beli (ready) dan sistem pre-order tanpa terjadi kesalahan pencatatan pesanan manual.",
      solution:
        "Membuat platform web full-stack dengan katalog produk interaktif untuk pembeli dan Admin Panel khusus bagi pengelola untuk memantau pesanan masuk serta memperbarui status pengiriman secara real-time.",
      features: [
        "Katalog produk interaktif untuk pembeli",
        "Sistem pre-order terpusat",
        "Admin Panel untuk memantau pesanan masuk",
        "Pembaruan status pengiriman real-time",
      ],
      approach: [
        "Pemisahan peran pembeli vs pengelola",
        "Admin panel berbasis Filament untuk alur pesanan",
      ],
      githubUrl: "https://github.com/RizkyMaulana-Dev/website-pemesanan",
      status: "completed",
    },
    {
      title: "Equipment Rental & Inventory Management System",
      slug: "equipment-rental-system",
      category: "Full-stack / Operations",
      year: "2025",
      summary:
        "An integrated rental workflow covering requests, approvals, live item tracking, and Excel reporting.",
      tags: ["Laravel 12", "PHP", "MySQL"],
      mark: "E",
      href: "/work/equipment-rental-system/",
      accent: "peach",
      visual: "stack",
      cover: image("equipment-rental-system", "cover"),
      gallery: [
        image("equipment-rental-system", "01-main-user"),
        image("equipment-rental-system", "02-dashboard-item"),
        image("equipment-rental-system", "03-dashboard-transaction"),
        image("equipment-rental-system", "04-dashboard-user"),
        image("equipment-rental-system", "05-export-excel"),
        image("equipment-rental-system", "06-apply-loan"),
      ],
      role: "Fullstack Developer",
      description:
        "Integrated full-stack web app automating equipment rental workflows from request and approval to real-time tracking and Excel reporting.",
      problem:
        "Pencatatan inventaris dan transaksi peminjaman barang yang manual seringkali memicu kehilangan data, sulitnya melacak status barang (dipinjam/dikembalikan), serta proses pembuatan laporan yang tidak efisien.",
      solution:
        "Membangun aplikasi web full-stack terintegrasi dengan pemisahan akses untuk Admin dan User. Sistem ini mengotomatisasi alur pengajuan peminjaman, persetujuan (approval) transaksi, pelacakan riwayat secara real-time, dan fitur ekspor data transaksi ke format Excel untuk kebutuhan pelaporan.",
      features: [
        "Alur pengajuan peminjaman otomatis",
        "Approval transaksi oleh Admin",
        "Pelacakan riwayat real-time",
        "Ekspor data transaksi ke Excel",
      ],
      approach: [
        "Pemisahan akses Admin vs User",
        "Otomatisasi alur peminjaman hingga pelaporan",
      ],
      githubUrl: "https://github.com/RizkyMaulana-Dev/rental-barang",
      status: "completed",
    },
    {
      title: "Web-Based Note Management App",
      slug: "note-management-app",
      category: "Web app",
      year: "2024",
      summary:
        "A lightweight, responsive daily note-taking app with a PHP native backend and MySQL persistence.",
      tags: ["PHP", "MySQL", "Tailwind CSS"],
      mark: "N",
      href: "/work/note-management-app/",
      accent: "lime",
      visual: "bars",
      cover: image("note-management-app", "cover"),
      gallery: [
        image("note-management-app", "01-main"),
        image("note-management-app", "02-note-detail"),
        image("note-management-app", "03-note-management"),
        image("note-management-app", "04-add-note"),
        image("note-management-app", "05-footer"),
      ],
      role: "Backend Developer & System Analyst",
      description:
        "Lightweight, responsive web app for structured daily note-taking with a PHP native backend and MySQL persistence.",
      problem:
        "Diperlukannya sebuah platform digital yang ringan dan responsif untuk menyimpan dan mengelola catatan harian secara terstruktur, guna menggantikan pencatatan manual yang datanya rentan hilang atau sulit dicari.",
      solution:
        "Merancang alur sistem (flowchart) dan membangun arsitektur Backend menggunakan PHP Native dan database MySQL untuk persistensi data catatan. Aplikasi ini juga diintegrasikan dengan antarmuka responsif berbasis Tailwind CSS agar dapat diakses dengan baik di berbagai perangkat.",
      features: [
        "Penyimpanan catatan harian terstruktur",
        "Alur sistem dirancang dari flowchart",
        "Antarmuka responsif berbasis Tailwind",
        "Persistensi data via PHP Native + MySQL",
      ],
      githubUrl: "https://github.com/RizkyMaulana-Dev/note-app-bootstrap",
      status: "completed",
    },
    {
      title: "NITRO STATION — Gaming Station Booking Website",
      slug: "nitro-station",
      category: "Frontend / Booking",
      year: "2026",
      summary:
        "A multi-page gaming-station site recreated from Figma, with a responsive layout and an interactive booking flow.",
      tags: ["HTML5", "CSS3", "JavaScript"],
      mark: "N",
      href: "/work/nitro-station/",
      accent: "violet",
      visual: "halo",
      cover: image("nitro-station", "cover"),
      gallery: [
        image("nitro-station", "10-slide-01"),
        image("nitro-station", "11-slide-02"),
        image("nitro-station", "12-slide-03"),
        image("nitro-station", "13-slide-04"),
        image("nitro-station", "14-slide-05"),
        image("nitro-station", "15-slide-06"),
        image("nitro-station", "16-slide-07"),
        image("nitro-station", "17-slide-08"),
        image("nitro-station", "18-slide-09"),
      ],
      video: "/videos/nitro-station-preview.mp4",
      role: "Frontend Developer",
      description:
        "Multi-page landing and booking site for a premium gaming-station brand, built pixel-faithful from Figma designs with a fully responsive layout and interactive booking flow.",
      problem:
        "Brand gaming station premium membutuhkan website yang mampu menampilkan paket gaming (Core Squad, Nitro Elite, Family Plan), memfasilitasi registrasi member, dan proses reservasi unit secara online — dengan tampilan yang konsisten mengikuti desain Figma di semua ukuran layar, termasuk mobile.",
      solution:
        "Membangun website statis multi-halaman (landing, register/login, unit reservation) yang mereplikasi desain Figma secara akurat: hero dengan ilustrasi isometric gaming setup, pricing tier dengan highlight Nitro Elite, testimoni, serta form reservasi interaktif dengan pemilihan paket, slider durasi, dan kuitansi akses yang menghitung total secara real-time. Seluruhnya responsif dari 320px hingga desktop tanpa horizontal scroll.",
      features: [
        "Landing page lengkap: hero, partner logos, features, pricing, testimoni, footer",
        "Halaman register/login split-screen dengan hexagon branding",
        "Halaman unit reservation dengan form, pemilihan paket, dan slider durasi",
        "Kuitansi akses real-time: total & jam main dihitung ulang saat paket/slider berubah",
        "Responsif 320px–2560px, hamburger menu di mobile",
      ],
      approach: [
        "Rekreasi pixel-accurate dari desain Figma",
        "Mobile-first CSS dengan breakpoint 480/768/1024/1280",
        "Zero dependency, static site, deploy langsung ke Vercel",
      ],
      liveUrl: "https://nitro-station-self.vercel.app",
      status: "completed",
    },
    {
      title: "Authentic Dimsum E-Commerce App",
      slug: "authentic-dimsum",
      category: "E-commerce / Food",
      year: "2025",
      summary:
        "A full-stack food-ordering app with an appetizing catalog, menu management, and a selective-checkout cart.",
      tags: ["PHP", "MySQL", "Tailwind CSS"],
      mark: "D",
      href: "/work/authentic-dimsum/",
      accent: "peach",
      visual: "arch",
      cover: image("authentic-dimsum", "cover"),
      gallery: [
        image("authentic-dimsum", "01-hero"),
        image("authentic-dimsum", "02-why-choose"),
        image("authentic-dimsum", "03-testimoni"),
        image("authentic-dimsum", "04-menu"),
        image("authentic-dimsum", "05-keranjang"),
      ],
      role: "Fullstack Developer",
      description:
        "Full-stack e-commerce food ordering app with interactive menu management and a dynamic selective-checkout cart.",
      problem:
        "Kebutuhan akan platform pemesanan makanan online yang tidak hanya fungsional, tetapi juga mampu menyajikan visual produk yang menarik (appetizing) dengan pengalaman pengelolaan keranjang belanja yang interaktif dan mudah digunakan oleh pelanggan.",
      solution:
        "Membangun aplikasi web e-commerce full-stack dengan antarmuka UI/UX yang bersih dan responsif menggunakan Tailwind CSS. Sistem ini dilengkapi autentikasi pengguna, manajemen menu interaktif (rating, stok, counter pesanan), serta keranjang belanja dinamis dengan fitur selective checkout yang diintegrasikan menggunakan backend PHP Native dan MySQL.",
      features: [
        "Autentikasi pengguna",
        "Manajemen menu interaktif: rating, stok, counter pesanan",
        "Keranjang belanja dinamis dengan selective checkout",
        "UI/UX bersih & responsif berbasis Tailwind",
      ],
      githubUrl: "https://github.com/RizkyMaulana-Dev/CodeX_Bites",
      status: "completed",
    },
    {
      title: "OpenProgress — Transparent Project Tracking",
      slug: "openprogress",
      category: "Product / SaaS",
      year: "2026",
      summary:
        "A freelancer project-tracking platform with public status lookup, a service price list, and a booking calendar.",
      tags: ["Next.js", "TypeScript", "Supabase"],
      mark: "O",
      href: "/work/openprogress/",
      accent: "sky",
      visual: "stack",
      cover: image("openprogress", "cover"),
      gallery: [
        image("openprogress", "02-landing-page"),
        image("openprogress", "03-dashboard"),
        image("openprogress", "04-projects"),
        image("openprogress", "05-calendar"),
        image("openprogress", "06-services"),
        image("openprogress", "07-testimonial"),
        image("openprogress", "1"),
      ],
      videos: [
        "/videos/openprogress-preview-landing.mp4",
        "/videos/openprogress-preview-full.mp4",
      ],
      role: "Fullstack Developer",
      description:
        "Freelancer project-tracking platform with public status lookup, service price list, and a booking calendar, backed by an admin panel for projects, pricing, and testimonial moderation.",
      problem:
        "Freelancer sering kewalahan menjawab klien yang menanyakan \"proyeknya sampai mana?\", sehingga harus melaporkan progress secara manual melalui chat. Klien tidak memiliki satu tempat yang transparan untuk melihat status, harga layanan, dan jadwal ketersediaan, sementara sisi freelancer tidak punya alat terpusat untuk mengelola proyek, paket harga, dan testimoni.",
      solution:
        "Membangun platform Next.js dengan dua sisi: halaman publik yang menampilkan daftar layanan beserta rentang harga, kalender ketersediaan slot yang memvalidasi bentrok tanggal, serta fitur Cek Status Project berdasarkan kode proyek (PRJ-YYYY-XXXX). Sisi admin memakai Supabase dengan Row Level Security dan peran admin/super_admin untuk mengelola proyek, tugas, paket harga, serta moderasi testimoni. Status deployment disinkronkan otomatis dari GitHub lewat Octokit.",
      features: [
        "Cek Status Project berdasarkan kode unik (PRJ-YYYY-XXXX)",
        "Sinkronisasi status deployment otomatis dari GitHub via Octokit",
        "Kalender ketersediaan slot dengan validasi bentrok tanggal",
        "Manajemen paket harga (rentang harga, durasi, kategori, fitur)",
        "Antrean moderasi testimoni dengan aksi sembunyikan per item",
        "Otorisasi berbasis peran admin & super_admin melalui Row Level Security",
      ],
      challenges: [
        "Memastikan tidak ada bentrok jadwal saat klien memilih slot booking",
        "Menjaga sinkronisasi GitHub tetap ringan tanpa membebani rate limit API",
      ],
      approach: [
        "Pemisahan tegas antara halaman publik dan dashboard admin",
        "Validasi bentrok tanggal di sisi server, bukan hanya di antarmuka",
        "RLS Supabase sebagai lapisan otorisasi kedua di samping pemeriksaan peran",
      ],
      liveUrl: "https://openprogress.vercel.app",
      githubUrl: "https://github.com/RizkyMaulana-Dev/OpenProgress",
      status: "in-progress",
    },
    {
      title: "Peyysupply — Streetwear & Thrift Store",
      slug: "peyysupply",
      category: "E-commerce / Fashion",
      year: "2026",
      summary:
        "A full-stack streetwear and thrift storefront with multi-facet catalog filtering, a New Drop showcase, and an admin panel.",
      tags: ["Next.js", "Prisma", "MariaDB"],
      mark: "P",
      href: "/work/peyysupply/",
      accent: "lime",
      visual: "bars",
      cover: image("peyysupply", "cover"),
      gallery: [
        image("peyysupply", "02-landing-page"),
        image("peyysupply", "03-shop-katalog"),
        image("peyysupply", "1"),
      ],
      video: "/videos/peyysupply-preview.mp4",
      role: "Fullstack Developer",
      description:
        "Full-stack streetwear and thrift storefront with multi-facet catalog filtering, a New Drop showcase, and a product-management admin panel.",
      problem:
        "Penjual streetwear dan thrift lokal umumnya mengandalkan Instagram dan WhatsApp untuk berjualan, sehingga pembeli tidak punya cara terstruktur untuk menelusuri barang berdasarkan brand, kategori, atau ukuran. Stok, varian, dan harga pun ikut dikelola manual sehingga rawan tidak sinkron dengan produk yang sudah terjual.",
      solution:
        "Membangun storefront Next.js dengan katalog yang mendukung filter multi-facet (brand, kategori, ukuran), section New Drop, serta carousel testimoni. Data produk, kategori, dan pengguna disimpan lewat Prisma ORM dengan autentikasi JWT dan refresh token. Panel admin terpisah mengelola siklus hidup produk, sementara Zustand menangani state katalog dan sesi di sisi klien.",
      features: [
        "Filter katalog multi-facet: brand, kategori, dan ukuran",
        "Section New Drop untuk showcase produk terbaru",
        "Carousel testimoni pelanggan",
        "Panel admin untuk mengelola produk",
        "Autentikasi JWT dengan refresh token",
        "Optimasi media gambar melalui ImageKit",
      ],
      approach: [
        "Struktur berbasis fitur (features/product) agar state katalog terpisah dari auth",
        "Pemisahan route admin dari storefront publik",
        "Validasi input konsisten melalui Zod di sisi server",
      ],
      liveUrl: "https://peyysupply.vercel.app",
      githubUrl: "https://github.com/RizkyMaulana-Dev/peyysupply",
      status: "completed",
    },
  ],
};
