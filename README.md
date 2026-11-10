# SOAS CRM Handbook

Panduan alur CRM dan kepatuhan untuk layanan korporasi Singapura. Dokumentasi tersedia pada rute `/docs`, dengan pilihan Bahasa Indonesia/English, pencarian global, kamus istilah, alur bisnis, serta aturan ACRA dan IRAS.

## Menjalankan lokal

```bash
bun install
bun run dev
```

Buka [http://localhost:3000/docs](http://localhost:3000/docs).

## Versi flow

- `/docs` dan `/docs/v1.1`: flow terbaru berdasarkan Excalidraw dan meeting Mr Lau.
- `/docs/v1.0`: flow sebelumnya, tetap tersedia sebagai arsip.
- Pilih versi di header; bahasa, tema, pencarian dan daftar isi tersedia pada kedua versi.

Versi 1.1 memperbaiki intake/quotation incorporation, bundel tanda tangan, identitas dan screening, handover CSP lama, kontrak/periode layanan serta rekonsiliasi WIP. Isi flow 1.0 tetap dipertahankan. Ini pembaruan dokumentasi proses, bukan implementasi database atau integrasi CRM.

## Login demo

- Username: `demo`
- Password: `demo123`

Halaman `/docs` memakai HTTP Basic Auth dan tidak memerlukan database. Untuk mengganti akun di hosting, atur `DOCS_DEMO_USERNAME` dan `DOCS_DEMO_PASSWORD` sebagai environment variables. Kredensial demo ini memang bersifat publik; jangan gunakan gate ini untuk melindungi data rahasia.

## Pemeriksaan kode

```bash
bun run lint
npx tsc --noEmit
```
