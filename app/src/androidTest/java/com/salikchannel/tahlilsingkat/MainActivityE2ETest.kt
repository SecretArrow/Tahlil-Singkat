package com.salikchannel.tahlilsingkat

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * E2E Compose UI tests — drive the real MainActivity on an emulator and
 * verify the user-facing features documented in CHANGELOG.md:
 *   - hero renders with the "Mulai" CTA and Bismillah
 *   - navigation drawer lists all 11 sections
 *   - display-settings sheet: layer toggles + new "Warnai Kata Arab" toggle
 *   - toggling layers hides the Arabic block content (all-hidden hint)
 */
@RunWith(AndroidJUnit4::class)
class MainActivityE2ETest {

    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun heroShowsTitleStartButtonAndBismillah() {
        composeRule.onNodeWithText("Tahlil Singkat").assertIsDisplayed()
        composeRule.onNodeWithText("Mulai").assertIsDisplayed()
        composeRule.onNodeWithText("Tahlil").assertIsDisplayed()
        composeRule.onNodeWithText("Dzikir").assertIsDisplayed()
        composeRule.onNodeWithText("Doa").assertIsDisplayed()
        composeRule.onNodeWithText("بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ").assertIsDisplayed()
    }

    @Test
    fun startButtonScrollsToFirstSection() {
        composeRule.onNodeWithText("Mulai").performClick()
        composeRule.waitForIdle()
        // Section 1 (Pembukaan) header becomes visible after the jump.
        composeRule.onNodeWithText("Pembukaan").assertIsDisplayed()
    }

    @Test
    fun drawerListsAllElevenSections() {
        composeRule.onNodeWithContentDescription("Daftar isi").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Daftar Isi").assertIsDisplayed()
        composeRule.onNodeWithText("11 bagian").assertIsDisplayed()
        composeRule.onNodeWithText("Ayat Kursi").assertIsDisplayed()
    }

    @Test
    fun displaySheetShowsAllTogglesIncludingColorize() {
        composeRule.onNodeWithContentDescription("Pengaturan tampilan").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Pengaturan Tampilan").assertIsDisplayed()
        composeRule.onNodeWithText("Arab").assertIsDisplayed()
        composeRule.onNodeWithText("Transliterasi").assertIsDisplayed()
        composeRule.onNodeWithText("Terjemahan").assertIsDisplayed()
        composeRule.onNodeWithText("Layar Tetap Hidup").assertIsDisplayed()
        composeRule.onNodeWithText("Koma Mengikuti Terjemahan").assertIsDisplayed()
        // The new v2.3.0 toggle.
        composeRule.onNodeWithText("Warnai Kata Arab").assertIsDisplayed()
    }

    @Test
    fun colorizeToggleFlipsSubtitleText() {
        composeRule.onNodeWithContentDescription("Pengaturan tampilan").performClick()
        composeRule.waitForIdle()
        // Default off.
        composeRule.onNodeWithText("Kata Arab memakai satu warna (default)").assertIsDisplayed()
        // Tap the switch labelled by its row title's clickable area — the
        // SwitchRow itself is the touch target.
        composeRule.onNodeWithText("Warnai Kata Arab").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Setiap kata Arab diberi warna bergantian agar mudah dibedakan")
            .assertIsDisplayed()
    }

    @Test
    fun hidingAllLayersShowsHint() {
        composeRule.onNodeWithContentDescription("Pengaturan tampilan").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Arab").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Transliterasi").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Terjemahan").performClick()
        composeRule.waitForIdle()
        // The all-hidden hint renders inside every section card.
        composeRule.onNodeWithText("Semua tampilan disembunyikan. Aktifkan minimal satu di tombol Tampilan.")
            .assertIsDisplayed()
    }
}
