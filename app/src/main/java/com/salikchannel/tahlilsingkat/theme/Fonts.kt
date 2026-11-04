package com.salikchannel.tahlilsingkat.theme

import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import com.salikchannel.tahlilsingkat.R

/**
 * Arabic font families bundled in res/font — faithful port of the web app's
 * Amiri / Amiri Quran / Scheherazade New stack.
 *
 *  standard → Amiri (regular + bold)
 *  quran    → Amiri Quran (regular) — Utsmani mushaf style
 *  naskhi   → Scheherazade New (regular + bold) — thick, horizontal, beginner-friendly
 */
val AmiriFamily = FontFamily(
    Font(R.font.amiri_regular, FontWeight.Normal),
    Font(R.font.amiri_bold, FontWeight.Bold),
)

val AmiriQuranFamily = FontFamily(Font(R.font.amiri_quran_regular, FontWeight.Normal))

val ScheherazadeFamily = FontFamily(
    Font(R.font.scheherazade_new_regular, FontWeight.Normal),
    Font(R.font.scheherazade_new_bold, FontWeight.Bold),
)

/** Map each Arabic mode to its font family. */
fun familyForMode(mode: com.salikchannel.tahlilsingkat.data.ArabicStyleMode): FontFamily =
    when (mode) {
        com.salikchannel.tahlilsingkat.data.ArabicStyleMode.STANDARD -> AmiriFamily
        com.salikchannel.tahlilsingkat.data.ArabicStyleMode.QURAN -> AmiriQuranFamily
        com.salikchannel.tahlilsingkat.data.ArabicStyleMode.NASKHI -> ScheherazadeFamily
    }
