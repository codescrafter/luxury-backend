const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { createTestImage, BASE_URL, OWNER_ID, PARTNER_1_TOKEN } = require('./config');

function getKayakTestData() {
  return {
    title: 'Ocean Explorer Kayak',
    description: 'Sturdy and safe kayak for all sea adventures.',
    pricePerHour: 25,
    pricePerDay: 150,
    securityDeposit: 50,
    fuelIncluded: false,
    insuranceIncluded: true,
    licenseRequired: false,
    ageRequirement: 16,
    cancellationPolicy: ['24hr notice', 'Partial refund'],
    termsAndConditions: ['Wear vest', 'No rough waters'],
    tags: ['eco-friendly', 'single', 'seaworthy'],
    kayakType: 'Sea',
    capacity: 1,
    modelYear: 2021,
    color: 'Yellow',
    lifeJacketsIncluded: true,
    minimumHours: 1,
    maintenanceNotes: 'Inspected monthly',
    ownerId: OWNER_ID,
    lat: 24.8615,
    lng: 67.0099,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    address: 'Sandspit Beach, Karachi',
    isFeatured: true,
  };
}

async function createKayak() {
  const form = new FormData();
  const imagePath = createTestImage();
  form.append('images', fs.createReadStream(imagePath));
  const data = getKayakTestData();

  for (const key in data) {
    if (Array.isArray(data[key])) form.append(key, JSON.stringify(data[key]));
    else form.append(key, String(data[key]));
  }

  try {
    const response = await axios.post(`${BASE_URL}/products/kayak`, form, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data?.data;
  } catch (error) {
    console.error('❌ Failed to create kayak:', error.response?.data || error.message);
    return null;
  } finally {
    try { fs.unlinkSync(imagePath); } catch {}
  }
}

module.exports = { createKayak };
