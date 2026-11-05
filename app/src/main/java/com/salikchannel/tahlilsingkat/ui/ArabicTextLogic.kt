package com.salikchannel.tahlilsingkat.ui

/**
 * Pure text-processing logic ported from the web app's arabic-text.tsx.
 * Lives outside Compose so it can be unit-tested on the JVM.
 *
 * formatArabic:      verse/clause line-splitting (ayah marks ۝X, then ،/.)
 * addArabicCommas:   comma insertion mirroring translation punctuation
 * colorizedSpans:    alternating two-colour word spans for the colorize toggle
 */
object ArabicTextLogic {

    /** Matches ۝ (U+06DD ARABIC END OF AYAH) + one or more Arabic-Indic digits. */
    private val AYAH_MARK = Regex("۝[\u0660-\u0669]+")

    /** Fixed phrases whose " وَ" connector must never receive a comma. */
    private val PHRASE_PATTERNS = listOf(" وَسَلَّمْ", " وَسَلِّمْ")

    /** Split a no-ayah string by ، / . keeping the delimiter at the end of each line. */
    fun splitSentences(text: String): List<String> {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return emptyList()
        return trimmed.split(Regex("(?<=[،.])"))
            .map { it.trim() }
            .filter { it.isNotEmpty() }
    }

    /** Format an Arabic string into verse/clause lines (one per line). */
    fun formatArabic(text: String): List<String> {
        val matches = AYAH_MARK.findAll(text).toList()
        if (matches.isEmpty()) return splitSentences(text)
        val lines = mutableListOf<String>()
        var cursor = 0
        for (m in matches) {
            val before = text.substring(cursor, m.range.first)
            lines.add((before + m.value).trim())
            cursor = m.range.last + 1
        }
        if (cursor < text.length) {
            lines.addAll(splitSentences(text.substring(cursor)))
        }
        return lines.filter { it.isNotEmpty() }
    }

    /**
     * Insert Arabic commas (،) before " وَ" connectors so the Arabic text
     * mirrors the comma punctuation of the Indonesian translation.
     *
     * Rules (faithful port of arabic-text.tsx):
     *  - Quran verses (text containing ۝ or ۩) are returned unchanged.
     *  - Connectors inside fixed phrases (e.g. " وَسَلَّمْ") are skipped, and so
     *    is the connector right after such a phrase (it introduces the first
     *    list item).
     *  - The LAST connector of each segment is skipped ("X، Y، Z dan W").
     *  - Segments with fewer than 2 connectors are left unchanged.
     */
    fun addArabicCommas(text: String): String {
        if (text.contains("۝") || text.contains("۩")) return text

        val positions = mutableListOf<Int>()
        var search = 0
        while (true) {
            val idx = text.indexOf(" وَ", search)
            if (idx == -1) break
            positions.add(idx)
            search = idx + 3
        }
        if (positions.size < 2) return text

        val segBoundaries = mutableListOf<Int>()
        text.forEachIndexed { i, c -> if (c == '،' || c == '.') segBoundaries.add(i) }
        fun segIdx(pos: Int): Int {
            var i = 0
            while (i < segBoundaries.size && segBoundaries[i] < pos) i++
            return i
        }

        val segPositions = mutableMapOf<Int, MutableList<Int>>()
        positions.forEachIndexed { i, pos ->
            segPositions.getOrPut(segIdx(pos)) { mutableListOf() }.add(i)
        }

        val skip = mutableSetOf<Int>()
        for (posIndices in segPositions.values) {
            if (posIndices.size < 2) {
                skip.addAll(posIndices)
                continue
            }
            val phraseIndices = posIndices.filter { i ->
                PHRASE_PATTERNS.any { text.startsWith(it, positions[i]) }
            }
            for (i in phraseIndices) {
                skip.add(i)
                val j = posIndices.indexOf(i)
                if (j + 1 < posIndices.size) skip.add(posIndices[j + 1])
            }
            skip.add(posIndices.last())
        }

        val out = StringBuilder()
        var lastEnd = 0
        positions.forEachIndexed { i, pos ->
            out.append(text, lastEnd, pos)
            out.append(if (i in skip) " وَ" else "، وَ")
            lastEnd = pos + 3
        }
        out.append(text, lastEnd, text.length)
        return out.toString()
    }

    /** One word + its colour index (0/1 alternation across the WHOLE render). */
    data class WordSpan(val word: String, val colorIndex: Int)

    /**
     * Split [text] into word tokens with a running [counter] so consecutive
     * words alternate colours CONTINUOUSLY across lines (matching the web
     * app's shared counterRef). Whitespace is implicit between spans.
     */
    fun colorizeWords(text: String, counter: IntArray): List<WordSpan> {
        if (text.isEmpty()) return emptyList()
        return text.split(Regex("\\s+"))
            .filter { it.isNotEmpty() }
            .map { WordSpan(it, counter[0]++ % 2) }
    }
}
