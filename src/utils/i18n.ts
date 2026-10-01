import { Language, PrayerName, PrayerCompletionNote, PrayerMissedReason } from '../types';

export const translations = {
  so: {
    // App
    appName: 'SalahGuard',
    appArabicName: 'صلاتي أولاً',
    tagline: 'Salaaddaada ilaali, maalintaadana hagaaji.',
    subTagline: 'Ilaalinta shanta salaadood ee maalinlaha ah iyo joogteyntooda',
    
    // Navigation
    navHome: 'Hoyga',
    navPrayers: 'Salaadaha',
    navHistory: 'Taariikhda',
    navDhikr: 'Tasbiix',
    navSettings: 'Dejinta',
    
    // Greetings & Times
    assalamuAlaikum: 'Assalaamu Calaykum',
    goodMorning: 'Subax wanaagsan',
    goodAfternoon: 'Galab wanaagsan',
    goodEvening: 'Fiid wanaagsan',
    today: 'Maanta',
    tomorrow: 'Berri',
    yesterday: 'Shalay',

    // Prayers
    fajr: 'Subax',
    sunrise: 'Qorrax soo bax',
    dhuhr: 'Duhur',
    asr: 'Casar',
    maghrib: 'Maqrib',
    isha: 'Cisha',
    nextPrayer: 'SALAADDA XIGTA',
    remaining: 'Waxa ka dhiman',
    ongoing: 'Hadda la joogo',
    completedTag: 'La tukaday',
    missedTag: 'Waa la dhaafay',
    pendingTag: 'Waa la sugayaa',
    
    // Progress & Streaks
    todaysProgress: 'HORMARKA MAANTA',
    prayersCount: '{count} / 5 salaadood',
    currentStreak: 'JOOGTEYNTA (STREAK)',
    streakDays: '{days} Maalmood',
    streakKeepGoing: 'Sii wad dadaalka, Alle haku dhowro.',
    streakEnded: 'Joogteyntii waxay ku ekaatay {days} maalmood.',
    streakStartAgain: 'Maanta dib uga bilow.',
    allPrayersCompletedTitle: 'Alxamdulillaah 🤍',
    allPrayersCompletedDesc: 'Dhammaan shantii salaadood ee maanta waad dhammaystirtay.',
    allDoneNextTomorrow: 'Salaadda xigta: Subax berri — {time}',
    
    // Quick Actions
    prayerHistory: 'Taariikhda',
    qiblaCompass: 'Qiblada',
    dhikrCounter: 'Tasbiixda',
    focusMode: 'Deeqda Salaadda',

    // Prayer Focus Mode
    focusModeTitle: 'Deeqda & Qushuucca Salaadda',
    focusModeTag: 'Waqtigii Salaadda wuu galay',
    focusModeQuote: 'Jooji mashquulka adduunka.\nU kac salaaddaada.',
    btnIPrayed: '🤲 Waan Tukaday',
    btnRemindLater: '⏰ I xasuusi 10 daqiiqo kaddib',
    btnDidNotPray: 'Weli Ma Tukan',

    // Confirmation
    alhamdulillah: 'Alxamdulillaah 🤍',
    prayerCompletedSuccess: 'Salaaddii {prayer} waa la dhammaystiray.',
    streakMaintained: '🔥 Joogteyntii waa la ilaaliyay',
    addNoteOptional: 'Ku dar qoraal (ikhtiyaari):',
    noteAtMosque: 'Masaajidka',
    noteAtHome: 'Guriga',
    noteWithCongregation: 'Jamaaco',
    noteOnTime: 'Waqtigeeda',
    noteLate: 'Waxyar kaddib',
    btnSaveNote: 'Keydi',
    btnClose: 'Xidh',

    // Did Not Pray & Missed Flow
    dontGiveUpTitle: 'Ha quusan.',
    dontGiveUpDesc: 'Weli waad u noqon kartaa salaaddaada. Waqtiga kama bixin.',
    btnPrayNow: 'Hadda Tukado',
    btnMarkMissed: 'U calaamadee in la dhaafay',
    missedRecordedTitle: 'Salaaddii waa la calaamadeeyay in la dhaafay.',
    missedRecordedDesc: 'Hal salaad oo ku dhaaftay yuusan sababin in maalintu dhan kaa lunto.',
    missedReasonQuestion: 'Maxaa sababay? (Ikhtiyaari):',
    reasonForgot: 'Waan iloobay',
    reasonOverslept: 'Hurdo ayaa i qaadday',
    reasonBusy: 'Aad baan u mashquulay',
    reasonTravel: 'Safayr baan ahaa',
    reasonOther: 'Sabab kale',
    scholarAdviceNote: 'Wixii ku saabsan qadaada salaadaha ku dhaafay iyo xukunnadooda diiniga ah, la tasho culumada aad ku kalsoontahay.',

    // History & Stats
    calendarTitle: 'Jadwalka Salaadaha',
    statsTitle: 'Tirakoobka Xaqiiqada ah',
    thisWeek: 'Toddobaadkan',
    thisMonth: 'Bishan',
    completionRate: 'Boqolkiiba la tukaday',
    longestStreak: 'Joogteynta ugu dheer',
    currentStreakStat: 'Joogteynta hadda',
    mostConsistentPrayer: 'Salaadda ugu joogtaysan',
    leastConsistentPrayer: 'Salaadda ugu badan ee ku seegtay',
    totalPrayersLogged: 'Wadarta salaadaha la diiwaangeliyay',
    emptyHistoryTitle: 'Weli taariikh ma jirto.',
    emptyHistoryDesc: 'Salaadda ugu horreysa ee aad calaamayso ayaa halkan ka muuqan doonta.',
    filterAll: 'Dhammaan',
    filterCompleted: 'La tukaday',
    filterMissed: 'Dhaaftay',

    // Dhikr
    dhikrTitle: 'Xuska Alle & Tasbiix',
    subhanallah: 'Subxaanallaah',
    subhanallahAr: 'سُبْحَانَ اللَّهِ',
    alhamdulillahDhikr: 'Alxamdulillaah',
    alhamdulillahAr: 'الْحَمْدُ لِلَّهِ',
    allahuAkbar: 'Allaahu Akbar',
    allahuAkbarAr: 'اللَّهُ أَكْبَرُ',
    astaghfirullah: 'Astaqfirullaah',
    astaghfirullahAr: 'أَسْتَغْفِرُ اللَّهَ',
    laIlahaIllallah: 'Laa Ilaaha Illallaah',
    laIlahaIllallahAr: 'لَا إِلَهَ إِلَّا اللَّهُ',
    salawat: 'Saliga Nabiga (NNKH)',
    salawatAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    target: 'Hadafka',
    count: 'Tirada',
    todaysDhikrCount: 'Xuskii maanta oo dhan',
    btnReset: 'Dib u celi',
    customTarget: 'Hadaf gaar ah',

    // Qibla
    qiblaTitle: 'Jiheeyaha Qiblada',
    qiblaTowardsMakkah: 'Xagga Kacbada Sharafta leh',
    distanceToMakkah: 'Masaafada Makkah',
    sensorActive: 'Dareemaha jiheeyaha wuu shaqeynayaa',
    sensorUnavailable: 'Qalabkaagu ma laha dareemaha jiheeyaha (compass sensor). Waxaad isticmaali kartaa xagasha digriiga ee xisaabsan.',
    rotatePhoneGuidance: 'Telefoonkaaga u rog si fallaadhuhu u toosiyaan xagga Kacbada.',

    // Daily Goals
    dailyGoalsTitle: 'Dadaallada Maalinlaha ah',
    goalAllPrayers: 'Dhammaystir shanta salaadood',
    goalQuran: 'Akhriso Qur\'aanka Kariimka',
    goalDhikr: 'Dhammaystir tasbiixda maanta',
    goalSadaqah: 'Bixi sadaqo yaryar',
    goalParents: 'U roonaaw waalidiintaada',
    goalHelpSomeone: 'Caawi qof walaal ah',
    goalDisclaimer: 'F.G: Kuwani waa camallo wanaagsan oo ikhtiyaari ah, ma aha waajibaad diini ah oo cusub.',

    // Notifications & Adhan
    notificationsTitle: 'Ogeysiisyada & Aadaanka',
    enableAdhan: 'Daar Codka Aadaanka',
    adhanSoundLabel: 'Codka Aadaanka',
    soundMakkah: 'Aadaanka Makkah',
    soundMadinah: 'Aadaanka Madiinah',
    soundQuds: 'Aadaanka Al-Quds',
    soundGentleChime: 'Garaac degan (Gentle Chime)',
    btnPreviewAdhan: 'Dhageyso / Tijaabi',
    btnStopAdhan: 'Jooji',
    prayerStartNotification: 'Ogeysiiska bilowga salaadda',
    lateReminderLabel: 'Xasuusinta dib-u-dhaca (10 daqiiqo)',
    dailySummaryLabel: 'Koobidda habeenkii ee salaadaha',
    androidBatteryOptimizationTitle: 'Ilaalinta Baytariga Android',
    androidBatteryNotice: 'Telefoonnada qaar ee Android waxay joojiyaan xasuusinta marka baytari badbaadintu daaran tahay. Fadlan u oggolow SalahGuard inuu si hagar la\'aan ah u shaqeeyo.',
    btnOpenBatterySettings: 'Fur Dejinta Baytariga',

    // App Lock / Focus Guidance
    appLockTitle: 'Deeqda & Focus-ka Android',
    appLockAndroidLimitation: 'Xaddidaadda Sharciga Android: Barnaamijyada caadiga ah ee Android ma xidhi karaan taleefanka oo dhan iyadoon la helin oggolaanshaha Maamulka Qalabka (Device Admin) ama Qalabka Badqabka (Digital Wellbeing). Waxaad isticmaali kartaa shaashadda deeqda ah ee SalahGuard ama "Do Not Disturb" si aad naftaada uga xorayso mashquulka.',
    btnOpenDNDSettings: 'Fur Dejinta "Do Not Disturb"',

    // Onboarding
    onboardingTitle1: 'SalahGuard',
    onboardingSub1: 'Salaaddaada ilaali, maalintaadana hagaaji.',
    btnGetStarted: 'Bilaaw',
    onboardingTitle2: 'Maxaan kuugu yeernaa?',
    nameInputPlaceholder: 'Magacaaga (Ikhtiyaari)',
    btnNext: 'Sii wad',
    btnSkip: 'Ka bood',
    onboardingTitle3: 'Halkee ku sugan tahay?',
    btnDetectLocation: 'Isticmaal Goobta Aan Joogo (GPS)',
    btnManualCity: 'Dooro Magaalo',
    orSelectCity: 'Ama ka dooro liiska magaalooyinka:',
    onboardingTitle4: 'Habka Xisaabinta Salaadda',
    calcMethodDesc: 'Dooro xisaabiyaha ku habboon gobolkaaga:',
    madhhabLabel: 'Habka Casarka (Madhhab)',
    madhhabStandard: 'Shaafici / Maaliki / Xanbali (Hooska 1x)',
    madhhabHanafi: 'Xanafi (Hooska 2x)',
    timeFormatLabel: 'Qaabka Saacadda',
    timeFormat24: '24 Saac (18:42)',
    timeFormat12: '12 Saac (6:42 PM)',
    onboardingTitle5: 'Oggolaanshaha Ogeysiisyada',
    notificationDesc: 'SalahGuard wuxuu u baahan yahay oggolaansho si uu kuugu soo diro xasuusinta salaad kasta waqtigeeda.',
    btnAllowNotifications: 'Oggolow Ogeysiisyada',
    onboardingTitle6: 'Digniinta Shaashadda Buuxda',
    fullScreenAlertDesc: 'Si salaaddu aysan kuugu dhaafin xitaa marka shaashaddu xidhan tahay, SalahGuard wuxuu isticmaali karaa digniinta shaashadda buuxda (Full-Screen Alarm).',
    btnUnderstood: 'Waan fahmay',
    onboardingTitle7: 'Hagaajinta Baytariga Android',
    onboardingTitle8: 'Diyaar ayaad tahay!',
    todaysPrayersReady: 'Waa kuwan salaadahaaga maanta:',
    btnStartMyDay: 'Biloow Maalintayda',

    // Settings
    settingsTitle: 'Dejinta Guud',
    sectionPrayerTimes: 'Waqtiyada Salaadda & Meesha',
    sectionNotifications: 'Ogeysiisyada & Aadaanka',
    sectionLanguageTheme: 'Luqadda & Muuqaalka',
    sectionDataPrivacy: 'Xogta & Xafidaadda',
    sectionDeveloper: 'Tijaabada Horumariyaha (Debug Mode)',
    exportDataCsv: 'Dhoofso Xogta (CSV)',
    exportDataJson: 'Dhoofso Xogta (JSON)',
    deleteDataLabel: 'Tir dhammaan xogta salaadaha',
    deleteDataConfirm: 'Ma hubtaa inaad tirtirto dhammaan taariikhdaada salaadaha? Ficilkan lagama noqon karo.',
    btnConfirmDelete: 'Haa, Tirtir',
    btnCancel: 'Iska daa',
    privacyNotice: 'Xogtaadu kuma baxdo taleefankaaga. Wax kasta waxaa lagu keydiyaa gudaha qalabkaaga oo kaliya (Local Room/Offline DB). Ma jirto xog loo diro server shisheeye.',
    aboutAppName: 'SalahGuard — صلاتي أولاً',
    appVersion: 'Nuqulka 1.0.0 (Android Production Build)',

    // Debug Simulator
    debugTitle: 'Qaybta Tijaabada (Simulation & Debug)',
    simulatePrayerPrompt: 'Geli waqtiga salaadda si aad u tijaabiso Focus Mode & Aadaanka:',
    btnSimulateFajr: 'Tijaabi Subax',
    btnSimulateDhuhr: 'Tijaabi Duhur',
    btnSimulateAsr: 'Tijaabi Casar',
    btnSimulateMaghrib: 'Tijaabi Maqrib',
    btnSimulateIsha: 'Tijaabi Cisha',
    btnSimulateStreakBroken: 'Tijaabi Joogteyn Jabtay',
  },

  ar: {
    // App
    appName: 'SalahGuard',
    appArabicName: 'صلاتي أولاً',
    tagline: 'احفظ صلاتك، تحفظ يومك.',
    subTagline: 'تطبيق التركيز والمحاسبة على الصلوات الخمس في أوقاتها',
    
    // Navigation
    navHome: 'الرئيسية',
    navPrayers: 'الصلوات',
    navHistory: 'السجل',
    navDhikr: 'الأذكار',
    navSettings: 'الإعدادات',
    
    // Greetings & Times
    assalamuAlaikum: 'السلام عليكم ورحمة الله',
    goodMorning: 'صباح الخير والبركة',
    goodAfternoon: 'مساء الخير',
    goodEvening: 'مساء النور والسكينة',
    today: 'اليوم',
    tomorrow: 'غداً',
    yesterday: 'أمس',

    // Prayers
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    nextPrayer: 'الصلاة القادمة',
    remaining: 'الوقت المتبقي',
    ongoing: 'الوقت الحالي',
    completedTag: 'أُدِّيت',
    missedTag: 'فاتت',
    pendingTag: 'في الانتظار',
    
    // Progress & Streaks
    todaysProgress: 'إنجاز اليوم',
    prayersCount: '{count} / 5 صلوات',
    currentStreak: 'سلسلة المحافظة',
    streakDays: '{days} يوماً',
    streakKeepGoing: 'واصل الثبات، ثبّت الله قلبك.',
    streakEnded: 'انتهت سلسلة المحافظة عند {days} يوماً.',
    streakStartAgain: 'ابدأ من جديد اليوم بعزم وتوكل.',
    allPrayersCompletedTitle: 'الحمد لله 🤍',
    allPrayersCompletedDesc: 'أتممت بحمد الله جميع الصلوات الخمس لهذا اليوم.',
    allDoneNextTomorrow: 'الصلاة القادمة: صلاة الفجر غداً — {time}',
    
    // Quick Actions
    prayerHistory: 'سجل الصلوات',
    qiblaCompass: 'اتجاه القبلة',
    dhikrCounter: 'المسبحة',
    focusMode: 'وضع الصلاة',

    // Prayer Focus Mode
    focusModeTitle: 'وضع الخشوع والتركيز',
    focusModeTag: 'دخل وقت الصلاة الآن',
    focusModeQuote: 'أوقف صخب الدنيا.\nوأقبل على صلاتك بقلب حاضر.',
    btnIPrayed: '🤲 صليت بحمد الله',
    btnRemindLater: '⏰ ذكّرني بعد 10 دقائق',
    btnDidNotPray: 'لم أصلِّ بعد',

    // Confirmation
    alhamdulillah: 'الحمد لله 🤍',
    prayerCompletedSuccess: 'تم تسجيل صلاة {prayer}.',
    streakMaintained: '🔥 استمرت سلسلة المحافظة',
    addNoteOptional: 'إضافة تفاصيل (اختياري):',
    noteAtMosque: 'في المسجد',
    noteAtHome: 'في المنزل',
    noteWithCongregation: 'مع الجماعة',
    noteOnTime: 'في أول وقتها',
    noteLate: 'بعد حين',
    btnSaveNote: 'حفظ',
    btnClose: 'إغلاق',

    // Did Not Pray & Missed Flow
    dontGiveUpTitle: 'لا تيأس ولا تعجز.',
    dontGiveUpDesc: 'ما زال بإمكانك العودة وأداء صلاتك في وقتها.',
    btnPrayNow: 'سأقوم للصلاة الآن',
    btnMarkMissed: 'تسجيل كصلاة فائتة',
    missedRecordedTitle: 'تم تسجيل الصلاة كفائتة.',
    missedRecordedDesc: 'لا تجعل فوات صلاة واحدة يجرّك إلى التفريط في بقية اليوم.',
    missedReasonQuestion: 'ما السبب؟ (اختياري):',
    reasonForgot: 'نسيان',
    reasonOverslept: 'نوم',
    reasonBusy: 'انشغال طارئ',
    reasonTravel: 'سفر',
    reasonOther: 'سبب آخر',
    scholarAdviceNote: 'لقضاء الصلوات الفائتة وأحكامها الفقهية، يرجى مراجعة أهل العلم الموثوقين.',

    // History & Stats
    calendarTitle: 'سجل وتقويم الصلوات',
    statsTitle: 'إحصاءات واقعية',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    completionRate: 'نسبة الإنجاز',
    longestStreak: 'أطول سلسلة صلوات',
    currentStreakStat: 'السلسلة الحالية',
    mostConsistentPrayer: 'الصلاة الأكثر التزاماً',
    leastConsistentPrayer: 'الصلاة الأكثر تفويتاً',
    totalPrayersLogged: 'إجمالي الصلوات المسجلة',
    emptyHistoryTitle: 'لا يوجد سجل صلوات حتى الآن.',
    emptyHistoryDesc: 'ستظهر صلواتك فور تسجيلها هنا.',
    filterAll: 'الكل',
    filterCompleted: 'أُدِّيت',
    filterMissed: 'فاتت',

    // Dhikr
    dhikrTitle: 'الأذكار والمسبحة',
    subhanallah: 'سبحان الله',
    subhanallahAr: 'سُبْحَانَ اللَّهِ',
    alhamdulillahDhikr: 'الحمد لله',
    alhamdulillahAr: 'الْحَمْدُ لِلَّهِ',
    allahuAkbar: 'الله أكبر',
    allahuAkbarAr: 'اللَّهُ أَكْبَرُ',
    astaghfirullah: 'أستغفر الله',
    astaghfirullahAr: 'أَسْتَغْفِرُ اللَّهَ',
    laIlahaIllallah: 'لا إله إلا الله',
    laIlahaIllallahAr: 'لَا إِلَهَ إِلَّا اللَّهُ',
    salawat: 'الصلاة على النبي ﷺ',
    salawatAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    target: 'الهدف',
    count: 'العدد',
    todaysDhikrCount: 'إجمالي تسبيح اليوم',
    btnReset: 'إعادة ضبط',
    customTarget: 'هدف مخصص',

    // Qibla
    qiblaTitle: 'بوصلة القبلة',
    qiblaTowardsMakkah: 'باتجاه الكعبة المشرفة',
    distanceToMakkah: 'المسافة إلى مكة المكرمة',
    sensorActive: 'مستشعر البوصلة نشط',
    sensorUnavailable: 'جهازك لا يحتوي على مستشعر البوصلة، يمكنك الاعتماد على الزاوية الحسابية.',
    rotatePhoneGuidance: 'قم بتدوير الهاتف حتى تتطابق الإبرة مع اتجاه الكعبة.',

    // Daily Goals
    dailyGoalsTitle: 'أهداف اليوم الصالحة',
    goalAllPrayers: 'إتمام الصلوات الخمس',
    goalQuran: 'ورد من القرآن الكريم',
    goalDhikr: 'أذكار اليوم والمساء',
    goalSadaqah: 'صدقة ولو بالقليل',
    goalParents: 'بر الوالدين وصلتهم',
    goalHelpSomeone: 'قضاء حاجة مسلم',
    goalDisclaimer: 'تنبيه: هذه أعمال بر تطوعية، وليست فرائض دينية جديدة.',

    // Notifications & Adhan
    notificationsTitle: 'التنبيهات والأذان',
    enableAdhan: 'تشغيل صوت الأذان',
    adhanSoundLabel: 'صوت الأذان المختار',
    soundMakkah: 'أذان المسجد الحرام (مكة)',
    soundMadinah: 'أذان المسجد النبوي (المدينة)',
    soundQuds: 'أذان المسجد الأقصى (القدس)',
    soundGentleChime: 'رنين هادئ وقور',
    btnPreviewAdhan: 'استماع وتجربة',
    btnStopAdhan: 'إيقاف',
    prayerStartNotification: 'تنبيه دخول وقت الصلاة',
    lateReminderLabel: 'تذكير لطيف عند التأخر (10 دقائق)',
    dailySummaryLabel: 'ملخص الصلوات المسائي',
    androidBatteryOptimizationTitle: 'تحسين البطارية في أندرويد',
    androidBatteryNotice: 'بعض أنظمة أندرويد قد توقف التنبيهات بسبب قيود توفير الطاقة. يرجى استثناء التطبيق لضمان دقة الأذان.',
    btnOpenBatterySettings: 'فتح إعدادات البطارية',

    // App Lock / Focus Guidance
    appLockTitle: 'التركيز ووضع عدم الإزعاج',
    appLockAndroidLimitation: 'تنويه تقني خاص بأندرويد: وفقاً لسياسات أمان أندرويد، لا يمكن لأي تطبيق عادي حظر التطبيقات الأخرى قسراً دون إذن مسؤول الجهاز أو الرفاهية الرقمية. ننصحك بتفعيل وضع عدم الإزعاج أثناء الصلاة.',
    btnOpenDNDSettings: 'إعدادات عدم الإزعاج (DND)',

    // Onboarding
    onboardingTitle1: 'SalahGuard',
    onboardingSub1: 'احفظ صلاتك، تحفظ يومك.',
    btnGetStarted: 'ابدأ الآن',
    onboardingTitle2: 'ما هو اسمك الكريم؟',
    nameInputPlaceholder: 'اسمك (اختياري)',
    btnNext: 'متابعة',
    btnSkip: 'تخطي',
    onboardingTitle3: 'أين تقيم حالياً؟',
    btnDetectLocation: 'تحديد الموقع تلقائياً (GPS)',
    btnManualCity: 'اختيار المدينة يدوياً',
    orSelectCity: 'أو اختر من المدن الشهيرة:',
    onboardingTitle4: 'طريقة حساب المواقيت',
    calcMethodDesc: 'اختر طريقة الحساب المعتمدة في بلدك:',
    madhhabLabel: 'طريقة حساب صلاة العصر',
    madhhabStandard: 'الجمهور: الشافعي والمالكي والحنبلي (ظل المثل)',
    madhhabHanafi: 'الحنفي (ظل المثلين)',
    timeFormatLabel: 'نظام الوقت',
    timeFormat24: '24 ساعة (18:42)',
    timeFormat12: '12 ساعة (6:42 م)',
    onboardingTitle5: 'إذن التنبيهات',
    notificationDesc: 'يحتاج صلاح جارد إلى إذن الإشعارات لتذكيرك بكل صلاة فور دخول وقتها.',
    btnAllowNotifications: 'السماح بالإشعارات',
    onboardingTitle6: 'التنبيه بالشاشة الكاملة',
    fullScreenAlertDesc: 'لضمان عدم فوات الصلاة أثناء قفل الشاشة، يدعم التطبيق التنبيه الكامل (Full-Screen Alarm).',
    btnUnderstood: 'مفهوم',
    onboardingTitle7: 'إرشادات بطارية أندرويد',
    onboardingTitle8: 'أنت جاهز تماماً!',
    todaysPrayersReady: 'مواقيت صلواتك اليوم:',
    btnStartMyDay: 'بدء اليوم بحفظ الله',

    // Settings
    settingsTitle: 'الإعدادات العامة',
    sectionPrayerTimes: 'المواقيت والموقع الجغرافي',
    sectionNotifications: 'الإشعارات والأذان',
    sectionLanguageTheme: 'اللغة والمظهر',
    sectionDataPrivacy: 'البيانات والخصوصية',
    sectionDeveloper: 'أدوات المطور والمحاكاة',
    exportDataCsv: 'تصدير البيانات (CSV)',
    exportDataJson: 'تصدير البيانات (JSON)',
    deleteDataLabel: 'مسح جميع سجلات الصلوات',
    deleteDataConfirm: 'هل أنت متأكد من رغبتك في حذف سجلات الصلوات بالكامل؟ لا يمكن التراجع عن هذا الإجراء.',
    btnConfirmDelete: 'نعم، احذف',
    btnCancel: 'إلغاء',
    privacyNotice: 'جميع بيانات صلواتك تُخزن محلياً فقط على جهازك (Room Local Database). لا نرسل أي بيانات إلى خوادم خارجية إطلاقاً.',
    aboutAppName: 'صلاح جارد — صلاتي أولاً',
    appVersion: 'الإصدار 1.0.0 (بنية أندرويد الرسمية)',

    // Debug Simulator
    debugTitle: 'شاشة المحاكاة للمطورين',
    simulatePrayerPrompt: 'محاكاة أوقات الصلاة للتأكد من الأداء:',
    btnSimulateFajr: 'محاكاة الفجر',
    btnSimulateDhuhr: 'محاكاة الظهر',
    btnSimulateAsr: 'محاكاة العصر',
    btnSimulateMaghrib: 'محاكاة المغرب',
    btnSimulateIsha: 'محاكاة العشاء',
    btnSimulateStreakBroken: 'محاكاة انقطاع السلسلة',
  },

  en: {
    // App
    appName: 'SalahGuard',
    appArabicName: 'صلاتي أولاً',
    tagline: 'Protect Your Prayer. Protect Your Day.',
    subTagline: 'A focused, respectful companion for guarding your five daily prayers',
    
    // Navigation
    navHome: 'Home',
    navPrayers: 'Prayers',
    navHistory: 'History',
    navDhikr: 'Dhikr',
    navSettings: 'Settings',
    
    // Greetings & Times
    assalamuAlaikum: 'Assalamu Alaikum',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',

    // Prayers
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    nextPrayer: 'NEXT PRAYER',
    remaining: 'Remaining',
    ongoing: 'Prayer Time',
    completedTag: 'Completed',
    missedTag: 'Missed',
    pendingTag: 'Upcoming',
    
    // Progress & Streaks
    todaysProgress: 'TODAY\'S PROGRESS',
    prayersCount: '{count} / 5 prayers',
    currentStreak: 'CURRENT STREAK',
    streakDays: '{days} Days',
    streakKeepGoing: 'Keep going. Guard your connection.',
    streakEnded: 'Your streak ended at {days} days.',
    streakStartAgain: 'Start again today with a fresh intention.',
    allPrayersCompletedTitle: 'Alhamdulillah 🤍',
    allPrayersCompletedDesc: 'All five prayers completed today.',
    allDoneNextTomorrow: 'Next prayer: Fajr tomorrow — {time}',
    
    // Quick Actions
    prayerHistory: 'History',
    qiblaCompass: 'Qibla',
    dhikrCounter: 'Dhikr',
    focusMode: 'Prayer Mode',

    // Prayer Focus Mode
    focusModeTitle: 'Prayer Focus Mode',
    focusModeTag: 'Prayer time has begun',
    focusModeQuote: 'Pause the distractions.\nMake time for your prayer.',
    btnIPrayed: '🤲 I PRAYED',
    btnRemindLater: '⏰ Remind Me Later',
    btnDidNotPray: 'I DID NOT PRAY',

    // Confirmation
    alhamdulillah: 'Alhamdulillah 🤍',
    prayerCompletedSuccess: '{prayer} completed.',
    streakMaintained: '🔥 Streak maintained',
    addNoteOptional: 'Add a note (optional):',
    noteAtMosque: 'At mosque',
    noteAtHome: 'At home',
    noteWithCongregation: 'With congregation',
    noteOnTime: 'On time',
    noteLate: 'Late',
    btnSaveNote: 'Save',
    btnClose: 'Close',

    // Did Not Pray & Missed Flow
    dontGiveUpTitle: 'Don\'t give up.',
    dontGiveUpDesc: 'You can still return to your prayer. Take a moment if you can.',
    btnPrayNow: 'Pray Now',
    btnMarkMissed: 'Mark as Missed',
    missedRecordedTitle: 'Prayer marked as missed.',
    missedRecordedDesc: 'Don\'t let one missed prayer become the whole day.',
    missedReasonQuestion: 'Reason (optional):',
    reasonForgot: 'Forgot',
    reasonOverslept: 'Overslept',
    reasonBusy: 'Busy',
    reasonTravel: 'Travel',
    reasonOther: 'Other',
    scholarAdviceNote: 'For questions about missed prayers and religious rulings, consult a trusted qualified scholar.',

    // History & Stats
    calendarTitle: 'Prayer Calendar',
    statsTitle: 'Factual Statistics',
    thisWeek: 'This week',
    thisMonth: 'This month',
    completionRate: 'Completion rate',
    longestStreak: 'Longest streak',
    currentStreakStat: 'Current streak',
    mostConsistentPrayer: 'Most consistent prayer',
    leastConsistentPrayer: 'Least consistent',
    totalPrayersLogged: 'Total prayers recorded',
    emptyHistoryTitle: 'No prayer history yet.',
    emptyHistoryDesc: 'Your first completed prayer will appear here.',
    filterAll: 'All',
    filterCompleted: 'Completed',
    filterMissed: 'Missed',

    // Dhikr
    dhikrTitle: 'Dhikr & Remembrance',
    subhanallah: 'SubhanAllah',
    subhanallahAr: 'سُبْحَانَ اللَّهِ',
    alhamdulillahDhikr: 'Alhamdulillah',
    alhamdulillahAr: 'الْحَمْدُ لِلَّهِ',
    allahuAkbar: 'Allahu Akbar',
    allahuAkbarAr: 'اللَّهُ أَكْبَرُ',
    astaghfirullah: 'Astaghfirullah',
    astaghfirullahAr: 'أَسْتَغْفِرُ اللَّهَ',
    laIlahaIllallah: 'La ilaha illallah',
    laIlahaIllallahAr: 'لَا إِلَهَ إِلَّا اللَّهُ',
    salawat: 'Salawat on the Prophet',
    salawatAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    target: 'Target',
    count: 'Count',
    todaysDhikrCount: 'Today\'s total dhikr',
    btnReset: 'Reset',
    customTarget: 'Custom target',

    // Qibla
    qiblaTitle: 'Qibla Direction',
    qiblaTowardsMakkah: 'Towards Kaaba, Makkah',
    distanceToMakkah: 'Distance to Makkah',
    sensorActive: 'Compass sensor active',
    sensorUnavailable: 'Your device does not provide the sensor required for compass-based Qibla. Using calculated degree bearing.',
    rotatePhoneGuidance: 'Rotate your phone until the needle points towards the Kaaba.',

    // Daily Goals
    dailyGoalsTitle: 'Daily Good Deeds',
    goalAllPrayers: 'Complete all five prayers',
    goalQuran: 'Read Qur\'an',
    goalDhikr: 'Complete daily dhikr',
    goalSadaqah: 'Give sadaqah (charity)',
    goalParents: 'Help your parents',
    goalHelpSomeone: 'Help someone today',
    goalDisclaimer: 'Note: These are recommended voluntary deeds, not mandatory obligations.',

    // Notifications & Adhan
    notificationsTitle: 'Notifications & Adhan',
    enableAdhan: 'Play Adhan sound',
    adhanSoundLabel: 'Adhan sound selection',
    soundMakkah: 'Makkah Adhan',
    soundMadinah: 'Madinah Adhan',
    soundQuds: 'Al-Quds Adhan',
    soundGentleChime: 'Gentle Chime',
    btnPreviewAdhan: 'Preview Sound',
    btnStopAdhan: 'Stop Audio',
    prayerStartNotification: 'Prayer start alert',
    lateReminderLabel: 'Gentle late reminder (10 min)',
    dailySummaryLabel: 'Daily evening prayer summary',
    androidBatteryOptimizationTitle: 'Android Battery Optimization',
    androidBatteryNotice: 'Some Android phones may stop or delay reminders when battery restrictions are enabled. Please exempt SalahGuard for timely alerts.',
    btnOpenBatterySettings: 'Open Battery Settings',

    // App Lock / Focus Guidance
    appLockTitle: 'Prayer Focus & System Guidance',
    appLockAndroidLimitation: 'Android Security Limitation: Normal Android apps cannot forcibly lock other apps without Device Admin or Digital Wellbeing permissions. Use SalahGuard Focus Mode or enable Do Not Disturb to minimize interruptions.',
    btnOpenDNDSettings: 'Open Do Not Disturb Settings',

    // Onboarding
    onboardingTitle1: 'SalahGuard',
    onboardingSub1: 'Protect Your Prayer. Protect Your Day.',
    btnGetStarted: 'Get Started',
    onboardingTitle2: 'What should we call you?',
    nameInputPlaceholder: 'Your name (Optional)',
    btnNext: 'Continue',
    btnSkip: 'Skip',
    onboardingTitle3: 'Where are you?',
    btnDetectLocation: 'Use My Current Location (GPS)',
    btnManualCity: 'Select City Manually',
    orSelectCity: 'Or choose a major city:',
    onboardingTitle4: 'Prayer Calculation Settings',
    calcMethodDesc: 'Choose the standard authority for your region:',
    madhhabLabel: 'Asr Calculation Method (Madhhab)',
    madhhabStandard: 'Standard: Shafi\'i, Maliki, Hanbali (Shadow 1x)',
    madhhabHanafi: 'Hanafi (Shadow 2x)',
    timeFormatLabel: 'Clock Format',
    timeFormat24: '24-hour (18:42)',
    timeFormat12: '12-hour (6:42 PM)',
    onboardingTitle5: 'Notification Permissions',
    notificationDesc: 'SalahGuard needs notification access to alert you precisely when each prayer begins.',
    btnAllowNotifications: 'Enable Notifications',
    onboardingTitle6: 'Full-Screen Prayer Alert',
    fullScreenAlertDesc: 'To ensure you never miss prayer even when your phone is locked, SalahGuard supports full-screen prayer alerts on Android.',
    btnUnderstood: 'Understood',
    onboardingTitle7: 'Battery Optimization Guidance',
    onboardingTitle8: 'You\'re ready.',
    todaysPrayersReady: 'Here are today\'s scheduled prayers:',
    btnStartMyDay: 'Start My Day',

    // Settings
    settingsTitle: 'Settings',
    sectionPrayerTimes: 'Prayer Times & Calculation',
    sectionNotifications: 'Notifications & Adhan',
    sectionLanguageTheme: 'Language & Display',
    sectionDataPrivacy: 'Data & Privacy',
    sectionDeveloper: 'Developer & Simulator Mode',
    exportDataCsv: 'Export Data (CSV)',
    exportDataJson: 'Export Data (JSON)',
    deleteDataLabel: 'Delete All Prayer Data',
    deleteDataConfirm: 'Are you sure you want to delete all prayer history? This cannot be undone.',
    btnConfirmDelete: 'Delete Data',
    btnCancel: 'Cancel',
    privacyNotice: 'Your data never leaves your device. All prayer records and settings are stored locally in Room/Offline Database. No external tracking or telemetry.',
    aboutAppName: 'SalahGuard — صلاتي أولاً',
    appVersion: 'Version 1.0.0 (Android Production Release)',

    // Debug Simulator
    debugTitle: 'Developer Simulator (Testing Only)',
    simulatePrayerPrompt: 'Trigger simulated prayer events to test Focus Mode, Adhan, and Alarms:',
    btnSimulateFajr: 'Simulate Fajr',
    btnSimulateDhuhr: 'Simulate Dhuhr',
    btnSimulateAsr: 'Simulate Asr',
    btnSimulateMaghrib: 'Simulate Maghrib',
    btnSimulateIsha: 'Simulate Isha',
    btnSimulateStreakBroken: 'Simulate Broken Streak',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.so;
}

export function formatPrayerName(prayer: PrayerName, lang: Language): string {
  const t = getTranslation(lang);
  switch (prayer) {
    case 'fajr': return t.fajr;
    case 'sunrise': return t.sunrise;
    case 'dhuhr': return t.dhuhr;
    case 'asr': return t.asr;
    case 'maghrib': return t.maghrib;
    case 'isha': return t.isha;
  }
}

export function formatNote(note: PrayerCompletionNote, lang: Language): string {
  const t = getTranslation(lang);
  switch (note) {
    case 'at_mosque': return t.noteAtMosque;
    case 'at_home': return t.noteAtHome;
    case 'with_congregation': return t.noteWithCongregation;
    case 'on_time': return t.noteOnTime;
    case 'late': return t.noteLate;
    default: return note;
  }
}

export function formatReason(reason: PrayerMissedReason, lang: Language): string {
  const t = getTranslation(lang);
  switch (reason) {
    case 'forgot': return t.reasonForgot;
    case 'overslept': return t.reasonOverslept;
    case 'busy': return t.reasonBusy;
    case 'travel': return t.reasonTravel;
    default: return t.reasonOther;
  }
}
