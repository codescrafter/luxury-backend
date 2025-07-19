const axios = require('axios');
const { BASE_URL, ADMIN_TOKEN } = require('./config');

/**
 * Approve a product (Admin)
 */
async function approveProduct(type, id) {
  try {
    const res = await axios.put(`${BASE_URL}/products/${type}/${id}/approve`, null, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });
    console.log(`✅ Approved ${type}: ${id}`);
    return res.data?.data;
  } catch (error) {
    console.error(`❌ Failed to approve ${type}:`, error.response?.data || error.message);
    return null;
  }
}

module.exports = { approveProduct };
