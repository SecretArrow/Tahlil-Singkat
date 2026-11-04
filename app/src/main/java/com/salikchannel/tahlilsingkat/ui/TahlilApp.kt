@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package com.salikchannel.tahlilsingkat.ui

import android.app.Activity
import android.view.WindowManager
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.isSystemInDarkTheme
import com.salikchannel.tahlilsingkat.data.tahlilSections
import com.salikchannel.tahlilsingkat.prefs.LocalSettings
import com.salikchannel.tahlilsingkat.prefs.SettingsState
import com.salikchannel.tahlilsingkat.prefs.ThemeMode
import com.salikchannel.tahlilsingkat.prefs.rememberSettingsState
import com.salikchannel.tahlilsingkat.ui.components.BackToTopButton
import com.salikchannel.tahlilsingkat.ui.components.Hero
import com.salikchannel.tahlilsingkat.ui.components.OrnamentDivider
import com.salikchannel.tahlilsingkat.ui.components.ScrollProgress
import com.salikchannel.tahlilsingkat.ui.components.SectionCard
import com.salikchannel.tahlilsingkat.ui.components.TahlilTopBar
import com.salikchannel.tahlilsingkat.ui.clickableNoRipple
import com.salikchannel.tahlilsingkat.ui.screens.ArabicStyleSheet
import com.salikchannel.tahlilsingkat.ui.screens.DisplaySettingsSheet
import kotlinx.coroutines.launch

/** Native keep-screen-on: sets FLAG_KEEP_SCREEN_ON on the window while enabled.
 *  This is the Android-recommended approach (the wakelock pattern from
 *  android/skills) — far simpler than the web Screen Wake Lock API and survives
 *  any visibility changes since it is a window flag, not a JS lock. */
@Composable
fun KeepScreenOnEffect(enabled: Boolean) {
    val view = LocalView.current
    DisposableEffect(enabled) {
        val window = (view.context as? Activity)?.window
        if (enabled) window?.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        else window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        onDispose { window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) }
    }
}

@Composable
fun TahlilApp() {
    val settings = rememberSettingsState()
    val darkTheme = when (settings.themeMode) {
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
    }

    com.salikchannel.tahlilsingkat.theme.TahlilTheme(darkTheme = darkTheme) {
        KeepScreenOnEffect(settings.keepScreenOn)
        CompositionLocalProvider(LocalSettings provides settings) {
            Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                AppContent(settings)
            }
        }
    }
}

@Composable
private fun AppContent(settings: SettingsState) {
    val drawer = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()
    var showDisplay by remember { mutableStateOf(false) }
    var showArabic by remember { mutableStateOf(false) }

    val cycleTheme: () -> Unit = {
        val next = when (settings.themeMode) {
            ThemeMode.SYSTEM -> ThemeMode.LIGHT
            ThemeMode.LIGHT -> ThemeMode.DARK
            ThemeMode.DARK -> ThemeMode.SYSTEM
        }
        settings.setTheme(next)
    }

    val goToSection: (Int) -> Unit = { sectionIndex ->
        // Hero is LazyColumn item 0; sections start at item 1.
        scope.launch {
            listState.animateScrollToItem(sectionIndex + 1)
            drawer.close()
        }
    }

    ModalNavigationDrawer(
        drawerState = drawer,
        drawerContent = {
            DrawerContent(onNavigate = goToSection, onClose = { scope.launch { drawer.close() } })
        },
    ) {
        Scaffold(
            topBar = {
                Column {
                    TahlilTopBar(
                        themeMode = settings.themeMode,
                        onOpenDisplay = { showDisplay = true },
                        onOpenArabic = { showArabic = true },
                        onCycleTheme = { cycleTheme() },
                        onOpenNav = { scope.launch { drawer.open() } },
                    )
                    ScrollProgress(listState)
                }
            },
            floatingActionButton = { BackToTopButton(listState) { scope.launch { listState.animateScrollToItem(0) } } },
            containerColor = MaterialTheme.colorScheme.background,
        ) { inner ->
            LazyColumn(
                state = listState,
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(top = inner.calculateTopPadding(), bottom = 80.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp),
            ) {
                item { Hero(onNavigate = goToSection, modifier = Modifier.padding(top = 4.dp)) }
                items(tahlilSections.size) { i ->
                    val section = tahlilSections[i]
                    SectionCard(
                        section = section,
                        toggles = settings.displayToggles,
                        arabic = settings.arabicStyle,
                        modifier = Modifier.padding(horizontal = 16.dp),
                    )
                }
                item { Footer(modifier = Modifier.padding(horizontal = 16.dp)) }
            }
        }
    }

    DisplaySettingsSheet(settings, showDisplay) { showDisplay = false }
    ArabicStyleSheet(settings, showArabic) { showArabic = false }
}

@Composable
private fun DrawerContent(onNavigate: (Int) -> Unit, onClose: () -> Unit) {
    ModalDrawerSheet(drawerContainerColor = MaterialTheme.colorScheme.surface) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text("Daftar Isi", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                    Text("${tahlilSections.size} bagian", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                IconButton(onClick = onClose) {
                    Icon(Icons.Filled.Close, contentDescription = "Tutup daftar isi")
                }
            }
            Spacer(Modifier.height(8.dp))
            OrnamentDivider()
            Spacer(Modifier.height(8.dp))
            tahlilSections.forEachIndexed { i, s ->
                Row(
                    Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .clickableNoRipple { onNavigate(i) }
                        .padding(vertical = 8.dp, horizontal = 8.dp),
                    verticalAlignment = Alignment.Top,
                ) {
                    Box(
                        Modifier
                            .size(28.dp)
                            .clip(RoundedCornerShape(50))
                            .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text("${s.number}", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary)
                    }
                    Spacer(Modifier.size(10.dp))
                    Column {
                        Text(s.title, fontSize = 14.sp, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurface)
                        s.subtitle?.let {
                            Text(it, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
            Box(Modifier.fillMaxWidth().padding(top = 8.dp), contentAlignment = Alignment.Center) {
                Text("Sumber: Salik Channel", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
private fun Footer(modifier: Modifier = Modifier) {
    Column(modifier.fillMaxWidth().padding(top = 16.dp)) {
        OrnamentDivider()
        Spacer(Modifier.height(16.dp))
        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
            Text("Tahlil Singkat — Majelis Doa", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface)
            Text("Disusun dari Al-Qur'an, hadits, dan amaliah ulama.", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(4.dp))
            Text("Sumber konten: Salik Channel", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text("Dibuat untuk kepentingan ibadah & pembelajaran.", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f))
        }
    }
}
