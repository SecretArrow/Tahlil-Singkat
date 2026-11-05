package com.salikchannel.tahlilsingkat.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Content invariants locked down from the CHANGELOG.md audit:
 *  - 11 sections / 38 blocks, Section 3 has 7 blocks, Section 9 has 5 blocks
 *  - harakat fixes: +10 sukun on wa+al+syamsiyyah (وَالْ…), +6 shadda on
 *    li-llah (لِلَّهِ), zero bare لِلهِ left
 *  - "Allah" variants keep the idgham convention (no sukun on lam1)
 *  - no NU / Nahdlatul Ulama mentions anywhere
 *  - every arabicComma variant differs from its base and contains ،
 */
class TahlilContentTest {

    private val allArabic get() = tahlilSections.flatMap { s -> s.blocks }
        .mapNotNull { it.arabic }

    @Test
    fun `eleven sections with expected block counts`() {
        assertEquals(11, tahlilSections.size)
        assertEquals(listOf(1, 2, 7, 7, 1, 4, 3, 3, 5, 4, 1),
            tahlilSections.map { it.blocks.size })
        assertEquals(38, tahlilSections.sumOf { it.blocks.size })
    }

    @Test
    fun `section numbering is 1 to 11 in order`() {
        assertEquals((1..11).toList(), tahlilSections.map { it.number })
    }

    @Test
    fun `every block has transliteration and translation`() {
        tahlilSections.flatMap { it.blocks }.forEach { b ->
            assertTrue(b.transliteration.isNotBlank())
            assertTrue(b.translation.isNotBlank())
        }
    }

    @Test
    fun `harakat audit - sukun on wa al syamsiyyah articles`() {
        // 22 intrinsically-correct + 10 fixed = 32 total (see content_report).
        assertEquals(32, allArabic.joinToString("").count { it == 'ل' }.let { _ ->
            allArabic.joinToString("").windowCount("وَالْ")
        })
    }

    @Test
    fun `harakat audit - li-llah always carries shadda`() {
        val joined = allArabic.joinToString("")
        assertEquals(14, joined.windowCount("لِلَّهِ"))
        assertEquals(0, joined.windowCount("لِلهِ"))
    }

    @Test
    fun `harakat audit - Allah idgham has no sukun on lam1`() {
        assertEquals(0, allArabic.joinToString("").windowCount("لْلَّه"))
    }

    @Test
    fun `no NU or Nahdlatul Ulama mentions`() {
        tahlilSections.forEach { s ->
            s.blocks.forEach { b ->
                val text = (b.arabic ?: "") + b.transliteration + b.translation + (b.note ?: "")
                assertTrue("NU mention in ${s.id}", !text.contains("Nahdlatul"))
                assertTrue("NU mention in ${s.id}", !text.contains("nahdhatil"))
                assertTrue("NU mention in ${s.id}", !text.contains("نهد"))
            }
        }
    }

    @Test
    fun `comma variants differ from base and contain arabic comma`() {
        var variantCount = 0
        tahlilSections.flatMap { it.blocks }.forEach { b ->
            if (b.arabicComma != null) {
                variantCount++
                assertTrue(b.arabicComma != b.arabic)
                assertTrue(b.arabicComma!!.contains("،"))
            }
        }
        assertEquals(19, variantCount)
    }

    @Test
    fun `quran verse blocks never get a comma variant`() {
        tahlilSections.flatMap { it.blocks }.forEach { b ->
            val ar = b.arabic ?: return@forEach
            if (ar.contains("۝") || ar.contains("۩")) {
                assertTrue("verse block ${b.note} must not have comma variant",
                    b.arabicComma == null || b.arabicComma == ar)
            }
        }
    }

    @Test
    fun `sheikh abdul qadir al-jilani block exists in section 3`() {
        val s3 = tahlilSections.first { it.id == "tahlil-ahli-kubur" }
        assertTrue(s3.blocks.any { it.arabic?.contains("الْجِيْلَانِي") == true })
    }

    private fun String.windowCount(needle: String): Int {
        var count = 0
        var idx = indexOf(needle)
        while (idx != -1) {
            count++
            idx = indexOf(needle, idx + 1)
        }
        return count
    }
}
