# Elite Models Backend - Test Suite

This directory contains comprehensive test files for the Elite Models Backend application, with a focus on testing the dual-language functionality.

## Overview

The test suite is designed to validate the dual-language feature implementation, which supports both English and Arabic content for all products and user interfaces.

## Test Files

### Core Dual-Language Tests

#### `test-dual-language.js`
Comprehensive testing of the dual-language feature including:
- Language preference updates
- Product creation with dual-language fields
- Product retrieval in different languages
- Fallback behavior
- Language field validation
- All product types in both languages

**Usage:**
```bash
node test/test-dual-language.js
```

#### `test-dual-language-migration.js`
Tests for the dual-language migration functionality:
- Migration validation for existing products
- New product creation with dual-language fields
- Language field validation
- Fallback behavior for missing translations
- User language preference testing

**Usage:**
```bash
node test/test-dual-language-migration.js
```

### Product Management Tests

#### `e2e-product-status-flow.js`
End-to-end testing of product status management with dual-language support:
- Product creation and approval flow
- Status transitions (pending, approved, rejected, revision)
- Dual-language testing for each product status
- Public API access in both languages

**Usage:**
```bash
node test/e2e-product-status-flow.js
```

#### `get-products.js`
Product retrieval testing with dual-language support:
- Public product retrieval in different languages
- Authenticated product retrieval with language override
- Individual product retrieval
- Language field validation
- Product type-specific retrieval

**Usage:**
```bash
node test/get-products.js
```

### Booking System Tests

#### `booking-api.js`
Booking system testing with dual-language support:
- Booking creation and management
- Product information in bookings in different languages
- Consumer and partner booking retrieval
- Language field validation for bookings

**Usage:**
```bash
node test/booking-api.js
```

### Product Creation Tests

#### `create-yacht.js`, `create-resort.js`, `create-jetski.js`, `create-kayak.js`, `create-speedboat.js`
Individual product creation tests with dual-language fields:
- Creates products with both English and Arabic content
- Validates all dual-language fields are properly set
- Tests product-specific fields (amenities, safety features, etc.)

**Usage:**
```bash
node test/create-yacht.js
node test/create-resort.js
node test/create-jetski.js
node test/create-kayak.js
node test/create-speedboat.js
```

### Utility Tests

#### `approve-product.js`, `reject-product.js`, `revision-product.js`, `resubmit-product.js`
Product status management utility tests:
- Approve, reject, revision, and resubmit products
- Test status transitions with dual-language support

**Usage:**
```bash
node test/approve-product.js
node test/reject-product.js
node test/revision-product.js
node test/resubmit-product.js
```

## Configuration

### `config.js`
Central configuration file containing:
- Base URL for the API
- Test data for all product types with dual-language content
- Authentication tokens for different user roles
- Test image creation utility

**Key Configuration:**
- `BASE_URL`: API endpoint (default: http://localhost:8080)
- `testData`: Dual-language test data for all product types
- `PARTNER_1_TOKEN`, `PARTNER_2_TOKEN`, `ADMIN_TOKEN`, `USER_TOKEN`: Authentication tokens

## Running Tests

### Using the Test Runner Script

The easiest way to run tests is using the main test runner:

```bash
./run-tests.sh
```

This will present you with options to run different test suites.

### Running Individual Tests

You can also run individual test files directly:

```bash
# Run comprehensive dual-language tests
node test/run-dual-language-tests.js

# Run specific test suites
node test/test-dual-language.js
node test/e2e-product-status-flow.js
node test/booking-api.js
node test/test-dual-language-migration.js
```

### Running All Tests

To run all tests in sequence:

```bash
./run-tests.sh
# Select option 6: All Tests
```

## Test Data

The test suite includes comprehensive dual-language test data for all product types:

### Yacht Test Data
- English: "Luxury Ocean Pearl"
- Arabic: "لؤلؤة المحيط الفاخرة"
- Includes descriptions, policies, location, and tags in both languages

### Resort Test Data
- English: "Paradise Beach Resort"
- Arabic: "منتجع شاطئ الجنة"
- Includes amenities and safety features in both languages

### Other Product Types
- Jetski, Kayak, and Speedboat test data with appropriate dual-language content

## Dual-Language Feature Testing

### Language Fields Tested
- `titleEn` / `titleAr`
- `descriptionEn` / `descriptionAr`
- `cancellationPolicyEn` / `cancellationPolicyAr`
- `termsAndConditionsEn` / `termsAndConditionsAr`
- `cityEn` / `cityAr`
- `regionEn` / `regionAr`
- `countryEn` / `countryAr`
- `addressEn` / `addressAr`
- `tagsEn` / `tagsAr`
- `amenitiesEn` / `amenitiesAr` (resorts)
- `safetyFeaturesEn` / `safetyFeaturesAr` (resorts)

### API Endpoints Tested
- `POST /auth/update-language` - Language preference updates
- `GET /products/public?lang=ar` - Public product retrieval
- `GET /products?lang=ar` - Authenticated product retrieval
- `GET /products/{type}/{id}?lang=ar` - Individual product retrieval
- All booking-related endpoints with language support

### Validation Tests
- Language field cleaning (ensuring language-specific fields are not returned)
- Fallback behavior for missing translations
- Token-based language preference
- Query parameter language override

## Prerequisites

1. **Node.js**: Ensure Node.js is installed
2. **Server Running**: Start the NestJS server with `npm run start:dev`
3. **Dependencies**: Install axios if not already installed
4. **Migration**: Run the migration script if needed: `node migrate-to-dual-language.js`

## Troubleshooting

### Common Issues

1. **Server Not Running**
   - Ensure the NestJS server is running on http://localhost:8080
   - Update BASE_URL in config.js if using a different port

2. **Authentication Errors**
   - Update tokens in config.js with valid JWT tokens
   - Ensure tokens have appropriate permissions

3. **Migration Issues**
   - Run the migration script: `node migrate-to-dual-language.js`
   - Check that existing products have dual-language fields

4. **Test Failures**
   - Check server logs for errors
   - Verify database connection
   - Ensure all required environment variables are set

### Debug Mode

To run tests with more verbose output, you can modify the test files to include additional logging or use Node.js debug mode:

```bash
node --inspect test/test-dual-language.js
```

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Include dual-language testing for new features
3. Update this README with new test documentation
4. Ensure tests are comprehensive and cover edge cases
5. Include proper error handling and validation

## Related Documentation

- `DUAL_LANGUAGE_FEATURE.md` - Detailed feature documentation
- `migrate-to-dual-language.js` - Migration script for existing data
- Main application README for setup instructions 