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

function getJetskiTestData() {
  return {
    ...testData.jetski,
    pricePerHour: 22.2,
    pricePerDay: 300,
    securityDeposit: 100,
    fuelIncluded: true,
    insuranceIncluded: true,
    licenseRequired: false,
    ageRequirement: 18,
    engineType: '4-stroke',
    enginePower: '180 HP',
    maxSpeed: 90,
    capacity: 2,
    brand: 'Yamaha',
    modelYear: 2022,
    jetskiType: 'Recreational',
    color: 'Blue',
    lifeJacketsIncluded: true,
    minimumHours: 2,
    maintenanceNotes: 'Regularly maintained every month',
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    isFeatured: true,
  };
}

async function createJetski(token = PARTNER_1_TOKEN) {
  const form = new FormData();
  const imagePath = createTestImage();
  form.append('images', fs.createReadStream(imagePath));
  const data = getJetskiTestData();

  for (const key in data) {
    if (Array.isArray(data[key])) {
      form.append(key, JSON.stringify(data[key]));
    } else {
      form.append(key, String(data[key]));
    }
  }

  try {
    const response = await axios.post(`${BASE_URL}/products/jetski`, form, {
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
      '❌ Failed to create jetski:',
      error.response?.data || error.message,
    );
    return null;
  } finally {
    try {
      fs.unlinkSync(imagePath);
    } catch {}
  }
}

module.exports = { createJetski, getJetskiTestData };
