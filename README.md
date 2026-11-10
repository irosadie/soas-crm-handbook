# SOAS CRM Handbook

Panduan alur CRM dan kepatuhan untuk layanan korporasi Singapura. Dokumentasi tersedia pada rute `/docs`, dengan pilihan Bahasa Indonesia/English, pencarian global, kamus istilah, alur bisnis, serta aturan ACRA dan IRAS.

## Menjalankan lokal

```bash
bun install
bun run dev
```

Buka [http://localhost:3000/docs](http://localhost:3000/docs).

## Versi flow

- `/docs` dan `/docs/v1.2`: flow versi 1.2 (disalin 100% identik dari versi 1.0 sebagai baseline).
- `/docs/v1.1`: flow berdasarkan Excalidraw dan meeting Mr Lau.
- `/docs/v1.0`: flow awal, tetap tersedia sebagai arsip.
- Pilih versi di header; bahasa, tema, pencarian dan daftar isi tersedia pada semua versi.

Versi 1.2 disalin 100% identik dari versi 1.0 sebagai baseline kerja baru. Versi 1.1 memperbaiki intake/quotation incorporation, bundel tanda tangan, identitas dan screening, handover CSP lama, kontrak/periode layanan serta rekonsiliasi WIP. Isi flow 1.0 tetap dipertahankan.

## Login demo

- Username: `demo`
- Password: `demo123`

Halaman `/docs` memakai HTTP Basic Auth dan tidak memerlukan database. Untuk mengganti akun di hosting, atur `DOCS_DEMO_USERNAME` dan `DOCS_DEMO_PASSWORD` sebagai environment variables. Kredensial demo ini memang bersifat publik; jangan gunakan gate ini untuk melindungi data rahasia.

## Pemeriksaan kode

```bash
bun run lint
npx tsc --noEmit
```
