const axios = require('axios');
const { BASE_URL, PARTNER_1_TOKEN } = require('./config');

async function getPendingProducts() {
  const res = await axios.get(`${BASE_URL}/products/pending`, {
    headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
  });
  return res.data?.data || {};
}

async function testPendingProductVisibility(type, id) {
  // 1. Should NOT be present in pending
  const pending = await getPendingProducts();
  const found = (pending[type + 's'] || []).some((p) => p._id === id);
  if (found) {
    console.error(
      `❌ Rejected ${type} ${id} is present in pending products (should not be)`,
    );
  } else {
    console.log(
      `✅ Rejected ${type} ${id} is NOT present in pending products (correct)`,
    );
  }
}

module.exports = { testPendingProductVisibility };
