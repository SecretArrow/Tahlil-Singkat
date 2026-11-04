package com.salikchannel.tahlilsingkat.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/** Extra colour roles not in Material3's ColorScheme (ornament, arabic box gradient). */
data class TahlilExtraColors(
    val ornament: Color,
    val arabicBoxStart: Color,
    val arabicBoxEnd: Color,
    val border: Color,
)

val LocalTahlilExtraColors = staticCompositionLocalOf {
    TahlilExtraColors(
        ornament = TahlilColors.Ornament,
        arabicBoxStart = TahlilColors.ArabicBoxStartLight,
        arabicBoxEnd = TahlilColors.ArabicBoxEndLight,
        border = TahlilColors.Border,
    )
}

private val LightScheme = lightColorScheme(
    primary = TahlilColors.Primary,
    onPrimary = TahlilColors.PrimaryForeground,
    primaryContainer = TahlilColors.Secondary,
    onPrimaryContainer = TahlilColors.SecondaryForeground,
    secondary = TahlilColors.Secondary,
    onSecondary = TahlilColors.SecondaryForeground,
    tertiary = TahlilColors.Accent,
    onTertiary = TahlilColors.AccentForeground,
    background = TahlilColors.Background,
    onBackground = TahlilColors.Foreground,
    surface = TahlilColors.Card,
    onSurface = TahlilColors.Foreground,
    surfaceVariant = TahlilColors.Muted,
    onSurfaceVariant = TahlilColors.MutedForeground,
    outline = TahlilColors.Border,
    outlineVariant = TahlilColors.Border,
    error = TahlilColors.Destructive,
    scrim = Color.Black,
)

private val DarkScheme = darkColorScheme(
    primary = TahlilColors.PrimaryDark,
    onPrimary = TahlilColors.PrimaryForegroundDark,
    primaryContainer = TahlilColors.SecondaryDark,
    onPrimaryContainer = TahlilColors.SecondaryForegroundDark,
    secondary = TahlilColors.SecondaryDark,
    onSecondary = TahlilColors.SecondaryForegroundDark,
    tertiary = TahlilColors.AccentDark,
    onTertiary = TahlilColors.AccentForegroundDark,
    background = TahlilColors.BackgroundDark,
    onBackground = TahlilColors.ForegroundDark,
    surface = TahlilColors.CardDark,
    onSurface = TahlilColors.ForegroundDark,
    surfaceVariant = TahlilColors.MutedDark,
    onSurfaceVariant = TahlilColors.MutedForegroundDark,
    outline = TahlilColors.BorderDark,
    outlineVariant = TahlilColors.BorderDark,
    error = TahlilColors.DestructiveDark,
    scrim = Color.Black,
)

@Composable
fun TahlilTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val scheme = if (darkTheme) DarkScheme else LightScheme
    val extra = if (darkTheme) {
        TahlilExtraColors(
            ornament = TahlilColors.OrnamentDark,
            arabicBoxStart = TahlilColors.ArabicBoxStartDark,
            arabicBoxEnd = TahlilColors.ArabicBoxEndDark,
            border = TahlilColors.BorderDark,
        )
    } else {
        TahlilExtraColors(
            ornament = TahlilColors.Ornament,
            arabicBoxStart = TahlilColors.ArabicBoxStartLight,
            arabicBoxEnd = TahlilColors.ArabicBoxEndLight,
            border = TahlilColors.Border,
        )
    }
    CompositionLocalProvider(LocalTahlilExtraColors provides extra) {
        MaterialTheme(
            colorScheme = scheme,
            typography = MaterialTheme.typography,
            content = content,
        )
    }
}
