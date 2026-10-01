package com.salahguard.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.salahguard.app.ui.screens.FocusModeScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val openFocusMode = intent.getBooleanExtra("OPEN_FOCUS_MODE", false)
        val prayerName = intent.getStringExtra("extra_prayer_name") ?: "Asr"

        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    if (openFocusMode) {
                        FocusModeScreen(
                            prayerName = prayerName,
                            scheduledTime = "18:42",
                            onConfirmPrayed = { finish() },
                            onRemindLater = { finish() },
                            onDidNotPray = { finish() }
                        )
                    } else {
                        // Main Navigation Hub
                        SalahGuardApp()
                    }
                }
            }
        }
    }
}
