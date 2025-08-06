// To run the end-to-end product status flow:
// 1. Use the Partner token to create a product.
// 2. Use the Admin token to approve or reject the product.
// 3. Use the appropriate token to fetch products by status.
// Switch the AUTH_TOKEN value as needed for each step.

const path = require('path');
const fs = require('fs');

function createTestImage() {
  const testImagePath = path.join(__dirname, 'test-image.png');
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
    0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xcf, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb0, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
  fs.writeFileSync(testImagePath, pngBuffer);
  return testImagePath;
}

// Test data for dual-language testing
const testData = {
  yacht: {
    titleEn: 'Luxury Ocean Pearl',
    titleAr: 'لؤلؤة المحيط الفاخرة',
    descriptionEn:
      'Experience ultimate luxury on the water with this premium yacht.',
    descriptionAr: 'استمتع بالفخامة القصوى على الماء مع هذه اليخت المميز.',
    cancellationPolicyEn: ['72hr notice', '50% refund'],
    cancellationPolicyAr: ['إشعار 72 ساعة', 'استرداد 50%'],
    termsAndConditionsEn: ['No pets', 'No smoking on deck'],
    termsAndConditionsAr: ['لا حيوانات أليفة', 'لا تدخين على سطح السفينة'],
    cityEn: 'Karachi',
    cityAr: 'كراتشي',
    regionEn: 'Sindh',
    regionAr: 'السند',
    countryEn: 'Pakistan',
    countryAr: 'باكستان',
    addressEn: 'Harbor Marina',
    addressAr: 'مارينا الميناء',
    tagsEn: ['luxury', 'party', 'family'],
    tagsAr: ['فخامة', 'حفلة', 'عائلة'],
  },
  resort: {
    titleEn: 'Paradise Beach Resort',
    titleAr: 'منتجع شاطئ الجنة',
    descriptionEn: 'Experience paradise at our luxurious beach resort.',
    descriptionAr: 'عش الجنة في منتجعنا الفاخر على الشاطئ.',
    cancellationPolicyEn: ['24hr notice', 'Full refund'],
    cancellationPolicyAr: ['إشعار 24 ساعة', 'استرداد كامل'],
    termsAndConditionsEn: ['Check-in 3PM', 'Check-out 11AM'],
    termsAndConditionsAr: ['تسجيل الوصول 3 مساءً', 'تسجيل الخروج 11 صباحاً'],
    safetyFeaturesEn: ['Fire alarms', 'Security cameras'],
    safetyFeaturesAr: ['أجهزة إنذار الحريق', 'كاميرات المراقبة'],
    amenitiesEn: ['Pool', 'Spa', 'Restaurant'],
    amenitiesAr: ['مسبح', 'سبا', 'مطعم'],
    cityEn: 'Dubai',
    cityAr: 'دبي',
    regionEn: 'Dubai',
    regionAr: 'دبي',
    countryEn: 'UAE',
    countryAr: 'الإمارات',
    addressEn: 'Beach Road, Palm Jumeirah',
    addressAr: 'طريق الشاطئ، نخلة جميرا',
  },
  jetski: {
    titleEn: 'Speed Demon Jet Ski',
    titleAr: 'جت سكي شيطان السرعة',
    descriptionEn: 'A fast and fun jetski for adrenaline seekers.',
    descriptionAr: 'جت سكي سريع وممتع لعشاق الأدرينالين.',
    cancellationPolicyEn: ['No refunds', 'Reschedule allowed'],
    cancellationPolicyAr: ['لا استرداد', 'إعادة جدولة مسموحة'],
    termsAndConditionsEn: ['Wear safety gear', 'No alcohol'],
    termsAndConditionsAr: ['ارتداء معدات السلامة', 'لا كحول'],
    cityEn: 'Karachi',
    cityAr: 'كراتشي',
    regionEn: 'Sindh',
    regionAr: 'السند',
    countryEn: 'Pakistan',
    countryAr: 'باكستان',
    addressEn: 'Clifton Beach, Karachi',
    addressAr: 'شاطئ كليفتون، كراتشي',
    tagsEn: ['fast', 'fun', 'family'],
    tagsAr: ['سريع', 'ممتع', 'عائلة'],
  },
  kayak: {
    titleEn: 'Peaceful Paddle Kayak',
    titleAr: 'كاياك التجديف الهادئ',
    descriptionEn: 'Enjoy peaceful paddling with this comfortable kayak.',
    descriptionAr: 'استمتع بالتجديف الهادئ مع هذا الكاياك المريح.',
    cancellationPolicyEn: ['24hr notice', 'Full refund'],
    cancellationPolicyAr: ['إشعار 24 ساعة', 'استرداد كامل'],
    termsAndConditionsEn: ['Life jacket required', 'Weather dependent'],
    termsAndConditionsAr: ['سترة نجاة مطلوبة', 'يعتمد على الطقس'],
    cityEn: 'Karachi',
    cityAr: 'كراتشي',
    regionEn: 'Sindh',
    regionAr: 'السند',
    countryEn: 'Pakistan',
    countryAr: 'باكستان',
    addressEn: 'Port Grand, Karachi',
    addressAr: 'بورت غراند، كراتشي',
    tagsEn: ['peaceful', 'nature', 'exercise'],
    tagsAr: ['هادئ', 'طبيعة', 'تمرين'],
  },
  speedboat: {
    titleEn: 'Thunder Speed Boat',
    titleAr: 'قارب السرعة الرعد',
    descriptionEn: 'Experience the thrill of high-speed boating.',
    descriptionAr: 'عش إثارة القوارب عالية السرعة.',
    cancellationPolicyEn: ['48hr notice', '75% refund'],
    cancellationPolicyAr: ['إشعار 48 ساعة', 'استرداد 75%'],
    termsAndConditionsEn: ['Professional captain', 'Safety briefing required'],
    termsAndConditionsAr: ['قبطان محترف', 'إحاطة سلامة مطلوبة'],
    cityEn: 'Karachi',
    cityAr: 'كراتشي',
    regionEn: 'Sindh',
    regionAr: 'السند',
    countryEn: 'Pakistan',
    countryAr: 'باكستان',
    addressEn: 'Marina Club, Karachi',
    addressAr: 'نادي المارينا، كراتشي',
    tagsEn: ['thrilling', 'speed', 'adventure'],
    tagsAr: ['مثير', 'سرعة', 'مغامرة'],
  },
};

module.exports = {
  BASE_URL: 'http://localhost:8080',
  OWNER_ID: '6892ecbdc8f7a7b2c703e300',
  createTestImage,
  testData,
  PARTNER_1_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTJlY2NmYzhmN2E3YjJjNzAzZTMwMiIsImxhbmciOiJlbiIsImlhdCI6MTc1NDQ2MzcxMiwiZXhwIjoxNzU1MDY4NTEyfQ.bpvY7heVqcKzQbZbxB8B6YN3fMmaY4N2vrPnm0odGyU',
  PARTNER_2_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTJlY2UyYzhmN2E3YjJjNzAzZTMwNCIsImxhbmciOiJlbiIsImlhdCI6MTc1NDQ2MzcyMiwiZXhwIjoxNzU1MDY4NTIyfQ.jZ61tXn1pov8U-pO2P75Pz0KoVZasU6qJUfFFX3wY7U',
  ADMIN_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTJlY2JkYzhmN2E3YjJjNzAzZTMwMCIsImxhbmciOiJlbiIsImlhdCI6MTc1NDQ2NTE4NSwiZXhwIjoxNzU1MDY5OTg1fQ.2N9GgJXGISilpPUd3k6i7-AmQgcTNWTQdpmRMW6UVX8',
  USER_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTJlY2Y0YzhmN2E3YjJjNzAzZTMwNiIsImxhbmciOiJlbiIsImlhdCI6MTc1NDQ2MzczMSwiZXhwIjoxNzU1MDY4NTMxfQ.xIzOgB49s9kdFUNrLeRBaAr5RRlZjrKLxl9EQecr4qw',
};
