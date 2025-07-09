const axios = require('axios');
const { BASE_URL, AUTH_TOKEN } = require('./config');

async function getPendingProducts(showRejected = false) {
  const res = await axios.get(`${BASE_URL}/products/pending`, {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    params: showRejected ? { showRejected: true } : {},
  });
  return res.data?.data || {};
}

async function testPendingProductVisibility(type, id) {
  // 1. Should NOT be present in pending by default
  const pending = await getPendingProducts(false);
  const foundDefault = (pending[type + 's'] || []).some((p) => p._id === id);
  if (foundDefault) {
    console.error(`❌ Rejected ${type} ${id} is present in pending products by default (should not be)`);
  } else {
    console.log(`✅ Rejected ${type} ${id} is NOT present in pending products by default (correct)`);
  }

  // 2. Should be present in pending with showRejected=true
  const pendingWithRejected = await getPendingProducts(true);
  const foundRejected = (pendingWithRejected[type + 's'] || []).some((p) => p._id === id);
  if (foundRejected) {
    console.log(`✅ Rejected ${type} ${id} is present in pending products when showRejected=true (correct)`);
  } else {
    console.error(`❌ Rejected ${type} ${id} is NOT present in pending products when showRejected=true (should be)`);
  }
}

module.exports = { testPendingProductVisibility }; 