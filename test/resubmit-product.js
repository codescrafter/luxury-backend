const axios = require('axios');
const { BASE_URL, PARTNER_1_TOKEN } = require('./config');

/**
 * Resubmit a product (Partner)
 */
async function resubmitProduct(type, id) {
  try {
    const res = await axios.put(`${BASE_URL}/products/${type}/${id}/resubmit`, null, {
      headers: {
        Authorization: `Bearer ${PARTNER_1_TOKEN}`,
      },
    });
    console.log(`📤 Resubmitted ${type}: ${id}`);
    return res.data?.data;
  } catch (error) {
    console.error(`❌ Failed to resubmit ${type}:`, error.response?.data || error.message);
    return null;
  }
}

module.exports = { resubmitProduct };
