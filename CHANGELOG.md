# Changelog — Tahlil Singkat (Android Native)

Semua pembaharuan aplikasi native Android (Kotlin + Jetpack Compose).
Rilis dibangun & ditandatangani otomatis oleh GitHub Actions
(signed split-per-ABI: arm64-v8a, armeabi-v7a, x86_64, universal).

---

## [2.3.0] — 2026-11-05

### Perbaikan Harakat Mode Naskhi Tebal (audit komprehensif)

Audit harakat seluruh 38 blok Arab (diport dari zip sumber web terbaru):

- **+10 sukun** pada lam1 artikel "wa+al+syamsiyyah": `وَالشُّهَدَاءِ` → `وَالْشُّهَدَاءِ`, `وَالصَّالِحِيْنَ` → `وَالْصَّالِحِيْنَ`, `وَالصَّحَابَةِ` → `وَالْصَّحَابَةِ`, `وَالتَّابِعِيْنَ` → `وَالْتَّابِعِيْنَ`, `وَالنَّاسِ` → `وَالْنَّاسِ`, `وَالنَّجَاةَ` → `وَالْنَّجَاةَ`, dll.
- **+6 fathah+syadda** pada lam2 "li-llah" yang telanjang: `لِلهِ` → `لِلَّهِ` (semua varian kini konsisten — tidak ada lagi `لِلهِ` tanpa syadda).
- **Varian "Allah" TETAP idgham** (keputusan dipertahankan): `اللَّهِ`, `اَللّٰهُمَّ`, `بِاللَّهِ`, `وَاللَّهُ` — tanpa sukun di lam1.

### Toggle "Warnai Kata Arab" (colorizeArabic)

- **Toggle baru di Pengaturan Tampilan** (default mati).
- Setiap kata Arab diberi salah satu dari dua warna bergantian agar kata
  berurutan mudah dibedakan (membantu mengikuti bacaan):
  - Tema terang: `#000000` & `#011b45`
  - Tema gelap: `#ffffff` & `#d9dadb`
- Pola A/B kontinu antarbaris (counter dibagi lintas ayat/klausa dalam satu
  render) — sama seperti versi web.
- Tanda waqf mushaf (۝X) ikut blok teksnya; tidak dikecualikan di native
  karena pewarnaan per kata tidak mengubah ornamentasi tanda.

### Varian Koma dihitung ulang untuk semua blok

- Algoritma `addArabicCommas` versi web (kompleks: skip frasa shalawat
  ` وَسَلَّمْ`, skip konektor pertama setelah frasa, skip konektor terakhir
  tiap segmen) di-port ke Kotlin dan **19 varian** `arabicComma` dihitung
  ulang (sebelumnya 2), sehingga toggle "Koma Mengikuti Terjemahan" kini
  bekerja untuk semua doa yang relevan, bukan cuma 2 blok.
- Ayat Al-Qur'an (ber۝/۩) tidak pernah diberi koma.

### Pengujian otomatis di CI (baru)

- **Unit test JVM**: logika teks Arab (pemecah ayat/klausa, penambahan koma,
  pewarnaan kata), invariant konten (harakat, jumlah bagian/blok, tanpa
  penyebutan NU, varian koma), persistensi preferensi (fake SharedPreferences).
- **Lint**: `./gradlew lint` — analisis statis Android.
- **E2E (instrumented, emulator)**: Compose UI test menjalankan MainActivity
  sungguhan — tombol Mulai, drawer 11 bagian, sheet pengaturan, toggle
  Warnai/Lapisan, petunjuk semua-lapisan-disembunyikan.
- Pipeline CI: `lint → unit → e2e → build signed split-per-ABI → release`.

### Lain-lain

- Row toggle di sheet Pengaturan kini seluruh baris bisa diklik (bukan hanya
  switch-nya) — lebih mudah disentuh di layar kecil.
- `SettingsState` dipecah jadi `SettingsStateBase` dengan `SharedPreferences`
  ter-inject agar bisa diuji di JVM tanpa framework Android.

---

## [2.2.0] — 2026-11-05

- Tombol **"Mulai"** di Hero (sebelumnya "Mulai Membaca").
- **Lanjut bacaan terakhir** — app membuka kembali pada bagian terakhir yang
  dibaca (posisi tersimpan otomatis).
- **Konfirmasi sebelum keluar** — tombol back dari layar utama memunculkan
  dialog "Keluar dari aplikasi?" (Batal / Keluar).
- **Koma teks Arab mengikuti terjemahan** (default mati) — jika dinyalakan,
  teks Arab memakai koma Arab (،) pada titik yang sama dengan koma terjemahan.

## [2.1.0] — 2026-11-05

- Rilis signed split-per-ABI (4 APK: arm64-v8a, armeabi-v7a, x86_64, universal).
- Logo app Rub el Hizb + bulan sabit.
- Mode **Layar Penuh** (immersive).
- R8 shrinking (APK ~1,8 MB).

## [2.0.0] — 2026-11-05

- Port ulang penuh dari aplikasi web Next.js ke **native Android Kotlin**
  (Kotlin 2.0, Jetpack Compose Material3).
- 11 bagian tahlil: teks Arab (3 mode font: Mushaf Quran / Amiri / Naskhi),
  transliterasi Latin, terjemahan Indonesia.
- Panel Tampilan: toggle Arab/transliterasi/terjemahan + Layar Tetap Hidup.
- Panel Teks Arab: 3 mode + slider ukuran/jarak baris/jarak kata/jarak huruf
  + perataan + pratinjau langsung.
- Mode gelap/terang (system/light/dark), daftar isi (drawer), tombol kembali
  ke atas, progress bar bacaan.
- Font Arab asli dibundel: Amiri, Amiri Quran, Scheherazade New.
