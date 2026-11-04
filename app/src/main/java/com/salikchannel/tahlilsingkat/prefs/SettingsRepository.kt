package com.salikchannel.tahlilsingkat.prefs

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import com.salikchannel.tahlilsingkat.data.ArabicAlign
import com.salikchannel.tahlilsingkat.data.ArabicStyleMode
import com.salikchannel.tahlilsingkat.data.ArabicStyleSettings
import com.salikchannel.tahlilsingkat.data.DisplayToggles
import com.salikchannel.tahlilsingkat.data.naskhiSuggested

enum class ThemeMode { SYSTEM, LIGHT, DARK }

/**
 * Holds every user preference as observable Compose state, backed by
 * SharedPreferences (the native equivalent of the web app's cookie persistence).
 * Every setter mutates state AND persists immediately.
 */
class SettingsState(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    var themeMode: ThemeMode by mutableStateOf(loadThemeMode())
        private set
    var displayToggles: DisplayToggles by mutableStateOf(loadToggles())
        private set
    var arabicStyle: ArabicStyleSettings by mutableStateOf(loadArabicStyle())
        private set
    var keepScreenOn: Boolean by mutableStateOf(prefs.getBoolean(KEY_KEEP_SCREEN_ON, false))
        private set
    /** When true, Arabic text uses Arabic commas (،) at the breakpoints that
     *  correspond to commas in the Indonesian translation (for blocks that
     *  provide an [com.salikchannel.tahlilsingkat.data.ContentBlock.arabicComma]
     *  variant). Default off. */
    var arabicCommaMode: Boolean by mutableStateOf(prefs.getBoolean(KEY_ARABIC_COMMA, false))
        private set
    /** Last section index the user was reading (0-based, -1 = not yet read).
     *  Used to restore scroll position when the app reopens. */
    var lastReadSection: Int by mutableStateOf(prefs.getInt(KEY_LAST_SECTION, -1))
        private set

    fun setTheme(mode: ThemeMode) {
        themeMode = mode
        prefs.edit().putString(KEY_THEME, mode.name).apply()
    }

    fun setToggle(arabic: Boolean? = null, transliteration: Boolean? = null, translation: Boolean? = null) {
        displayToggles = displayToggles.copy(
            arabic = arabic ?: displayToggles.arabic,
            transliteration = transliteration ?: displayToggles.transliteration,
            translation = translation ?: displayToggles.translation,
        )
        prefs.edit()
            .putBoolean(KEY_ARABIC, displayToggles.arabic)
            .putBoolean(KEY_TRANSLIT, displayToggles.transliteration)
            .putBoolean(KEY_TRANSLATION, displayToggles.translation)
            .apply()
    }

    fun resetToggles() {
        displayToggles = DisplayToggles()
        prefs.edit()
            .putBoolean(KEY_ARABIC, true)
            .putBoolean(KEY_TRANSLIT, true)
            .putBoolean(KEY_TRANSLATION, true)
            .apply()
    }

    fun setArabicMode(mode: ArabicStyleMode) {
        // When switching to Naskhi, apply its suggested spacing (matches the web app
        // behaviour — only when the user hasn't customised; here we always apply on
        // explicit selection, matching the panel's ModeCard preview intent).
        val next = if (mode == ArabicStyleMode.NASKHI) naskhiSuggested else arabicStyle.copy(mode = mode)
        arabicStyle = next
        saveArabicStyle()
    }

    fun setArabic(fontSize: Float? = null, lineHeight: Float? = null,
                  wordSpacing: Float? = null, letterSpacing: Float? = null,
                  align: ArabicAlign? = null) {
        arabicStyle = arabicStyle.copy(
            fontSize = fontSize ?: arabicStyle.fontSize,
            lineHeight = lineHeight ?: arabicStyle.lineHeight,
            wordSpacing = wordSpacing ?: arabicStyle.wordSpacing,
            letterSpacing = letterSpacing ?: arabicStyle.letterSpacing,
            align = align ?: arabicStyle.align,
        )
        saveArabicStyle()
    }

    fun resetArabic() {
        arabicStyle = ArabicStyleSettings()
        saveArabicStyle()
    }

    fun setKeepScreen(on: Boolean) {
        keepScreenOn = on
        prefs.edit().putBoolean(KEY_KEEP_SCREEN_ON, on).apply()
    }

    fun setArabicComma(on: Boolean) {
        arabicCommaMode = on
        prefs.edit().putBoolean(KEY_ARABIC_COMMA, on).apply()
    }

    fun setLastRead(index: Int) {
        if (index == lastReadSection) return
        lastReadSection = index
        prefs.edit().putInt(KEY_LAST_SECTION, index).apply()
    }

    private fun saveArabicStyle() {
        val s = arabicStyle
        prefs.edit()
            .putString(KEY_AR_MODE, s.mode.name)
            .putFloat(KEY_AR_SIZE, s.fontSize)
            .putFloat(KEY_AR_LH, s.lineHeight)
            .putFloat(KEY_AR_WS, s.wordSpacing)
            .putFloat(KEY_AR_LS, s.letterSpacing)
            .putString(KEY_AR_ALIGN, s.align.name)
            .apply()
    }

    private fun loadThemeMode(): ThemeMode =
        runCatching { ThemeMode.valueOf(prefs.getString(KEY_THEME, ThemeMode.SYSTEM.name)!!) }
            .getOrDefault(ThemeMode.SYSTEM)

    private fun loadToggles(): DisplayToggles = DisplayToggles(
        arabic = prefs.getBoolean(KEY_ARABIC, true),
        transliteration = prefs.getBoolean(KEY_TRANSLIT, true),
        translation = prefs.getBoolean(KEY_TRANSLATION, true),
    )

    private fun loadArabicStyle(): ArabicStyleSettings {
        val mode = runCatching {
            ArabicStyleMode.valueOf(prefs.getString(KEY_AR_MODE, ArabicStyleMode.QURAN.name)!!)
        }.getOrDefault(ArabicStyleMode.QURAN)
        val align = runCatching {
            ArabicAlign.valueOf(prefs.getString(KEY_AR_ALIGN, ArabicAlign.RIGHT.name)!!)
        }.getOrDefault(ArabicAlign.RIGHT)
        return ArabicStyleSettings(
            mode = mode,
            fontSize = prefs.getFloat(KEY_AR_SIZE, 1.75f).coerceIn(MIN_SIZE, MAX_SIZE),
            lineHeight = prefs.getFloat(KEY_AR_LH, 2.1f).coerceIn(MIN_LH, MAX_LH),
            wordSpacing = prefs.getFloat(KEY_AR_WS, 0.05f).coerceIn(0f, 0.6f),
            letterSpacing = prefs.getFloat(KEY_AR_LS, 0f).coerceIn(0f, 0.2f),
            align = align,
        )
    }

    companion object {
        private const val PREFS = "tahlil_prefs"
        private const val KEY_THEME = "theme"
        private const val KEY_ARABIC = "arabic"
        private const val KEY_TRANSLIT = "translit"
        private const val KEY_TRANSLATION = "translation"
        private const val KEY_KEEP_SCREEN_ON = "keep_screen_on"
        private const val KEY_ARABIC_COMMA = "arabic_comma_mode"
        private const val KEY_LAST_SECTION = "last_read_section"
        private const val KEY_AR_MODE = "ar_mode"
        private const val KEY_AR_SIZE = "ar_size"
        private const val KEY_AR_LH = "ar_lh"
        private const val KEY_AR_WS = "ar_ws"
        private const val KEY_AR_LS = "ar_ls"
        private const val KEY_AR_ALIGN = "ar_align"
        // Slider bounds (mirror arabic-style-panel.tsx).
        const val MIN_SIZE = 1.2f; const val MAX_SIZE = 3.2f
        const val MIN_LH = 1.4f; const val MAX_LH = 3.2f
    }
}

val LocalSettings = compositionLocalOf<SettingsState> {
    error("SettingsState not provided")
}

@Composable
fun rememberSettingsState(): SettingsState {
    val context = LocalContext.current
    return remember { SettingsState(context) }
}
