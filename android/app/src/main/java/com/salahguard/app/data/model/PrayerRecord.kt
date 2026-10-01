package com.salahguard.app.data.model

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
    val date: String, // "yyyy-MM-dd"
    val prayerName: PrayerName,
    val scheduledTime: String,
    val status: PrayerStatus,
    val completedAt: Long? = null,
    val note: String? = null,
    val missedReason: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "user_profile")
data class UserProfile(
    @PrimaryKey
    val id: String = "primary_user",
    val name: String,
    val language: String = "so", // "so" (Somali), "ar", "en"
    val theme: String = "dark",
    val city: String,
    val latitude: Double,
    val longitude: Double,
    val calculationMethod: String = "MWL",
    val madhhab: String = "STANDARD",
    val createdAt: Long = System.currentTimeMillis()
)
