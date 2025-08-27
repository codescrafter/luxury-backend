const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Configuration - UPDATE THESE VALUES
const CONFIG = {
  PARTNER_TOKEN: 'YOUR_PARTNER_TOKEN_HERE', // Replace with actual partner token
  YACHT_ID: 'YOUR_YACHT_ID_HERE', // Replace with actual yacht ID
  OWNER_ID: 'YOUR_OWNER_ID_HERE', // Replace with actual owner ID (should match JWT token)
};

async function testYachtUpdate() {
  try {
    console.log('🚀 Testing Yacht Update with ownerId from frontend...\n');

    // Step 1: Get current yacht data
    console.log('📋 Step 1: Getting current yacht data...');
    const currentYacht = await axios.get(
      `${BASE_URL}/products/yacht/${CONFIG.YACHT_ID}`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.PARTNER_TOKEN}`,
        },
      },
    );

    console.log('✅ Current yacht data:', {
      id: currentYacht.data.data._id,
      status: currentYacht.data.data.status,
      titleEn: currentYacht.data.data.titleEn,
      ownerId: currentYacht.data.data.ownerId,
    });

    // Step 2: Test update with ownerId from frontend
    console.log('\n📝 Step 2: Testing update with ownerId from frontend...');
    const updateData = {
      ownerId: CONFIG.OWNER_ID, // Frontend sends ownerId
      titleEn: 'Updated Yacht Title - ' + new Date().toISOString(),
      descriptionEn:
        'This is an updated description for testing - ' +
        new Date().toISOString(),
      pricePerHour: 150,
      pricePerDay: 1200,
    };

    console.log('📤 Update data:', updateData);

    const updateResponse = await axios.put(
      `${BASE_URL}/products/yacht/${CONFIG.YACHT_ID}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.PARTNER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('✅ Update response:', {
      success: updateResponse.data.success,
      status: updateResponse.data.data?.status,
      titleEn: updateResponse.data.data?.titleEn,
      ownerId: updateResponse.data.data?.ownerId,
    });

    // Step 3: Verify the update
    console.log('\n🔍 Step 3: Verifying update...');
    const verifyResponse = await axios.get(
      `${BASE_URL}/products/yacht/${CONFIG.YACHT_ID}`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.PARTNER_TOKEN}`,
        },
      },
    );

    console.log('✅ Verification result:', {
      id: verifyResponse.data.data._id,
      status: verifyResponse.data.data.status,
      titleEn: verifyResponse.data.data.titleEn,
      descriptionEn: verifyResponse.data.data.descriptionEn,
      ownerId: verifyResponse.data.data.ownerId,
    });

    // Step 4: Check if status was updated to pending
    if (verifyResponse.data.data.status === 'pending') {
      console.log('🎉 SUCCESS: Status correctly updated to pending!');
    } else {
      console.log(
        '❌ FAILED: Status not updated to pending:',
        verifyResponse.data.data.status,
      );
    }

    // Step 5: Check if yacht appears in pending list
    console.log('\n📋 Step 4: Checking pending products list...');
    const pendingResponse = await axios.get(`${BASE_URL}/products/pending`, {
      headers: {
        Authorization: `Bearer ${CONFIG.PARTNER_TOKEN}`,
      },
      params: {
        page: 1,
        limit: 50,
      },
    });

    const pendingYachts = pendingResponse.data.data.filter(
      (product) => product._id === CONFIG.YACHT_ID,
    );

    if (pendingYachts.length > 0) {
      console.log('✅ Yacht found in pending list:', {
        id: pendingYachts[0]._id,
        status: pendingYachts[0].status,
        titleEn: pendingYachts[0].titleEn,
      });
    } else {
      console.log('❌ Yacht NOT found in pending list');
    }

    console.log('\n🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Test error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.data?.error) {
      console.error('📝 Detailed error:', error.response.data.error);
    }
  }
}

// Test with wrong ownerId (should fail)
async function testWrongOwnerId() {
  try {
    console.log('\n🧪 Testing with wrong ownerId (should fail)...');

    const updateData = {
      ownerId: 'wrong_owner_id_123', // Wrong ownerId
      titleEn: 'This should fail',
      pricePerHour: 100,
    };

    await axios.put(
      `${BASE_URL}/products/yacht/${CONFIG.YACHT_ID}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.PARTNER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('❌ Test failed - should have rejected wrong ownerId');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ CORRECT: Rejected wrong ownerId with 403 Forbidden');
    } else {
      console.log(
        '❌ Unexpected error:',
        error.response?.data?.message || error.message,
      );
    }
  }
}

// Run the tests
if (require.main === module) {
  console.log('🚀 Yacht Update Test with ownerId from Frontend');
  console.log('⚠️  Please update the CONFIG object with your actual values\n');

  if (
    CONFIG.PARTNER_TOKEN === 'YOUR_PARTNER_TOKEN_HERE' ||
    CONFIG.YACHT_ID === 'YOUR_YACHT_ID_HERE' ||
    CONFIG.OWNER_ID === 'YOUR_OWNER_ID_HERE'
  ) {
    console.log('❌ Please update the CONFIG object with your actual values:');
    console.log('- PARTNER_TOKEN: Your partner JWT token');
    console.log('- YACHT_ID: The ID of the yacht you want to update');
    console.log(
      '- OWNER_ID: The owner ID (should match the JWT token user._id)\n',
    );
    process.exit(1);
  }

  testYachtUpdate()
    .then(() => {
      return testWrongOwnerId();
    })
    .catch(console.error);
}

module.exports = { testYachtUpdate, testWrongOwnerId };
