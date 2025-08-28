const axios = require('axios');
const { BASE_URL, ADMIN_TOKEN } = require('./config');

/**
 * Mark a product for revision (Admin)
 */
async function markProductForRevision(type, id) {
  try {
    const res = await axios.put(
      `${BASE_URL}/products/${type}/${id}/revision`,
      null,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      },
    );
    console.log(`🔄 Marked ${type} for revision: ${id}`);
    return res.data?.data;
  } catch (error) {
    console.error(
      `❌ Failed to mark ${type} for revision:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

module.exports = { markProductForRevision };
