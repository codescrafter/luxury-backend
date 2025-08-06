const axios = require('axios');
const { createJetski } = require('./create-jetski');
const { createYacht } = require('./create-yacht');
const { approveProduct } = require('./approve-product');
const { BASE_URL, USER_TOKEN, PARTNER_1_TOKEN, OWNER_ID } = require('./config');

async function createBooking(product) {
  const now = new Date();
  const startTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  const endTime = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now
  const bookingDto = {
    productId: product._id,
    productType: 'yacht',
    startTime: "2025-07-22T19:00",
    endTime: "2025-07-22T20:00",
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
    console.log(res.data)
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
    const res = await axios.get(`${BASE_URL}/products/booking/consumer/${consumerId}`, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    return res.data?.data || [];
  } catch (error) {
    console.error(
      '❌ Failed to fetch consumer bookings:',
      error.response?.data || error.message,
    );
    return [];
  }
}

async function getBookingsForPartner(partnerId) {
  try {
    const res = await axios.get(`${BASE_URL}/products/booking/partner/${partnerId}`, {
      headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
    });
    return res.data?.data || [];
  } catch (error) {
    console.error(
      '❌ Failed to fetch partner bookings:',
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
    return res.data?.data || null;
  } catch (error) {
    console.error(
      '❌ Failed to fetch booking by id:',
      error.response?.data || error.message,
    );
    return null;
  }
}

// Test dual-language functionality for bookings
async function testBookingDualLanguage() {
  console.log('🧪 Testing dual-language functionality for bookings...\n');

  try {
    // Create a product first
    console.log('📝 Creating a yacht for booking test...');
    const yacht = await createYacht();
    if (!yacht) {
      console.log('❌ Failed to create yacht for booking test');
      return;
    }

    // Approve the product so it can be booked
    console.log('📝 Approving yacht for booking...');
    const approvedYacht = await approveProduct(yacht._id, 'yacht');
    if (!approvedYacht) {
      console.log('❌ Failed to approve yacht for booking');
      return;
    }

    // Create a booking
    console.log('📝 Creating booking...');
    const booking = await createBooking(yacht);
    if (!booking) {
      console.log('❌ Failed to create booking');
      return;
    }

    console.log(`✅ Booking created with ID: ${booking._id}`);

    // Test booking retrieval in English
    console.log('\n📝 Testing booking retrieval in English...');
    const bookingEn = await getBookingById(booking._id);
    if (bookingEn) {
      console.log('✅ Booking retrieved in English');
      console.log(`   Product Title: ${bookingEn.product?.title || 'N/A'}`);
      console.log(`   Product City: ${bookingEn.product?.city || 'N/A'}`);
      console.log(`   Product Country: ${bookingEn.product?.country || 'N/A'}`);
    } else {
      console.log('❌ Failed to retrieve booking in English');
    }

    // Test booking retrieval in Arabic
    console.log('\n📝 Testing booking retrieval in Arabic...');
    try {
      const res = await axios.get(`${BASE_URL}/products/booking/${booking._id}`, {
        headers: { Authorization: `Bearer ${USER_TOKEN}` },
        params: { lang: 'ar' }
      });
      
      if (res.data.success) {
        const bookingAr = res.data.data;
        console.log('✅ Booking retrieved in Arabic');
        console.log(`   Product Title: ${bookingAr.product?.title || 'N/A'}`);
        console.log(`   Product City: ${bookingAr.product?.city || 'N/A'}`);
        console.log(`   Product Country: ${bookingAr.product?.country || 'N/A'}`);
        
        // Compare English and Arabic product information
        if (bookingEn && bookingAr) {
          const titleDifferent = bookingEn.product?.title !== bookingAr.product?.title;
          const cityDifferent = bookingEn.product?.city !== bookingAr.product?.city;
          
          console.log(`   Title different (EN vs AR): ${titleDifferent}`);
          console.log(`   City different (EN vs AR): ${cityDifferent}`);
        }
      } else {
        console.log('❌ Failed to retrieve booking in Arabic');
      }
    } catch (error) {
      console.log('❌ Failed to retrieve booking in Arabic:', error.message);
    }

    // Test consumer bookings in both languages
    console.log('\n📝 Testing consumer bookings in both languages...');
    const consumerBookingsEn = await getBookingsForConsumer(OWNER_ID);
    console.log(`✅ Consumer bookings in English: ${consumerBookingsEn.length} found`);
    
    try {
      const res = await axios.get(`${BASE_URL}/products/booking/consumer/${OWNER_ID}`, {
        headers: { Authorization: `Bearer ${USER_TOKEN}` },
        params: { lang: 'ar' }
      });
      
      if (res.data.success) {
        const consumerBookingsAr = res.data.data;
        console.log(`✅ Consumer bookings in Arabic: ${consumerBookingsAr.length} found`);
        
        if (consumerBookingsEn.length > 0 && consumerBookingsAr.length > 0) {
          const enBooking = consumerBookingsEn[0];
          const arBooking = consumerBookingsAr[0];
          
          console.log(`   English product: ${enBooking.product?.title} - ${enBooking.product?.city}`);
          console.log(`   Arabic product: ${arBooking.product?.title} - ${arBooking.product?.city}`);
        }
      }
    } catch (error) {
      console.log('❌ Failed to retrieve consumer bookings in Arabic:', error.message);
    }

    // Test partner bookings in both languages
    console.log('\n📝 Testing partner bookings in both languages...');
    const partnerBookingsEn = await getBookingsForPartner(OWNER_ID);
    console.log(`✅ Partner bookings in English: ${partnerBookingsEn.length} found`);
    
    try {
      const res = await axios.get(`${BASE_URL}/products/booking/partner/${OWNER_ID}`, {
        headers: { Authorization: `Bearer ${PARTNER_1_TOKEN}` },
        params: { lang: 'ar' }
      });
      
      if (res.data.success) {
        const partnerBookingsAr = res.data.data;
        console.log(`✅ Partner bookings in Arabic: ${partnerBookingsAr.length} found`);
        
        if (partnerBookingsEn.length > 0 && partnerBookingsAr.length > 0) {
          const enBooking = partnerBookingsEn[0];
          const arBooking = partnerBookingsAr[0];
          
          console.log(`   English product: ${enBooking.product?.title} - ${enBooking.product?.city}`);
          console.log(`   Arabic product: ${arBooking.product?.title} - ${arBooking.product?.city}`);
        }
      }
    } catch (error) {
      console.log('❌ Failed to retrieve partner bookings in Arabic:', error.message);
    }

    // Test language field validation for bookings
    console.log('\n📝 Testing language field validation for bookings...');
    if (bookingEn && bookingEn.product) {
      const hasLanguageFields = bookingEn.product.titleEn || bookingEn.product.titleAr || 
                               bookingEn.product.cityEn || bookingEn.product.cityAr;
      
      if (!hasLanguageFields) {
        console.log('✅ Language-specific fields properly cleaned from booking response');
      } else {
        console.log('❌ Language-specific fields found in booking response');
        console.log(`   titleEn: ${bookingEn.product.titleEn}`);
        console.log(`   titleAr: ${bookingEn.product.titleAr}`);
      }
    }

  } catch (error) {
    console.error('❌ Booking dual-language test failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Booking API Tests...\n');

  // Create a yacht
  const yacht = await createYacht();
  if (!yacht) {
    console.log('❌ Failed to create yacht');
    return;
  }

  // Approve the yacht
  const approvedYacht = await approveProduct(yacht._id, 'yacht');
  if (!approvedYacht) {
    console.log('❌ Failed to approve yacht');
    return;
  }

  // Create a booking
  const booking = await createBooking(yacht);
  if (!booking) {
    console.log('❌ Failed to create booking');
    return;
  }

  console.log(`✅ Booking created: ${booking._id}`);

  // Test booking operations
  console.log('\n📝 Testing booking operations...');
  
  // Approve booking
  const approvedBooking = await approveBooking(booking._id);
  console.log(approvedBooking ? '✅ Booking approved' : '❌ Failed to approve booking');

  // Get booking by ID
  const retrievedBooking = await getBookingById(booking._id);
  console.log(retrievedBooking ? '✅ Booking retrieved' : '❌ Failed to retrieve booking');

  // Get consumer bookings
  const consumerBookings = await getBookingsForConsumer(OWNER_ID);
  console.log(`✅ Consumer bookings: ${consumerBookings.length} found`);

  // Get partner bookings
  const partnerBookings = await getBookingsForPartner(OWNER_ID);
  console.log(`✅ Partner bookings: ${partnerBookings.length} found`);

  // Test dual-language functionality
  await testBookingDualLanguage();

  console.log('\n🎉 Booking API tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createBooking,
  approveBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
  getBookingsForConsumer,
  getBookingsForPartner,
  getBookingById,
  testBookingDualLanguage
};
