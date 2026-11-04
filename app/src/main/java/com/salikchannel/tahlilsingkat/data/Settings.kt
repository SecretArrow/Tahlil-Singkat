package com.salikchannel.tahlilsingkat.data

/** Arabic typography mode (port of src/data/arabic-style.ts). */
enum class ArabicStyleMode { STANDARD, QURAN, NASKHI }

enum class ArabicAlign { RIGHT, JUSTIFY }

/** Which text layers are visible inside each SectionCard (port of DisplayToggles). */
data class DisplayToggles(
    val arabic: Boolean = true,
    val transliteration: Boolean = true,
    val translation: Boolean = true,
)

/** Arabic typography settings (port of ArabicStyleSettings). */
data class ArabicStyleSettings(
    val mode: ArabicStyleMode = ArabicStyleMode.QURAN,
    val fontSize: Float = 1.75f,      // rem-equivalent; mapped to sp via a base multiplier
    val lineHeight: Float = 2.1f,     // unitless multiplier
    val wordSpacing: Float = 0.05f,   // em
    val letterSpacing: Float = 0f,    // em (space between letters within a word)
    val align: ArabicAlign = ArabicAlign.RIGHT,
)

data class ArabicModeConfig(
    val label: String,
    val description: String,
)

val arabicModeConfigs: Map<ArabicStyleMode, ArabicModeConfig> = mapOf(
    ArabicStyleMode.STANDARD to ArabicModeConfig(
        label = "Arab Standar",
        description = "Tampilan sederhana, bersih, dan harakat konvensional. Font: Amiri — readability tinggi untuk teks sehari-hari.",
    ),
    ArabicStyleMode.QURAN to ArabicModeConfig(
        label = "Gaya Mushaf Al-Qur'an (Utsmani)",
        description = "Karakter Naskhi khas mushaf, bentuk sambungan huruf, ligatur, harakat, dan tanda baca Al-Qur'an yang lebih autentik. Font: Amiri Quran.",
    ),
    ArabicStyleMode.NASKHI to ArabicModeConfig(
        label = "Naskhi Tebal",
        description = "Font Naskhi tradisional yang tebal & estetik, dengan struktur huruf horizontal lurus (tanpa ligatur/sambungan rumit), harakat lengkap, dan spasi antarbaris renggang agar setiap huruf & harakatnya jelas. Font: Scheherazade New.",
    ),
)

/** Suggested defaults applied when the user switches to Naskhi mode
 *  (matches arabicStyleModes.naskhi.suggested in the TS source). */
val naskhiSuggested = ArabicStyleSettings(
    mode = ArabicStyleMode.NASKHI,
    fontSize = 2.0f,
    lineHeight = 2.6f,
    wordSpacing = 0.18f,
    letterSpacing = 0.03f,
    align = ArabicAlign.RIGHT,
)

// ── Section-type badge styling ─────────────────────────────────────────────
// container = type colour at 15% alpha; textLight/textDark = -700 / -300 shades
// (port of section-card typeConfig, Tailwind emerald/teal/amber/yellow/rose/violet).
data class TypeStyle(
    val label: String,
    val container: Long,   // 0xAARRGGBB
    val textLight: Long,   // 0xFFRRGGBB
    val textDark: Long,    // 0xFFRRGGBB
)

val typeConfig: Map<SectionType, TypeStyle> = mapOf(
    SectionType.PEMBUKAAN to TypeStyle("Pembukaan", 0x2610B981L, 0xFF047857L, 0xFF6EE7B7L),
    SectionType.SHOLAWAT to TypeStyle("Shalawat", 0x2614B8A6L, 0xFF0F766EL, 0xFF5EEAD4L),
    SectionType.SURAH to TypeStyle("Surat", 0x26F59E0BL, 0xFFB45309L, 0xFFFCD34DL),
    SectionType.TAHLIL to TypeStyle("Tahlil", 0x2610B981L, 0xFF047857L, 0xFF6EE7B7L),
    SectionType.AYAT to TypeStyle("Ayat", 0x26EAB308L, 0xFFA16207L, 0xFFFDE047L),
    SectionType.DOA to TypeStyle("Doa", 0x26F43F5EL, 0xFFBE123CL, 0xFFFDA4AFL),
    SectionType.DZIKIR to TypeStyle("Dzikir", 0x268B5CF6L, 0xFF6D28D9L, 0xFFC4B5FDL),
)
