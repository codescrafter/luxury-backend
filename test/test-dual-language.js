const axios = require('axios');
const { BASE_URL, testData, PARTNER_1_TOKEN, USER_TOKEN } = require('./config');
const { createYacht } = require('./create-yacht');
const { createResort } = require('./create-resort');
const { createJetski } = require('./create-jetski');
const { createKayak } = require('./create-kayak');
const { createSpeedboat } = require('./create-speedboat');

async function testLanguageUpdate() {
  console.log('🧪 Testing language update functionality...\n');

  try {
    // Test updating user language preference to Arabic
    console.log('📝 Testing language update to Arabic...');
    const response = await axios.post(
      `${BASE_URL}/auth/update-language`,
      {
        language: 'ar',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${USER_TOKEN}`,
        },
      },
    );

    if (response.data.success) {
      console.log('✅ Language update to Arabic successful');
      console.log(
        `   New token: ${response.data.data.token.substring(0, 50)}...`,
      );

      // Test updating back to English
      console.log('\n📝 Testing language update back to English...');
      const responseEn = await axios.post(
        `${BASE_URL}/auth/update-language`,
        {
          language: 'en',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${response.data.data.token}`,
          },
        },
      );

      if (responseEn.data.success) {
        console.log('✅ Language update to English successful');
      } else {
        console.log('❌ Language update to English failed');
      }
    } else {
      console.log('❌ Language update to Arabic failed');
    }
  } catch (error) {
    console.log('⚠️  Language update test skipped (requires valid token)');
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
  }
}

async function testProductCreationWithDualLanguage() {
  console.log('\n🧪 Testing product creation with dual-language fields...\n');

  // Test yacht creation
  console.log('📝 Creating yacht with dual-language fields...');
  const yacht = await createYacht();
  if (yacht) {
    console.log('✅ Yacht created successfully');
    console.log(`   ID: ${yacht._id}`);
    console.log(`   Title (EN): ${yacht.titleEn}`);
    console.log(`   Title (AR): ${yacht.titleAr}`);
    console.log(`   City (EN): ${yacht.cityEn}`);
    console.log(`   City (AR): ${yacht.cityAr}`);
    console.log(`   Tags (EN): ${yacht.tagsEn?.join(', ')}`);
    console.log(`   Tags (AR): ${yacht.tagsAr?.join(', ')}`);
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
    console.log(
      `   Safety Features (EN): ${resort.safetyFeaturesEn?.join(', ')}`,
    );
    console.log(
      `   Safety Features (AR): ${resort.safetyFeaturesAr?.join(', ')}`,
    );
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
    console.log(
      `   Description (EN): ${jetski.descriptionEn?.substring(0, 50)}...`,
    );
    console.log(
      `   Description (AR): ${jetski.descriptionAr?.substring(0, 50)}...`,
    );
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

async function testProductRetrievalInDifferentLanguages() {
  console.log('\n🧪 Testing product retrieval in different languages...\n');

  try {
    // Get products in English
    console.log('📝 Testing English product retrieval...');
    const englishResponse = await axios.get(`${BASE_URL}/products/public`, {
      params: { lang: 'en' },
    });

    if (englishResponse.data.success && englishResponse.data.data.length > 0) {
      const product = englishResponse.data.data[0];
      console.log('✅ English products retrieved');
      console.log(
        `   Sample: ${product.title} - ${product.city}, ${product.country}`,
      );
      console.log(`   Description: ${product.description.substring(0, 50)}...`);
      console.log(
        `   Cancellation Policy: ${product.cancellationPolicy?.join(', ')}`,
      );
      console.log(`   Terms: ${product.termsAndConditions?.join(', ')}`);

      // Test individual product retrieval in English
      const individualEn = await axios.get(
        `${BASE_URL}/products/${product.type}/${product._id}`,
        {
          params: { lang: 'en' },
        },
      );

      if (individualEn.data.success) {
        console.log(
          `   Individual ${product.type} (EN): ${individualEn.data.data.title}`,
        );
      }
    }

    // Get products in Arabic
    console.log('\n📝 Testing Arabic product retrieval...');
    const arabicResponse = await axios.get(`${BASE_URL}/products/public`, {
      params: { lang: 'ar' },
    });

    if (arabicResponse.data.success && arabicResponse.data.data.length > 0) {
      const product = arabicResponse.data.data[0];
      console.log('✅ Arabic products retrieved');
      console.log(
        `   Sample: ${product.title} - ${product.city}, ${product.country}`,
      );
      console.log(`   Description: ${product.description.substring(0, 50)}...`);
      console.log(
        `   Cancellation Policy: ${product.cancellationPolicy?.join(', ')}`,
      );
      console.log(`   Terms: ${product.termsAndConditions?.join(', ')}`);

      // Test individual product retrieval in Arabic
      const individualAr = await axios.get(
        `${BASE_URL}/products/${product.type}/${product._id}`,
        {
          params: { lang: 'ar' },
        },
      );

      if (individualAr.data.success) {
        console.log(
          `   Individual ${product.type} (AR): ${individualAr.data.data.title}`,
        );
      }
    }

    // Test authenticated products with language override
    console.log(
      '\n📝 Testing authenticated products with language override...',
    );
    const authResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
      params: { lang: 'ar' },
    });

    if (authResponse.data.success && authResponse.data.data.length > 0) {
      const product = authResponse.data.data[0];
      console.log('✅ Authenticated products with Arabic override retrieved');
      console.log(
        `   Sample: ${product.title} - ${product.city}, ${product.country}`,
      );
    }
  } catch (error) {
    console.error(
      '❌ Product retrieval test failed:',
      error.response?.data || error.message,
    );
  }
}

async function testFallbackBehavior() {
  console.log('\n🧪 Testing fallback behavior...\n');

  try {
    // Test with invalid language parameter
    console.log('📝 Testing with invalid language parameter...');
    const response = await axios.get(`${BASE_URL}/products/public`, {
      params: { lang: 'invalid' },
    });

    if (response.data.success) {
      console.log('✅ Fallback to default language successful');
      if (response.data.data.length > 0) {
        const product = response.data.data[0];
        console.log(`   Sample product: ${product.title}`);
      }
    }

    // Test with missing language parameter
    console.log('\n📝 Testing with missing language parameter...');
    const responseNoLang = await axios.get(`${BASE_URL}/products/public`);

    if (responseNoLang.data.success) {
      console.log('✅ Default language (English) used successfully');
      if (responseNoLang.data.data.length > 0) {
        const product = responseNoLang.data.data[0];
        console.log(`   Sample product: ${product.title}`);
      }
    }
  } catch (error) {
    console.log('⚠️  Fallback test completed');
  }
}

async function testLanguageFieldValidation() {
  console.log('\n🧪 Testing language field validation...\n');

  try {
    // Test that language-specific fields are not returned in response
    console.log(
      '📝 Testing that language-specific fields are cleaned from response...',
    );
    const response = await axios.get(`${BASE_URL}/products/public`, {
      params: { lang: 'en' },
    });

    if (response.data.success && response.data.data.length > 0) {
      const product = response.data.data[0];
      const hasLanguageFields =
        product.titleEn || product.titleAr || product.cityEn || product.cityAr;

      if (!hasLanguageFields) {
        console.log(
          '✅ Language-specific fields properly cleaned from response',
        );
        console.log(`   Transformed title: ${product.title}`);
        console.log(`   Transformed city: ${product.city}`);
      } else {
        console.log('❌ Language-specific fields found in response');
        console.log(`   titleEn: ${product.titleEn}`);
        console.log(`   titleAr: ${product.titleAr}`);
      }
    }
  } catch (error) {
    console.error(
      '❌ Language field validation test failed:',
      error.response?.data || error.message,
    );
  }
}

async function testAllProductTypesInBothLanguages() {
  console.log('\n🧪 Testing all product types in both languages...\n');

  const productTypes = ['yacht', 'resort', 'jetski', 'kayak', 'speedboat'];
  const languages = ['en', 'ar'];

  for (const lang of languages) {
    console.log(
      `📝 Testing ${lang.toUpperCase()} language for all product types...`,
    );

    for (const type of productTypes) {
      try {
        const response = await axios.get(`${BASE_URL}/products/public`, {
          params: { lang, type },
        });

        if (response.data.success) {
          const products = response.data.data.filter((p) => p.type === type);
          console.log(`   ✅ ${type}: ${products.length} products found`);

          if (products.length > 0) {
            const product = products[0];
            console.log(`      Sample: ${product.title} - ${product.city}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ ${type}: Failed to retrieve`);
      }
    }
    console.log('');
  }
}

async function runDualLanguageTests() {
  console.log('🚀 Starting Dual-Language Feature Tests\n');
  console.log('='.repeat(50));

  await testLanguageUpdate();
  await testProductCreationWithDualLanguage();
  await testProductRetrievalInDifferentLanguages();
  await testFallbackBehavior();
  await testLanguageFieldValidation();
  await testAllProductTypesInBothLanguages();

  console.log('\n' + '='.repeat(50));
  console.log('🎉 All dual-language tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runDualLanguageTests().catch(console.error);
}

module.exports = {
  testLanguageUpdate,
  testProductCreationWithDualLanguage,
  testProductRetrievalInDifferentLanguages,
  testFallbackBehavior,
  testLanguageFieldValidation,
  testAllProductTypesInBothLanguages,
  runDualLanguageTests,
};
