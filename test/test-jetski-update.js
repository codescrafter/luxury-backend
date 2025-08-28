const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const PARTNER_TOKEN = process.env.PARTNER_TOKEN || 'YOUR_PARTNER_TOKEN';
const JETSKI_ID = process.env.JETSKI_ID || 'YOUR_JETSKI_ID';
const OWNER_ID = process.env.OWNER_ID || 'YOUR_OWNER_ID';

async function testJetskiUpdate() {
  if (
    PARTNER_TOKEN === 'YOUR_PARTNER_TOKEN' ||
    JETSKI_ID === 'YOUR_JETSKI_ID' ||
    OWNER_ID === 'YOUR_OWNER_ID'
  ) {
    console.log('❌ Please set environment variables:');
    console.log('export PARTNER_TOKEN="your_jwt_token"');
    console.log('export JETSKI_ID="jetski_id_to_test"');
    console.log('export OWNER_ID="owner_id_from_jwt"');
    return;
  }

  try {
    console.log('🚀 Testing Jetski Update with ownerId from frontend...');

    const updateData = {
      ownerId: OWNER_ID,
      titleEn: 'Updated Jetski - ' + Date.now(),
      descriptionEn: 'Updated jetski description',
      pricePerHour: 80,
      pricePerDay: 600,
      capacity: 2,
      maxSpeed: 60,
      brand: 'Yamaha',
      modelYear: 2023,
    };

    console.log('📤 Update data:', updateData);

    const response = await axios.put(
      `${BASE_URL}/products/jetski/${JETSKI_ID}`,
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
      console.log('🎉 SUCCESS: Jetski status correctly updated to pending!');
    } else {
      console.log('❌ FAILED: Jetski status not updated to pending');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

if (require.main === module) {
  testJetskiUpdate();
}

module.exports = { testJetskiUpdate };
