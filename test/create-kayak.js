const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { createTestImage, BASE_URL, OWNER_ID, PARTNER_1_TOKEN, testData } = require('./config');

function getKayakTestData() {
  return {
    ...testData.kayak,
    pricePerHour: 15.5,
    pricePerDay: 200,
    securityDeposit: 50,
    fuelIncluded: false,
    insuranceIncluded: true,
    licenseRequired: false,
    ageRequirement: 16,
    kayakType: 'Sit-on-top',
    capacity: 2,
    modelYear: 2021,
    color: 'Yellow',
    lifeJacketsIncluded: true,
    minimumHours: 1,
    maintenanceNotes: 'Inspected weekly',
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    isFeatured: false,
  };
}

async function createKayak(token = PARTNER_1_TOKEN) {
  const form = new FormData();
  const imagePath = createTestImage();
  form.append('images', fs.createReadStream(imagePath));
  const data = getKayakTestData();

  for (const key in data) {
    if (Array.isArray(data[key])) {
      form.append(key, JSON.stringify(data[key]));
    } else {
      form.append(key, String(data[key]));
    }
  }

  try {
    const response = await axios.post(`${BASE_URL}/products/kayak`, form, {
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
      '❌ Failed to create kayak:',
      error.response?.data || error.message,
    );
    return null;
  } finally {
    try {
      fs.unlinkSync(imagePath);
    } catch {}
  }
}

module.exports = { createKayak, getKayakTestData };
