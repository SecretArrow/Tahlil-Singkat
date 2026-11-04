# Tahlil Singkat — Majelis Tahlil & Doa

Aplikasi panduan tahlil ringkas: rangkaian zikir, tahlil, Al-Fātihah, Āyatul-Kursī, dan doa untuk mendoakan para arwah kaum muslimin. Disusun dari Al-Qur'an, hadits, dan amaliah ulama.

Dibangun sebagai **app Android native** (APK bertanda tangan, split per-ABI) dari sebuah aplikasi web Next.js, dibungkus oleh [Capacitor](https://capacitorjs.com/) — WebView Android menjalankan static export, jadi tidak perlu server.

### Fitur utama

- 10 bagian tahlil ringkas dengan teks Arab (3 mode font: Mushaf Quran / Amiri / Naskhi pemula), transliterasi Latin, dan terjemahan Indonesia.
- Panel tampilan: toggle tiap lapisan teks (Arab / transliterasi / terjemahan) on/off.
- **Layar Tetap Hidup** — cegah layar terkunci saat membaca (toggle on/off di panel Tampilan; memakai Screen Wake Lock API `navigator.wakeLock`, dilepas otomatis saat app di-background, dipasang lagi saat kembali ke foreground).
- Mode gelap/terang, navigasi mobile, tombol kembali ke atas, progress bar bacaan.
- Semua preferensi tersimpan otomatis (cookie) dan dipulihkan saat app dibuka lagi.

---

## Tech stack

| Layer | Teknologi |
| --- | --- |
| Web app | Next.js 15 (App Router, `output: "export"`) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 · shadcn/ui (New York) · framer-motion |
| Tipografi Arab | Amiri / Amiri Quran / Scheherazade New (`next/font/google`) |
| Persistence | `document.cookie` (preferensi tipografi & tampilan) + `localStorage` (tema) |
| Native shell | Capacitor 6 → Android (Gradle 8, AGP 8.2.1) |
| Testing | Vitest + Testing Library (unit) · Playwright (e2e) |
| CI/CD | GitHub Actions |

## Struktur repo

```
.
├── src/                      # Aplikasi web (Next.js)
│   ├── app/                  # layout.tsx, page.tsx, globals.css
│   ├── components/           # Header, Hero, SectionCard, panel, provider, ArabicText
│   ├── data/                 # tahlil-content, arabic-style, display-settings
│   └── lib/                  # cookie helpers, utils
├── tests/
│   ├── unit/                 # Vitest — data, cookies, komponen, provider
│   └── e2e/                  # Playwright — alur fitur penuh
├── android/                  # Proyek Capacitor Android (gradle, manifest, ikon)
├── scripts/                  # Skrip util (generate ikon Android)
├── capacitor.config.ts
├── next.config.js            # output: "export"
└── .github/workflows/ci.yml  # CI + auto-release
```

## Pengembangan lokal

```bash
npm install
npm run dev          # dev server Next.js (http://localhost:3000)
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest unit tests
npm run build        # static export → out/
npm run e2e          # Playwright (butuh out/ — jalankan `npm run build` dulu)
```

## Build APK Android lokal

```bash
# 1. Siapkan kredensial signing (lihat android/keystore.properties.example)
cp android/keystore.properties.example android/keystore.properties
#   lalu isi storeFile, storePassword, keyAlias, keyPassword

# 2. Build web + sync ke Android + assembleRelease (split per-ABI)
npm run android:build
```

APK hasil ada di `android/app/build/outputs/apk/release/`:
- `app-armeabi-v8a-release.apk` — perangkat 32-bit ARM lama
- `app-arm64-v8a-release.apk` — perangkat 64-bit ARM (mayoritas ponsel modern)
- `app-x86_64-release.apk` — emulator / perangkat x86_64
- `app-universal-release.apk` — fallback semua ABI

## Signing — setup secret CI

CI membangun APK bertanda tangan menggunakan 4 repository secret (Settings →
Secrets and variables → Actions):

| Secret | Isi |
| --- | --- |
| `KEYSTORE_BASE64` | Base64 dari file `.keystore` (hasil `base64 -w 0 release.keystore`) |
| `KEYSTORE_PASSWORD` | Password keystore |
| `KEY_ALIAS` | Nama alias key (`tahlil-release`) |
| `KEY_PASSWORD` | Password key |

`android/keystore.properties` (berisi password plaintext) **dibuat on-the-fly
di runner CI** dari secret di atas dan tidak pernah di-commit — sudah ada di
`.gitignore`. File keystore asli juga git-ignored.

> **Penting:** jangan pernah menyimpan keystore, password, atau token di repo.
> Token GitHub PAT tidak digunakan di CI — release dibuat dengan `GITHUB_TOKEN`
> bawaan runner.

## CI/CD (`.github/workflows/ci.yml`)

Satu workflow, dua job:

1. **test** (setiap push ke main + PR) — lint (dengan `lint:fix` auto-heal +
   auto-commit ke main), typecheck, unit test (Vitest), build static export,
   Playwright e2e. Cache npm + browser Playwright untuk mempercepat.
2. **release** (hanya push ke main, setelah `test` lulus) — build web, `cap sync`,
   decode keystore dari secret, `./gradlew assembleRelease`, verifikasi tanda
   tangan dengan `apksigner`, lalu **auto-publish GitHub Release** berisi 4 APK
   signed (arm64-v8a, armeabi-v7a, x86_64, universal) + release notes otomatis.

Versi diambil dari nomor run CI: `versionName = 1.0.<run_number>`,
`versionCode = <run_number>` (selalu naik).

### Auto-fix & auto-release

- **Auto-fix:** sebelum gate lint, `npm run lint:fix` dijalankan; jika ada
  perubahan yang bisa diperbaiki otomatis, bot commit kembali ke main dengan
  `[skip ci]` (tidak memicu loop).
- **Auto-release:** setiap push ke main yang lulus semua tes langsung membuat
  GitHub Release baru dengan APK signed — tanpa tagging manual.

## Konten

10 bagian tahlil ringkas: Al-Fātihah · Tahlil (zikir) · Ṣalawat Ibrāhīmiyyah ·
Al-Ikhlāṣ · Al-Falaq · An-Nās · Āyatul-Kursī · Tasbīḥ/Taḥmid/Takbīr · Doa untuk
Arwah · Doa Penutup. Setiap bagian punya tiga lapis (Arab, transliterasi,
terjemahan) yang bisa dimatikan satu per satu, plus jumlah pengulangan dan
sumber kutipan. Teks Quran memakai tanda akhir ayat (۝) yang dirender sebagai
ornamen dengan angka di tengahnya (gaya mushaf).

## Lisensi & sumber

Konten tahlil bersumber dari Al-Qur'an dan amaliah ulama Nusantara. Aplikasi
dibuat untuk kepentingan ibadah & pembelajaran.
