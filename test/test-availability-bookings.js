const { createUnavailability } = require('./unavailability-api');
const { createJetski } = require('./create-jetski');
const { default: axios } = require('axios');
const { BASE_URL, PARTNER_1_TOKEN } = require('./config');

async function testUnavailabilityFlow() {
  // 1. Create a product (jetski)
  const jetski = await createJetski();
  if (!jetski || !jetski._id) {
    console.error('❌ Could not create test jetski');
    return;
  }
  const productId = jetski._id;
  const productType = 'jetski';

  // 2. Block a time slot using unavailability
  const now = new Date();
  const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
  const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now

  const unavailability = await createUnavailability({
    productId,
    productType,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    unavailabilityType: 'partner_blocked',
  });
  if (!unavailability || unavailability.error) {
    console.error('❌ Could not create unavailability');
    return;
  }
  console.log('✅ Unavailability created:', unavailability);
  // get unavailability for product   @Get(':type/:productId/unavailability')
  try {
    const unavailabilityForProduct = await axios.get(
      `${BASE_URL}/products/${productType}/${productId}/unavailability`,
      {
        headers: {
          Authorization: `Bearer ${PARTNER_1_TOKEN}`,
        },
      },
    );
    if (!unavailabilityForProduct || unavailabilityForProduct.error) {
      console.error('❌ Could not get unavailability for product');
      return;
    }
    console.log(
      '✅ Unavailability for product:',
      unavailabilityForProduct.data.data,
    );
  } catch (error) {
    console.error(
      '❌ Failed to get unavailability for product:',
      error.response?.data || error.message,
    );
    return null;
  }
}

if (require.main === module) {
  testUnavailabilityFlow();
}
