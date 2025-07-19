const axios = require('axios');
const { createJetski } = require('./create-jetski');
const { approveProduct } = require('./approve-product');
const { BASE_URL, USER_TOKEN, PARTNER_1_TOKEN, PARTNER_2_TOKEN, ADMIN_TOKEN } = require('./config');

async function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

function logResult(desc, pass) {
  if (pass) console.log(`✅ ${desc}`);
  else console.error(`❌ ${desc}`);
}

async function runBookingFlow() {
  console.log('🚀 Booking API Flow Tests...');

  // 1. Create and approve a jetski product (as partner)
  const jetski = await createJetski(PARTNER_1_TOKEN);
  if (!jetski || !jetski._id) {
    console.error('❌ Could not create test jetski');
    return;
  }
  await approveProduct('jetski', jetski._id);
  await sleep(500);

  // 2. User creates a booking
  const now = new Date();
  const startTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2h from now
  const endTime = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4h from now
  const hours = (endTime - startTime) / (1000 * 60 * 60);
  const expectedPrice = Math.ceil(hours) * jetski.pricePerHour;
  const bookingPayload = {
    productId: jetski._id,
    productType: 'jetski',
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    totalPrice: expectedPrice,
    currency: 'USD',
    paymentMethod: 'cash',
    specialRequests: 'Test booking',
    adultsCount: 1,
    childrenCount: 0,
  };
  let booking;
  try {
    const res = await axios.post(`${BASE_URL}/products/booking`, bookingPayload, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    booking = res.data?.data;
    logResult('User can create booking', !!booking && booking._id);
  } catch (e) {
    logResult('User can create booking', false);
    return;
  }

  // 3. User cannot approve/reject/cancel/complete as user (forbidden)
  for (const action of ['approve', 'reject', 'cancel', 'complete']) {
    try {
      let url = `${BASE_URL}/products/booking/${booking._id}/${action}`;
      let method = action === 'reject' ? 'put' : 'post';
      let data = { partnerId: jetski.ownerId, userId: booking.consumerId };
      await axios({ url, method, data, headers: { Authorization: `Bearer ${USER_TOKEN}` } });
      logResult(`User forbidden from ${action} booking`, false);
    } catch (e) {
      logResult(`User forbidden from ${action} booking`, e.response?.status === 403 || e.response?.status === 400);
    }
  }

  // 4. Partner (not owner) cannot approve/reject/cancel/complete (forbidden)
  for (const action of ['approve', 'reject', 'cancel', 'complete']) {
    try {
      let url = `${BASE_URL}/products/booking/${booking._id}/${action}`;
      let method = action === 'reject' ? 'put' : 'post';
      let data = { partnerId: jetski.ownerId, userId: booking.consumerId };
      await axios({ url, method, data, headers: { Authorization: `Bearer ${PARTNER_2_TOKEN}` } });
      logResult(`Other partner forbidden from ${action} booking`, false);
    } catch (e) {
      logResult(`Other partner forbidden from ${action} booking`, e.response?.status === 403 || e.response?.status === 400);
    }
  }

  // 5. Partner (owner) approves booking
  let approved;
  try {
    const res = await axios.post(`${BASE_URL}/products/booking/${booking._id}/approve`, { partnerId: jetski.ownerId }, {
      headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
    });
    approved = res.data?.data;
    logResult('Partner can approve booking', approved && approved.bookingStatus === 'confirmed');
  } catch (e) {
    logResult('Partner can approve booking', false);
  }

  // 6. Partner (owner) completes booking
  let completed;
  try {
    const res = await axios.post(`${BASE_URL}/products/booking/${booking._id}/complete`, { partnerId: jetski.ownerId }, {
      headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
    });
    completed = res.data?.data;
    logResult('Partner can complete booking', completed && completed.bookingStatus === 'completed');
  } catch (e) {
    logResult('Partner can complete booking', false);
  }

  // 7. Partner (owner) cancels booking (should fail, already completed)
  try {
    await axios.post(`${BASE_URL}/products/booking/${booking._id}/cancel`, { userId: jetski.ownerId }, {
      headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
    });
    logResult('Partner cannot cancel completed booking', false);
  } catch (e) {
    logResult('Partner cannot cancel completed booking', e.response?.status === 400);
  }

  // 8. Get booking details as user and partner
  try {
    const resUser = await axios.get(`${BASE_URL}/products/booking/${booking._id}`, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    logResult('User can get booking details', resUser.data?.data?._id === booking._id);
    const resPartner = await axios.get(`${BASE_URL}/products/booking/${booking._id}`, {
      headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
    });
    logResult('Partner can get booking details', resPartner.data?.data?._id === booking._id);
    // Other partner forbidden
    try {
      await axios.get(`${BASE_URL}/products/booking/${booking._id}`, {
        headers: { Authorization: `Bearer ${PARTNER_2_TOKEN}` },
      });
      logResult('Other partner forbidden from booking details', false);
    } catch (e) {
      logResult('Other partner forbidden from booking details', e.response?.status === 403);
    }
  } catch (e) {
    logResult('Booking details retrieval failed', false);
  }

  // 9. Create, then reject a new booking (status: cancelled)
  const bookingPayload2 = { ...bookingPayload, startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), endTime: new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString() };
  let booking2;
  try {
    const res = await axios.post(`${BASE_URL}/products/booking`, bookingPayload2, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    booking2 = res.data?.data;
    logResult('User can create second booking', !!booking2 && booking2._id);
  } catch (e) {
    logResult('User can create second booking', false);
    return;
  }
  try {
    const res = await axios.put(`${BASE_URL}/products/booking/${booking2._id}/reject`, { partnerId: jetski.ownerId, cancellationReason: 'Not available' }, {
      headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
    });
    logResult('Partner can reject booking', res.data?.data?.bookingStatus === 'cancelled');
  } catch (e) {
    logResult('Partner can reject booking', false);
  }
  // User cancels a pending booking
  const bookingPayload3 = { ...bookingPayload, startTime: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(), endTime: new Date(now.getTime() + 50 * 60 * 60 * 1000).toISOString() };
  let booking3;
  try {
    const res = await axios.post(`${BASE_URL}/products/booking`, bookingPayload3, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    booking3 = res.data?.data;
    logResult('User can create third booking', !!booking3 && booking3._id);
  } catch (e) {
    logResult('User can create third booking', false);
    return;
  }
  try {
    const res = await axios.post(`${BASE_URL}/products/booking/${booking3._id}/cancel`, { userId: booking3.consumerId }, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    logResult('User can cancel their own booking', res.data?.data?.bookingStatus === 'cancelled');
  } catch (e) {
    logResult('User can cancel their own booking', false);
  }

  console.log('🎉 Booking API Flow Tests Completed!');
}

if (require.main === module) {
  runBookingFlow();
} 