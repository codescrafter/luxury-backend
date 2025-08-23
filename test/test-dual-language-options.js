const axios = require('axios');
const { BASE_URL, ADMIN_TOKEN } = require('./config');

async function testDualLanguageOptions() {
  console.log('🧪 Testing Dual-Language Options\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Get products WITHOUT lang parameter (pure dual-language)
    console.log('📝 Test 1: Getting products WITHOUT lang parameter...');
    const noLangResponse = await axios.get(`${BASE_URL}/products/pending`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });

    if (noLangResponse.data.success) {
      const products = noLangResponse.data.data;
      console.log(`✅ No lang response: ${products.length} products found`);

      if (products.length > 0) {
        const product = products[0];
        console.log('   Product structure:');
        console.log(`     Has displayLang: ${!!product.displayLang}`);
        console.log(`     Has title: ${!!product.title}`);
        console.log(`     Has titleEn: ${!!product.titleEn}`);
        console.log(`     Has titleAr: ${!!product.titleAr}`);
        console.log(`     Has description: ${!!product.description}`);
        console.log(`     Has descriptionEn: ${!!product.descriptionEn}`);
        console.log(`     Has descriptionAr: ${!!product.descriptionAr}`);

        if (!product.title && !product.description) {
          console.log(
            '   ✅ Correct: No display fields, only language-specific fields',
          );
        } else {
          console.log('   ❌ Incorrect: Should not have display fields');
        }
      }
    } else {
      console.log('❌ Failed to get no-lang response');
    }

    // Test 2: Get products WITH lang parameter (display language set)
    console.log('\n📝 Test 2: Getting products WITH lang=en parameter...');
    const withLangResponse = await axios.get(`${BASE_URL}/products/pending`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      params: { lang: 'en' },
    });

    if (withLangResponse.data.success) {
      const products = withLangResponse.data.data;
      console.log(`✅ With lang response: ${products.length} products found`);

      if (products.length > 0) {
        const product = products[0];
        console.log('   Product structure:');
        console.log(`     displayLang: ${product.displayLang}`);
        console.log(`     Has title: ${!!product.title}`);
        console.log(`     Has titleEn: ${!!product.titleEn}`);
        console.log(`     Has titleAr: ${!!product.titleAr}`);
        console.log(`     Has description: ${!!product.description}`);
        console.log(`     Has descriptionEn: ${!!product.descriptionEn}`);
        console.log(`     Has descriptionAr: ${!!product.descriptionAr}`);

        if (
          product.displayLang === 'en' &&
          product.title &&
          product.description
        ) {
          console.log('   ✅ Correct: Has display fields with English content');
          console.log(`     title: ${product.title}`);
          console.log(
            `     description: ${product.description?.substring(0, 50)}...`,
          );
        } else {
          console.log(
            '   ❌ Incorrect: Should have display fields with English content',
          );
        }
      }
    } else {
      console.log('❌ Failed to get with-lang response');
    }

    // Test 3: Get products WITH lang=ar parameter (Arabic display)
    console.log('\n📝 Test 3: Getting products WITH lang=ar parameter...');
    const withArLangResponse = await axios.get(`${BASE_URL}/products/pending`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      params: { lang: 'ar' },
    });

    if (withArLangResponse.data.success) {
      const products = withArLangResponse.data.data;
      console.log(
        `✅ With Arabic lang response: ${products.length} products found`,
      );

      if (products.length > 0) {
        const product = products[0];
        console.log('   Product structure:');
        console.log(`     displayLang: ${product.displayLang}`);
        console.log(`     Has title: ${!!product.title}`);
        console.log(`     Has titleEn: ${!!product.titleEn}`);
        console.log(`     Has titleAr: ${!!product.titleAr}`);

        if (product.displayLang === 'ar' && product.title) {
          console.log('   ✅ Correct: Has display fields with Arabic content');
          console.log(`     title: ${product.title}`);
        } else {
          console.log(
            '   ❌ Incorrect: Should have display fields with Arabic content',
          );
        }
      }
    } else {
      console.log('❌ Failed to get with-Arabic-lang response');
    }

    // Test 4: Compare responses
    console.log('\n📝 Test 4: Comparing response structures...');
    if (noLangResponse.data.success && withLangResponse.data.success) {
      const noLangProduct = noLangResponse.data.data[0];
      const withLangProduct = withLangResponse.data.data[0];

      console.log('   No lang parameter:');
      console.log(
        `     Has display fields: ${!!(noLangProduct.title && noLangProduct.description)}`,
      );
      console.log(
        `     Has both languages: ${!!(noLangProduct.titleEn && noLangProduct.titleAr)}`,
      );

      console.log('   With lang parameter:');
      console.log(
        `     Has display fields: ${!!(withLangProduct.title && withLangProduct.description)}`,
      );
      console.log(
        `     Has both languages: ${!!(withLangProduct.titleEn && withLangProduct.titleAr)}`,
      );
      console.log(`     Display language: ${withLangProduct.displayLang}`);

      if (!noLangProduct.title && withLangProduct.title) {
        console.log(
          '   ✅ Correct: No lang = no display fields, With lang = display fields',
        );
      } else {
        console.log('   ❌ Incorrect: Response structure mismatch');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Dual-language options testing completed!');
    console.log('\n📋 Summary:');
    console.log(
      '   • No lang parameter = Pure dual-language (no display fields)',
    );
    console.log('   • With lang parameter = Dual-language + display fields');
    console.log('   • Frontend can choose based on their needs');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testDualLanguageOptions().catch(console.error);
}

module.exports = {
  testDualLanguageOptions,
};
