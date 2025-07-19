const axios = require('axios');
const { createJetski } = require('./create-jetski');
const { approveProduct } = require('./approve-product');
const { BASE_URL, USER_TOKEN, PARTNER_1_TOKEN, OWNER_ID } = require('./config');

async function createBooking(product) {
  const now = new Date();
  const startTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  const endTime = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now
  const bookingDto = {
    productId: product._id,
    productType: 'jetski',
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    totalPrice: 100,
    currency: 'USD',
    paymentMethod: 'cash',
    specialRequests: 'Test booking',
    adultsCount: 2,
    childrenCount: 0,
  };
  try {
    const res = await axios.post(`${BASE_URL}/products/booking`, bookingDto, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    return res.data.data;
  } catch (error) {
    console.error(
      '❌ Failed to create booking:',
      error.response?.data || error.message,
    );
    return null;
  }
}

async function approveBooking(bookingId) {
  try {
    const res = await axios.post(
      `${BASE_URL}/products/booking/${bookingId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` } },
    );
    return res.data.data;
  } catch (error) {
    console.error(
      '❌ Failed to approve booking:',
      error.response?.data || error.message,
    );
    return null;
  }
}

async function rejectBooking(bookingId) {
  try {
    const res = await axios.post(
      `${BASE_URL}/products/booking/${bookingId}/reject`,
      { cancellationReason:"Test" },
      { headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` } },
    );
    return res.data.data;
  } catch (error) {
    console.error(
      '❌ Failed to reject booking:',
      error.response?.data || error.message,
    );
    return null;
  }
}

async function cancelBooking(bookingId) {
  try {
    const res = await axios.post(
      `${BASE_URL}/products/booking/${bookingId}/cancel`,
      { reason: 'Test cancel' },
      { headers: { Authorization: `Bearer ${USER_TOKEN}` } },
    );
    return res.data.data;
  } catch (error) {
    console.error(
      '❌ Failed to cancel booking:',
      error.response?.data || error.message,
    );
    return null;
  }
}

async function completeBooking(bookingId) {
  try {
    const res = await axios.post(
      `${BASE_URL}/products/booking/${bookingId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` } },
    );
    return res.data.data;
  } catch (error) {
    console.error(
      '❌ Failed to complete booking:',
      error.response?.data || error.message,
    );
    return null;
  }
}

async function getBookingsForConsumer(consumerId) {
  try {
    const res = await axios.get(
      `${BASE_URL}/products/consumer/${consumerId}/bookings`,
      { headers: { Authorization: `Bearer ${USER_TOKEN}` } },
    );
    return res.data.data;
  } catch (error) {
    console.error(
      '❌ Failed to get bookings for consumer:',
      error.response?.data || error.message,
    );
    return [];
  }
}

async function getBookingsForPartner(partnerId) {
  try {
    const res = await axios.get(
      `${BASE_URL}/products/partner/${partnerId}/bookings`,
      { headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` } },
    );
    return res.data.data;
  } catch (error) {
    console.error(
      '❌ Failed to get bookings for partner:',
      error.response?.data || error.message,
    );
    return [];
  }
}

async function getBookingById(bookingId) {
  try {
    const res = await axios.get(`${BASE_URL}/products/booking/${bookingId}`, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    return res.data.data;
  } catch (error) {
    console.error(
      '❌ Failed to get booking by ID:',
      error.response?.data || error.message,
    );
    return null;
  }
}

async function main() {
  // 1. Create product
  const product = await createJetski();
  if (!product || !product._id) {
    console.error('❌ Could not create test jetski');
    return;
  }
  console.log('✅ Created jetski:', product._id);

  // 2. Approve product
  await approveProduct('jetski', product._id);
  console.log('✅ Approved jetski');

  // 3. Create booking
  const booking = await createBooking(product);
  if (!booking || !booking._id) {
    console.error('❌ Could not create booking');
    return;
  }
  console.log('✅ Created booking:', booking._id);

  // 4. Approve booking
  const approved = await approveBooking(booking._id);
  if (approved) {
    console.log('✅ Approved booking:', booking._id);
  }

  // 5. Reject booking (should fail if already approved)
 const res= await rejectBooking(booking._id);
 if (res) {
    console.log('✅ Rejected booking:', booking._id);
  }
 


//   // 6. Cancel booking (as user)
const res1=  await cancelBooking(booking._id);
if (res1) {
  console.log('✅ Cancelled booking:', booking._id);
}

//   // 7. Complete booking (as partner)
 const res3= await completeBooking(booking._id);
  if (res3) {
    console.log('✅ Completed booking:', booking._id);
  }

  // 8. Get bookings for consumer
  const consumerBookings = await getBookingsForConsumer(
    booking.consumerId || booking.userId || OWNER_ID,
  );
  console.log('✅ Bookings for consumer:', consumerBookings.length);

//   // 9. Get bookings for partner
  const partnerBookings = await getBookingsForPartner(
    product.ownerId || OWNER_ID,
  );
  console.log('✅ Bookings for partner:', partnerBookings.length);

//   // 10. Get booking by ID
  const bookingById = await getBookingById(booking._id);
  console.log("booking",bookingById)
  if (bookingById) {
    console.log('✅ Fetched booking by ID:', bookingById._id);
  }
}

if (require.main === module) {
  main();
}
