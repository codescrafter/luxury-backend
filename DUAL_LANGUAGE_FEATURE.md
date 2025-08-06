# Dual-Language Feature Implementation

This document describes the implementation of the dual-language feature (English and Arabic) in the Elite Models Backend application.

## Overview

The dual-language feature allows the application to serve content in both English and Arabic based on the user's language preference. The language preference is stored in the user's profile and included in JWT tokens. Additionally, public APIs support a `lang` query parameter for language selection.

## Schema Changes

### User Schema
- Added `language` field with default value 'en' and enum ['en', 'ar']

### Product Schemas
All product entities (Yacht, Resort, Jetski, Kayak, Speedboat) have been updated to include dual-language fields:

**Basic Content:**
- `titleEn` and `titleAr` fields
- `descriptionEn` and `descriptionAr` fields

**Policies and Terms:**
- `cancellationPolicyEn` and `cancellationPolicyAr` fields
- `termsAndConditionsEn` and `termsAndConditionsAr` fields

**Location Information:**
- `cityEn` and `cityAr` fields
- `regionEn` and `regionAr` fields
- `countryEn` and `countryAr` fields
- `addressEn` and `addressAr` fields

**Additional Content:**
- `tagsEn` and `tagsAr` fields
- `amenitiesEn` and `amenitiesAr` fields (Resort only)
- `safetyFeaturesEn` and `safetyFeaturesAr` fields (Resort only)

## Authentication Changes

### JWT Token
- JWT tokens now include a `lang` field representing the user's language preference
- The `lang` field is extracted from the user's `language` field in the database

### JWT Strategy
- Updated to include language information in the user object returned from token validation
- The `lang` field is available in `req.user.lang` in protected routes

## API Endpoints

### New Endpoints

#### Update Language Preference
```
POST /auth/update-language
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "ar" // or "en"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_with_updated_language"
  }
}
```

#### Public Products Endpoint
```
GET /products/public?lang=ar
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "title": "Arabic Title",
      "description": "Arabic Description",
      "city": "Arabic City",
      "country": "Arabic Country",
      // ... other fields in Arabic
    }
  ]
}
```

### Updated Endpoints

All product-related GET endpoints now support language selection via:
1. **Token-based language** (default): Uses `req.user.lang` from JWT token
2. **Query parameter override**: `?lang=ar` or `?lang=en` to override token language

**Protected Endpoints:**
- `GET /products?lang=ar` - Returns all approved products
- `GET /products/pending?lang=ar` - Returns pending products
- `GET /products/approved?lang=ar` - Returns approved products

**Public Endpoints (No Authentication Required):**
- `GET /products/public?lang=ar` - Returns all approved products
- `GET /products/jetski/:id?lang=ar` - Returns specific jetski
- `GET /products/kayak/:id?lang=ar` - Returns specific kayak
- `GET /products/yacht/:id?lang=ar` - Returns specific yacht
- `GET /products/speedboat/:id?lang=ar` - Returns specific speedboat
- `GET /products/resort/:id?lang=ar` - Returns specific resort

## Data Transformation

### Helper Functions
The application includes helper functions in `src/helpers/dto-helpers.ts`:

- `transformProductForLanguage(product, lang)` - Transforms a single product
- `transformProductsArrayForLanguage(products, lang)` - Transforms an array of products

### Transformation Logic
The transformation handles all dual-language fields:

**Basic Content:**
- For Arabic (`lang = 'ar'`): Returns `titleAr` and `descriptionAr` as `title` and `description`
- For English (`lang = 'en'`): Returns `titleEn` and `descriptionEn` as `title` and `description`

**Policies and Terms:**
- `cancellationPolicy` and `termsAndConditions` are transformed based on language

**Location Fields:**
- `city`, `region`, `country`, `address` are transformed based on language

**Additional Content:**
- `tags`, `amenities` (resorts), `safetyFeatures` (resorts) are transformed based on language

**Fallback Logic:**
- Falls back to the other language if the preferred language field is empty
- Falls back to original field values if both language fields are empty
- Removes all language-specific fields from the response

## DTO Updates

All Create and Update DTOs for products now require dual-language fields:

**Required Fields:**
- `titleEn` and `titleAr`
- `descriptionEn` and `descriptionAr`
- `cancellationPolicyEn` and `cancellationPolicyAr`
- `termsAndConditionsEn` and `termsAndConditionsAr`
- `cityEn` and `cityAr`
- `regionEn` and `regionAr`
- `countryEn` and `countryAr`
- `addressEn` and `addressAr`

**Optional Fields:**
- `tagsEn` and `tagsAr`
- `amenitiesEn` and `amenitiesAr` (resorts)
- `safetyFeaturesEn` and `safetyFeaturesAr` (resorts)

## Migration

### Running the Migration
To migrate existing data to support dual-language:

```bash
node migrate-to-dual-language.js
```

The migration script will:
1. Copy existing content to both language fields (English and Arabic)
2. Set default language to 'en' for all users
3. Use Arabic placeholder text for Arabic fields if no translation is available
4. Handle all dual-language fields including policies, location, and additional content

## Frontend Integration

### Language Switching
1. Call `POST /auth/update-language` with the new language preference
2. Use the returned new token for subsequent requests
3. Update the stored token in your frontend application

### Public API Usage
For public access (no authentication required):
```javascript
// Get all products in Arabic without authentication
const response = await fetch('/products/public?lang=ar');
const products = await response.json();

// Get specific product in Arabic without authentication
const yachtResponse = await fetch('/products/yacht/123?lang=ar');
const yacht = await yachtResponse.json();

const resortResponse = await fetch('/products/resort/456?lang=ar');
const resort = await resortResponse.json();
```

### Protected API Usage
For authenticated users:
```javascript
// Use token language (default)
const response = await fetch('/products', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Override with query parameter
const response = await fetch('/products?lang=ar', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Token Management
- The frontend should store and use the JWT token returned from the language update endpoint
- All subsequent API calls will automatically return content in the selected language
- Query parameters can override the token language for specific requests

## Example Usage

### Switching to Arabic
```javascript
// Update language preference
const response = await fetch('/auth/update-language', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${currentToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ language: 'ar' })
});

const { data } = await response.json();
const newToken = data.token;

// Use new token for subsequent requests
localStorage.setItem('token', newToken);

// Get products in Arabic
const productsResponse = await fetch('/products', {
  headers: {
    'Authorization': `Bearer ${newToken}`
  }
});
```

### Public API Usage
```javascript
// Get all products in Arabic without authentication
const productsResponse = await fetch('/products/public?lang=ar');
const { data: products } = await productsResponse.json();

// Get specific yacht in Arabic without authentication
const yachtResponse = await fetch('/products/yacht/123?lang=ar');
const { data: yacht } = await yachtResponse.json();

// Get specific resort in English without authentication
const resortResponse = await fetch('/products/resort/456?lang=en');
const { data: resort } = await resortResponse.json();
```

## Error Handling

- If a user's language preference is not set, it defaults to 'en'
- If language-specific content is missing, the system falls back to the other language
- If both language fields are empty, the original field values are used
- Query parameter language values are validated and default to 'en' if invalid

## Testing

### Manual Testing
1. Create a user account
2. Update language preference using the new endpoint
3. Verify that product listings return content in the selected language
4. Switch language and verify the content changes
5. Test public endpoints with different language parameters

### API Testing
Use the provided test scripts in the `test/` directory to verify the functionality.

## Notes

- The migration script should be run before deploying the new version
- Existing products will have the same content in both languages until manually updated
- The system gracefully handles missing translations by falling back to available content
- Public APIs support language selection without authentication
- All dual-language fields are properly transformed and cleaned from responses 