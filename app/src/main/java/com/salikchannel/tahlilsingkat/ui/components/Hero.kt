package com.salikchannel.tahlilsingkat.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.salikchannel.tahlilsingkat.data.heroInfo
import com.salikchannel.tahlilsingkat.data.tahlilSections
import com.salikchannel.tahlilsingkat.theme.AmiriQuranFamily
import com.salikchannel.tahlilsingkat.ui.clickableNoRipple

/** CTA → section list index (0-based). */
private data class Cta(val label: String, val sectionIndex: Int, val primary: Boolean)

private val ctas = listOf(
    Cta("Mulai", 0, true),
    Cta("Tahlil", 2, false),
    Cta("Dzikir", 6, false),
    Cta("Doa", 7, false),
)

@Composable
fun Hero(onNavigate: (sectionIndex: Int) -> Unit, modifier: Modifier = Modifier) {
    Box(modifier.fillMaxWidth()) {
        // Decorative background orbs.
        Box(
            Modifier
                .matchParentSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            MaterialTheme.colorScheme.primary.copy(alpha = 0.16f),
                            Color.Transparent,
                        ),
                        radius = 600f,
                    )
                )
        )
        Column(
            Modifier
                .fillMaxWidth()
                .padding(top = 16.dp, bottom = 28.dp)
                .padding(horizontal = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            // Bismillah (Amiri Quran, centred, RTL).
            Text(
                heroInfo.arabicBismillah,
                fontFamily = AmiriQuranFamily,
                fontSize = 28.sp,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
                style = MaterialTheme.typography.bodyLarge.copy(textDirection = TextDirection.Rtl),
            )
            Spacer(Modifier.height(6.dp))
            Text(
                heroInfo.title,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground,
                textAlign = TextAlign.Center,
            )
            Text(
                heroInfo.subtitle,
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center,
            )
            Text(
                heroInfo.description,
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 4.dp),
            )

            Spacer(Modifier.height(18.dp))
            // CTA chips.
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                ctas.forEach { cta ->
                    val idx = cta.sectionIndex
                    Box(
                        Modifier
                            .clip(RoundedCornerShape(50))
                            .background(
                                if (cta.primary) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
                            )
                            .padding(horizontal = 18.dp, vertical = 10.dp)
                            .clickableNoRipple { onNavigate(idx) },
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            cta.label,
                            color = if (cta.primary) MaterialTheme.colorScheme.onPrimary
                            else MaterialTheme.colorScheme.onSurface,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                        )
                    }
                }
            }
        }
    }
}
