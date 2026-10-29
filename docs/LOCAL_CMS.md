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

## Alur konten

1. Pilih section di sidebar: Hero, About, Work, Videos, atau Contact.
2. Edit field. Draft langsung disimpan di `localStorage` browser.
3. Setelah sekitar 900 ms tanpa mengetik, draft juga dikirim ke MySQL.
4. Klik **Simpan perubahan** untuk menerapkan section ke MySQL dan membersihkan draft.
5. Kalau tab ditutup di tengah edit, buka lagi halaman admin. Draft dipulihkan otomatis dan muncul banner **dipulihkan otomatis**. Klik **Buang draft** untuk kembali ke versi tersimpan.

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

## Endpoint API

| Method | Path | Fungsi |
| --- | --- | --- |
| `GET` | `/api/health` | Cek API |
| `GET` | `/api/content` | Ambil semua section |
| `PUT` | `/api/content/:section` | Simpan satu section |
| `PUT` | `/api/content` | Simpan semua section sekaligus |
| `DELETE` | `/api/content` | Reset semua section |
| `GET` | `/api/drafts` | Ambil semua draft |
| `GET` | `/api/drafts/:section` | Ambil draft satu section |
| `PUT` | `/api/drafts/:section` | Simpan draft |
| `DELETE` | `/api/drafts/:section` | Hapus draft |
| `GET` | `/api/revisions/:section` | Riwayat revisi section |
| `POST` | `/api/uploads` | Upload file (`multipart/form-data`, field `file`) |
| `GET` | `/api/uploads` | Daftar file |
| `DELETE` | `/api/uploads/:id` | Hapus file |

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

`npm run test` menjalankan integration test API terhadap MySQL lokal dan test unit untuk merge konten, path upload, serta draft browser. Test API membutuhkan container MySQL yang aktif dan schema sudah dibuat.

## Troubleshooting

- **API tidak bisa terhubung** — cek `docker compose ps`, lalu `docker compose logs mysql`; pastikan port `3307` tidak dipakai proses lain.
- **`setup-db.mjs` gagal** — pastikan `.env` ada dan MySQL healthy. Script menunggu koneksi sampai batas waktu tertentu.
- **Upload gagal** — cek API di terminal, pastikan file berformat yang didukung dan tidak lebih dari 50 MB. Pesan error dari API tampil di field upload.
- **Konten tidak berubah di halaman publik** — pastikan API aktif, reload halaman, dan cek status **MySQL lokal** di admin. Halaman statis yang sudah di-build tidak otomatis berubah; build ulang untuk deployment statis.
- **Draft lama masih muncul** — gunakan **Buang draft** di section terkait. Draft browser memakai key `rizky-portfolio-draft-v1:<section>`.
