const axios = require('axios');

// Simple test configuration
const BASE_URL = 'http://localhost:3000';
const PARTNER_TOKEN = process.env.PARTNER_TOKEN || 'YOUR_PARTNER_TOKEN';
const YACHT_ID = process.env.YACHT_ID || 'YOUR_YACHT_ID';
const OWNER_ID = process.env.OWNER_ID || 'YOUR_OWNER_ID';

async function testYachtUpdate() {
  if (
    PARTNER_TOKEN === 'YOUR_PARTNER_TOKEN' ||
    YACHT_ID === 'YOUR_YACHT_ID' ||
    OWNER_ID === 'YOUR_OWNER_ID'
  ) {
    console.log('❌ Please set environment variables:');
    console.log('export PARTNER_TOKEN="your_jwt_token"');
    console.log('export YACHT_ID="yacht_id_to_test"');
    console.log('export OWNER_ID="owner_id_from_jwt"');
    return;
  }

  try {
    console.log('🚀 Testing Yacht Update with ownerId from frontend...');

    // Test data with ownerId from frontend
    const updateData = {
      ownerId: OWNER_ID, // Frontend sends ownerId
      titleEn: 'Test Update - ' + Date.now(),
      descriptionEn: 'Test description update',
      pricePerHour: 100,
      pricePerDay: 800,
    };

    console.log('📤 Update data:', updateData);

    // Make update request
    const response = await axios.put(
      `${BASE_URL}/products/yacht/${YACHT_ID}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${PARTNER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('✅ Response:', {
      success: response.data.success,
      status: response.data.data?.status,
      titleEn: response.data.data?.titleEn,
      ownerId: response.data.data?.ownerId,
    });

    if (response.data.data?.status === 'pending') {
      console.log('🎉 SUCCESS: Status correctly updated to pending!');
    } else {
      console.log('❌ FAILED: Status not updated to pending');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

if (require.main === module) {
  testYachtUpdate();
}

module.exports = { testYachtUpdate };
