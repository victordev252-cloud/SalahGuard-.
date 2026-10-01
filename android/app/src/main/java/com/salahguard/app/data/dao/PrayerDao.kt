package com.salahguard.app.data.dao

import androidx.room.*
import com.salahguard.app.data.model.PrayerRecord
import com.salahguard.app.data.model.PrayerStatus
import kotlinx.coroutines.flow.Flow

@Dao
interface PrayerDao {
    @Query("SELECT * FROM prayer_records WHERE date = :date")
    fun getPrayersForDate(date: String): Flow<List<PrayerRecord>>

    @Query("SELECT * FROM prayer_records WHERE date = :date AND prayerName = :prayerName LIMIT 1")
    suspend fun getPrayer(date: String, prayerName: String): PrayerRecord?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(record: PrayerRecord)

    @Query("UPDATE prayer_records SET status = :status, completedAt = :completedAt, note = :note WHERE id = :id")
    suspend fun markPrayerCompleted(id: String, status: PrayerStatus = PrayerStatus.COMPLETED, completedAt: Long, note: String?)

    @Query("UPDATE prayer_records SET status = :status, missedReason = :reason WHERE id = :id")
    suspend fun markPrayerMissed(id: String, status: PrayerStatus = PrayerStatus.MISSED, reason: String?)

    @Query("SELECT * FROM prayer_records ORDER BY date DESC")
    fun getAllRecords(): Flow<List<PrayerRecord>>

    @Query("DELETE FROM prayer_records")
    suspend fun clearAll()
}
