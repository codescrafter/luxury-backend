const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { createTestImage, BASE_URL, AUTH_TOKEN, OWNER_ID } = require('./config');

function getSpeedboatTestData() {
  return {
    title: 'Speedy Wave',
    description: 'A fast and comfortable speedboat for thrilling rides.',
    pricePerHour: 150.5,
    pricePerDay: 1000,
    securityDeposit: 200,
    fuelIncluded: true,
    insuranceIncluded: false,
    licenseRequired: true,
    ageRequirement: 18,
    cancellationPolicy: ['48hr notice', 'full refund'],
    termsAndConditions: ['No smoking', 'No loud music'],
    tags: ['fast', 'luxury', 'fun'],
    engineType: 'V8',
    enginePower: '450 HP',
    maxSpeed: 85.5,
    capacity: 8,
    modelYear: 2021,
    brand: 'WaveMaster',
    color: 'red',
    lifeJacketsIncluded: true,
    minimumHours: 2,
    maintenanceNotes: 'Regular servicing every 6 months',
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    address: 'Beachfront Marina',
    isFeatured: true,
  };
}

async function createSpeedboat() {
  const form = new FormData();
  const imagePath = createTestImage();
  form.append('images', fs.createReadStream(imagePath));
  const data = getSpeedboatTestData();

  for (const key in data) {
    if (Array.isArray(data[key])) form.append(key, JSON.stringify(data[key]));
    else form.append(key, String(data[key]));
  }

  try {
    const response = await axios.post(`${BASE_URL}/products/speedboat`, form, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data?.data;
  } catch (error) {
    console.error('❌ Failed to create speedboat:', error.response?.data || error.message);
    return null;
  } finally {
    try { fs.unlinkSync(imagePath); } catch {}
  }
}

module.exports = { createSpeedboat };
