@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package com.salikchannel.tahlilsingkat.ui.screens

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.TextFields
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.salikchannel.tahlilsingkat.data.ArabicAlign
import com.salikchannel.tahlilsingkat.data.ArabicStyleMode
import com.salikchannel.tahlilsingkat.data.arabicModeConfigs
import com.salikchannel.tahlilsingkat.prefs.SettingsState
import com.salikchannel.tahlilsingkat.ui.components.ArabicText
import com.salikchannel.tahlilsingkat.ui.clickableNoRipple

private val SAMPLE = "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ. الْحَمْدُ لِلهِ رَبِّ الْعٰلَمِيْنَ"

@Composable
private fun SheetHeader(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, subtitle: String) {
    Row(Modifier.padding(bottom = 16.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(MaterialTheme.colorScheme.primary),
            contentAlignment = Alignment.Center,
        ) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(20.dp))
        }
        Spacer(Modifier.size(12.dp))
        Column {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.onSurface)
            Text(subtitle, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun SwitchRow(
    title: String,
    subtitle: String,
    checked: Boolean,
    enabled: Boolean = true,
    onChange: (Boolean) -> Unit,
) {
    Row(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(16.dp))
            .background(MaterialTheme.colorScheme.surface)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)
            Text(subtitle, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(checked = checked, enabled = enabled, onCheckedChange = onChange)
    }
}

/** Display settings: text-layer toggles + keep-screen-on + reset. */
@Composable
fun DisplaySettingsSheet(settings: SettingsState, show: Boolean, onDismiss: () -> Unit) {
    if (!show) return
    val sheet = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    ModalBottomSheet(onDismissRequest = onDismiss, sheetState = sheet) {
        Column(Modifier.padding(horizontal = 20.dp).padding(bottom = 32.dp)) {
            SheetHeader(
                Icons.Filled.Visibility,
                "Pengaturan Tampilan",
                "Lapisan teks & perilaku layar.",
            )
            val t = settings.displayToggles
            SwitchRow("Arab", if (t.arabic) "Tampil" else "Disembunyikan", t.arabic) { settings.setToggle(arabic = it) }
            Spacer(Modifier.height(8.dp))
            SwitchRow("Transliterasi", if (t.transliteration) "Tampil" else "Disembunyikan", t.transliteration) { settings.setToggle(transliteration = it) }
            Spacer(Modifier.height(8.dp))
            SwitchRow("Terjemahan", if (t.translation) "Tampil" else "Disembunyikan", t.translation) { settings.setToggle(translation = it) }

            Spacer(Modifier.height(16.dp))
            // Section header "Layar".
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Filled.Lightbulb, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.size(6.dp))
                Text("LAYAR", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Spacer(Modifier.height(8.dp))
            SwitchRow(
                "Layar Tetap Hidup",
                if (settings.keepScreenOn) "Layar tidak akan terkunci saat membaca"
                else "Layar boleh terkunci seperti biasa",
                settings.keepScreenOn,
            ) { settings.setKeepScreen(it) }

            Spacer(Modifier.height(16.dp))
            // Section header "Teks Arab".
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Filled.TextFields, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.size(6.dp))
                Text("TEKS ARAB", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Spacer(Modifier.height(8.dp))
            SwitchRow(
                "Koma Mengikuti Terjemahan",
                if (settings.arabicCommaMode) "Teks Arab memakai koma (،) mengikuti koma terjemahan"
                else "Teks Arab tanpa koma tambahan (default)",
                settings.arabicCommaMode,
            ) { settings.setArabicComma(it) }

            Spacer(Modifier.height(16.dp))
            ResetRow(onReset = { settings.resetToggles() })
        }
    }
}

@Composable
private fun ResetRow(onReset: () -> Unit) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
        Text("Pengaturan tersimpan otomatis di perangkat ini.", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Row(
            Modifier
                .clip(RoundedCornerShape(50))
                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(50))
                .clickableNoRipple { onReset() }
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(Icons.Filled.Refresh, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.size(6.dp))
            Text("Reset", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun SliderRow(label: String, value: Float, range: ClosedFloatingPointRange<Float>, steps: Int, format: (Float) -> String, onChange: (Float) -> Unit) {
    Column(Modifier.padding(vertical = 4.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, fontWeight = FontWeight.Medium, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)
            Text(format(value), fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Slider(value = value, valueRange = range, steps = steps, onValueChange = onChange)
    }
}

/** Arabic typography sheet: 3 mode cards + 4 sliders + alignment + live preview. */
@Composable
fun ArabicStyleSheet(settings: SettingsState, show: Boolean, onDismiss: () -> Unit) {
    if (!show) return
    val sheet = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    ModalBottomSheet(onDismissRequest = onDismiss, sheetState = sheet) {
        Column(
            Modifier
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp)
        ) {
            SheetHeader(
                Icons.Filled.TextFields,
                "Pengaturan Teks Arab",
                "Pilih gaya, ukuran, dan tata letak.",
            )

            Text("MODE PENULISAN", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(10.dp))
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                listOf(ArabicStyleMode.QURAN, ArabicStyleMode.STANDARD, ArabicStyleMode.NASKHI).forEach { mode ->
                    ModeCardRow(mode, active = settings.arabicStyle.mode == mode) { settings.setArabicMode(mode) }
                }
            }

            Spacer(Modifier.height(20.dp))
            Text("TIPOGRAFI", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(8.dp))
            SliderRow("Ukuran Huruf", settings.arabicStyle.fontSize, SettingsState.MIN_SIZE..SettingsState.MAX_SIZE, 39, format = { "%.2f rem".format(it) }) { settings.setArabic(fontSize = it) }
            SliderRow("Jarak Antarbaris", settings.arabicStyle.lineHeight, SettingsState.MIN_LH..SettingsState.MAX_LH, 35, format = { "%.2f".format(it) }) { settings.setArabic(lineHeight = it) }
            SliderRow("Jarak Antarkata", settings.arabicStyle.wordSpacing, 0f..0.6f, 59, format = { "%.2f em".format(it) }) { settings.setArabic(wordSpacing = it) }
            SliderRow("Jarak Antar Huruf", settings.arabicStyle.letterSpacing, 0f..0.15f, 29, format = { "%.3f em".format(it) }) { settings.setArabic(letterSpacing = it) }

            Spacer(Modifier.height(8.dp))
            Text("Perataan", fontWeight = FontWeight.Medium, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)
            Spacer(Modifier.height(6.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(ArabicAlign.RIGHT to "Kanan", ArabicAlign.JUSTIFY to "Rata Kanan-Kiri").forEach { (align, label) ->
                    val active = settings.arabicStyle.align == align
                    Row(
                        Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .border(1.dp, if (active) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp))
                            .background(if (active) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f) else MaterialTheme.colorScheme.surface)
                            .clickableNoRipple { settings.setArabic(align = align) }
                            .padding(vertical = 10.dp),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(label, fontSize = 13.sp, color = if (active) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }

            Spacer(Modifier.height(20.dp))
            Text("PRATINJAU LANGSUNG", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(8.dp))
            Box(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(16.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                    .padding(16.dp),
            ) {
                ArabicText(text = SAMPLE, settings = settings.arabicStyle)
            }

            Spacer(Modifier.height(16.dp))
            ResetRow(onReset = { settings.resetArabic() })
        }
    }
}

@Composable
private fun ModeCardRow(mode: ArabicStyleMode, active: Boolean, onSelect: () -> Unit) {
    val cfg = arabicModeConfigs[mode]!!
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .border(
                width = if (active) 2.dp else 1.dp,
                color = if (active) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline,
                shape = RoundedCornerShape(16.dp),
            )
            .background(if (active) MaterialTheme.colorScheme.primary.copy(alpha = 0.05f) else MaterialTheme.colorScheme.surface)
            .clickableNoRipple { onSelect() }
            .padding(16.dp),
    ) {
        ArabicText(
            text = SAMPLE,
            settings = com.salikchannel.tahlilsingkat.data.ArabicStyleSettings(mode = mode),
        )
        Spacer(Modifier.height(8.dp))
        Text(cfg.label, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)
        Text(cfg.description, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
