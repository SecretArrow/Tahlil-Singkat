package com.salikchannel.tahlilsingkat.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.salikchannel.tahlilsingkat.data.ContentBlock
import com.salikchannel.tahlilsingkat.data.DisplayToggles
import com.salikchannel.tahlilsingkat.data.Section
import com.salikchannel.tahlilsingkat.data.typeConfig
import com.salikchannel.tahlilsingkat.theme.LocalTahlilExtraColors

/** A section's content card — number badge, title + type badge, ornament, blocks. */
@Composable
fun SectionCard(
    section: Section,
    toggles: DisplayToggles,
    arabic: com.salikchannel.tahlilsingkat.data.ArabicStyleSettings,
    arabicCommaMode: Boolean = false,
    modifier: Modifier = Modifier,
) {
    val cfg = typeConfig[section.type]!!
    val isDark = MaterialTheme.colorScheme.background.luminance() < 0.5f
    val badgeText = Color(if (isDark) cfg.textDark else cfg.textLight)
    val badgeBg = Color(cfg.container)
    val extra = LocalTahlilExtraColors.current
    val allHidden = !toggles.arabic && !toggles.transliteration && !toggles.translation

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(MaterialTheme.colorScheme.surface)
            .border(1.dp, extra.border, RoundedCornerShape(24.dp)),
    ) {
        // Top gradient strip (emerald → teal → amber).
        Box(
            Modifier
                .fillMaxWidth()
                .height(6.dp)
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF10B981), Color(0xFF2DD4BF), Color(0xFFFBBF24))
                    )
                )
        )

        Column(Modifier.padding(20.dp)) {
            // Header: number badge + title/type badge + subtitle.
            Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                Box(
                    Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(MaterialTheme.colorScheme.primary, Color(0xFF0F766E))
                            )
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        "${section.number}",
                        color = MaterialTheme.colorScheme.onPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                    )
                }
                Column(Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            section.title,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface,
                        )
                        Box(
                            Modifier
                                .clip(RoundedCornerShape(50))
                                .background(badgeBg)
                                .border(1.dp, badgeText.copy(alpha = 0.3f), RoundedCornerShape(50))
                                .padding(horizontal = 10.dp, vertical = 2.dp),
                        ) {
                            Text(cfg.label, color = badgeText, fontSize = 11.sp, fontWeight = FontWeight.Medium)
                        }
                    }
                    section.subtitle?.let {
                        Spacer(Modifier.height(4.dp))
                        Text(it, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                    }
                }
            }

            Spacer(Modifier.height(16.dp))
            OrnamentDivider()
            Spacer(Modifier.height(20.dp))

            // Blocks.
            Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
                section.blocks.forEach { block ->
                    BlockView(block, toggles, arabic, arabicCommaMode, allHidden)
                }
            }
        }
    }
}

@Composable
private fun BlockView(
    block: ContentBlock,
    toggles: DisplayToggles,
    arabic: com.salikchannel.tahlilsingkat.data.ArabicStyleSettings,
    arabicCommaMode: Boolean,
    allHidden: Boolean,
) {
    val extra = LocalTahlilExtraColors.current
    // Use the comma variant when the user enabled it and the block provides one.
    val arabicText = if (arabicCommaMode && block.arabicComma != null) block.arabicComma else block.arabic
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        // Arabic (in a gradient box).
        if (toggles.arabic && arabicText != null) {
            Box(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(
                        Brush.linearGradient(listOf(extra.arabicBoxStart, extra.arabicBoxEnd))
                    )
                    .padding(20.dp),
                contentAlignment = Alignment.CenterEnd,
            ) {
                ArabicText(
                    text = arabicText,
                    settings = arabic,
                    repeat = block.repeat,
                )
            }
        }

        // Transliteration (italic, primary).
        if (toggles.transliteration) {
            Text(
                block.transliteration,
                color = MaterialTheme.colorScheme.primary,
                fontStyle = FontStyle.Italic,
                fontSize = 15.sp,
            )
        }

        // Translation.
        if (toggles.translation) {
            Text(
                block.translation,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.82f),
                fontSize = 15.sp,
            )
        }

        // All-hidden hint.
        if (allHidden) {
            Box(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .border(1.dp, extra.border, RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                    .padding(12.dp),
            ) {
                Text(
                    "Semua tampilan disembunyikan. Aktifkan minimal satu di tombol Tampilan.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 12.sp,
                )
            }
        }

        // Note (◆ + text).
        block.note?.let { note ->
            Row(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
                    .padding(horizontal = 10.dp, vertical = 8.dp),
                verticalAlignment = Alignment.Top,
            ) {
                Text("◆", color = MaterialTheme.colorScheme.primary, fontSize = 12.sp)
                Spacer(Modifier.width(8.dp))
                Text(note, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 12.sp)
            }
        }
    }
}

/** Decorative ornament divider (port of ArabicOrnament + ornament-divider). */
@Composable
fun OrnamentDivider(modifier: Modifier = Modifier) {
    val color = LocalTahlilExtraColors.current.ornament
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Box(
            Modifier
                .weight(1f)
                .height(1.dp)
                .background(Brush.horizontalGradient(listOf(Color.Transparent, color.copy(alpha = 0.6f))))
        )
        // Small arabesque dot.
        Box(
            Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(color)
        )
        Box(
            Modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(color.copy(alpha = 0.5f))
        )
        Box(
            Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(color)
        )
        Box(
            Modifier
                .weight(1f)
                .height(1.dp)
                .background(Brush.horizontalGradient(listOf(color.copy(alpha = 0.6f), Color.Transparent)))
        )
    }
}
