# SOAS CRM Handbook

Panduan alur CRM dan kepatuhan untuk layanan korporasi Singapura. Dokumentasi tersedia pada rute `/docs`, dengan pilihan Bahasa Indonesia/English, pencarian global, kamus istilah, alur bisnis, serta aturan ACRA dan IRAS.

## Menjalankan lokal

```bash
bun install
bun run dev
```

Buka [http://localhost:3000/docs](http://localhost:3000/docs).

## Login demo

- Username: `demo`
- Password: `demo123`

Halaman `/docs` memakai HTTP Basic Auth dan tidak memerlukan database. Untuk mengganti akun di hosting, atur `DOCS_DEMO_USERNAME` dan `DOCS_DEMO_PASSWORD` sebagai environment variables. Kredensial demo ini memang bersifat publik; jangan gunakan gate ini untuk melindungi data rahasia.

## Pemeriksaan kode

```bash
bun run lint
npx tsc --noEmit
```
