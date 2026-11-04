package com.salikchannel.tahlilsingkat.ui.components

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.salikchannel.tahlilsingkat.data.ArabicStyleSettings
import com.salikchannel.tahlilsingkat.data.naskhiSuggested
import com.salikchannel.tahlilsingkat.theme.familyForMode

/**
 * ArabicText — faithful port of components/arabic-text.tsx.
 *
 * Renders an Arabic string with the user's chosen typography (font family per
 * mode, font size, line-height, letter-spacing, alignment) and enforces RTL.
 * The text content is never modified — only presentation.
 *
 * Ayah marks (۝ + Arabic-Indic digits) end each verse; each verse is broken
 * onto its own line. Long dua text without ayah marks is split by Arabic comma
 * (،) and Latin period (.) so each clause gets its own line.
 */
private val AYAH_MARK = Regex("۝[\u0660-\u0669]+")

/** Split a no-ayah string by ، / . keeping the delimiter at the end of each line. */
private fun splitSentences(text: String): String {
    val trimmed = text.trim()
    if (trimmed.isEmpty()) return ""
    return trimmed.split(Regex("(?<=[،.])"))
        .map { it.trim() }
        .filter { it.isNotEmpty() }
        .joinToString("\n")
}

/** Format an Arabic string into newline-separated verses/clauses. */
fun formatArabic(text: String): String {
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
        val trailing = splitSentences(text.substring(cursor))
        if (trailing.isNotEmpty()) lines.add(trailing)
    }
    return lines.filter { it.isNotEmpty() }.joinToString("\n")
}

@Composable
fun ArabicText(
    text: String,
    settings: ArabicStyleSettings,
    repeat: Int? = null,
    modifier: Modifier = Modifier,
) {
    // Naskhi mode always uses its suggested spacing for clarity (matches the
    // web app's naskhi suggested defaults, applied on selection).
    val s = if (settings.mode == com.salikchannel.tahlilsingkat.data.ArabicStyleMode.NASKHI)
        naskhiSuggested.copy(
            fontSize = settings.fontSize.coerceIn(1.2f, 3.2f),
            align = settings.align,
        ) else settings

    val baseSp = s.fontSize * 16f           // rem → sp (1rem = 16sp base)
    val lineSp = baseSp * s.lineHeight
    val lsSp = baseSp * s.letterSpacing

    val annotated = buildAnnotatedString {
        append(formatArabic(text))
        if (repeat != null && repeat > 1) {
            append("  ")
            withStyle(
                SpanStyle(
                    fontSize = (baseSp * 0.62f).sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                )
            ) { append("×$repeat") }
        }
    }

    Text(
        text = annotated,
        modifier = modifier.padding(vertical = 2.dp),
        style = MaterialTheme.typography.bodyLarge.copy(
            fontFamily = familyForMode(s.mode),
            fontSize = baseSp.sp,
            lineHeight = lineSp.sp,
            letterSpacing = lsSp.sp,
            textAlign = if (s.align == com.salikchannel.tahlilsingkat.data.ArabicAlign.RIGHT)
                TextAlign.Right else TextAlign.Justify,
            textDirection = TextDirection.Rtl,
        ),
    )
}
