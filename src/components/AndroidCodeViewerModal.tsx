import React, { useState } from 'react';
import { Code2, X, Copy, Check, FileCode, FolderTree, Terminal } from 'lucide-react';

interface AndroidCodeViewerModalProps {
  onClose: () => void;
}

const ANDROID_FILES: { path: string; language: string; content: string }[] = [
  {
    path: 'android/app/src/main/java/com/salahguard/app/MainActivity.kt',
    language: 'kotlin',
    content: `package com.salahguard.app

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
                        // Main Navigation Graph
                        SalahGuardAppNav()
                    }
                }
            }
        }
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/salahguard/app/data/model/PrayerRecord.kt',
    language: 'kotlin',
    content: `package com.salahguard.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class PrayerName {
    FAJR, SUNRISE, DHUHR, ASR, MAGHRIB, ISHA
}

enum class PrayerStatus {
    PENDING, COMPLETED, MISSED
}

@Entity(tableName = "prayer_records")
data class PrayerRecord(
    @PrimaryKey
    val id: String, // Format: "yyyy-MM-dd-ASR"
    val date: String,
    val prayerName: PrayerName,
    val scheduledTime: String,
    val status: PrayerStatus,
    val completedAt: Long? = null,
    val note: String? = null,
    val missedReason: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)`
  },
  {
    path: 'android/app/src/main/java/com/salahguard/app/services/notifications/PrayerAlarmReceiver.kt',
    language: 'kotlin',
    content: `package com.salahguard.app.services.notifications

import android.app.*
import android.content.*
import android.os.Build
import androidx.core.app.NotificationCompat
import com.salahguard.app.MainActivity

class PrayerAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val prayerName = intent.getStringExtra("extra_prayer_name") ?: "Prayer"
        val prayerTime = intent.getStringExtra("extra_prayer_time") ?: ""

        val fullScreenIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            putExtra("OPEN_FOCUS_MODE", true)
            putExtra("extra_prayer_name", prayerName)
        }

        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            prayerName.hashCode(),
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, "salahguard_prayer_alerts")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("🕌 $prayerName TIME")
            .setContentText("Prayer time has begun ($prayerTime). Pause and enter Focus Mode.")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setAutoCancel(true)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(prayerName.hashCode(), notification)
    }
}`
  },
  {
    path: 'android/app/build.gradle.kts',
    language: 'groovy',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.kapt)
}

android {
    namespace = "com.salahguard.app"
    compileSdk = 34
    defaultConfig {
        applicationId = "com.salahguard.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.8" }
}`
  }
];

export const AndroidCodeViewerModal: React.FC<AndroidCodeViewerModalProps> = ({ onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = ANDROID_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060a12]/95 backdrop-blur-md text-slate-100 flex flex-col justify-between p-4 md:p-6 select-none overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <span>Native Android Project Sources</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Kotlin · Jetpack Compose · Room Database · WorkManager
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-400 hover:text-slate-200 bg-[#101726] border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Code Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 py-4 min-h-0 overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-full md:w-64 bg-[#0c1320] border border-slate-800 rounded-2xl p-3 flex flex-col gap-1 overflow-y-auto shrink-0">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2 px-1 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-slate-400" />
            <span>Project Files</span>
          </div>

          {ANDROID_FILES.map((f, idx) => (
            <button
              key={f.path}
              onClick={() => setSelectedFileIdx(idx)}
              className={`p-2 rounded-xl text-left font-mono text-xs flex items-center gap-2 transition-all ${
                selectedFileIdx === idx
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileCode className="w-4 h-4 shrink-0 text-slate-500" />
              <span className="truncate">{f.path.split('/').pop()}</span>
            </button>
          ))}
        </div>

        {/* Code Content View */}
        <div className="flex-1 bg-[#090f1a] border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 bg-[#0e1624] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 truncate">{activeFile.path}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed select-text">
            <pre>{activeFile.content}</pre>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-500 font-mono pt-2">
        Full source files located in <code className="text-slate-400">/android/</code> directory
      </div>
    </div>
  );
};
