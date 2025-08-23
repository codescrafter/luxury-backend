const axios = require('axios');
const { BASE_URL, ADMIN_TOKEN } = require('./config');

async function testDualLanguageResponse() {
  console.log('🧪 Testing Dual-Language Response Functionality\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Get pending products with English language
    console.log(
      '📝 Test 1: Getting pending products with English (lang=en)...',
    );
    const englishResponse = await axios.get(`${BASE_URL}/products/pending`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      params: { lang: 'en' },
    });

    if (englishResponse.data.success) {
      const products = englishResponse.data.data;
      console.log(`✅ English response: ${products.length} products found`);

      if (products.length > 0) {
        const sampleProduct = products[0];
        console.log(
          `   Sample product display language: ${sampleProduct.displayLang}`,
        );
        console.log(`   Sample product title: ${sampleProduct.title}`);
        console.log(`   Has titleEn: ${!!sampleProduct.titleEn}`);
        console.log(`   Has titleAr: ${!!sampleProduct.titleAr}`);
        console.log(`   Has cityEn: ${!!sampleProduct.cityEn}`);
        console.log(`   Has cityAr: ${!!sampleProduct.cityAr}`);
      }
    } else {
      console.log('❌ Failed to get English response');
    }

    // Test 2: Get pending products with Arabic language
    console.log(
      '\n📝 Test 2: Getting pending products with Arabic (lang=ar)...',
    );
    const arabicResponse = await axios.get(`${BASE_URL}/products/pending`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      params: { lang: 'ar' },
    });

    if (arabicResponse.data.success) {
      const products = arabicResponse.data.data;
      console.log(`✅ Arabic response: ${products.length} products found`);

      if (products.length > 0) {
        const sampleProduct = products[0];
        console.log(
          `   Sample product display language: ${sampleProduct.displayLang}`,
        );
        console.log(`   Sample product title: ${sampleProduct.title}`);
        console.log(`   Has titleEn: ${!!sampleProduct.titleEn}`);
        console.log(`   Has titleAr: ${!!sampleProduct.titleAr}`);
        console.log(`   Has cityEn: ${!!sampleProduct.cityEn}`);
        console.log(`   Has cityAr: ${!!sampleProduct.cityAr}`);
      }
    } else {
      console.log('❌ Failed to get Arabic response');
    }

    // Test 3: Get pending products without lang parameter (should use user's default)
    console.log(
      '\n📝 Test 3: Getting pending products without lang parameter...',
    );
    const defaultResponse = await axios.get(`${BASE_URL}/products/pending`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });

    if (defaultResponse.data.success) {
      const products = defaultResponse.data.data;
      console.log(`✅ Default response: ${products.length} products found`);

      if (products.length > 0) {
        const sampleProduct = products[0];
        console.log(
          `   Sample product display language: ${sampleProduct.displayLang}`,
        );
        console.log(`   Sample product title: ${sampleProduct.title}`);
      }
    } else {
      console.log('❌ Failed to get default response');
    }

    // Test 4: Compare responses to ensure both languages are preserved
    console.log(
      '\n📝 Test 4: Comparing responses to verify dual-language preservation...',
    );
    if (englishResponse.data.success && arabicResponse.data.success) {
      const englishProducts = englishResponse.data.data;
      const arabicProducts = arabicResponse.data.data;

      if (englishProducts.length > 0 && arabicProducts.length > 0) {
        const englishProduct = englishProducts[0];
        const arabicProduct = arabicProducts[0];

        // Check if both language fields are preserved
        const hasBothLanguages =
          englishProduct.titleEn &&
          englishProduct.titleAr &&
          englishProduct.cityEn &&
          englishProduct.cityAr &&
          arabicProduct.titleEn &&
          arabicProduct.titleAr &&
          arabicProduct.cityEn &&
          arabicProduct.cityAr;

        if (hasBothLanguages) {
          console.log('✅ Both language fields are preserved in response');
          console.log(`   English product titleEn: ${englishProduct.titleEn}`);
          console.log(`   English product titleAr: ${englishProduct.titleAr}`);
          console.log(`   Arabic product titleEn: ${arabicProduct.titleEn}`);
          console.log(`   Arabic product titleAr: ${arabicProduct.titleAr}`);
        } else {
          console.log('❌ Language fields are not properly preserved');
        }

        // Check if display language is correctly set
        if (
          englishProduct.displayLang === 'en' &&
          arabicProduct.displayLang === 'ar'
        ) {
          console.log('✅ Display language is correctly set');
        } else {
          console.log('❌ Display language is not correctly set');
        }
      }
    }

    // Test 5: Test approved products endpoint
    console.log(
      '\n📝 Test 5: Testing approved products endpoint with dual-language...',
    );
    const approvedResponse = await axios.get(`${BASE_URL}/products/approved`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      params: { lang: 'en' },
    });

    if (approvedResponse.data.success) {
      const products = approvedResponse.data.data;
      console.log(
        `✅ Approved products response: ${products.length} products found`,
      );

      if (products.length > 0) {
        const sampleProduct = products[0];
        console.log(
          `   Sample product display language: ${sampleProduct.displayLang}`,
        );
        console.log(
          `   Has both language fields: ${!!(sampleProduct.titleEn && sampleProduct.titleAr)}`,
        );
      }
    } else {
      console.log('❌ Failed to get approved products response');
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Dual-language response testing completed!');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testDualLanguageResponse().catch(console.error);
}

module.exports = {
  testDualLanguageResponse,
};
