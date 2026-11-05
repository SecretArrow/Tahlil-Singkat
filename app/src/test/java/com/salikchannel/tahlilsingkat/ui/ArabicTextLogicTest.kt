package com.salikchannel.tahlilsingkat.ui

import com.salikchannel.tahlilsingkat.data.tahlilSections
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Unit tests for the pure Arabic text-processing logic (JVM).
 * These lock down the behaviours documented in CHANGELOG.md.
 */
class ArabicTextLogicTest {

    // ── formatArabic: ayah-mark line splitting ──────────────────────────────

    @Test
    fun `fatihah splits into 7 verse lines with mark at end`() {
        val text = "بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ ۝١ الْحَمْدُ لِلَّهِ رَبِّ الْعٰلَمِيْنَ ۝٢ الرَّحْمٰنِ الرَّحِيْمِ ۝٣ مٰلِكِ يَوْمِ الدِّيْنِ ۝٤ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِيْنُ ۝٥ اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ ۝٦ صِرَاطَ الَّذِيْنَ ۝٧"
        val lines = ArabicTextLogic.formatArabic(text)
        assertEquals(7, lines.size)
        assertTrue(lines[0].endsWith("۝١"))
        assertTrue(lines[6].endsWith("۝٧"))
    }

    @Test
    fun `long dua splits by comma and period keeping delimiters`() {
        val text = "اَللّٰهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ. اَللّٰهُمَّ أَنْزِلِ الرَّحْمَةَ"
        val lines = ArabicTextLogic.formatArabic(text)
        assertEquals(2, lines.size)
        assertTrue(lines[0].endsWith("."))
        assertFalse(lines[0].endsWith("،"))
    }

    @Test
    fun `plain text stays a single line`() {
        assertEquals(listOf("لَآ إِلٰهَ إِلَّا اللَّهُ"),
            ArabicTextLogic.formatArabic("لَآ إِلٰهَ إِلَّا اللَّهُ"))
    }

    // ── addArabicCommas ─────────────────────────────────────────────────────

    @Test
    fun `quran verses are never modified`() {
        val text = "بِسْمِ ۝١ النَّاسِ ۝٢"
        assertEquals(text, ArabicTextLogic.addArabicCommas(text))
        val text2 = "وَمِنْ شَرِّ ۩ النَّاسِ"
        assertEquals(text2, ArabicTextLogic.addArabicCommas(text2))
    }

    @Test
    fun `sholawat phrase connector stays comma-free, first item too`() {
        // Changelog example: ...وَسَلَّمْ وَعَلَى آلِهِ، وَأَصْحَابِهِ، وَأَزْوَاجِهِ، وَذُرِّيَّتِهِ وَأَهْلِ بَيْتِهِ
        val text = "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمْ وَعَلَى آلِهِ وَأَصْحَابِهِ وَأَزْوَاجِهِ وَذُرِّيَّتِهِ وَأَهْلِ بَيْتِهِ"
        val out = ArabicTextLogic.addArabicCommas(text)
        assertTrue(out, out.contains("وَسَلَّمْ وَعَلَى آلِهِ،"))
        assertTrue(out, out.contains("وَأَصْحَابِهِ، وَأَزْوَاجِهِ، وَذُرِّيَّتِهِ وَأَهْلِ بَيْتِهِ"))
        assertFalse(out, out.contains("وَسَلَّمْ،"))
    }

    @Test
    fun `last connector in segment gets no comma`() {
        val text = "أ وَب وَج"
        val out = ArabicTextLogic.addArabicCommas(text)
        // 2 connectors → first gets comma, last doesn't ("X، Y dan W").
        assertEquals("أ، وَب وَج", out)
    }

    @Test
    fun `single connector text unchanged`() {
        val text = "أَحْمَدُ وَزَيْدٌ"
        assertEquals(text, ArabicTextLogic.addArabicCommas(text))
    }

    @Test
    fun `phrase at text start - first list connector still gets comma`() {
        // When the phrase sits at index 0 it is not a connector position, so
        // the phrase rule never fires; the first connector introduces the
        // list and receives a comma just like every non-final item. This is
        // the exact behaviour of the web addArabicCommas (verified against
        // the JS source) — the real content never starts with such a phrase.
        val text = "وَسَلِّمْ وَعَلَى آلِهِ وَأَصْحَابِهِ وَأَزْوَاجِهِ وَذُرِّيَّتِهِ وَأَهْلِ بَيْتِهِ"
        val out = ArabicTextLogic.addArabicCommas(text)
        assertTrue(out, out.contains("وَسَلِّمْ، وَعَلَى آلِهِ، وَأَصْحَابِهِ، وَأَزْوَاجِهِ، وَذُرِّيَّتِهِ وَأَهْلِ بَيْتِهِ"))
    }

    @Test
    fun `phrase pattern in mid-text protects its own connector`() {
        // Mid-text phrase (the real sholawat structure): the connector
        // " وَسَلَّمْ" gets no comma and neither does the connector right
        // after it (first list item); later items do get commas.
        val text = "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمْ وَعَلَى آلِهِ وَأَصْحَابِهِ وَأَزْوَاجِهِ وَذُرِّيَّتِهِ وَأَهْلِ بَيْتِهِ"
        val out = ArabicTextLogic.addArabicCommas(text)
        assertTrue(out, out.contains("وَسَلَّمْ وَعَلَى آلِهِ، وَأَصْحَابِهِ، وَأَزْوَاجِهِ، وَذُرِّيَّتِهِ وَأَهْلِ بَيْتِهِ"))
        assertFalse(out, out.contains("وَسَلَّمْ،"))
    }

    // ── colorizeWords ───────────────────────────────────────────────────────

    @Test
    fun `colors alternate across words`() {
        val spans = ArabicTextLogic.colorizeWords("اَلْحَمْدُ لِلَّهِ رَبِّ", intArrayOf(0))
        assertEquals(listOf(0, 1, 0), spans.map { it.colorIndex })
        assertEquals(listOf("اَلْحَمْدُ", "لِلَّهِ", "رَبِّ"), spans.map { it.word })
    }

    @Test
    fun `counter continues across calls so alternation is continuous`() {
        val counter = intArrayOf(0)
        val first = ArabicTextLogic.colorizeWords("أ ب", counter)
        val second = ArabicTextLogic.colorizeWords("ج د", counter)
        assertEquals(listOf(0, 1), first.map { it.colorIndex })
        assertEquals(listOf(0, 1), second.map { it.colorIndex })
        // 4 words total → indices 0,1,2,3 → mod 2 = 0,1,0,1 continuous.
        assertEquals(4, counter[0])
    }

    @Test
    fun `empty text yields no spans`() {
        assertTrue(ArabicTextLogic.colorizeWords("", intArrayOf(0)).isEmpty())
        assertTrue(ArabicTextLogic.colorizeWords("   ", intArrayOf(0)).isEmpty())
    }
}
