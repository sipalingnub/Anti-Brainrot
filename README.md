# Anti-Brainrot

# 🛡️ Anti-Brainrot: Gamify Your Productivity

> *"Ubah rasa malas menjadi XP. Level up di dunia nyata, bukan cuma di game."*

![Anti-Brainrot Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Pixel+Art+RPG+Preview)

---

## 📖 Latar Belakang (The Problem)
Di era digital ini, kita sering terjebak dalam **"Brainrot"**: kondisi di mana kita menghabiskan waktu berjam-jam melakukan *doomscrolling* di media sosial tanpa tujuan, membuat otak lelah, dan produktivitas menurun. Motivasi untuk melakukan hal produktif seringkali kalah dengan gratifikasi instan dari konten hiburan.

## 💡 Solusi (The Solution)
**Anti-Brainrot** adalah aplikasi produktivitas berbasis web yang menggunakan konsep **Gamifikasi (RPG Style)**. Aplikasi ini mengubah aktivitas sehari-hari menjadi Quest.

- **Productive (Heroic):** Kegiatan positif (Coding, Belajar, Olahraga) memberikan XP dan menaikkan Level.
- **Brainrot (Cursed):** Kegiatan buang waktu (scroll sosmed berlebihan) akan dicatat sebagai **Cursed Time** (Waktu Terkutuk).
- **Goal:** Memotivasi pengguna melalui visualisasi progres karakter dan sistem reward (Medals & Leaderboard).

---

## 🌟 Fitur Utama

### 1. 🧙‍♂️ RPG Dashboard
Visualisasi status pengguna layaknya karakter game:
- **Level & XP Bar:** Progres nyata dari produktivitas. Naik level setiap 500 XP.
- **Daily Mana:** Batas waktu harian untuk penggunaan sosmed/hiburan.
- **Cursed Time:** Tracking seberapa lama waktu terbuang untuk hal tidak produktif.
- **Total Playtime:** Total jam produktif yang telah dicapai.

### 2. 📜 Quest Log (Activity Tracking)
Catat aktivitas harian dengan kategori:
- ✅ **Productive (Heroic):** Memberikan XP besar (+10 XP/menit).
- ⚖️ **Neutral (Misc):** Memberikan XP kecil (+2 XP/menit).
- 💀 **Brainrot (Cursed):** Tidak memberikan XP (0 XP), hanya menambah statistik negatif.
- 📸 **Evidence System:** Upload bukti foto (screenshot) aktivitas sebagai validasi diri.
- 🔍 **Lightbox Preview:** Lihat bukti aktivitas dalam mode layar penuh (Fullscreen).

### 3. 🏆 Gamification Elements
**Medals/Badges:** Penghargaan otomatis saat mencapai milestone tertentu:
- 🦶 **First Step:** Log aktivitas pertama.
- 🥉 **Novice Grinder:** Mencapai Level 2.
- 👑 **Productivity Master:** Mengumpulkan 1000+ XP.

**Leaderboard (Guild Rankings):** Bersaing dengan pengguna lain untuk menjadi "Mage" paling produktif di server.

### 4. 🎨 Retro Pixel Art UI
- Desain antarmuka menggunakan tema **Pixel Art** dan warna gelap ala dungeon.
- Efek CRT Scanline dan Flicker untuk nuansa monitor tabung jadul.
- Font *Alagard* untuk tipografi bergaya fantasi abad pertengahan.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite):** Framework UI yang cepat dan modern.
- **Tailwind CSS:** Styling utility-first untuk desain responsif dan kustomisasi tema RPG.
- **Axios:** Untuk komunikasi dengan Backend API.
- **React Router:** Navigasi antar halaman (SPA).

### Backend
- **Node.js & Express.js:** Server REST API yang ringan dan scalable.
- **MongoDB & Mongoose:** Database NoSQL untuk menyimpan user, aktivitas, dan leaderboard.
- **JWT (JSON Web Token):** Autentikasi user yang aman.
- **Multer:** Middleware untuk menangani upload file gambar (bukti aktivitas).

---

## 🚀 Cara Menjalankan (Installation)

Pastikan kamu sudah menginstall **Node.js** (v16+) dan memiliki koneksi **MongoDB** (Local atau Atlas).

### 1. Clone Repository
```bash
git clone [https://github.com/sipalingnub/Anti-Brainrot.git](https://github.com/sipalingnub/Anti-Brainrot.git)
cd Anti-Brainrot
