package com.salahguard.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

val DarkNavy = Color(0xFF070C16)
val SoftGold = Color(0xFFD4AF37)
val CardBackground = Color(0xFF101726)
val CompletedGreen = Color(0xFF10B981)

@Composable
fun FocusModeScreen(
    prayerName: String,
    scheduledTime: String,
    onConfirmPrayed: () -> Unit,
    onRemindLater: () -> Unit,
    onDidNotPray: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavy)
            .padding(24.dp)
    ) {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "🕌",
                fontSize = 42.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = prayerName.uppercase(),
                color = Color.White,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = "Prayer Time",
                color = SoftGold,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )

            Text(
                text = scheduledTime,
                color = Color.LightGray,
                fontSize = 18.sp
            )

            Spacer(modifier = Modifier.height(28.dp))

            Text(
                text = "\"Pause the distractions.\nMake time for your prayer.\"",
                color = Color(0xFFCBD5E1),
                fontSize = 15.sp,
                textAlign = TextAlign.Center,
                lineHeight = 22.sp
            )

            Spacer(modifier = Modifier.height(36.dp))

            Button(
                onClick = onConfirmPrayed,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = SoftGold)
            ) {
                Text(
                    text = "🤲 I PRAYED",
                    color = Color(0xFF0B111E),
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedButton(
                onClick = onRemindLater,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.LightGray)
            ) {
                Text(text = "⏰ Remind Me Later")
            }

            Spacer(modifier = Modifier.height(8.dp))

            TextButton(onClick = onDidNotPray) {
                Text(
                    text = "I DID NOT PRAY",
                    color = Color.Gray,
                    fontSize = 13.sp
                )
            }
        }
    }
}
