package com.salikchannel.tahlilsingkat

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import android.content.Context
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * E2E Compose UI tests — drive the real MainActivity on an emulator and
 * verify the user-facing features documented in CHANGELOG.md.
 *
 * AndroidJUnit4 runs methods alphabetically, so tests are prefixed to make
 * the order deterministic and independent of the v2.2.0 resume-last-read
 * feature: hero-dependent tests run FIRST while the list is still at the
 * top; the drawer test (which navigates to section 6 and persists that
 * position) runs LAST. recreate() cannot restore the top position because
 * rememberLazyListState saves the scroll index across recreation.
 *
 * [resetAppState] still clears SharedPreferences between tests so the
 * sheet-toggle tests each start from the documented defaults.
 *
 * Texts that legitimately appear in multiple places (title in top bar +
 * hero, "Pembukaan" in drawer + section card, the hint in every visible
 * section card) are matched with onAllNodesWithText()[n].
 */
@RunWith(AndroidJUnit4::class)
class MainActivityE2ETest {

    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Before
    fun resetAppState() {
        // Must match SettingsState's PREFS name ("tahlil_prefs"). Only the
        // preference values (toggles, theme, last-read index) live here.
        val prefs = InstrumentationRegistry.getInstrumentation()
            .targetContext.getSharedPreferences("tahlil_prefs", Context.MODE_PRIVATE)
        prefs.edit().clear().commit()
        composeRule.waitForIdle()
    }

    @Test
    fun a01_heroShowsTitleStartButtonAndBismillah() {
        // "Tahlil Singkat" appears in the top bar AND the hero title.
        composeRule.onAllNodesWithText("Tahlil Singkat")[0].assertIsDisplayed()
        composeRule.onAllNodesWithText("Tahlil Singkat")[1].assertIsDisplayed()
        composeRule.onNodeWithText("Mulai").assertIsDisplayed()
        composeRule.onNodeWithText("Tahlil").assertIsDisplayed()
        composeRule.onNodeWithText("Dzikir").assertIsDisplayed()
        composeRule.onNodeWithText("Doa").assertIsDisplayed()
        composeRule.onNodeWithText("بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ").assertIsDisplayed()
    }

    @Test
    fun a02_startButtonScrollsToFirstSection() {
        composeRule.onNodeWithText("Mulai").performClick()
        composeRule.waitForIdle()
        // "Pembukaan" exists in the drawer AND the section card; after the
        // jump the section card is on screen — any match being displayed
        // satisfies the intent, so check the first found node.
        composeRule.onAllNodesWithText("Pembukaan")[0].assertIsDisplayed()
    }

    @Test
    fun a03_displaySheetShowsAllTogglesIncludingColorize() {
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
    fun a04_colorizeToggleFlipsSubtitleText() {
        composeRule.onNodeWithContentDescription("Pengaturan tampilan").performClick()
        composeRule.waitForIdle()
        // Default off.
        composeRule.onNodeWithText("Kata Arab memakai satu warna (default)").assertIsDisplayed()
        // The whole row is tappable (not just the switch).
        composeRule.onNodeWithText("Warnai Kata Arab").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Setiap kata Arab diberi warna bergantian agar mudah dibedakan")
            .assertIsDisplayed()
    }

    @Test
    fun a05_hidingAllLayersShowsHint() {
        composeRule.onNodeWithContentDescription("Pengaturan tampilan").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Arab").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Transliterasi").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Terjemahan").performClick()
        composeRule.waitForIdle()
        // The hint renders inside every visible section card — several
        // matches are expected and correct.
        composeRule.onAllNodesWithText(
            "Semua tampilan disembunyikan. Aktifkan minimal satu di tombol Tampilan.",
        )[0].assertIsDisplayed()
    }

    @Test
    fun z99_drawerListsAllElevenSections() {
        // Runs last: navigating from the drawer persists the read position,
        // which the earlier hero-dependent tests must not observe.
        composeRule.onNodeWithContentDescription("Daftar isi").performClick()
        composeRule.waitForIdle()
        composeRule.onNodeWithText("Daftar Isi").assertIsDisplayed()
        composeRule.onNodeWithText("11 bagian").assertIsDisplayed()
        // A deep section only reachable through the drawer list.
        composeRule.onNodeWithText("Ayat Kursi").performClick()
        composeRule.waitForIdle()
        // Navigating from the drawer jumps to section 6 (Ayat Kursi).
        composeRule.onAllNodesWithText("Ayat Kursi")[0].assertIsDisplayed()
    }
}
