# Local CMS

Portfolio ini punya CMS lokal berbasis Express + MySQL. Halaman publik tetap bisa dibangun sebagai situs statis untuk GitHub Pages; CMS hanya aktif saat API lokal berjalan.

## Yang dibutuhkan

- Node.js 22+
- pnpm
- Docker + Docker Compose

## Menjalankan pertama kali

```bash
# 1. Salin konfigurasi lokal
cp .env.example .env

# 2. Nyalakan MySQL lokal (port 3307 agar tidak bentrok dengan MySQL sistem)
docker compose up -d mysql

# 3. Install dependency
npx pnpm@12.15.0 install

# 4. Buat schema dan tabel CMS
node server/scripts/setup-db.mjs

# 5. Jalankan API dan Astro sekaligus
npm run dev
```

Buka `http://localhost:4321`. API berjalan di `http://127.0.0.1:8787` dan diproksikan oleh Astro untuk path `/api` dan `/uploads`.

Kalau port `4321` sedang dipakai, Astro otomatis memilih port berikutnya. Lihat URL yang tercetak di terminal.

## Login admin

- URL: `http://localhost:4321/admin/login`
- Email: `admin@gmail.com`
- Password: `admin123`

Login ini masih hardcoded dan hanya untuk pemakaian lokal. Jangan memakai alur ini sebagai autentikasi produksi.

Admin mengikuti preferensi tema situs. Tombol tema tersedia di halaman login dan dashboard, dengan transisi warna sekitar 280 ms saat berganti mode.

## Alur konten

1. Pilih section di sidebar: Hero, About, Work, Videos, atau Contact.
2. Di section dengan lebih dari satu daftar, pilih tab daftar terlebih dahulu (misalnya **Certificates** / **Skill groups** atau **Social links** / **Footer nav**).
3. Gunakan kolom pencarian di atas tabel untuk menemukan data. Klik baris untuk membuka detail individual.
4. Klik **Edit** untuk masuk mode edit. Perubahan field langsung masuk ke draft; klik **Selesai edit** untuk kembali ke detail.
5. Untuk menambah data baru, klik tombol **Tambah…** di kanan atas tabel. Data baru langsung membuka mode edit.
6. Judul, intro, dan copy section tetap tersedia di panel **Pengaturan section** yang bisa dibuka di bawah tabel.
7. Setelah selesai, klik **Simpan perubahan** untuk menerapkan section ke MySQL dan membersihkan draft.
8. Kalau tab ditutup di tengah edit, buka lagi halaman admin. Draft dipulihkan otomatis dan muncul banner **dipulihkan otomatis**. Klik **Buang draft** untuk kembali ke versi tersimpan.

Admin menampilkan status penyimpanan di header:

- **MySQL lokal** — API dan database aktif. Perubahan disimpan ke MySQL; draft juga tetap dicadangkan di browser.
- **Browser fallback** — API/MySQL tidak tersedia. Perubahan disimpan di `localStorage` browser dan situs publik di origin yang sama tetap membacanya.

## Upload dan Media

Halaman **Media** menerima drag-and-drop beberapa file sekaligus. File disimpan di folder `uploads/` dan metadata-nya di tabel `uploads`.

Format yang diterima:

- Gambar: PNG, JPEG, WebP, GIF, AVIF
- Video: MP4, WebM, MOV
- Dokumen: PDF

Batas ukuran: 50 MB per file (bisa diubah lewat `MAX_UPLOAD_MB`). URL file berbentuk `/uploads/<uuid>.<ext>`.

Field upload juga tersedia langsung di editor:

- Work: cover project, video utama, gallery gambar, video tambahan
- About: gambar certificate dan file PDF certificate

Gunakan tombol **Copy URL** di Media untuk menyalin URL absolut, atau **Hapus** untuk menghapus file dari disk dan database. Menghapus file yang masih dipakai di konten akan membuat preview-nya rusak; ganti nilai field terlebih dahulu.

Folder `uploads/` sengaja di-ignore oleh Git dan tidak ikut build GitHub Pages. Untuk deployment publik, file upload perlu disajikan dari origin yang sama dengan API atau dari object storage/CDN.

## MCP server untuk agen AI

Server MCP lokal memungkinkan agen AI membaca dan mengubah CMS lewat tool, tanpa memberi akses SQL langsung. Server tetap memakai API CMS yang sama, jadi validasi section, draft, revisi, dan upload berjalan di jalur yang sudah ada.

### Menyalakan

Pastikan MySQL dan API aktif:

```bash
docker compose up -d mysql
npm run dev:api
```

OpenCode sudah punya konfigurasi project-local di `opencode.json`. Cek koneksinya:

```bash
opencode mcp list
```

Status yang diharapkan: `portfolio-cms connected`. Restart atau reload sesi OpenCode kalau tool baru belum muncul.

Untuk client MCP lain, jalankan command berikut dari root repo. Stdio harus bersih, jadi jangan memakai `npm run mcp` sebagai command client:

```json
{
  "mcpServers": {
    "portfolio-cms": {
      "command": "node",
      "args": ["--import", "tsx", "server/mcp/index.mjs"],
      "cwd": "/path/ke/PortofolioV2"
    }
  }
}
```

`tsx` diperlukan untuk memuat default content dari `src/content/`. Kalau server dijalankan tanpa `tsx`, tool tetap hidup tetapi fallback default tidak tersedia (`defaultsLoaded: false`).

Untuk smoke test manual di terminal:

```bash
npm run mcp
```

Command itu akan menunggu client dan menampilkan log di stderr. Hentikan dengan `Ctrl+C`.

### Alur tool

Semua perubahan default masuk **draft**, sama seperti admin. Panggil `publish_section` kalau sudah yakin ingin menerapkannya ke MySQL.

```text
cms_status
  → get_section (baca workingContent)
  → list_items / get_item (cari item)
  → update_item / create_item / set_field
  → publish_section (live) atau discard_draft (buang)
```

Tool yang tersedia:

| Tool               | Fungsi                                                      |
| ------------------ | ----------------------------------------------------------- |
| `cms_status`       | Cek API, section, draft, jumlah item, dan upload            |
| `get_section`      | Baca konten live/default dan draft yang sedang bekerja      |
| `search_content`   | Cari teks dan dapatkan path field                           |
| `list_items`       | Daftar item pada path array                                 |
| `get_item`         | Ambil satu item lengkap                                     |
| `create_item`      | Tambah item ke array                                        |
| `update_item`      | Edit item dengan patch atau pengganti penuh                 |
| `delete_item`      | Hapus item (butuh `confirm: true`)                          |
| `move_item`        | Ubah urutan item                                            |
| `set_field`        | Set satu field, misalnya `site.email`                       |
| `patch_section`    | Deep-merge sebagian section                                 |
| `save_section`     | Ganti seluruh section                                       |
| `publish_section`  | Terapkan draft atau content ke MySQL                        |
| `discard_draft`    | Hapus draft section                                         |
| `list_revisions`   | Lihat riwayat revisi                                        |
| `restore_revision` | Kembalikan revisi ke draft/live                             |
| `list_uploads`     | Daftar file upload                                          |
| `upload_file`      | Upload dari path lokal atau base64                          |
| `delete_upload`    | Hapus file (butuh `confirm: true`)                          |
| `reset_content`    | Reset semua konten (butuh `confirm: "RESET_PORTFOLIO_CMS"`) |

Contoh alur edit satu sertifikat:

1. `get_section` untuk `about`.
2. `list_items` dengan `path: "certificates.items"`.
3. `update_item` dengan `match` judul sertifikat dan `patch` field yang berubah.
4. `publish_section` untuk `about` setelah hasilnya benar.

Path array yang umum:

- `hero.nav`, `hero.cards`, `hero.sideNotes`
- `about.skillGroups`, `about.fullstack.stages`, `about.certificates.items`
- `work.projects`
- `videos.clips`
- `site.socials`, `site.footerNav`

### Upload lewat MCP

`upload_file` menerima path lokal (absolut, atau relatif dari root repo) atau base64:

```text
upload_file { "path": "/home/user/Pictures/cover.webp" }
```

Hasilnya berisi `upload.url`, misalnya `/uploads/<uuid>.webp`, yang bisa dipakai di field `cover`, `gallery`, `image`, atau `href` PDF.

### Keamanan

- MCP ini hanya untuk lokal. Jangan mengekspos proses stdio sebagai HTTP publik.
- Tool destruktif butuh konfirmasi eksplisit.
- `reset_content` menghapus semua section dan draft, tetapi tidak menghapus file upload atau riwayat revisi.
- Agen AI tetap bisa membuat draft yang salah. Periksa hasil dengan `get_section` sebelum `publish_section`.

### Troubleshooting MCP

- **`portfolio-cms` tidak connected** — jalankan `opencode mcp list`, pastikan dependency sudah di-install, lalu coba command `node --import tsx server/mcp/index.mjs` dari root repo.
- **`defaultsLoaded: false`** — server dijalankan tanpa `tsx`. Gunakan command di atas atau `npm run mcp`.
- **`Cannot reach CMS API`** — nyalakan `npm run dev:api` dan cek `.env`.
- **Perubahan tidak terlihat di situs publik** — pastikan sudah `publish_section`, reload halaman, dan ingat build GitHub Pages statis perlu di-build ulang.

## Endpoint API

| Method   | Path                      | Fungsi                                            |
| -------- | ------------------------- | ------------------------------------------------- |
| `GET`    | `/api/health`             | Cek API                                           |
| `GET`    | `/api/content`            | Ambil semua section                               |
| `PUT`    | `/api/content/:section`   | Simpan satu section                               |
| `PUT`    | `/api/content`            | Simpan semua section sekaligus                    |
| `DELETE` | `/api/content`            | Reset semua section                               |
| `GET`    | `/api/drafts`             | Ambil semua draft                                 |
| `PUT`    | `/api/drafts/:section`    | Simpan draft                                      |
| `DELETE` | `/api/drafts/:section`    | Hapus draft                                       |
| `GET`    | `/api/revisions/:section` | Riwayat revisi section                            |
| `POST`   | `/api/uploads`            | Upload file (`multipart/form-data`, field `file`) |
| `GET`    | `/api/uploads`            | Daftar file                                       |
| `DELETE` | `/api/uploads/:id`        | Hapus file                                        |

## Data dan reset

Tabel MySQL:

- `content_sections` — konten tersimpan per section
- `content_drafts` — draft server per section
- `content_revisions` — riwayat perubahan section
- `uploads` — metadata file upload

Reset seluruh konten dari admin lewat **Reset seluruh konten** di halaman Ringkasan. Reset juga menghapus draft di server. Untuk mengosongkan database tanpa menghapus schema:

```bash
curl -X DELETE http://127.0.0.1:8787/api/content
```

Untuk mematikan MySQL:

```bash
docker compose down
```

Data MySQL tetap tersimpan di volume Docker. Gunakan `docker compose down -v` hanya kalau memang ingin menghapus database lokal.

## Build statis GitHub Pages

```bash
GITHUB_PAGES=true npx astro build
```

Build ini menghasilkan situs statis dengan base `/portofolio-v2`. Tanpa API, halaman publik memakai konten default dari `src/content/` dan cache `localStorage` yang tersedia di browser. Upload lokal tidak disertakan dalam build.

## Verifikasi

```bash
npm run test
npx astro check
GITHUB_PAGES=true npx astro build
```

`npm run test` menjalankan integration test API terhadap MySQL lokal, test MCP server, dan test unit untuk merge konten, path upload, serta draft browser. Test API membutuhkan container MySQL yang aktif dan schema sudah dibuat.

## Troubleshooting

- **API tidak bisa terhubung** — cek `docker compose ps`, lalu `docker compose logs mysql`; pastikan port `3307` tidak dipakai proses lain.
- **`setup-db.mjs` gagal** — pastikan `.env` ada dan MySQL healthy. Script menunggu koneksi sampai batas waktu tertentu.
- **Upload gagal** — cek API di terminal, pastikan file berformat yang didukung dan tidak lebih dari 50 MB. Pesan error dari API tampil di field upload.
- **Konten tidak berubah di halaman publik** — pastikan API aktif, reload halaman, dan cek status **MySQL lokal** di admin. Halaman statis yang sudah di-build tidak otomatis berubah; build ulang untuk deployment statis.
- **Draft lama masih muncul** — gunakan **Buang draft** di section terkait. Draft browser memakai key `rizky-portfolio-draft-v1:<section>`.
