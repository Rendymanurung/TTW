# PRD: Website Perkenalan Geng TTW (Tamat Tepat Waktu) + Retro Arcade

**Versi:** 2.0 (revisi setelah jawaban tim)
**Tanggal:** 7 November 2026
**Status:** Draft siap dikerjakan
**Bahasa website:** Indonesia saja
**Hosting:** Vercel (ditentukan nanti)

---

## 1. Ringkasan & Visi Produk

Website front-end statis dua halaman untuk **TTW (Tamat Tepat Waktu)**. Halaman 1 memperkenalkan geng dengan gaya **retro arcade** yang keren, halaman 2 berisi **Arcade** berisi game mini (slot machine, blackjack, dan lainnya) yang dimainkan langsung di browser tanpa backend.

**Visi:** website ini terasa seperti *mesin arcade* milik TTW. Pengunjung "memasukkan koin", memilih karakter (anggota geng), lalu bermain. Nama geng "Tamat Tepat Waktu" menjadi bahan permainan kata: *Stage Clear*, *Level Up*, *Game Tamat*, *Finish On Time*.

### Ruang lingkup (in scope)

- Front-end saja: HTML, CSS, JavaScript. Tanpa server, database, atau login.
- Dua halaman: **Landing (perkenalan geng)** dan **Arcade (game)**.
- Game memakai **koin virtual** tanpa nilai uang. Saldo disimpan di browser (localStorage).
- Responsif untuk HP, tablet, dan desktop.
- Seluruh teks dalam Bahasa Indonesia.

### Di luar ruang lingkup (out of scope)

- Taruhan uang asli, deposit, penarikan, atau pembayaran apa pun.
- Akun pengguna, leaderboard online, multiplayer real-time (kandidat fase lanjutan).
- Panel admin atau CMS.
- Versi multi-bahasa.

---

## 2. Tujuan, Target Pengguna & Metrik

### Tujuan produk

1. Memperkenalkan identitas TTW (nama, cerita, 10 anggota, nilai) dengan tampilan retro yang unik dan mudah diingat.
2. Memberi alasan untuk berlama-lama lewat arcade yang seru.
3. Mudah dibagikan lewat satu link (WhatsApp, Instagram bio, Discord).

### Target pengguna

| Persona | Siapa | Yang dicari |
| --- | --- | --- |
| Teman & kenalan | Orang yang menerima link dari anggota | Kesan pertama keren, kenal para anggota |
| Anggota TTW | Pemilik konten website | Tampil bangga, mudah pamer ke orang lain |
| Pengunjung iseng | Datang lewat bio/share | Hiburan cepat tanpa daftar |

### Metrik keberhasilan

| Metrik | Target |
| --- | --- |
| Waktu muat halaman 1 (jaringan 4G) | di bawah 3 detik |
| Skor Lighthouse Performance (mobile) | 85 ke atas |
| Pengunjung yang lanjut ke Arcade | 40% atau lebih |
| Rata-rata durasi sesi | di atas 2 menit |
| Tampilan benar di HP 360 px sampai desktop 1920 px | 100% |

---

## 3. Konsep Kreatif & Arah Desain

> **Catatan:** arah desain sudah ditetapkan **retro**. Detail visual (logo, palet final, font final) akan dirancang ulang bersama tim pada fase persiapan. Usulan di bawah adalah titik awal.

**Konsep: "TTW Retro Arcade"**: estetika arcade era 80-an/90-an, pixel art, layar CRT, dan antarmuka mirip konsol game lawas. Seluruh website adalah satu "game" yang pemainnya adalah pengunjung.

### Palet warna (usulan, bisa diubah)

| Peran | Warna | Hex |
| --- | --- | --- |
| Background utama | Hitam kebiruan (layar mati) | #0B0B1E |
| Permukaan panel | Ungu tua | #1A1440 |
| Aksen utama | Kuning koin | #FFD500 |
| Aksen kedua | Merah arcade | #FF3B3B |
| Aksen ketiga | Cyan piksel | #2DE2E6 |
| Aksen hijau (menang/Stage Clear) | Hijau terminal | #39FF14 |
| Teks | Putih krem | #F5F1E3 |

### Tipografi

- Judul dan label tombol: **Press Start 2P** (font pixel khas arcade).
- Teks isi panjang: **VT323** atau **Space Mono** agar tetap terbaca di layar kecil.
- Angka saldo dan skor: gaya seven-segment atau monospace tebal.

### Bahasa visual & efek

- **Efek CRT:** garis pindai (scanline), sedikit lengkung layar, kedip halus, dengan opsi mematikan efek untuk kenyamanan.
- **Pixel art:** ikon, karakter anggota, dan elemen dekoratif bergaya 8-bit/16-bit.
- **Layar "PRESS START"** di awal, lengkap dengan teks berkedip dan bunyi "insert coin" (opsional).
- **HUD ala game:** bar "XP", "Nyawa", dan "Level" sebagai elemen dekoratif di navbar.
- **Transisi antar halaman** bergaya layar game (wipe piksel, "LOADING...").
- **Plesetan nama geng:** "STAGE CLEAR: TAMAT TEPAT WAKTU!", "GAME OVER? BELUM!", "LEVEL UP: SEMESTER BERIKUTNYA".
- **Mode suara opsional** (default mati): musik chiptune, efek koin, putar slot, kartu dibagi, dengan tombol mute yang jelas.

### Prinsip desain

1. Mobile-first: mayoritas pengunjung membuka dari HP.
2. Animasi memperkuat kesan, bukan memperlambat. Hormati `prefers-reduced-motion`.
3. Efek retro tidak boleh mengorbankan keterbacaan teks.

---

## 4. Struktur Halaman & Sitemap

| Halaman | File | Fungsi |
| --- | --- | --- |
| Landing / Perkenalan TTW | `index.html` | Kesan pertama, cerita, 10 anggota, galeri, ajakan masuk arcade |
| Arcade | `arcade.html` | Lobby game dan game yang dapat dimainkan |

### Navigasi

- Navbar tetap (sticky) di kedua halaman: logo TTW, tautan section, tombol **"MASUK ARCADE"**.
- Di arcade: tombol kembali ke markas, saldo koin, tombol suara, tombol reset saldo.
- Di HP: menu hamburger dengan overlay layar penuh bergaya menu konsol.

### Alur pengguna utama

1. Buka link, muncul layar "PRESS START".
2. Menjelajahi profil geng dan memilih karakter (anggota).
3. Menekan **"MASUK ARCADE"**, melewati transisi loading.
4. Memilih game di lobby dan bermain dengan koin virtual.
5. Kembali ke markas atau membagikan link.

---

## 5. Halaman 1: Landing Perkenalan TTW

Setiap section punya satu tugas dan satu efek khas.

| # | Section | Isi | Efek / interaksi |
| --- | --- | --- | --- |
| 1 | Layar Start | Logo TTW piksel, teks "PRESS START", bar loading | Teks berkedip, klik/tap atau tombol Enter untuk masuk |
| 2 | Hero | "TTW: Tamat Tepat Waktu", tagline, tombol "MASUK ARCADE" dan "KENALAN DULU" | Teks mengetik per huruf, latar piksel bergerak, efek CRT |
| 3 | Tentang Kami | Cerita TTW: asal-usul, motto, makna nama "Tamat Tepat Waktu" | Teks muncul bertahap saat scroll, counter statistik (anggota: 10, tahun berdiri, kenangan) |
| 4 | **Pilih Karakter** (10 anggota) | Kartu karakter tiap anggota: foto/avatar piksel, nama panggilan, julukan/kelas karakter, kata-kata khas, sosmed | Layar ala "character select", hover/tap memperlihatkan statistik lucu (misal: Kekuatan, Kecepatan, Skor Begadang), kartu terbalik untuk fakta unik |
| 5 | Aturan Main TTW | 3 sampai 5 prinsip atau "hukum" geng | Ikon piksel, animasi bergantian |
| 6 | Peta Level (Timeline) | Momen penting dari awal berdiri sampai sekarang, ditampilkan sebagai level game | Jalur ala peta Mario, level terbuka saat scroll |
| 7 | Galeri | Foto atau video kebersamaan | Grid ber-frame bingkai arcade, lightbox, filter kategori |
| 8 | Teaser Arcade | Cuplikan game, saldo awal 1.000 koin | Mesin slot mini berputar sendiri, tombol "INSERT COIN" |
| 9 | Footer | Link sosmed, hak cipta | Tombol kembali ke atas, teks "GAME OVER? BELUM!", easter egg Konami code |

### Susunan 10 anggota

- Grid 5 x 2 di desktop, 2 kolom di HP (scroll horizontal atau carousel sebagai alternatif).
- Satu data anggota (JSON) berisi: `nama`, `julukan`, `kelas_karakter`, `foto`, `avatar_piksel`, `quote`, `statistik`, `sosmed`.
- Opsi: foto asli dikonversi ke gaya piksel agar seragam dengan tema retro.

### Konten yang perlu disiapkan tim

- Logo TTW (atau dirancang bersama pada fase persiapan), tagline, dan motto.
- Foto 10 anggota (rasio kotak, minimal 600 px) beserta nama panggilan, julukan, dan satu kalimat khas.
- Cerita singkat TTW (100 sampai 200 kata) dan 5 sampai 8 momen timeline.
- 8 sampai 20 foto galeri yang sudah dikompres.
- Akun sosmed yang ingin ditampilkan.
- **Persetujuan tiap anggota** untuk foto dan sosmed yang dipublikasikan.

---

## 6. Halaman 2: Retro Arcade

Lobby berbentuk deretan mesin arcade, tiap mesin adalah satu game. Semua game memakai **koin virtual tanpa nilai uang**, disimpan di localStorage, dan dibuat murni dengan JavaScript.

### Sistem koin & progres (berlaku untuk semua game)

- Saldo awal 1.000 koin untuk pengunjung baru, tampil permanen di header arcade.
- Saldo tersimpan otomatis. Tombol "Reset saldo" memberi 1.000 koin lagi.
- Bonus harian: klaim 500 koin sekali per 24 jam.
- Statistik pribadi: total main, kemenangan, rekor saldo tertinggi.
- Disclaimer jelas: koin hanya fiktif dan untuk hiburan (lihat bagian 10).

### Daftar game

| Prioritas | Game | Aturan inti | Fitur kunci |
| --- | --- | --- | --- |
| P0 (wajib) | Slot Machine | 3 gulungan, 6 simbol bertema TTW, taruhan 10/50/100/MAX, payline tengah | Animasi putar dengan easing, tabel pembayaran, efek jackpot piksel dan kedip, auto-spin opsional |
| P0 (wajib) | Blackjack | Deck 52 kartu dikocok, Hit/Stand/Double, dealer berhenti di 17, blackjack bayar 3:2 | Animasi kartu dibagi, hitung total otomatis, kartu bergaya piksel, taruhan chip |
| P1 | Roulette mini | Taruhan merah/hitam, ganjil/genap, atau angka tunggal | Roda animasi, riwayat hasil |
| P1 | Tebak Koin / High-Low | Tebak sisi koin atau kartu berikutnya lebih tinggi/rendah | Streak multiplier, cepat dimainkan |
| P2 | Scratch Card | Gosok kartu, 3 simbol sama menang | Efek gosok di canvas, cocok di layar sentuh |
| P2 | **Kuis "Seberapa Kenal TTW?"** | Pertanyaan tentang 10 anggota untuk bonus koin | Memperkuat tujuan perkenalan, data diambil dari JSON anggota |

> Game prioritas di luar slot dan blackjack belum diputuskan tim, jadi daftar P1/P2 di atas masih usulan dan akan dibahas saat perancangan.

### Detail Slot Machine

1. **Simbol (usulan):** topi toga, jam/deadline, kopi, laptop, angka 7, logo TTW. Logo TTW adalah simbol langka dengan bayaran tertinggi.
2. **Tabel pembayaran:** 3 simbol sama dikali 5 sampai 50 kali taruhan, 2 simbol sama dikali 1,5 kali.
3. Hasil ditentukan lewat pemilihan acak berbobot di JavaScript, lalu animasi dibuat menyesuaikan hasil, bukan sebaliknya.
4. **Kontrol:** tombol SPIN besar, pilihan taruhan, tombol spasi di desktop.
5. **Efek menang:** tulisan "STAGE CLEAR!" dan hujan koin piksel.

### Detail Blackjack

1. **Alur:** pasang taruhan, bagi 2 kartu pemain dan 2 dealer (1 tertutup), pemain Hit/Stand/Double, dealer buka kartu dan menarik sampai 17.
2. As bernilai 1 atau 11 otomatis menyesuaikan total terbaik.
3. **Hasil:** Menang (1:1), Blackjack (3:2), Seri (taruhan kembali), Kalah.
4. Opsional fase lanjut: Split dan Insurance.

### Pengalaman di lobby

- Kartu game berbentuk mesin arcade dengan label "POPULER" atau "BARU".
- Hover/tap menampilkan aturan singkat.
- Efek suara dan getar (vibrate) ringan di HP saat menang, semuanya bisa dimatikan.
- Saat saldo habis: layar "GAME OVER, LANJUT?" dengan pilihan klaim bonus harian atau reset saldo.

---

## 7. Kebutuhan Fungsional & Non-Fungsional

### Fungsional

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-01 | Landing page menampilkan 9 section sesuai bagian 5 | P0 |
| F-02 | Navbar sticky dan tombol "MASUK ARCADE" menuju `arcade.html` | P0 |
| F-03 | Data 10 anggota dibaca dari satu file `members.json` agar mudah diubah | P0 |
| F-04 | Layar "PRESS START" dengan opsi lewati | P1 |
| F-05 | Slot Machine berfungsi penuh (taruhan, putar, hitung hadiah, saldo) | P0 |
| F-06 | Blackjack berfungsi penuh (Hit, Stand, Double, aturan dealer) | P0 |
| F-07 | Saldo koin tersimpan di localStorage dan dapat direset | P0 |
| F-08 | Bonus harian 500 koin | P1 |
| F-09 | Galeri dengan lightbox dan lazy loading | P1 |
| F-10 | Game tambahan (Roulette, High-Low, Scratch Card, Kuis TTW) | P1/P2 |
| F-11 | Tombol suara/musik, default mati, status tersimpan | P1 |
| F-12 | Tombol bagikan (salin link) dan meta tag Open Graph untuk preview di WhatsApp/IG | P1 |
| F-13 | Easter egg (Konami code membuka bonus koin atau game rahasia) | P2 |
| F-14 | Toggle efek CRT (nyala/mati) | P1 |

### Non-Fungsional

| Aspek | Standar |
| --- | --- |
| Performa | Total halaman 1 di bawah 2 MB (gambar WebP, lazy load), animasi 60 fps di HP kelas menengah |
| Responsif | Breakpoint 360, 768, 1024, 1440 px; semua kontrol game bisa disentuh |
| Aksesibilitas | Kontras teks WCAG AA, navigasi keyboard, `alt` pada gambar, hormati `prefers-reduced-motion` |
| Kompatibilitas | Chrome, Safari, Firefox, Edge versi terbaru; Safari iOS dan Chrome Android |
| Keamanan & privasi | Tanpa data pribadi dikirim ke server; hanya localStorage; tanpa pelacakan tanpa persetujuan |
| Keterpeliharaan | Kode modular per game, data konten terpisah dari kode |
| Bahasa | Seluruh teks antarmuka Bahasa Indonesia |
| Hosting | Statis di **Vercel** (gratis), deploy otomatis dari repositori Git |

---

## 8. Tech Stack Front-End & Struktur Folder

Rekomendasi: **HTML + CSS + JavaScript murni (vanilla)** dengan beberapa library ringan. Mudah dideploy ke Vercel sebagai situs statis tanpa build tool.

| Kebutuhan | Pilihan | Alasan |
| --- | --- | --- |
| Markup & style | HTML5, CSS3 (variabel CSS, Grid, Flexbox) | Ringan, tanpa dependensi |
| Gaya retro | Font Google (Press Start 2P, VT323), CSS `image-rendering: pixelated` | Autentik dan gratis |
| Efek CRT | CSS (overlay scanline, `filter`, animasi) | Tanpa library tambahan |
| Animasi scroll | GSAP + ScrollTrigger (opsional) | Animasi mulus dan stabil |
| Efek menang | canvas-confetti atau partikel piksel kustom | Ringan |
| Suara | Howler.js atau Web Audio API | Kontrol audio konsisten |
| Logika game | JavaScript ES modules | Satu file per game |
| Penyimpanan | localStorage | Tanpa backend |
| Alternatif bila tim sudah familiar | React/Vite atau Astro (output statis) | Komponen dan routing, tetap kompatibel dengan Vercel |

### Struktur folder yang diusulkan

```
ttw-website/
  index.html            (halaman 1: landing)
  arcade.html           (halaman 2: lobby + game)
  assets/
    img/                (foto anggota, avatar piksel, galeri, logo)
    audio/              (musik chiptune, efek suara)
    fonts/
  css/
    base.css            (variabel warna, reset, tipografi, efek CRT)
    landing.css
    arcade.css
  js/
    main.js             (navbar, transisi, efek umum)
    landing.js          (section landing, galeri, timeline)
    wallet.js           (saldo koin, bonus harian, statistik)
    games/
      slot.js
      blackjack.js
      roulette.js       (P1)
  data/
    members.json        (10 anggota)
    gallery.json
  vercel.json           (opsional)
```

---

## 9. Roadmap, Milestone & Checklist

Estimasi total sekitar 5 sampai 6 minggu untuk satu orang paruh waktu, lebih cepat bila dikerjakan beberapa anggota. Anggap ini perkiraan awal.

| Fase | Durasi | Hasil akhir |
| --- | --- | --- |
| 1. Persiapan & perancangan ulang | 3 sampai 5 hari | Logo dan palet final, wireframe 2 halaman, konten 10 anggota terkumpul |
| 2. Landing page | 1 sampai 1,5 minggu | `index.html` lengkap dengan semua section dan efek retro dasar, responsif |
| 3. Arcade inti | 1,5 sampai 2 minggu | Lobby, sistem koin, Slot Machine dan Blackjack berfungsi penuh |
| 4. Polish & game tambahan | 1 minggu | Suara, transisi, bonus harian, Roulette/High-Low, Kuis TTW, easter egg |
| 5. Uji & rilis | 3 sampai 5 hari | Uji di HP asli, perbaikan bug, kompres aset, deploy ke Vercel, cek preview share |

### Checklist MVP

- [ ] Landing page lengkap dengan 9 section dan data 10 anggota nyata
- [ ] Layar PRESS START, navbar, dan transisi ke Arcade
- [ ] Sistem koin dengan localStorage dan tombol reset
- [ ] Slot Machine berfungsi dan terlihat meyakinkan
- [ ] Blackjack berfungsi sesuai aturan
- [ ] Tampilan rapi di HP dan desktop
- [ ] Open Graph tag, favicon, dan judul halaman
- [ ] Dideploy di Vercel dan link bisa dibagikan

### Kriteria selesai (Definition of Done)

1. Tidak ada error di konsol browser pada alur utama.
2. Skor Lighthouse mobile: Performance 85 ke atas, Accessibility 90 ke atas.
3. Ke-10 anggota sudah melihat dan menyetujui profil masing-masing.

---

## 10. Risiko, Catatan Penting & Keputusan

### Risiko

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Game dianggap judi sungguhan | Reputasi, kebijakan platform hosting, hukum | Koin fiktif tanpa nilai tukar, disclaimer jelas di arcade dan footer, tanpa deposit/penarikan/hadiah uang |
| Pengunjung di bawah umur | Konten kurang pantas | Gerbang "Saya paham ini hanya game hiburan" di pintu arcade; gunakan nama "Arcade", bukan "Casino" |
| Efek retro/animasi membuat HP lambat | Pengunjung kabur | Kompres aset, batasi efek di HP, toggle CRT, hormati reduced-motion |
| Foto 10 anggota terlambat/tidak lengkap | Jadwal mundur | Mulai dengan placeholder dan avatar piksel, kumpulkan konten sejak fase 1 |
| Saldo hilang saat cache dibersihkan | Pengguna kesal | Beri tahu bahwa saldo tersimpan di browser; opsi ekspor/impor kode saldo (P2) |
| Privasi foto dan sosmed anggota | Anggota tidak nyaman | Minta persetujuan tiap anggota sebelum dipublikasikan |

### Catatan hukum (khusus Indonesia)

Perjudian dengan uang atau barang bernilai dilarang di Indonesia. Karena produk ini hanya memakai koin virtual tanpa nilai, tanpa hadiah nyata, dan tanpa pembayaran, risikonya rendah. Pertahankan hal itu, dan hindari mempromosikan arcade sebagai "judi online" atau "slot gacor". Dokumen ini bukan nasihat hukum.

### Keputusan yang sudah ditetapkan

| Topik | Keputusan |
| --- | --- |
| Nama kelompok | TTW (Tamat Tepat Waktu) |
| Jumlah anggota ditampilkan | 10 |
| Gaya desain | Retro (arcade 8-bit/CRT) |
| Bahasa | Indonesia saja |
| Hosting | Vercel (dikerjakan belakangan) |
| Logo & detail visual | Dirancang ulang bersama tim pada fase persiapan |

### Pertanyaan yang masih terbuka

- [ ] Logo TTW: pakai logo yang sudah ada atau dibuat baru bergaya piksel?
- [ ] Game prioritas selain slot dan blackjack: Roulette, High-Low, Scratch Card, atau Kuis TTW?
- [ ] Makna dan cerita di balik nama "Tamat Tepat Waktu" untuk section Tentang Kami.
- [ ] Gaya foto anggota: foto asli, avatar piksel, atau gabungan keduanya?
- [ ] Nama domain di Vercel (misalnya `ttw.vercel.app` atau domain sendiri).
