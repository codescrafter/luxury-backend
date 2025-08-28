const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const PARTNER_TOKEN = 'YOUR_PARTNER_TOKEN_HERE'; // Replace with actual token
const YACHT_ID = 'YOUR_YACHT_ID_HERE'; // Replace with actual yacht ID

async function testYachtUpdate() {
  try {
    console.log('🚀 Testing Yacht Update API...');

    // Test data for update
    const updateData = {
      titleEn: 'Updated Yacht Title',
      descriptionEn: 'This is an updated description for testing',
      pricePerHour: 150,
      pricePerDay: 1200,
      // Add other fields as needed
    };

    console.log('📝 Update Data:', updateData);
    console.log('🔗 URL:', `${BASE_URL}/products/yacht/${YACHT_ID}`);

    // Make the update request
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

    console.log('✅ Update Response:', response.data);

    // Check if status was updated to pending
    if (response.data.data && response.data.data.status) {
      console.log('📊 Status after update:', response.data.data.status);
      if (response.data.data.status === 'pending') {
        console.log('✅ Status correctly updated to pending!');
      } else {
        console.log(
          '❌ Status not updated to pending:',
          response.data.data.status,
        );
      }
    }

    // Get the yacht to verify the update
    console.log('\n🔍 Verifying update by fetching yacht...');
    const getResponse = await axios.get(
      `${BASE_URL}/products/yacht/${YACHT_ID}`,
      {
        headers: {
          Authorization: `Bearer ${PARTNER_TOKEN}`,
        },
      },
    );

    console.log('📋 Current yacht data:', getResponse.data.data);

    if (getResponse.data.data.status) {
      console.log('📊 Current status:', getResponse.data.data.status);
    }
  } catch (error) {
    console.error(
      '❌ Error testing yacht update:',
      error.response?.data || error.message,
    );

    if (error.response?.status) {
      console.log('📊 HTTP Status:', error.response.status);
    }

    if (error.response?.data?.message) {
      console.log('📝 Error Message:', error.response.data.message);
    }
  }
}

// Run the test
if (require.main === module) {
  testYachtUpdate();
}

module.exports = { testYachtUpdate };
