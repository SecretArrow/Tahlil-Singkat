package com.salikchannel.tahlilsingkat.ui.components

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.salikchannel.tahlilsingkat.data.ArabicAlign
import com.salikchannel.tahlilsingkat.data.ArabicStyleMode
import com.salikchannel.tahlilsingkat.data.ArabicStyleSettings
import com.salikchannel.tahlilsingkat.data.naskhiSuggested
import com.salikchannel.tahlilsingkat.theme.familyForMode
import com.salikchannel.tahlilsingkat.ui.ArabicTextLogic

/**
 * ArabicText — faithful port of components/arabic-text.tsx.
 *
 * Renders an Arabic string with the user's chosen typography (font family per
 * mode, font size, line-height, letter-spacing, alignment) and enforces RTL.
 * The text content itself is only modified when [colorize] is on (colour) or
 * the comma variant is chosen by the caller — presentation otherwise.
 *
 * Ayah marks (۝ + Arabic-Indic digits) end each verse; each verse is broken
 * onto its own line. Long dua text without ayah marks is split by Arabic comma
 * (،) and Latin period (.) so each clause gets its own line.
 *
 * colorize: each word gets one of two alternating shades picked by theme —
 * light theme → #000000 / #011b45, dark theme → #ffffff / #d9dadb (same
 * pairs as the web app). The alternation counter is shared across all lines
 * of one render so the pattern is continuous.
 */
private val COLORIZE_LIGHT = listOf(Color(0xFF000000), Color(0xFF011B45))
private val COLORIZE_DARK = listOf(Color(0xFFFFFFFF), Color(0xFFD9DADB))

@Composable
fun ArabicText(
    text: String,
    settings: ArabicStyleSettings,
    repeat: Int? = null,
    colorize: Boolean = false,
    darkTheme: Boolean = MaterialTheme.colorScheme.background.luminance() < 0.5f,
    modifier: Modifier = Modifier,
) {
    // Naskhi mode always uses its suggested spacing for clarity (matches the
    // web app's naskhi suggested defaults, applied on selection).
    val s = if (settings.mode == ArabicStyleMode.NASKHI)
        naskhiSuggested.copy(
            fontSize = settings.fontSize.coerceIn(1.2f, 3.2f),
            align = settings.align,
        ) else settings

    val baseSp = s.fontSize * 16f           // rem → sp (1rem = 16sp base)
    val lineSp = baseSp * s.lineHeight
    val lsSp = baseSp * s.letterSpacing

    val colors = if (colorize) {
        if (darkTheme) COLORIZE_DARK else COLORIZE_LIGHT
    } else null

    val annotated = buildAnnotatedString {
        // Shared running counter across all lines of this render.
        val counter = intArrayOf(0)
        val sb = StringBuilder()
        ArabicTextLogic.formatArabic(text).forEach { line ->
            if (colors != null) {
                var first = true
                for (span in ArabicTextLogic.colorizeWords(line, counter)) {
                    if (!first) sb.append(' ')
                    sb.append(span.word)
                    first = false
                }
            } else {
                sb.append(line)
            }
            sb.append('\n')
        }
        // Drop the trailing newline introduced by the last line.
        if (sb.isNotEmpty() && sb.last() == '\n') sb.setLength(sb.length - 1)
        append(sb.toString())
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
            textAlign = if (s.align == ArabicAlign.RIGHT)
                TextAlign.Right else TextAlign.Justify,
            textDirection = TextDirection.Rtl,
        ),
    )
}
