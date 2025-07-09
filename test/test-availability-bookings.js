const { createUnavailability } = require('./unavailability-api');
const { createJetski } = require('./create-jetski');

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
}

if (require.main === module) {
  testUnavailabilityFlow();
} 