package com.salikchannel.tahlilsingkat.prefs

import android.content.SharedPreferences
import com.salikchannel.tahlilsingkat.data.ArabicStyleMode
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Persistence tests for SettingsStateBase with a fake SharedPreferences —
 * pure JVM, no Android framework (matches the web app's cookie persistence
 * guarantees: every setter persists immediately).
 */
class SettingsStateTest {

    /** Minimal in-memory SharedPreferences (only what SettingsState uses). */
    private class FakePrefs : SharedPreferences {
        private val map = mutableMapOf<String, Any?>()
        private val listeners = mutableListOf<SharedPreferences.OnSharedPreferenceChangeListener>()

        override fun getAll(): Map<String, *> = map
        override fun getString(key: String?, defValue: String?): String? = map[key] as? String ?: defValue
        override fun getStringSet(key: String?, defValue: MutableSet<String>?): MutableSet<String>? =
            @Suppress("UNCHECKED_CAST") (map[key] as? Set<String>) as MutableSet<String>? ?: defValue
        override fun getInt(key: String?, defValue: Int): Int = map[key] as? Int ?: defValue
        override fun getLong(key: String?, defValue: Long): Long = map[key] as? Long ?: defValue
        override fun getFloat(key: String?, defValue: Float): Float = map[key] as? Float ?: defValue
        override fun getBoolean(key: String?, defValue: Boolean): Boolean = map[key] as? Boolean ?: defValue
        override fun contains(key: String?): Boolean = map.containsKey(key)
        override fun edit(): SharedPreferences.Editor = FakeEditor()
        override fun registerOnSharedPreferenceChangeListener(l: SharedPreferences.OnSharedPreferenceChangeListener) { listeners.add(l) }
        override fun unregisterOnSharedPreferenceChangeListener(l: SharedPreferences.OnSharedPreferenceChangeListener) { listeners.remove(l) }

        inner class FakeEditor : SharedPreferences.Editor {
            private val pending = mutableMapOf<String, Any?>()
            private val clears = mutableListOf<String>()
            private fun stash(key: String?, value: Any?) {
                if (key != null) pending[key] = value
            }
            override fun putString(key: String?, value: String?): SharedPreferences.Editor = also { stash(key, value) }
            override fun putStringSet(key: String?, values: MutableSet<String>?): SharedPreferences.Editor = also { stash(key, values) }
            override fun putInt(key: String?, value: Int): SharedPreferences.Editor = also { stash(key, value) }
            override fun putLong(key: String?, value: Long): SharedPreferences.Editor = also { stash(key, value) }
            override fun putFloat(key: String?, value: Float): SharedPreferences.Editor = also { stash(key, value) }
            override fun putBoolean(key: String?, value: Boolean): SharedPreferences.Editor = also { stash(key, value) }
            override fun remove(key: String?): SharedPreferences.Editor = also { if (key != null) clears.add(key) }
            override fun clear(): SharedPreferences.Editor = also { map.clear() }
            override fun commit(): Boolean { apply(); return true }
            override fun apply() {
                map.putAll(pending)
                pending.clear()
            }
        }
    }

    private fun fresh() = SettingsStateBase(FakePrefs())

    @Test
    fun `defaults - everything off except text layers`() {
        val s = fresh()
        assertEquals(ThemeMode.SYSTEM, s.themeMode)
        assertTrue(s.displayToggles.arabic)
        assertTrue(s.displayToggles.transliteration)
        assertTrue(s.displayToggles.translation)
        assertFalse(s.keepScreenOn)
        assertFalse(s.arabicCommaMode)
        assertFalse(s.colorizeArabic)
        assertEquals(-1, s.lastReadSection)
        assertEquals(ArabicStyleMode.QURAN, s.arabicStyle.mode)
    }

    @Test
    fun `colorizeArabic toggle persists`() {
        val prefs = FakePrefs()
        val s = SettingsStateBase(prefs)
        s.setColorize(true)
        assertTrue(s.colorizeArabic)
        // A second instance over the same prefs sees the persisted value.
        assertTrue(SettingsStateBase(prefs).colorizeArabic)
        s.setColorize(false)
        assertFalse(SettingsStateBase(prefs).colorizeArabic)
    }

    @Test
    fun `arabicCommaMode toggle persists`() {
        val prefs = FakePrefs()
        val s = SettingsStateBase(prefs)
        s.setArabicComma(true)
        assertTrue(SettingsStateBase(prefs).arabicCommaMode)
    }

    @Test
    fun `theme cycle persists and reloads`() {
        val prefs = FakePrefs()
        val s = SettingsStateBase(prefs)
        s.setTheme(ThemeMode.DARK)
        assertEquals(ThemeMode.DARK, SettingsStateBase(prefs).themeMode)
        s.setTheme(ThemeMode.LIGHT)
        assertEquals(ThemeMode.LIGHT, SettingsStateBase(prefs).themeMode)
    }

    @Test
    fun `layer toggles persist individually`() {
        val prefs = FakePrefs()
        val s = SettingsStateBase(prefs)
        s.setToggle(arabic = false)
        assertFalse(SettingsStateBase(prefs).displayToggles.arabic)
        assertTrue(SettingsStateBase(prefs).displayToggles.transliteration)
        s.setToggle(translation = false)
        assertFalse(SettingsStateBase(prefs).displayToggles.translation)
    }

    @Test
    fun `naskhi mode applies suggested spacing`() {
        val s = fresh()
        s.setArabicMode(ArabicStyleMode.NASKHI)
        assertEquals(ArabicStyleMode.NASKHI, s.arabicStyle.mode)
        assertEquals(2.0f, s.arabicStyle.fontSize, 1e-6f)
        assertEquals(2.6f, s.arabicStyle.lineHeight, 1e-6f)
        assertEquals(0.18f, s.arabicStyle.wordSpacing, 1e-6f)
        assertEquals(0.03f, s.arabicStyle.letterSpacing, 1e-6f)
    }

    @Test
    fun `last read section persists`() {
        val prefs = FakePrefs()
        val s = SettingsStateBase(prefs)
        s.setLastRead(4)
        assertEquals(4, SettingsStateBase(prefs).lastReadSection)
    }

    @Test
    fun `reset restores defaults`() {
        val s = fresh()
        s.setToggle(arabic = false, translation = false)
        s.resetToggles()
        assertTrue(s.displayToggles.arabic)
        assertTrue(s.displayToggles.translation)
    }
}
