const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const {
  createTestImage,
  BASE_URL,
  OWNER_ID,
  PARTNER_1_TOKEN,
  testData,
} = require('./config');

function getSpeedboatTestData() {
  return {
    ...testData.speedboat,
    pricePerHour: 150,
    pricePerDay: 1200,
    securityDeposit: 500,
    fuelIncluded: true,
    insuranceIncluded: true,
    licenseRequired: true,
    ageRequirement: 25,
    engineType: 'V8',
    enginePower: '350 HP',
    maxSpeed: 120,
    capacity: 8,
    modelYear: 2023,
    brand: 'Sea Ray',
    color: 'White',
    lifeJacketsIncluded: true,
    minimumHours: 4,
    maintenanceNotes: 'Professional maintenance every 100 hours',
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    isFeatured: true,
  };
}

async function createSpeedboat(token = PARTNER_1_TOKEN) {
  const form = new FormData();
  const imagePath = createTestImage();
  form.append('images', fs.createReadStream(imagePath));
  const data = getSpeedboatTestData();

  for (const key in data) {
    if (Array.isArray(data[key])) {
      form.append(key, JSON.stringify(data[key]));
    } else {
      form.append(key, String(data[key]));
    }
  }

  try {
    const response = await axios.post(`${BASE_URL}/products/speedboat`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data?.data;
  } catch (error) {
    console.error(
      '❌ Failed to create speedboat:',
      error.response?.data || error.message,
    );
    return null;
  } finally {
    try {
      fs.unlinkSync(imagePath);
    } catch {}
  }
}

module.exports = { createSpeedboat, getSpeedboatTestData };
