const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Configuration - UPDATE THESE VALUES
const CONFIG = {
  PARTNER_TOKEN: 'YOUR_PARTNER_TOKEN_HERE', // Replace with actual partner token
  OWNER_ID: 'YOUR_OWNER_ID_HERE', // Replace with actual owner ID (should match JWT token)

  // Product IDs to test - replace with actual IDs
  JETSKI_ID: 'YOUR_JETSKI_ID_HERE',
  KAYAK_ID: 'YOUR_KAYAK_ID_HERE',
  YACHT_ID: 'YOUR_YACHT_ID_HERE',
  SPEEDBOAT_ID: 'YOUR_SPEEDBOAT_ID_HERE',
  RESORT_ID: 'YOUR_RESORT_ID_HERE',
};

// Test data for each product type
const TEST_DATA = {
  jetski: {
    titleEn: 'Updated Jetski - ' + Date.now(),
    descriptionEn: 'Updated jetski description',
    pricePerHour: 80,
    pricePerDay: 600,
    capacity: 2,
    maxSpeed: 60,
    brand: 'Yamaha',
    modelYear: 2023,
  },
  kayak: {
    titleEn: 'Updated Kayak - ' + Date.now(),
    descriptionEn: 'Updated kayak description',
    pricePerHour: 30,
    pricePerDay: 200,
    capacity: 1,
    kayakType: 'recreational',
    lengthInFeet: 10,
  },
  yacht: {
    titleEn: 'Updated Yacht - ' + Date.now(),
    descriptionEn: 'Updated yacht description',
    pricePerHour: 150,
    pricePerDay: 1200,
    capacity: 8,
    yachtType: 'motor',
    lengthInFeet: 45,
  },
  speedboat: {
    titleEn: 'Updated Speedboat - ' + Date.now(),
    descriptionEn: 'Updated speedboat description',
    pricePerHour: 100,
    pricePerDay: 800,
    capacity: 6,
    maxSpeed: 50,
    brand: 'Sea Ray',
    modelYear: 2022,
  },
  resort: {
    titleEn: 'Updated Resort - ' + Date.now(),
    descriptionEn: 'Updated resort description',
    dailyPrice: 300,
    yearlyPrice: 80000,
    numberOfRooms: 50,
    starRating: 4,
    cityEn: 'Dubai',
    cityAr: 'دبي',
  },
};

async function testProductUpdate(productType, productId, testData) {
  try {
    console.log(`\n🚀 Testing ${productType.toUpperCase()} Update...`);

    // Add ownerId to test data
    const updateData = {
      ownerId: CONFIG.OWNER_ID,
      ...testData,
    };

    console.log(`📤 Update data for ${productType}:`, updateData);

    // Make update request
    const response = await axios.put(
      `${BASE_URL}/products/${productType}/${productId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.PARTNER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(`✅ ${productType.toUpperCase()} Update Response:`, {
      success: response.data.success,
      status: response.data.data?.status,
      titleEn: response.data.data?.titleEn,
      ownerId: response.data.data?.ownerId,
    });

    // Check if status was updated to pending
    if (response.data.data?.status === 'pending') {
      console.log(
        `🎉 SUCCESS: ${productType.toUpperCase()} status correctly updated to pending!`,
      );
      return true;
    } else {
      console.log(
        `❌ FAILED: ${productType.toUpperCase()} status not updated to pending:`,
        response.data.data?.status,
      );
      return false;
    }
  } catch (error) {
    console.error(`❌ ${productType.toUpperCase()} Update Error:`, {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return false;
  }
}

async function testWrongOwnerId(productType, productId) {
  try {
    console.log(
      `\n🧪 Testing ${productType.toUpperCase()} with wrong ownerId (should fail)...`,
    );

    const updateData = {
      ownerId: 'wrong_owner_id_123', // Wrong ownerId
      titleEn: 'This should fail',
      pricePerHour: 100,
    };

    await axios.put(
      `${BASE_URL}/products/${productType}/${productId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.PARTNER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(
      `❌ ${productType.toUpperCase()} test failed - should have rejected wrong ownerId`,
    );
  } catch (error) {
    if (error.response?.status === 403) {
      console.log(
        `✅ CORRECT: ${productType.toUpperCase()} rejected wrong ownerId with 403 Forbidden`,
      );
      return true;
    } else {
      console.log(
        `❌ ${productType.toUpperCase()} unexpected error:`,
        error.response?.data?.message || error.message,
      );
      return false;
    }
  }
}

async function testAllProducts() {
  console.log('🚀 Testing All Product Update Endpoints');
  console.log('⚠️  Please update the CONFIG object with your actual values\n');

  // Check if all required values are provided
  const requiredFields = [
    'PARTNER_TOKEN',
    'OWNER_ID',
    'JETSKI_ID',
    'KAYAK_ID',
    'YACHT_ID',
    'SPEEDBOAT_ID',
    'RESORT_ID',
  ];

  const missingFields = requiredFields.filter(
    (field) => CONFIG[field] === `YOUR_${field}_HERE`,
  );

  if (missingFields.length > 0) {
    console.log('❌ Please update the CONFIG object with your actual values:');
    missingFields.forEach((field) => {
      console.log(
        `- ${field}: Your actual ${field.toLowerCase().replace('_', ' ')}`,
      );
    });
    console.log('\nExample:');
    console.log(
      'CONFIG.PARTNER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."',
    );
    console.log('CONFIG.OWNER_ID = "507f1f77bcf86cd799439011"');
    console.log('CONFIG.JETSKI_ID = "507f1f77bcf86cd799439012"');
    return;
  }

  const results = {
    jetski: { success: false, wrongOwnerId: false },
    kayak: { success: false, wrongOwnerId: false },
    yacht: { success: false, wrongOwnerId: false },
    speedboat: { success: false, wrongOwnerId: false },
    resort: { success: false, wrongOwnerId: false },
  };

  // Test all product updates
  results.jetski.success = await testProductUpdate(
    'jetski',
    CONFIG.JETSKI_ID,
    TEST_DATA.jetski,
  );
  results.kayak.success = await testProductUpdate(
    'kayak',
    CONFIG.KAYAK_ID,
    TEST_DATA.kayak,
  );
  results.yacht.success = await testProductUpdate(
    'yacht',
    CONFIG.YACHT_ID,
    TEST_DATA.yacht,
  );
  results.speedboat.success = await testProductUpdate(
    'speedboat',
    CONFIG.SPEEDBOAT_ID,
    TEST_DATA.speedboat,
  );
  results.resort.success = await testProductUpdate(
    'resort',
    CONFIG.RESORT_ID,
    TEST_DATA.resort,
  );

  // Test wrong ownerId for all products
  results.jetski.wrongOwnerId = await testWrongOwnerId(
    'jetski',
    CONFIG.JETSKI_ID,
  );
  results.kayak.wrongOwnerId = await testWrongOwnerId('kayak', CONFIG.KAYAK_ID);
  results.yacht.wrongOwnerId = await testWrongOwnerId('yacht', CONFIG.YACHT_ID);
  results.speedboat.wrongOwnerId = await testWrongOwnerId(
    'speedboat',
    CONFIG.SPEEDBOAT_ID,
  );
  results.resort.wrongOwnerId = await testWrongOwnerId(
    'resort',
    CONFIG.RESORT_ID,
  );

  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');

  Object.entries(results).forEach(([productType, result]) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const security = result.wrongOwnerId ? '✅ PASS' : '❌ FAIL';
    console.log(
      `${productType.toUpperCase()}: Update ${status} | Security ${security}`,
    );
  });

  const allPassed = Object.values(results).every(
    (r) => r.success && r.wrongOwnerId,
  );

  if (allPassed) {
    console.log(
      '\n🎉 ALL TESTS PASSED! All product update endpoints are working correctly.',
    );
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run the tests
if (require.main === module) {
  testAllProducts().catch(console.error);
}

module.exports = { testAllProducts, testProductUpdate, testWrongOwnerId };
