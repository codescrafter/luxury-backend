const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { createTestImage, BASE_URL, OWNER_ID, PARTNER_1_TOKEN, testData } = require('./config');

function getResortTestData() {
  return {
    ...testData.resort,
    isAnnualResort: true,
    isDailyResort: true,
    canHostEvent: false,
    numberOfRooms: 120,
    numberOfBathrooms: 120,
    totalAreaInSqFt: 50000,
    starRating: 4.8,
    dailyPrice: 150.00,
    yearlyPrice: 45000.00,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    capacity: 240,
    petFriendly: true,
    smokingAllowed: false,
    parkingAvailable: true,
    wifiAvailable: true,
    insuranceProvided: true,
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    isFeatured: true,
    averageRating: 4.6,
    reviewCount: 85,
  };
}

async function createResort() {
  const form = new FormData();
  const imagePath = createTestImage();
  form.append('images', fs.createReadStream(imagePath));
  const data = getResortTestData();

  for (const key in data) {
    if (Array.isArray(data[key])) form.append(key, JSON.stringify(data[key]));
    else form.append(key, String(data[key]));
  }

  try {
    const response = await axios.post(`${BASE_URL}/products/resort`, form, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data?.data;
  } catch (error) {
    console.error('❌ Failed to create resort:', error.response?.data || error.message);
    return null;
  } finally {
    try { fs.unlinkSync(imagePath); } catch {}
  }
}

module.exports = { createResort };
