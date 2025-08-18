const { createJetski } = require('./create-jetski');
const { createKayak } = require('./create-kayak');
const { createYacht } = require('./create-yacht');
const { createSpeedboat } = require('./create-speedboat');
const { createResort } = require('./create-resort');
const axios = require('axios');
const { BASE_URL, PARTNER_1_TOKEN } = require('./config');

async function editProduct(type, id, updates) {
  try {
    const res = await axios.put(`${BASE_URL}/products/${type}/${id}`, updates, {
      headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
    });
    console.log(`✏️ Edited ${type}: ${id}`);
    return res.data?.data;
  } catch (error) {
    console.error(
      `❌ Failed to edit ${type}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

async function runEditTest(type, createFn, editField, newValue) {
  const created = await createFn();
  if (!created || !created._id) {
    console.error(`❌ Failed to create ${type}`);
    return;
  }
  const id = created._id;
  console.log(`\n🚤 Created ${type}: ${id}`);
  const updates = { [editField]: newValue };
  const edited = await editProduct(type, id, updates);
  if (edited && edited[editField] === newValue) {
    console.log(
      `✅ ${type} edit reflected: ${editField} = ${edited[editField]}`,
    );
  } else {
    console.error(
      `❌ ${type} edit NOT reflected: expected ${editField} = ${newValue}`,
    );
  }
}

async function main() {
  await runEditTest('jetski', createJetski, 'title', 'Edited Jet Ski');
  await runEditTest('kayak', createKayak, 'title', 'Edited Kayak');
  await runEditTest('yacht', createYacht, 'title', 'Edited Yacht');
  await runEditTest('speedboat', createSpeedboat, 'title', 'Edited Speedboat');
  await runEditTest('resort', createResort, 'title', 'Edited Resort');
}

main();
