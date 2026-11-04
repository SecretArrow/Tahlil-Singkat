package com.salikchannel.tahlilsingkat.theme

import androidx.compose.ui.graphics.Color

/**
 * Exact port of the OKLCH tokens in src/app/globals.css (converted to sRGB).
 * Light = warm cream background, deep emerald primary, gold accent.
 * Dark  = deep forest background, cream text, lighter emerald primary.
 */
object TahlilColors {
    // ── Light ──
    val Background = Color(0xFFFDFAF2)
    val Foreground = Color(0xFF012014)
    val Card = Color(0xFFFFFB)
    val Primary = Color(0xFF005C41)
    val PrimaryForeground = Color(0xFFFDFAF2)
    val Secondary = Color(0xFFF0EBDD)
    val SecondaryForeground = Color(0xFF113528)
    val Muted = Color(0xFFF2EEE4)
    val MutedForeground = Color(0xFF506358)
    val Accent = Color(0xFFE0AD51)
    val AccentForeground = Color(0xFF331B00)
    val Destructive = Color(0xFFE80019)
    val Border = Color(0xFFE2DED0)
    val Ring = Color(0xFF2A8364)
    val Ornament = Color(0xFFC69435)

    // ── Dark ──
    val BackgroundDark = Color(0xFF00100B)
    val ForegroundDark = Color(0xFFF2EEE4)
    val CardDark = Color(0xFF0B1A13)
    val PrimaryDark = Color(0xFF35A57E)
    val PrimaryForegroundDark = Color(0xFF00100B)
    val SecondaryDark = Color(0xFF16251F)
    val SecondaryForegroundDark = Color(0xFFF2EEE4)
    val MutedDark = Color(0xFF19251F)
    val MutedForegroundDark = Color(0xFFA39E91)
    val AccentDark = Color(0xFFCC9A3C)
    val AccentForegroundDark = Color(0xFF1E1301)
    val DestructiveDark = Color(0xFFFF616A)
    val BorderDark = Color(0x1AFFFFFF)   // white @ 10%
    val RingDark = Color(0xFF3C9272)
    val OrnamentDark = Color(0xFFE0AD51)

    // ── Arabic text box gradient stops (from-emerald-50/80 → to-amber-50/60) ──
    val ArabicBoxStartLight = Color(0xCCECFDF5) // emerald-50 @ 80%
    val ArabicBoxEndLight = Color(0x99FFFBEB)   // amber-50  @ 60%
    val ArabicBoxStartDark = Color(0x66052E2B)  // emerald-950 @ 40%
    val ArabicBoxEndDark = Color(0x33452C0A)    // amber-950  @ 20%
}
