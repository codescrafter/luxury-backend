# Dual-Language Response Examples

## Overview

This document shows example responses for the dual-language implementation with and without the `lang` parameter.

## API Endpoints

All product endpoints now support dual-language responses:
- `GET /products/pending`
- `GET /products/approved` 
- `GET /products/rejected`
- `GET /products`
- `GET /products/public`

## Example 1: Pure Dual-Language Response (No `lang` parameter)

### Request
```http
GET /products/pending
Authorization: Bearer <token>
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "type": "yacht",
      "status": "pending",
      "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
      
      // Language-specific fields (both preserved)
      "titleEn": "Luxury Ocean Pearl",
      "titleAr": "لؤلؤة المحيط الفاخرة",
      "descriptionEn": "Experience ultimate luxury on the water with this premium yacht featuring state-of-the-art amenities and professional crew.",
      "descriptionAr": "عش الفخامة القصوى على الماء مع هذه اليخت المميز المزود بأحدث المرافق وطاقم محترف.",
      
      "cancellationPolicyEn": ["72hr notice", "50% refund", "Weather dependent"],
      "cancellationPolicyAr": ["إشعار 72 ساعة", "استرداد 50%", "يعتمد على الطقس"],
      
      "termsAndConditionsEn": ["No pets", "No smoking on deck", "Professional captain required"],
      "termsAndConditionsAr": ["لا حيوانات أليفة", "لا تدخين على سطح السفينة", "قبطان محترف مطلوب"],
      
      "cityEn": "Dubai",
      "cityAr": "دبي",
      "regionEn": "Dubai",
      "regionAr": "دبي",
      "countryEn": "UAE",
      "countryAr": "الإمارات",
      "addressEn": "Marina Bay, Palm Jumeirah",
      "addressAr": "خليج المارينا، نخلة جميرا",
      
      "tagsEn": ["luxury", "party", "family", "corporate"],
      "tagsAr": ["فخامة", "حفلة", "عائلة", "شركات"],
      
      // Product-specific fields
      "pricePerHour": 500,
      "pricePerDay": 5000,
      "capacity": 12,
      "maxSpeed": 25,
      "brand": "Azimut",
      "modelYear": 2023,
      
      // Timestamps
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "type": "resort",
      "status": "pending",
      "ownerId": "64f8a1b2c3d4e5f6a7b8c9d3",
      
      // Language-specific fields
      "titleEn": "Paradise Beach Resort",
      "titleAr": "منتجع شاطئ الجنة",
      "descriptionEn": "Experience paradise at our luxurious beach resort with private beach access and world-class amenities.",
      "descriptionAr": "عش الجنة في منتجعنا الفاخر على الشاطئ مع إمكانية الوصول الخاص للشاطئ ومرافق عالمية المستوى.",
      
      "amenitiesEn": ["Private Beach", "Infinity Pool", "Spa", "Restaurant", "Gym"],
      "amenitiesAr": ["شاطئ خاص", "مسبح لانهائي", "سبا", "مطعم", "صالة رياضية"],
      
      "safetyFeaturesEn": ["Fire alarms", "Security cameras", "24/7 security", "First aid kit"],
      "safetyFeaturesAr": ["أجهزة إنذار الحريق", "كاميرات المراقبة", "أمن 24/7", "حقيبة إسعافات أولية"],
      
      "cityEn": "Abu Dhabi",
      "cityAr": "أبو ظبي",
      "regionEn": "Abu Dhabi",
      "regionAr": "أبو ظبي",
      "countryEn": "UAE",
      "countryAr": "الإمارات",
      "addressEn": "Saadiyat Island, Beach Road",
      "addressAr": "جزيرة السعديات، طريق الشاطئ",
      
      // Resort-specific fields
      "dailyPrice": 800,
      "yearlyPrice": 250000,
      "capacity": 50,
      "numberOfRooms": 25,
      "starRating": 5,
      
      "createdAt": "2024-01-15T11:45:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  ]
}
```

### Key Points:
- ✅ **No display fields**: No `title`, `description`, `city`, etc.
- ✅ **Both languages preserved**: `titleEn`/`titleAr`, `descriptionEn`/`descriptionAr`, etc.
- ✅ **Frontend control**: Frontend must handle language switching
- ✅ **Minimal response**: Smaller payload size

---

## Example 2: Dual-Language + Display Response (With `lang=en`)

### Request
```http
GET /products/pending?lang=en
Authorization: Bearer <token>
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "type": "yacht",
      "status": "pending",
      "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "displayLang": "en",
      
      // Display fields (English content)
      "title": "Luxury Ocean Pearl",
      "description": "Experience ultimate luxury on the water with this premium yacht featuring state-of-the-art amenities and professional crew.",
      "cancellationPolicy": ["72hr notice", "50% refund", "Weather dependent"],
      "termsAndConditions": ["No pets", "No smoking on deck", "Professional captain required"],
      "city": "Dubai",
      "region": "Dubai",
      "country": "UAE",
      "address": "Marina Bay, Palm Jumeirah",
      "tags": ["luxury", "party", "family", "corporate"],
      
      // Language-specific fields (both preserved)
      "titleEn": "Luxury Ocean Pearl",
      "titleAr": "لؤلؤة المحيط الفاخرة",
      "descriptionEn": "Experience ultimate luxury on the water with this premium yacht featuring state-of-the-art amenities and professional crew.",
      "descriptionAr": "عش الفخامة القصوى على الماء مع هذه اليخت المميز المزود بأحدث المرافق وطاقم محترف.",
      
      "cancellationPolicyEn": ["72hr notice", "50% refund", "Weather dependent"],
      "cancellationPolicyAr": ["إشعار 72 ساعة", "استرداد 50%", "يعتمد على الطقس"],
      
      "termsAndConditionsEn": ["No pets", "No smoking on deck", "Professional captain required"],
      "termsAndConditionsAr": ["لا حيوانات أليفة", "لا تدخين على سطح السفينة", "قبطان محترف مطلوب"],
      
      "cityEn": "Dubai",
      "cityAr": "دبي",
      "regionEn": "Dubai",
      "regionAr": "دبي",
      "countryEn": "UAE",
      "countryAr": "الإمارات",
      "addressEn": "Marina Bay, Palm Jumeirah",
      "addressAr": "خليج المارينا، نخلة جميرا",
      
      "tagsEn": ["luxury", "party", "family", "corporate"],
      "tagsAr": ["فخامة", "حفلة", "عائلة", "شركات"],
      
      // Product-specific fields
      "pricePerHour": 500,
      "pricePerDay": 5000,
      "capacity": 12,
      "maxSpeed": 25,
      "brand": "Azimut",
      "modelYear": 2023,
      
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "type": "resort",
      "status": "pending",
      "ownerId": "64f8a1b2c3d4e5f6a7b8c9d3",
      "displayLang": "en",
      
      // Display fields (English content)
      "title": "Paradise Beach Resort",
      "description": "Experience paradise at our luxurious beach resort with private beach access and world-class amenities.",
      "amenities": ["Private Beach", "Infinity Pool", "Spa", "Restaurant", "Gym"],
      "safetyFeatures": ["Fire alarms", "Security cameras", "24/7 security", "First aid kit"],
      "city": "Abu Dhabi",
      "region": "Abu Dhabi",
      "country": "UAE",
      "address": "Saadiyat Island, Beach Road",
      
      // Language-specific fields (both preserved)
      "titleEn": "Paradise Beach Resort",
      "titleAr": "منتجع شاطئ الجنة",
      "descriptionEn": "Experience paradise at our luxurious beach resort with private beach access and world-class amenities.",
      "descriptionAr": "عش الجنة في منتجعنا الفاخر على الشاطئ مع إمكانية الوصول الخاص للشاطئ ومرافق عالمية المستوى.",
      
      "amenitiesEn": ["Private Beach", "Infinity Pool", "Spa", "Restaurant", "Gym"],
      "amenitiesAr": ["شاطئ خاص", "مسبح لانهائي", "سبا", "مطعم", "صالة رياضية"],
      
      "safetyFeaturesEn": ["Fire alarms", "Security cameras", "24/7 security", "First aid kit"],
      "safetyFeaturesAr": ["أجهزة إنذار الحريق", "كاميرات المراقبة", "أمن 24/7", "حقيبة إسعافات أولية"],
      
      "cityEn": "Abu Dhabi",
      "cityAr": "أبو ظبي",
      "regionEn": "Abu Dhabi",
      "regionAr": "أبو ظبي",
      "countryEn": "UAE",
      "countryAr": "الإمارات",
      "addressEn": "Saadiyat Island, Beach Road",
      "addressAr": "جزيرة السعديات، طريق الشاطئ",
      
      // Resort-specific fields
      "dailyPrice": 800,
      "yearlyPrice": 250000,
      "capacity": 50,
      "numberOfRooms": 25,
      "starRating": 5,
      
      "createdAt": "2024-01-15T11:45:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  ]
}
```

### Key Points:
- ✅ **Display fields present**: `title`, `description`, `city`, etc. (English content)
- ✅ **displayLang field**: Shows which language is used for display
- ✅ **Both languages preserved**: `titleEn`/`titleAr`, etc.
- ✅ **Backward compatible**: Existing frontend code works

---

## Example 3: Dual-Language + Display Response (With `lang=ar`)

### Request
```http
GET /products/pending?lang=ar
Authorization: Bearer <token>
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "type": "yacht",
      "status": "pending",
      "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "displayLang": "ar",
      
      // Display fields (Arabic content)
      "title": "لؤلؤة المحيط الفاخرة",
      "description": "عش الفخامة القصوى على الماء مع هذه اليخت المميز المزود بأحدث المرافق وطاقم محترف.",
      "cancellationPolicy": ["إشعار 72 ساعة", "استرداد 50%", "يعتمد على الطقس"],
      "termsAndConditions": ["لا حيوانات أليفة", "لا تدخين على سطح السفينة", "قبطان محترف مطلوب"],
      "city": "دبي",
      "region": "دبي",
      "country": "الإمارات",
      "address": "خليج المارينا، نخلة جميرا",
      "tags": ["فخامة", "حفلة", "عائلة", "شركات"],
      
      // Language-specific fields (both preserved)
      "titleEn": "Luxury Ocean Pearl",
      "titleAr": "لؤلؤة المحيط الفاخرة",
      "descriptionEn": "Experience ultimate luxury on the water with this premium yacht featuring state-of-the-art amenities and professional crew.",
      "descriptionAr": "عش الفخامة القصوى على الماء مع هذه اليخت المميز المزود بأحدث المرافق وطاقم محترف.",
      
      "cancellationPolicyEn": ["72hr notice", "50% refund", "Weather dependent"],
      "cancellationPolicyAr": ["إشعار 72 ساعة", "استرداد 50%", "يعتمد على الطقس"],
      
      "termsAndConditionsEn": ["No pets", "No smoking on deck", "Professional captain required"],
      "termsAndConditionsAr": ["لا حيوانات أليفة", "لا تدخين على سطح السفينة", "قبطان محترف مطلوب"],
      
      "cityEn": "Dubai",
      "cityAr": "دبي",
      "regionEn": "Dubai",
      "regionAr": "دبي",
      "countryEn": "UAE",
      "countryAr": "الإمارات",
      "addressEn": "Marina Bay, Palm Jumeirah",
      "addressAr": "خليج المارينا، نخلة جميرا",
      
      "tagsEn": ["luxury", "party", "family", "corporate"],
      "tagsAr": ["فخامة", "حفلة", "عائلة", "شركات"],
      
      // Product-specific fields
      "pricePerHour": 500,
      "pricePerDay": 5000,
      "capacity": 12,
      "maxSpeed": 25,
      "brand": "Azimut",
      "modelYear": 2023,
      
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Key Points:
- ✅ **Display fields present**: `title`, `description`, `city`, etc. (Arabic content)
- ✅ **displayLang field**: Shows "ar" for Arabic display
- ✅ **Both languages preserved**: `titleEn`/`titleAr`, etc.
- ✅ **Arabic default**: Display fields show Arabic content

---

## Frontend Usage Examples

### 1. Pure Dual-Language (No `lang` parameter)

```javascript
// Get both languages, handle display yourself
const response = await fetch('/products/pending');
const products = response.data;

// Display in English
function displayInEnglish(product) {
  return {
    title: product.titleEn,
    description: product.descriptionEn,
    city: product.cityEn,
    country: product.countryEn
  };
}

// Display in Arabic
function displayInArabic(product) {
  return {
    title: product.titleAr,
    description: product.descriptionAr,
    city: product.cityAr,
    country: product.countryAr
  };
}

// Switch languages client-side
let currentLang = 'en';
function switchLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  updateUI();
}

function updateUI() {
  products.forEach(product => {
    const displayData = currentLang === 'en' 
      ? displayInEnglish(product) 
      : displayInArabic(product);
    
    // Update UI with displayData
    document.getElementById('title').textContent = displayData.title;
    document.getElementById('description').textContent = displayData.description;
  });
}
```

### 2. Dual-Language + Display (With `lang` parameter)

```javascript
// Get both languages + default display
const userLang = getUserLanguage(); // 'en' or 'ar'
const response = await fetch(`/products/pending?lang=${userLang}`);
const products = response.data;

// Use display fields directly
products.forEach(product => {
  // product.title, product.description are already in user's language
  document.getElementById('title').textContent = product.title;
  document.getElementById('description').textContent = product.description;
});

// Switch to other language
function switchToArabic() {
  products.forEach(product => {
    product.title = product.titleAr;
    product.description = product.descriptionAr;
    product.city = product.cityAr;
    product.country = product.countryAr;
  });
  updateUI();
}

function switchToEnglish() {
  products.forEach(product => {
    product.title = product.titleEn;
    product.description = product.descriptionEn;
    product.city = product.cityEn;
    product.country = product.countryEn;
  });
  updateUI();
}
```

## Comparison Summary

| Feature | No `lang` parameter | With `lang` parameter |
|---------|-------------------|----------------------|
| **Response Size** | Smaller | Larger |
| **Display Fields** | ❌ None | ✅ Present |
| **Language Control** | Frontend only | API + Frontend |
| **Backward Compatibility** | ❌ Requires changes | ✅ Works as-is |
| **Flexibility** | ✅ Maximum | ⚠️ Limited |
| **Ease of Use** | ⚠️ More code | ✅ Less code |

## Recommendation

- **Use no `lang` parameter** when you want complete control and minimal response size
- **Use `lang` parameter** when you want convenience and backward compatibility
- **Both approaches** return both languages, so you can switch client-side in either case

