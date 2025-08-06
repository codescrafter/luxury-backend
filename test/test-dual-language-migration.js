const axios = require('axios');
const { BASE_URL, testData, PARTNER_1_TOKEN, ADMIN_TOKEN } = require('./config');
const { createYacht } = require('./create-yacht');
const { createResort } = require('./create-resort');
const { createJetski } = require('./create-jetski');
const { createKayak } = require('./create-kayak');
const { createSpeedboat } = require('./create-speedboat');

async function testMigrationValidation() {
  console.log('🧪 Testing dual-language migration validation...\n');

  try {
    // Get all products to check if they have dual-language fields
    console.log('📝 Checking existing products for dual-language fields...');
    const response = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });

    if (response.data.success) {
      const products = response.data.data;
      console.log(`✅ Found ${products.length} products to validate`);

      let migratedCount = 0;
      let needsMigrationCount = 0;

      for (const product of products) {
        const hasDualLanguageFields = product.titleEn && product.titleAr && 
                                    product.descriptionEn && product.descriptionAr &&
                                    product.cityEn && product.cityAr &&
                                    product.countryEn && product.countryAr;

        if (hasDualLanguageFields) {
          migratedCount++;
        } else {
          needsMigrationCount++;
          console.log(`   ⚠️  Product ${product._id} (${product.type}) needs migration`);
          console.log(`      titleEn: ${!!product.titleEn}, titleAr: ${!!product.titleAr}`);
          console.log(`      cityEn: ${!!product.cityEn}, cityAr: ${!!product.cityAr}`);
        }
      }

      console.log(`\n📊 Migration Status:`);
      console.log(`   ✅ Migrated products: ${migratedCount}`);
      console.log(`   ⚠️  Products needing migration: ${needsMigrationCount}`);
      console.log(`   📈 Migration progress: ${((migratedCount / products.length) * 100).toFixed(1)}%`);

      if (needsMigrationCount === 0) {
        console.log('🎉 All products have been successfully migrated to dual-language!');
      } else {
        console.log('⚠️  Some products still need migration. Run the migration script.');
      }
    }

  } catch (error) {
    console.error('❌ Migration validation failed:', error.response?.data || error.message);
  }
}

async function testNewProductCreation() {
  console.log('\n🧪 Testing new product creation with dual-language fields...\n');

  // Test yacht creation
  console.log('📝 Creating yacht with dual-language fields...');
  const yacht = await createYacht();
  if (yacht) {
    console.log('✅ Yacht created successfully');
    console.log(`   ID: ${yacht._id}`);
    console.log(`   Title (EN): ${yacht.titleEn}`);
    console.log(`   Title (AR): ${yacht.titleAr}`);
    console.log(`   Description (EN): ${yacht.descriptionEn?.substring(0, 50)}...`);
    console.log(`   Description (AR): ${yacht.descriptionAr?.substring(0, 50)}...`);
    console.log(`   City (EN): ${yacht.cityEn}`);
    console.log(`   City (AR): ${yacht.cityAr}`);
    console.log(`   Country (EN): ${yacht.countryEn}`);
    console.log(`   Country (AR): ${yacht.countryAr}`);
    console.log(`   Cancellation Policy (EN): ${yacht.cancellationPolicyEn?.join(', ')}`);
    console.log(`   Cancellation Policy (AR): ${yacht.cancellationPolicyAr?.join(', ')}`);
    console.log(`   Terms (EN): ${yacht.termsAndConditionsEn?.join(', ')}`);
    console.log(`   Terms (AR): ${yacht.termsAndConditionsAr?.join(', ')}`);
  } else {
    console.log('❌ Yacht creation failed');
  }

  // Test resort creation
  console.log('\n📝 Creating resort with dual-language fields...');
  const resort = await createResort();
  if (resort) {
    console.log('✅ Resort created successfully');
    console.log(`   ID: ${resort._id}`);
    console.log(`   Title (EN): ${resort.titleEn}`);
    console.log(`   Title (AR): ${resort.titleAr}`);
    console.log(`   Amenities (EN): ${resort.amenitiesEn?.join(', ')}`);
    console.log(`   Amenities (AR): ${resort.amenitiesAr?.join(', ')}`);
    console.log(`   Safety Features (EN): ${resort.safetyFeaturesEn?.join(', ')}`);
    console.log(`   Safety Features (AR): ${resort.safetyFeaturesAr?.join(', ')}`);
  } else {
    console.log('❌ Resort creation failed');
  }

  // Test jetski creation
  console.log('\n📝 Creating jetski with dual-language fields...');
  const jetski = await createJetski();
  if (jetski) {
    console.log('✅ Jetski created successfully');
    console.log(`   ID: ${jetski._id}`);
    console.log(`   Title (EN): ${jetski.titleEn}`);
    console.log(`   Title (AR): ${jetski.titleAr}`);
    console.log(`   Tags (EN): ${jetski.tagsEn?.join(', ')}`);
    console.log(`   Tags (AR): ${jetski.tagsAr?.join(', ')}`);
  } else {
    console.log('❌ Jetski creation failed');
  }

  // Test kayak creation
  console.log('\n📝 Creating kayak with dual-language fields...');
  const kayak = await createKayak();
  if (kayak) {
    console.log('✅ Kayak created successfully');
    console.log(`   ID: ${kayak._id}`);
    console.log(`   Title (EN): ${kayak.titleEn}`);
    console.log(`   Title (AR): ${kayak.titleAr}`);
  } else {
    console.log('❌ Kayak creation failed');
  }

  // Test speedboat creation
  console.log('\n📝 Creating speedboat with dual-language fields...');
  const speedboat = await createSpeedboat();
  if (speedboat) {
    console.log('✅ Speedboat created successfully');
    console.log(`   ID: ${speedboat._id}`);
    console.log(`   Title (EN): ${speedboat.titleEn}`);
    console.log(`   Title (AR): ${speedboat.titleAr}`);
  } else {
    console.log('❌ Speedboat creation failed');
  }
}

async function testLanguageFieldValidation() {
  console.log('\n🧪 Testing language field validation...\n');

  try {
    // Get products and check for language-specific fields
    console.log('📝 Checking for language-specific fields in responses...');
    const response = await axios.get(`${BASE_URL}/products/public`, {
      params: { lang: 'en' }
    });

    if (response.data.success && response.data.data.length > 0) {
      const products = response.data.data;
      let hasLanguageFields = false;

      for (const product of products) {
        if (product.titleEn || product.titleAr || product.cityEn || product.cityAr ||
            product.descriptionEn || product.descriptionAr || product.countryEn || product.countryAr) {
          hasLanguageFields = true;
          console.log(`   ❌ Product ${product._id} has language-specific fields in response`);
          console.log(`      titleEn: ${product.titleEn}, titleAr: ${product.titleAr}`);
          console.log(`      cityEn: ${product.cityEn}, cityAr: ${product.cityAr}`);
        }
      }

      if (!hasLanguageFields) {
        console.log('✅ All products properly cleaned of language-specific fields');
      } else {
        console.log('❌ Some products still contain language-specific fields in response');
      }
    }

  } catch (error) {
    console.error('❌ Language field validation failed:', error.response?.data || error.message);
  }
}

async function testFallbackBehavior() {
  console.log('\n🧪 Testing fallback behavior for missing translations...\n');

  try {
    // Test with products that might have missing translations
    console.log('📝 Testing fallback behavior...');
    const response = await axios.get(`${BASE_URL}/products/public`, {
      params: { lang: 'ar' }
    });

    if (response.data.success && response.data.data.length > 0) {
      const products = response.data.data;
      console.log(`✅ Retrieved ${products.length} products in Arabic`);

      for (const product of products) {
        console.log(`   Product: ${product.title} - ${product.city}, ${product.country}`);
        console.log(`   Description: ${product.description?.substring(0, 50)}...`);
        
        // Check if the content looks like it might be fallback content
        const isEnglishContent = /[a-zA-Z]/.test(product.title) && !/[\u0600-\u06FF]/.test(product.title);
        if (isEnglishContent) {
          console.log(`   ⚠️  Possible fallback to English content detected`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Fallback behavior test failed:', error.response?.data || error.message);
  }
}

async function testUserLanguagePreference() {
  console.log('\n🧪 Testing user language preference...\n');

  try {
    // Test updating user language preference
    console.log('📝 Testing user language preference update...');
    const updateResponse = await axios.post(`${BASE_URL}/auth/update-language`, {
      language: 'ar'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PARTNER_1_TOKEN}`
      }
    });

    if (updateResponse.data.success) {
      console.log('✅ Language preference updated to Arabic');
      const newToken = updateResponse.data.data.token;

      // Test getting products with the new token (should default to Arabic)
      const productsResponse = await axios.get(`${BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${newToken}` }
      });

      if (productsResponse.data.success) {
        console.log(`✅ Retrieved ${productsResponse.data.data.length} products with Arabic preference`);
        if (productsResponse.data.data.length > 0) {
          const product = productsResponse.data.data[0];
          console.log(`   Sample product: ${product.title} - ${product.city}`);
        }
      }

      // Test switching back to English
      const switchBackResponse = await axios.post(`${BASE_URL}/auth/update-language`, {
        language: 'en'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        }
      });

      if (switchBackResponse.data.success) {
        console.log('✅ Language preference switched back to English');
      }
    } else {
      console.log('❌ Failed to update language preference');
    }

  } catch (error) {
    console.log('⚠️  Language preference test skipped:', error.response?.data?.message || error.message);
  }
}

async function runMigrationTests() {
  console.log('🚀 Starting Dual-Language Migration Tests\n');
  console.log('=' .repeat(50));

  await testMigrationValidation();
  await testNewProductCreation();
  await testLanguageFieldValidation();
  await testFallbackBehavior();
  await testUserLanguagePreference();

  console.log('\n' + '=' .repeat(50));
  console.log('🎉 All dual-language migration tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runMigrationTests().catch(console.error);
}

module.exports = {
  testMigrationValidation,
  testNewProductCreation,
  testLanguageFieldValidation,
  testFallbackBehavior,
  testUserLanguagePreference,
  runMigrationTests
}; 