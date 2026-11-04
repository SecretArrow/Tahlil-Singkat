@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package com.salikchannel.tahlilsingkat.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoMode
import androidx.compose.material.icons.filled.AutoStories
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.TextFields
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.salikchannel.tahlilsingkat.prefs.ThemeMode

/** Top app bar: gradient logo, title, and action buttons (display / arabic style /
 *  theme cycle / nav drawer). */
@Composable
fun TahlilTopBar(
    themeMode: ThemeMode,
    onOpenDisplay: () -> Unit,
    onOpenArabic: () -> Unit,
    onCycleTheme: () -> Unit,
    onOpenNav: () -> Unit,
) {
    TopAppBar(
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(
                    Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(MaterialTheme.colorScheme.primary, Color(0xFF0F766E))
                            )
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        Icons.Filled.AutoStories,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.size(20.dp),
                    )
                }
                Spacer(Modifier.width(2.dp))
                Column {
                    Text(
                        "Tahlil Singkat",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        "MAJELIS DOA",
                        fontSize = 9.sp,
                        letterSpacing = 1.5.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        },
        actions = {
            IconButton(onClick = onOpenDisplay) {
                Icon(Icons.Filled.Visibility, contentDescription = "Pengaturan tampilan")
            }
            IconButton(onClick = onOpenArabic) {
                Icon(Icons.Filled.TextFields, contentDescription = "Pengaturan teks Arab")
            }
            IconButton(onClick = onCycleTheme) {
                val icon = when (themeMode) {
                    ThemeMode.SYSTEM -> Icons.Filled.AutoMode
                    ThemeMode.LIGHT -> Icons.Filled.LightMode
                    ThemeMode.DARK -> Icons.Filled.DarkMode
                }
                Icon(icon, contentDescription = "Ganti tema")
            }
            IconButton(onClick = onOpenNav) {
                Icon(Icons.Filled.Menu, contentDescription = "Daftar isi")
            }
        },
        colors = androidx.compose.material3.TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background.copy(alpha = 0.96f),
        ),
    )
}
