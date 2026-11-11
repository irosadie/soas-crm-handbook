# SOAS CRM Handbook

Panduan alur CRM dan kepatuhan untuk layanan korporasi Singapura. Dokumentasi tersedia pada rute `/docs`, dengan pilihan Bahasa Indonesia/English, pencarian global, kamus istilah, alur bisnis, serta aturan ACRA dan IRAS.

## Menjalankan lokal

```bash
bun install
bun run dev
```

Buka [http://localhost:3000/docs](http://localhost:3000/docs).

## Versi flow

- `/docs` dan `/docs/v1.1`: flow terbaru, sebelumnya bernomor v1.2.
- `/docs/v1.0`: flow awal, tetap tersedia sebagai arsip.
- `/docs/v1.2`: redirect kompatibilitas ke `/docs/v1.1`.
- Pilih versi di header; bahasa, tema, pencarian dan daftar isi tersedia pada kedua versi.

Versi 1.1 memuat pembaruan incorporation, handover CSP, akses filing Bizfile, WIP & follow-up, monthly management report dan alert deadline kepatuhan. Versi 1.1 lama dihapus dan digantikan isi v1.2 terakhir. Isi flow 1.0 tetap dipertahankan.

## Login demo

- Username: `demo`
- Password: `demo123`

Halaman `/docs` memakai HTTP Basic Auth dan tidak memerlukan database. Untuk mengganti akun di hosting, atur `DOCS_DEMO_USERNAME` dan `DOCS_DEMO_PASSWORD` sebagai environment variables. Kredensial demo ini memang bersifat publik; jangan gunakan gate ini untuk melindungi data rahasia.

## Pemeriksaan kode

```bash
bun run lint
npx tsc --noEmit
```
