# Tahlil Singkat — Majelis Tahlil & Doa (Native Android)

Aplikasi panduan tahlil ringkas: rangkaian zikir, tahlil, Al-Fātihah, Āyatul-Kursī, dan doa untuk mendoakan para arwah kaum muslimin. Disusun dari Al-Qur'an, hadits, dan amaliah ulama. Sumber konten: **Salik Channel**.

Ini adalah **port ulang penuh** dari aplikasi web Next.js (di folder zip sumber) ke **native Android** menggunakan Kotlin + Jetpack Compose. Bukan lagi app WebView/Capacitor — sekarang murni Compose.

## Tech stack

| Layer | Teknologi |
| --- | --- |
| Bahasa | Kotlin 2.0.21 |
| UI | Jetpack Compose (Material 3) |
| Build | Android Gradle Plugin 8.7.3, Gradle 8.9 |
| Persistensi | SharedPreferences |
| Font Arab | Amiri, Amiri Quran, Scheherazade New (dibundel di `res/font/`) |
| minSdk / targetSdk | 26 / 34 |

## Fitur

- **10+ bagian tahlil** dengan teks Arab (3 mode font: **Mushaf Quran** / **Amiri Standar** / **Naskhi Tebal**), transliterasi Latin, dan terjemahan Indonesia. Setiap ayat dipecah ke baris tersendiri; tanda akhir ayah (۝) dipertahankan.
- **Panel Tampilan** — toggle tiap lapisan teks (Arab / transliterasi / terjemahan) on/off.
- **Pengaturan Teks Arab** — 3 mode font + slider ukuran huruf, jarak antarbaris, jarak antarkata, jarak antarhuruf, dan perataan (kanan / rata kanan-kiri), dengan pratinjau langsung.
- **Lanjut bacaan terakhir** — app otomatis membuka kembali pada bagian terakhir yang dibaca; posisi tersimpan otomatis (SharedPreferences).
- **Konfirmasi sebelum keluar** — tombol back dari layar utama memunculkan dialog "Keluar dari aplikasi?" (Batal / Keluar); saat layar penuh, back keluar dari mode penuh dulu.
- **Koma teks Arab mengikuti terjemahan** (default mati, di Pengaturan Tampilan) — jika dinyalakan, teks Arab memakai koma Arab (،) pada titik yang sama dengan koma terjemahan (mis. "...keluarga, sahabat, istri, anak cucu...").
- **Hero** — tombol **Mulai** (ke bagian pertama), serta **Tahlil** / **Dzikir** / **Doa** untuk lompat langsung.
- **Layar Tetap Hidup** — cegah layar terkunci saat membaca (toggle on/off di Pengaturan Tampilan). Memakai `WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON` — pola native Android yang direkomendasikan (setara `keepScreenOn` di Compose), lebih andal daripada Screen Wake Lock API web karena bertahan saat app di-background.
- **Mode Layar Penuh** — tombol layar-penuh di top bar menyembunyikan status bar & navigation bar untuk membaca tanpa gangguan (immersive, `WindowInsetsControllerCompat`); tombol back mengambang di pojok kanan atas untuk kembali ke mode biasa.
- **Logo app** — Rub el Hizb (bintang segi delapan) emas + bulan sabit krem + bintang, di atas latar gradien zamrud (adaptive icon, vector).
- **Mode gelap/terang** (system / light / dark), **daftar isi** (navigation drawer), **tombol kembali ke atas**, **progress bar bacaan**.
- Semua preferensi tersimpan otomatis (SharedPreferences) dan dipulihkan saat app dibuka lagi.
- Warna tema dikonversi persis dari token OKLCH sumber web (cream / emerald / gold untuk light; deep forest / cream / gold untuk dark).

## Rilis

Setiap rilis memproduksi **4 APK signed split per-ABI**: `arm64-v8a`, `armeabi-v7a`, `x86_64`, dan `universal` (cocok untuk semua perangkat). Lihat [Releases](https://github.com/SecretArrow/Tahlil-Singkat/releases).

## Struktur proyek

```
app/src/main/java/com/salikchannel/tahlilsingkat/
├── MainActivity.kt              # entry point (edge-to-edge)
├── data/
│   ├── TahlilContent.kt         # 11 bagian tahlil (port dari tahlil-content.ts)
│   └── Settings.kt              # DisplayToggles, ArabicStyleSettings, typeConfig
├── prefs/
│   └── SettingsRepository.kt    # SharedPreferences + Compose state holder
├── theme/
│   ├── Color.kt                 # token OKLCH → ARGB
│   ├── Fonts.kt                 # Amiri / Amiri Quran / Scheherazade
│   └── Theme.kt                 # Material3 ColorScheme (light/dark)
└── ui/
    ├── TahlilApp.kt             # root: Scaffold + LazyColumn + nav drawer + KeepScreenOnEffect
    ├── Util.kt                  # Modifier.clickableNoRipple
    ├── components/              # Header, Hero, SectionCard, ArabicText, ScrollProgress, BackToTop
    └── screens/                 # DisplaySettingsSheet, ArabicStyleSheet
```

## Build

```bash
# Debug
./gradlew :app:assembleDebug

# Release (butuh keystore via env: KEYSTORE_PATH, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD)
./gradlew :app:assembleRelease
```

APK keluaran: `app/build/outputs/apk/release/app-release.apk`.

CI (`.github/workflows/android.yml`) membangun + menandatangani + merilis APK otomatis pada setiap push ke `main`.
