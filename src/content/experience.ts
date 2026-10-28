export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  techStack: string[];
}

export const experiences: Experience[] = [
  {
    role: "Game Developer",
    company: "Gamelab.ID / Educa Studio",
    location: "Remote · 6 months",
    period: "Agustus 2025 — Januari 2026",
    description:
      "Merancang dan mengembangkan game edukasi interaktif berbasis Phaser.js dengan penanganan logika permainan yang kompleks.",
    achievements: [
      "Merancang dan mengembangkan 4 proyek game edukasi, termasuk Game Edukasi Menghitung Biji, Menyusun Boneka, Menghitung Bola Baseball, dan Aljabar.",
      "Meraih nominasi “Game of the Week” untuk Game Edukasi Menghitung Biji dan Game Edukasi Aljabar.",
      "Menyelesaikan program magang dengan predikat Sangat Baik (nilai A, rata-rata 86.0).",
    ],
    techStack: ["Phaser.js", "JavaScript", "HTML"],
  },
  {
    role: "Fullstack Web Developer",
    company: "Freelance / Client Projects",
    location: "Remote",
    period: "Agustus 2024 — Januari 2026",
    description:
      "Merancang dan mengembangkan aplikasi web dengan fokus pada arsitektur backend, skema database mandiri, REST API, dan logika bisnis yang kompleks.",
    achievements: [
      "Merancang skema database mandiri untuk sistem absensi, rental barang, pre-order kuliner, dan manajemen catatan — termasuk relasi antar-tabel dan normalisasi.",
      "Membangun RESTful API sebagai jembatan data yang aman dan efisien antara server dan klien.",
      "Mengembangkan dashboard admin dengan pengelolaan real-time: monitoring pesanan, approval transaksi, dan tracking riwayat.",
    ],
    techStack: ["Laravel", "PHP", "REST API", "MySQL", "Tailwind CSS"],
  },
];
