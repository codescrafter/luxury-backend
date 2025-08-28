const axios = require('axios');
const { BASE_URL, PARTNER_1_TOKEN, USER_TOKEN } = require('./config');

async function getProducts(filters = {}) {
  try {
    const res = await axios.get(`${BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      },
      params: filters,
    });
    return res.data?.data || [];
  } catch (error) {
    console.error(
      '❌ Failed to fetch products:',
      error.response?.data || error.message,
    );
    return [];
  }
}

async function getPublicProducts(lang = 'en') {
  try {
    const res = await axios.get(`${BASE_URL}/products/public`, {
      params: { lang },
    });
    return res.data?.data || [];
  } catch (error) {
    console.error(
      '❌ Failed to fetch public products:',
      error.response?.data || error.message,
    );
    return [];
  }
}

async function getProductById(type, id, lang = 'en', useAuth = false) {
  try {
    const config = {
      params: { lang },
    };

    if (useAuth) {
      config.headers = {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
      };
    }

    const res = await axios.get(`${BASE_URL}/products/${type}/${id}`, config);
    return res.data?.data || null;
  } catch (error) {
    console.error(
      `❌ Failed to fetch ${type} by id:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

async function getRejectedProducts() {
  try {
    const res = await axios.get(`${BASE_URL}/products/rejected`, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
      },
    });
    return res.data?.data || [];
  } catch (error) {
    console.error(
      '❌ Failed to fetch rejected products:',
      error.response?.data || error.message,
    );
    return [];
  }
}

async function getApprovedProducts() {
  try {
    const res = await axios.get(`${BASE_URL}/products/approved`, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
      },
    });
    return res.data?.data || [];
  } catch (error) {
    console.error(
      '❌ Failed to fetch approved products:',
      error.response?.data || error.message,
    );
    return [];
  }
}

// Test dual-language functionality
async function testDualLanguage() {
  console.log('🧪 Testing dual-language functionality...\n');

  // Test public products in English
  console.log('📝 Testing public products in English...');
  const englishProducts = await getPublicProducts('en');
  console.log(`✅ Found ${englishProducts.length} products in English`);
  if (englishProducts.length > 0) {
    const firstProduct = englishProducts[0];
    console.log(
      `   Sample product: ${firstProduct.title} - ${firstProduct.city}, ${firstProduct.country}`,
    );
    console.log(
      `   Description: ${firstProduct.description?.substring(0, 50)}...`,
    );
    console.log(
      `   Cancellation Policy: ${firstProduct.cancellationPolicy?.join(', ')}`,
    );
    console.log(`   Terms: ${firstProduct.termsAndConditions?.join(', ')}`);
  }

  // Test public products in Arabic
  console.log('\n📝 Testing public products in Arabic...');
  const arabicProducts = await getPublicProducts('ar');
  console.log(`✅ Found ${arabicProducts.length} products in Arabic`);
  if (arabicProducts.length > 0) {
    const firstProduct = arabicProducts[0];
    console.log(
      `   Sample product: ${firstProduct.title} - ${firstProduct.city}, ${firstProduct.country}`,
    );
    console.log(
      `   Description: ${firstProduct.description?.substring(0, 50)}...`,
    );
    console.log(
      `   Cancellation Policy: ${firstProduct.cancellationPolicy?.join(', ')}`,
    );
    console.log(`   Terms: ${firstProduct.termsAndConditions?.join(', ')}`);
  }

  // Test authenticated products with language override
  console.log('\n📝 Testing authenticated products with language override...');
  const authProducts = await getProducts({ lang: 'ar' });
  console.log(`✅ Found ${authProducts.length} products with Arabic override`);
  if (authProducts.length > 0) {
    const firstProduct = authProducts[0];
    console.log(
      `   Sample product: ${firstProduct.title} - ${firstProduct.city}, ${firstProduct.country}`,
    );
  }

  // Test individual product retrieval
  if (englishProducts.length > 0) {
    const productId = englishProducts[0]._id;
    const productType = englishProducts[0].type || 'yacht';

    console.log(`\n📝 Testing individual ${productType} retrieval...`);

    // Test public access in Arabic
    const publicProduct = await getProductById(
      productType,
      productId,
      'ar',
      false,
    );
    if (publicProduct) {
      console.log(`✅ Public ${productType} in Arabic: ${publicProduct.title}`);
      console.log(
        `   City: ${publicProduct.city}, Country: ${publicProduct.country}`,
      );
    }

    // Test authenticated access in English
    const authProduct = await getProductById(
      productType,
      productId,
      'en',
      true,
    );
    if (authProduct) {
      console.log(
        `✅ Authenticated ${productType} in English: ${authProduct.title}`,
      );
      console.log(
        `   City: ${authProduct.city}, Country: ${authProduct.country}`,
      );
    }
  }

  // Test language field validation
  console.log('\n📝 Testing language field validation...');
  if (englishProducts.length > 0) {
    const product = englishProducts[0];
    const hasLanguageFields =
      product.titleEn || product.titleAr || product.cityEn || product.cityAr;

    if (!hasLanguageFields) {
      console.log('✅ Language-specific fields properly cleaned from response');
    } else {
      console.log('❌ Language-specific fields found in response');
      console.log(`   titleEn: ${product.titleEn}`);
      console.log(`   titleAr: ${product.titleAr}`);
    }
  }

  // Test all product types in both languages
  console.log('\n📝 Testing all product types in both languages...');
  const productTypes = ['yacht', 'resort', 'jetski', 'kayak', 'speedboat'];
  const languages = ['en', 'ar'];

  for (const lang of languages) {
    console.log(`   ${lang.toUpperCase()} language:`);
    for (const type of productTypes) {
      try {
        const typeProducts = await getPublicProducts(lang);
        const filteredProducts = typeProducts.filter((p) => p.type === type);
        console.log(`     ${type}: ${filteredProducts.length} products`);

        if (filteredProducts.length > 0) {
          const sample = filteredProducts[0];
          console.log(`       Sample: ${sample.title} - ${sample.city}`);
        }
      } catch {
        console.log(`     ${type}: Error`);
      }
    }
  }

  // Test fallback behavior
  console.log('\n📝 Testing fallback behavior...');
  try {
    const invalidLangProducts = await getPublicProducts('invalid');
    console.log(
      `✅ Fallback successful: ${invalidLangProducts.length} products found`,
    );
    if (invalidLangProducts.length > 0) {
      console.log(`   Sample: ${invalidLangProducts[0].title}`);
    }
  } catch {
    console.log('❌ Fallback test failed');
  }

  console.log('\n🎉 Dual-language testing completed!');
}

// Test specific product type retrieval
async function testProductTypeRetrieval() {
  console.log('🧪 Testing product type-specific retrieval...\n');

  const productTypes = ['yacht', 'resort', 'jetski', 'kayak', 'speedboat'];
  const languages = ['en', 'ar'];

  for (const type of productTypes) {
    console.log(`📝 Testing ${type} retrieval...`);

    for (const lang of languages) {
      try {
        const products = await getPublicProducts(lang);
        const typeProducts = products.filter((p) => p.type === type);

        console.log(
          `   ${lang.toUpperCase()}: ${typeProducts.length} products`,
        );

        if (typeProducts.length > 0) {
          const product = typeProducts[0];
          console.log(`     Sample: ${product.title} - ${product.city}`);

          // Test individual product retrieval
          const individual = await getProductById(
            type,
            product._id,
            lang,
            false,
          );
          if (individual) {
            console.log(`     Individual: ${individual.title}`);
          }
        }
      } catch (error) {
        console.log(`   ${lang.toUpperCase()}: Error - ${error.message}`);
      }
    }
    console.log('');
  }
}

// Test language switching with authentication
async function testLanguageSwitching() {
  console.log('🧪 Testing language switching with authentication...\n');

  try {
    // Get products with default language (should be English)
    const defaultProducts = await getProducts();
    console.log(
      `✅ Default language products: ${defaultProducts.length} found`,
    );

    if (defaultProducts.length > 0) {
      console.log(`   Sample: ${defaultProducts[0].title}`);
    }

    // Get products with explicit English
    const englishProducts = await getProducts({ lang: 'en' });
    console.log(
      `✅ Explicit English products: ${englishProducts.length} found`,
    );

    if (englishProducts.length > 0) {
      console.log(
        `   Sample: ${englishProducts.length > 0 ? englishProducts[0].title : 'None'}`,
      );
    }

    // Get products with Arabic override
    const arabicProducts = await getProducts({ lang: 'ar' });
    console.log(`✅ Arabic override products: ${arabicProducts.length} found`);

    if (arabicProducts.length > 0) {
      console.log(`   Sample: ${arabicProducts[0].title}`);
    }

    // Compare results
    if (
      defaultProducts.length === englishProducts.length &&
      defaultProducts.length === arabicProducts.length
    ) {
      console.log('✅ All language variants return same number of products');
    } else {
      console.log(
        '⚠️  Different number of products returned for different languages',
      );
    }
  } catch (error) {
    console.error('❌ Language switching test failed:', error.message);
  }
}

module.exports = {
  getProducts,
  getPublicProducts,
  getProductById,
  getRejectedProducts,
  getApprovedProducts,
  testDualLanguage,
  testProductTypeRetrieval,
  testLanguageSwitching,
};
