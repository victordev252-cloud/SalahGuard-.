package com.salahguard.app.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.salahguard.app.data.dao.PrayerDao
import com.salahguard.app.data.model.PrayerRecord
import com.salahguard.app.data.model.UserProfile

@Database(
    entities = [PrayerRecord::class, UserProfile::class],
    version = 1,
    exportSchema = false
)
abstract class SalahGuardDatabase : RoomDatabase() {
    abstract fun prayerDao(): PrayerDao

    companion object {
        @Volatile
        private var INSTANCE: SalahGuardDatabase? = null

        fun getDatabase(context: Context): SalahGuardDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    SalahGuardDatabase::class.java,
                    "salahguard_database"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
