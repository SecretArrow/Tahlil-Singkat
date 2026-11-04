package com.salikchannel.tahlilsingkat

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.salikchannel.tahlilsingkat.ui.TahlilApp

/** Single-activity entry point. Edge-to-edge so the emerald background draws
 *  behind the status / navigation bars; Compose handles all insets. */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent { TahlilApp() }
    }
}
