const axios = require('axios');
const { BASE_URL, AUTH_TOKEN } = require('./config');

/**
 * Reject a product (Admin)
 */
async function rejectProduct(type, id) {
  try {
    const res = await axios.put(`${BASE_URL}/products/${type}/${id}/reject`, null, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    console.log(`✅ Rejected ${type}: ${id}`);
    return res.data?.data;
  } catch (error) {
    console.error(`❌ Failed to reject ${type}:`, error.response?.data || error.message);
    return null;
  }
}

module.exports = { rejectProduct };
