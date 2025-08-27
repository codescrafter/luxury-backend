const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const PRODUCT_TYPE = process.env.PRODUCT_TYPE || 'yacht'; // jetski, kayak, yacht, speedboat, resort
const PRODUCT_ID = process.env.PRODUCT_ID || 'YOUR_PRODUCT_ID';

async function testRelatedProducts() {
  if (PRODUCT_ID === 'YOUR_PRODUCT_ID') {
    console.log('❌ Please set environment variables:');
    console.log(
      'export PRODUCT_TYPE="yacht" (or jetski, kayak, speedboat, resort)',
    );
    console.log('export PRODUCT_ID="product_id_to_test"');
    return;
  }

  try {
    console.log(
      `🚀 Testing Related Products for ${PRODUCT_TYPE.toUpperCase()}...`,
    );

    // Test with default limit (10)
    console.log('\n📤 Testing with default limit (10)...');
    const response1 = await axios.get(
      `${BASE_URL}/products/${PRODUCT_TYPE}/${PRODUCT_ID}/related`,
    );

    console.log('✅ Response:', {
      success: response1.data.success,
      count: response1.data.data?.length || 0,
      products: response1.data.data?.map((p) => ({
        id: p._id,
        titleEn: p.titleEn,
        pricePerHour: p.pricePerHour,
        pricePerDay: p.pricePerDay,
        dailyPrice: p.dailyPrice,
        capacity: p.capacity,
        brand: p.brand,
        cityEn: p.cityEn,
      })),
    });

    // Test with custom limit (5)
    console.log('\n📤 Testing with custom limit (5)...');
    const response2 = await axios.get(
      `${BASE_URL}/products/${PRODUCT_TYPE}/${PRODUCT_ID}/related?limit=5`,
    );

    console.log('✅ Response:', {
      success: response2.data.success,
      count: response2.data.data?.length || 0,
    });

    // Test with language parameter
    console.log('\n📤 Testing with language parameter (ar)...');
    const response3 = await axios.get(
      `${BASE_URL}/products/${PRODUCT_TYPE}/${PRODUCT_ID}/related?lang=ar`,
    );

    console.log('✅ Response:', {
      success: response3.data.success,
      count: response3.data.data?.length || 0,
      sampleProduct: response3.data.data?.[0]
        ? {
            title: response3.data.data[0].title,
            titleEn: response3.data.data[0].titleEn,
            titleAr: response3.data.data[0].titleAr,
          }
        : null,
    });

    // Test with invalid product ID
    console.log('\n🧪 Testing with invalid product ID...');
    try {
      await axios.get(
        `${BASE_URL}/products/${PRODUCT_TYPE}/invalid_id_123/related`,
      );
      console.log('❌ Should have failed with invalid ID');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Correctly failed with 404 for invalid product ID');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message);
      }
    }

    // Test with invalid product type
    console.log('\n🧪 Testing with invalid product type...');
    try {
      await axios.get(
        `${BASE_URL}/products/invalid_type/${PRODUCT_ID}/related`,
      );
      console.log('❌ Should have failed with invalid type');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly failed with 400 for invalid product type');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message);
      }
    }

    console.log('\n🎉 Related Products API Test Completed!');
  } catch (error) {
    console.error('❌ Error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}

async function testAllProductTypes() {
  console.log('\n🧪 Testing Related Products for All Product Types...');

  const productTypes = ['jetski', 'kayak', 'yacht', 'speedboat', 'resort'];
  const testProductIds = {
    jetski: process.env.JETSKI_ID || 'YOUR_JETSKI_ID',
    kayak: process.env.KAYAK_ID || 'YOUR_KAYAK_ID',
    yacht: process.env.YACHT_ID || 'YOUR_YACHT_ID',
    speedboat: process.env.SPEEDBOAT_ID || 'YOUR_SPEEDBOAT_ID',
    resort: process.env.RESORT_ID || 'YOUR_RESORT_ID',
  };

  for (const type of productTypes) {
    const productId = testProductIds[type];
    if (productId.startsWith('YOUR_')) {
      console.log(`⚠️  Skipping ${type} - no product ID provided`);
      continue;
    }

    try {
      console.log(`\n📤 Testing ${type.toUpperCase()} related products...`);
      const response = await axios.get(
        `${BASE_URL}/products/${type}/${productId}/related?limit=3`,
      );

      console.log(`✅ ${type.toUpperCase()}:`, {
        success: response.data.success,
        count: response.data.data?.length || 0,
      });
    } catch (error) {
      console.log(
        `❌ ${type.toUpperCase()}: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}

if (require.main === module) {
  testRelatedProducts()
    .then(() => testAllProductTypes())
    .catch(console.error);
}

module.exports = { testRelatedProducts, testAllProductTypes };
