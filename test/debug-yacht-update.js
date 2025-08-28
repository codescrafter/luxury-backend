const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Configuration - UPDATE THESE VALUES
const CONFIG = {
  PARTNER_TOKEN: 'YOUR_PARTNER_TOKEN_HERE', // Replace with actual partner token
  YACHT_ID: 'YOUR_YACHT_ID_HERE', // Replace with actual yacht ID
  ADMIN_TOKEN: 'YOUR_ADMIN_TOKEN_HERE', // Replace with actual admin token (optional)
};

async function debugYachtUpdate() {
  try {
    console.log('🔍 Starting Yacht Update Debug...\n');

    // Step 1: Check if yacht exists and get current data
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

    // Step 2: Test simple update without files
    console.log('\n📝 Step 2: Testing simple update...');
    const updateData = {
      titleEn: 'Updated Yacht Title - ' + new Date().toISOString(),
      descriptionEn:
        'This is an updated description for testing - ' +
        new Date().toISOString(),
      pricePerHour: 150,
      pricePerDay: 1200,
    };

    console.log('📤 Sending update data:', updateData);

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
    });

    // Step 3: Verify the update by fetching again
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
    });

    // Step 4: Check if yacht appears in pending list
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

    // Step 5: Test with admin token if available
    if (CONFIG.ADMIN_TOKEN && CONFIG.ADMIN_TOKEN !== 'YOUR_ADMIN_TOKEN_HERE') {
      console.log('\n👑 Step 5: Testing admin view of pending products...');
      const adminPendingResponse = await axios.get(
        `${BASE_URL}/products/pending`,
        {
          headers: {
            Authorization: `Bearer ${CONFIG.ADMIN_TOKEN}`,
          },
          params: {
            page: 1,
            limit: 50,
          },
        },
      );

      const adminPendingYachts = adminPendingResponse.data.data.filter(
        (product) => product._id === CONFIG.YACHT_ID,
      );

      if (adminPendingYachts.length > 0) {
        console.log('✅ Admin can see yacht in pending list:', {
          id: adminPendingYachts[0]._id,
          status: adminPendingYachts[0].status,
          titleEn: adminPendingYachts[0].titleEn,
        });
      } else {
        console.log('❌ Admin cannot see yacht in pending list');
      }
    }

    console.log('\n🎉 Debug completed!');
  } catch (error) {
    console.error('❌ Debug error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.data?.error) {
      console.error('📝 Detailed error:', error.response.data.error);
    }
  }
}

// Helper function to test with different data
async function testWithDifferentData() {
  console.log('\n🧪 Testing with different update data...');

  const testCases = [
    {
      name: 'Minimal update',
      data: { titleEn: 'Minimal Update Test' },
    },
    {
      name: 'Full update',
      data: {
        titleEn: 'Full Update Test',
        descriptionEn: 'Full description update',
        pricePerHour: 200,
        pricePerDay: 1500,
        capacity: 8,
        yachtType: 'motor',
        lengthInFeet: 45,
      },
    },
    {
      name: 'Only price update',
      data: {
        pricePerHour: 175,
        pricePerDay: 1400,
      },
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n📝 Testing: ${testCase.name}`);
      console.log('Data:', testCase.data);

      const response = await axios.put(
        `${BASE_URL}/products/yacht/${CONFIG.YACHT_ID}`,
        testCase.data,
        {
          headers: {
            Authorization: `Bearer ${CONFIG.PARTNER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Result:', {
        success: response.data.success,
        status: response.data.data?.status,
        titleEn: response.data.data?.titleEn,
      });
    } catch (error) {
      console.error(
        `❌ ${testCase.name} failed:`,
        error.response?.data?.message || error.message,
      );
    }
  }
}

// Run the debug
if (require.main === module) {
  console.log('🚀 Yacht Update Debug Tool');
  console.log(
    '⚠️  Please update the CONFIG object with your actual tokens and yacht ID\n',
  );

  if (
    CONFIG.PARTNER_TOKEN === 'YOUR_PARTNER_TOKEN_HERE' ||
    CONFIG.YACHT_ID === 'YOUR_YACHT_ID_HERE'
  ) {
    console.log('❌ Please update the CONFIG object with your actual values:');
    console.log('- PARTNER_TOKEN: Your partner JWT token');
    console.log('- YACHT_ID: The ID of the yacht you want to update');
    console.log('- ADMIN_TOKEN: Your admin JWT token (optional)\n');
    process.exit(1);
  }

  debugYachtUpdate()
    .then(() => {
      return testWithDifferentData();
    })
    .catch(console.error);
}

module.exports = { debugYachtUpdate, testWithDifferentData };
