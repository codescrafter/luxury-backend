const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { createTestImage, BASE_URL, OWNER_ID, PARTNER_1_TOKEN } = require('./config');

async function testResortValidation() {
  console.log('🧪 Testing resort validation with new price fields...\n');

  // Test 1: Create resort with both daily and yearly prices (should succeed)
  console.log('Test 1: Creating resort with both daily and yearly prices...');
  const form1 = new FormData();
  const imagePath = createTestImage();
  form1.append('images', fs.createReadStream(imagePath));
  
  const validData = {
    title: 'Test Resort with Prices',
    description: 'A test resort with proper pricing.',
    isAnnualResort: true,
    isDailyResort: true,
    canHostEvent: false,
    amenities: ['pool', 'spa'],
    numberOfRooms: 50,
    capacity: 100,
    dailyPrice: 200.00,
    yearlyPrice: 50000.00,
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    address: 'Test Address',
  };

  for (const key in validData) {
    if (Array.isArray(validData[key])) {
      form1.append(key, JSON.stringify(validData[key]));
    } else {
      form1.append(key, String(validData[key]));
    }
  }

  try {
    const response1 = await axios.post(`${BASE_URL}/products/resort`, form1, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        ...form1.getHeaders(),
      },
    });
    console.log('✅ Test 1 PASSED: Resort created successfully with both prices');
    console.log('   Resort ID:', response1.data?.data?._id);
  } catch (error) {
    console.log('❌ Test 1 FAILED:', error.response?.data || error.message);
  }

  // Test 2: Create resort with only daily price (should succeed)
  console.log('\nTest 2: Creating resort with only daily price...');
  const form2 = new FormData();
  form2.append('images', fs.createReadStream(imagePath));
  
  const dailyOnlyData = {
    ...validData,
    title: 'Daily Only Resort',
    isAnnualResort: false,
    isDailyResort: true,
    dailyPrice: 150.00,
    yearlyPrice: undefined,
  };

  for (const key in dailyOnlyData) {
    if (dailyOnlyData[key] !== undefined) {
      if (Array.isArray(dailyOnlyData[key])) {
        form2.append(key, JSON.stringify(dailyOnlyData[key]));
      } else {
        form2.append(key, String(dailyOnlyData[key]));
      }
    }
  }

  try {
    const response2 = await axios.post(`${BASE_URL}/products/resort`, form2, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        ...form2.getHeaders(),
      },
    });
    console.log('✅ Test 2 PASSED: Resort created successfully with only daily price');
    console.log('   Resort ID:', response2.data?.data?._id);
  } catch (error) {
    console.log('❌ Test 2 FAILED:', error.response?.data || error.message);
  }

  // Test 3: Create resort with only yearly price (should succeed)
  console.log('\nTest 3: Creating resort with only yearly price...');
  const form3 = new FormData();
  form3.append('images', fs.createReadStream(imagePath));
  
  const yearlyOnlyData = {
    ...validData,
    title: 'Yearly Only Resort',
    isAnnualResort: true,
    isDailyResort: false,
    dailyPrice: undefined,
    yearlyPrice: 40000.00,
  };

  for (const key in yearlyOnlyData) {
    if (yearlyOnlyData[key] !== undefined) {
      if (Array.isArray(yearlyOnlyData[key])) {
        form3.append(key, JSON.stringify(yearlyOnlyData[key]));
      } else {
        form3.append(key, String(yearlyOnlyData[key]));
      }
    }
  }

  try {
    const response3 = await axios.post(`${BASE_URL}/products/resort`, form3, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        ...form3.getHeaders(),
      },
    });
    console.log('✅ Test 3 PASSED: Resort created successfully with only yearly price');
    console.log('   Resort ID:', response3.data?.data?._id);
  } catch (error) {
    console.log('❌ Test 3 FAILED:', error.response?.data || error.message);
  }

  // Test 4: Create resort with daily flag but no daily price (should fail)
  console.log('\nTest 4: Creating resort with daily flag but no daily price (should fail)...');
  const form4 = new FormData();
  form4.append('images', fs.createReadStream(imagePath));
  
  const invalidDailyData = {
    ...validData,
    title: 'Invalid Daily Resort',
    isAnnualResort: false,
    isDailyResort: true,
    dailyPrice: undefined,
    yearlyPrice: undefined,
  };

  for (const key in invalidDailyData) {
    if (invalidDailyData[key] !== undefined) {
      if (Array.isArray(invalidDailyData[key])) {
        form4.append(key, JSON.stringify(invalidDailyData[key]));
      } else {
        form4.append(key, String(invalidDailyData[key]));
      }
    }
  }

  try {
    await axios.post(`${BASE_URL}/products/resort`, form4, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        ...form4.getHeaders(),
      },
    });
    console.log('❌ Test 4 FAILED: Resort was created when it should have failed');
  } catch (error) {
    console.log('✅ Test 4 PASSED: Resort creation failed as expected');
    console.log('   Error:', error.response?.data?.message || error.message);
  }

  // Cleanup
  try {
    fs.unlinkSync(imagePath);
  } catch {}

  console.log('\n🎉 Resort validation tests completed!');
}

if (require.main === module) {
  testResortValidation().catch(console.error);
}

module.exports = { testResortValidation }; 