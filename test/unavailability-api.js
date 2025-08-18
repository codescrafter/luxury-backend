const axios = require('axios');
const { BASE_URL, OWNER_ID, PARTNER_1_TOKEN } = require('./config');

async function createUnavailability({
  productId,
  productType,
  startTime,
  endTime,
  consumerId,
  unavailabilityType = 'booked',
}) {
  try {
    const response = await axios.post(
      `${BASE_URL}/products/unavailability`,
      {
        productId,
        productType,
        startTime,
        endTime,
        consumerId,
        unavailabilityType,
      },
      {
        headers: {
          Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      '❌ Failed to create unavailability:',
      error.response?.data || error.message,
    );
    return null;
  }
}

// Add more helpers as needed, e.g., to check or delete unavailability

module.exports = {
  createUnavailability,
};
