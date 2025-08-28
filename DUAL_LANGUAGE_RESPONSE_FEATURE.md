# Dual-Language Response Feature

## Overview

The dual-language response feature allows the API to return both English and Arabic language fields in the response while also providing a `displayLang` field that indicates which language should be displayed by default. This enables frontend applications to switch between languages without making additional API calls.

## Features

### ✅ **What's New**

1. **Dual-Language Response**: All product endpoints now return both `titleEn`/`titleAr`, `descriptionEn`/`descriptionAr`, etc.
2. **Display Language Control**: Frontend can specify which language to display using the `lang` query parameter
3. **Backward Compatibility**: Existing functionality remains unchanged
4. **Generic Implementation**: The same pattern can be applied to all product endpoints

### 🎯 **Updated Endpoints**

| Endpoint | Method | Description | Dual-Language Support |
|----------|--------|-------------|----------------------|
| `/products/pending` | GET | Get pending products | ✅ Added |
| `/products/approved` | GET | Get approved products | ✅ Added |
| `/products/rejected` | GET | Get rejected products | ✅ Added |
| `/products` | GET | Get all products (authenticated) | ✅ Added |
| `/products/public` | GET | Get public products | ✅ Added |

## API Usage

### Request Parameters

All endpoints now support an optional `lang` query parameter:

```http
GET /products/pending?lang=en
GET /products/pending?lang=ar
GET /products/pending
```

### Response Format

**Before (Single Language):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123",
      "title": "Luxury Yacht",
      "description": "Experience luxury on the water",
      "city": "Dubai",
      "country": "UAE"
    }
  ]
}
```

**After (Dual Language):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123",
      "displayLang": "en",
      "title": "Luxury Yacht",
      "description": "Experience luxury on the water",
      "city": "Dubai",
      "country": "UAE",
      "titleEn": "Luxury Yacht",
      "titleAr": "يخت فاخر",
      "descriptionEn": "Experience luxury on the water",
      "descriptionAr": "عش الفخامة على الماء",
      "cityEn": "Dubai",
      "cityAr": "دبي",
      "countryEn": "UAE",
      "countryAr": "الإمارات"
    }
  ]
}
```

## Implementation Details

### 1. Helper Functions

**New Functions Added:**
- `transformProductForDualLanguage()`: Transforms a single product to include both languages
- `transformProductsArrayForDualLanguage()`: Transforms an array of products

**Key Features:**
- Preserves both language fields (`titleEn`, `titleAr`, etc.)
- Sets display fields based on `displayLang` parameter
- Adds `displayLang` field to response
- Maintains backward compatibility

### 2. Service Methods

**New Methods Added:**
- `getProductsWithDualLanguage()`: Get approved products with dual-language support
- `getProductsByOwnerAndStatusWithDualLanguage()`: Get products by status with dual-language support

### 3. Controller Updates

**Updated Endpoints:**
- All product listing endpoints now accept `lang` query parameter
- Default language falls back to user's preferred language or 'en'
- Uses new dual-language service methods

## Frontend Integration

### Language Switching

Frontend can now switch languages without additional API calls:

```javascript
// Get products with English display
const englishProducts = await fetch('/products/pending?lang=en');

// Get products with Arabic display  
const arabicProducts = await fetch('/products/pending?lang=ar');

// Both responses contain both language fields
// Frontend can switch display language client-side
```

### Client-Side Language Switching

```javascript
function switchLanguage(product, newLang) {
  if (newLang === 'ar') {
    return {
      ...product,
      title: product.titleAr,
      description: product.descriptionAr,
      city: product.cityAr,
      country: product.countryAr
    };
  } else {
    return {
      ...product,
      title: product.titleEn,
      description: product.descriptionEn,
      city: product.cityEn,
      country: product.countryEn
    };
  }
}
```

## Testing

### Test File
- `test/test-dual-language-response.js`: Comprehensive test for dual-language functionality

### Test Coverage
- ✅ English language response
- ✅ Arabic language response
- ✅ Default language fallback
- ✅ Language field preservation
- ✅ Display language setting
- ✅ Multiple endpoint testing

## Migration Guide

### For Existing Frontend Code

**No Breaking Changes**: Existing code will continue to work as before.

**Optional Enhancement**: Add `lang` parameter to requests for better user experience:

```javascript
// Before
const products = await fetch('/products/pending');

// After (optional enhancement)
const products = await fetch('/products/pending?lang=ar');
```

### For New Frontend Code

**Recommended Approach**: Use the `lang` parameter and leverage both language fields:

```javascript
// Get products with user's preferred language
const userLang = getUserLanguage(); // 'en' or 'ar'
const response = await fetch(`/products/pending?lang=${userLang}`);
const products = response.data;

// Display products in user's language
products.forEach(product => {
  displayProduct(product); // Uses product.title, product.description, etc.
});

// Allow language switching without API calls
function switchToArabic() {
  products.forEach(product => {
    product.title = product.titleAr;
    product.description = product.descriptionAr;
    // ... update other fields
  });
  updateUI();
}
```

## Benefits

### 🚀 **Performance**
- Reduced API calls for language switching
- Faster user experience
- Better caching opportunities

### 🎨 **User Experience**
- Instant language switching
- Consistent language across the app
- Better accessibility

### 🔧 **Developer Experience**
- Simple API integration
- Flexible frontend implementation
- Backward compatible

### 🌐 **Internationalization**
- Proper dual-language support
- Fallback mechanisms
- Consistent language handling

## Future Enhancements

The same pattern can be easily applied to other endpoints:

1. **Individual Product Endpoints**: `/products/jetski/:id`, `/products/yacht/:id`, etc.
2. **Booking Endpoints**: Booking details, user preferences
3. **User Profile Endpoints**: User information, preferences
4. **Notification Endpoints**: System messages, alerts

## Technical Notes

### Language Priority
1. Query parameter `lang` (highest priority)
2. User's preferred language from JWT token
3. Default to 'en' (fallback)

### Field Mapping
All translatable fields follow the same pattern:
- `fieldNameEn` / `fieldNameAr` (source fields)
- `fieldName` (display field based on `displayLang`)

### Performance Considerations
- No additional database queries
- Minimal memory overhead
- Efficient transformation functions

