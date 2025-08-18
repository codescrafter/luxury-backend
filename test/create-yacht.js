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

function getYachtTestData() {
  return {
    ...testData.yacht,
    pricePerHour: 100,
    pricePerDay: 3500,
    securityDeposit: 1000,
    fuelIncluded: true,
    insuranceIncluded: true,
    licenseRequired: false,
    ageRequirement: 21,
    yachtType: 'Motor Yacht',
    lengthInFeet: 120,
    capacity: 20,
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    crewIncluded: true,
    captainIncluded: true,
    numberOfCabins: 8,
    numberOfBathrooms: 6,
    modelYear: 2022,
    brand: 'OceanMaster',
    color: 'white',
    luxuryFeaturesIncluded: true,
    minimumHours: 4,
    maintenanceNotes: 'Serviced quarterly, always clean',
    isFeatured: true,
  };
}

async function createYacht() {
  const form = new FormData();
  const imagePath = createTestImage();
  form.append('images', fs.createReadStream(imagePath));
  const data = getYachtTestData();

  for (const key in data) {
    if (Array.isArray(data[key])) form.append(key, JSON.stringify(data[key]));
    else form.append(key, String(data[key]));
  }

  try {
    const response = await axios.post(`${BASE_URL}/products/yacht`, form, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data?.data;
  } catch (error) {
    console.error(
      '❌ Failed to create yacht:',
      error.response?.data || error.message,
    );
    return null;
  } finally {
    try {
      fs.unlinkSync(imagePath);
    } catch {}
  }
}

module.exports = { createYacht };
