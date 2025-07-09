const { createJetski } = require('./create-jetski');
const { createKayak } = require('./create-kayak');
const { createYacht } = require('./create-yacht');
const { createSpeedboat } = require('./create-speedboat');
const { createResort } = require('./create-resort');
const { resubmitProduct } = require('./resubmit-product');

const { approveProduct } = require('./approve-product');
const { markProductForRevision } = require('./revision-product');
const { rejectProduct } = require('./reject-product');
const { getProducts } = require('./get-products');
const { testPendingProductVisibility } = require('./get-pending-products');
const axios = require('axios');

// Utility to fetch a single product by type and id
async function getProductById(type, id) {
  const products = await getProducts({ productType: type });
  return products.find((p) => p._id === id);
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const isProductVisible = async (type, id) => {
  const products = await getProducts({ productType: type });
  return products.some((p) => p._id === id);
};

const runFlow = async (type, createFn) => {
  const created = await createFn();
  if (!created || !created._id) {
    console.error(`❌ Failed to create ${type}`);
    return;
  }

  const id = created._id;
  console.log(`\n🚤 Created ${type}: ${id}`);

  // 0. Check that product is NOT visible before approval
  await sleep(500);
  let visible = await isProductVisible(type, id);
  console.log(
    visible
      ? `❌ ${type} is visible before approval (should not be)`
      : `✅ ${type} is NOT visible before approval (correct)`,
  );

  // 1. Approve
  await approveProduct(type, id);
  await sleep(500);
  visible = await isProductVisible(type, id);
  console.log(
    visible
      ? `✅ ${type} is visible after approval`
      : `❌ ${type} is NOT visible after approval`,
  );

  // 2. Revision
  await markProductForRevision(type, id);
  await sleep(500);
  visible = await isProductVisible(type, id);
  console.log(
    visible
      ? `❌ ${type} is STILL visible after revision (should not be)`
      : `✅ ${type} is NOT visible after revision (correct)`,
  );

  // 4. Reject
  await rejectProduct(type, id);
  await sleep(500);
  visible = await isProductVisible(type, id);
  console.log(
    visible
      ? `❌ ${type} is STILL visible after rejection`
      : `✅ ${type} is NOT visible after rejection`,
  );

  // 4b. Test rejected product visibility in pending API
  await testPendingProductVisibility(type, id);

  // 5. Approve again (FINAL)
  await approveProduct(type, id);
  await sleep(500);
  visible = await isProductVisible(type, id);
  console.log(
    visible
      ? `✅ ${type} is visible again after final approval`
      : `❌ ${type} is NOT visible after final approval`,
  );
};

const main = async () => {
  try {
    await runFlow('jetski', createJetski);
    await runFlow('kayak', createKayak);
    await runFlow('yacht', createYacht);
    await runFlow('speedboat', createSpeedboat);
    await runFlow('resort', createResort);
  } catch (error) {
    console.error(
      '❌ Error in main:',
      error?.response?.data || error.message || error,
    );
  }
};

main();
