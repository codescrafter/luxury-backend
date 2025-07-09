const axios = require('axios');
const { BASE_URL, AUTH_TOKEN } = require('./config');

async function getProducts(filters = {}) {
  try {
    const res = await axios.get(`${BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      params: filters,
    });
    return res.data?.data || [];

  } catch (error) {
    console.error(
      '❌ Failed to fetch products:',
      error.response?.data || error.message,
    );
    return [];
  }
}

module.exports = { getProducts };
