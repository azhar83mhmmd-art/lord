# LORD

Portal Komunitas Game LORD — **bukan** website pendaftaran klub sepak bola asli.
Ini adalah portal komunitas untuk pemain game sepak bola online, dengan nuansa
clan esports / guild game / dashboard gaming (terinspirasi Valorant, PUBG Clan,
Mobile Legends Squad, eFootball/FC Mobile Community, Discord Community Dashboard).

## Fitur

- **Homepage dashboard** — hero banner, statistik clan, anggota terbaru, activity feed,
  posisi player, leader team, top player, jadwal mabar, rules, FAQ, footer.
- **Community Feed** (`/members.html`) — feed gaya Discord dengan search & filter posisi.
- **Halaman Pendaftaran** (`/register.html`) — "Join LORD Community", pilih posisi CB/CM/WF/ST.
- **ID Card digital animasi** (`/idcard.html`) — kartu pemain dengan QR code, hologram sheen, dan reveal animation setelah daftar.
- **Leaderboard**, **Jadwal Mabar**, **Rules**, **Tentang Kami**, **Admin Panel**, dan halaman **404** custom.
- Backend Express dengan penyimpanan JSON file-based (tanpa database eksternal).
- Semua ikon adalah SVG custom bergaya Heroicons/Lucide/Tabler — **tanpa emoji**.

## Setup

```bash
npm install
npm run dev
```

Server berjalan di **http://localhost:3000**

Untuk produksi:

```bash
npm start
```

## Struktur Proyek

```
lord/
├── server.js              # Entry point Express
├── config/config.js       # Port, path database, posisi, rank
├── routes/                # Endpoint API
├── controllers/           # Logika bisnis tiap endpoint
├── middleware/            # Validasi, logging, error handling
├── utils/                 # Helper (member ID, QR code, avatar, tanggal, ID card)
├── database/               # Penyimpanan JSON (members, activities, stats, settings)
└── public/                # Frontend statis
    ├── *.html              # 10 halaman (index, members, member, register, idcard, admin, leaderboard, schedule, rules, about, 404)
    ├── css/                 # variables, style, components, animation, responsive, darkmode
    ├── js/                  # app shell, api client, per-page logic, icons, utils
    └── assets/              # logo, favicon, fonts, icons, avatars, idcards, backgrounds, banners, audio
```

## Posisi Player

| Kode | Nama              |
|------|-------------------|
| CB   | Center Back       |
| CM   | Center Midfielder |
| WF   | Wing Forward      |
| ST   | Striker           |

## API Endpoints

| Method | Path                      | Keterangan                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/api/stats`              | Statistik clan                       |
| GET    | `/api/activity`           | Activity feed (`?limit=`)            |
| GET    | `/api/members`            | Daftar anggota (`?position=`, `?search=`) |
| GET    | `/api/members/:id`        | Detail satu anggota                  |
| GET    | `/api/members/:id/idcard` | Data ID Card satu anggota            |
| GET    | `/api/members/top`        | Top player berdasarkan win rate      |
| GET    | `/api/settings`           | Rules, FAQ, jadwal mabar             |
| POST   | `/api/register`           | Daftar anggota baru                  |
| GET    | `/api/admin/overview`     | Ringkasan admin                      |
| DELETE | `/api/admin/members/:id`  | Hapus anggota                        |

## Palet Warna

- Hitam: `#0F172A`
- Biru Neon: `#38BDF8`
- Hijau Neon: `#34D399`
- Emas: `#F5B942`
- Putih: `#F8FAFC`

## Tipografi

- Display: **Orbitron** (heading, angka statistik)
- Body: **Rajdhani** (teks utama, gaya HUD gaming)
- Mono: **JetBrains Mono** (ID member, timestamp, kode)

## Catatan

Tidak ada foto pemain sepak bola sungguhan yang digunakan. Semua avatar adalah
ilustrasi generatif (Dicebear), dan seluruh ikon adalah SVG custom hand-authored,
bukan foto atau emoji.
