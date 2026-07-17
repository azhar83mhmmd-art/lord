# LORD — Vercel + Supabase

Portal komunitas game LORD (sepak bola online 4vs4), backend serverless
di Vercel + database/realtime di Supabase.

## Setup

1. **Buat project Supabase** di supabase.com.
2. Buka **SQL Editor**, jalankan isi `supabase-schema.sql` (satu kali).
3. Buka **Storage**, buat bucket baru bernama `lord-assets`, set jadi **Public**.
4. Buka **Project Settings → API**, catat 3 nilai:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (rahasia, jangan expose ke client)

## Environment Variables (Vercel)

Di Vercel → Project Settings → Environment Variables, tambahkan:

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Client-side key

Edit `public/js/supabase-config.js`, ganti dua placeholder dengan
`SUPABASE_URL` dan `anon public` key kamu (aman ditaruh di client,
beda dengan service role key).

## Deploy

```
vercel --prod
```

## Struktur

- `/api/*.js` — setiap file = satu Vercel Serverless Function
- `/lib/supabase.js` — koneksi Supabase pakai service role key (server-side)
- `/public/js/supabase-config.js` — koneksi Supabase pakai anon key (client-side, untuk Realtime chat)
- `/public/*.html` — halaman statis
- `/public/admin-chat.html` — inbox chat admin (tidak ada link di nav, akses langsung via URL)
- `supabase-schema.sql` — jalankan sekali di SQL Editor Supabase

## Live Chat

- Pengunjung: `/contact.html` — conversationId disimpan di localStorage, pesan real-time via Supabase Realtime.
- Admin: `/admin-chat.html` — lihat semua percakapan, klik salah satu untuk balas. Update real-time juga.
