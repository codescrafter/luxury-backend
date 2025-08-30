const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
let authToken = '';
let partnerToken = '';
let bookingId = '';
let productId = '68ad686ea5208006878b4c15'; // The product ID from your URL

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
};

const testPartner = {
  email: 'partner@example.com',
  password: 'password123',
};

const testBooking = {
  productId: productId,
  productType: 'jetski',
  startTime: '2024-12-25T10:00:00.000Z',
  endTime: '2024-12-25T18:00:00.000Z',
  totalPrice: 500,
  currency: 'USD',
  paymentMethod: 'credit_card',
  adultsCount: 2,
  childrenCount: 0,
};

async function loginUser() {
  try {
    console.log('🔐 Logging in as user...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = response.data.data.token;
    console.log('✅ User login successful');
    return authToken;
  } catch (error) {
    console.error(
      '❌ User login failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function loginPartner() {
  try {
    console.log('🔐 Logging in as partner...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testPartner);
    partnerToken = response.data.data.token;
    console.log('✅ Partner login successful');
    return partnerToken;
  } catch (error) {
    console.error(
      '❌ Partner login failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function createBooking() {
  try {
    console.log('📝 Creating booking...');
    const response = await axios.post(
      `${BASE_URL}/products/booking`,
      testBooking,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    bookingId = response.data.data._id;
    console.log('✅ Booking created:', bookingId);
    console.log('Initial payment status:', response.data.data.paymentStatus);
    console.log('Initial booking status:', response.data.data.bookingStatus);
    console.log('Product ID:', response.data.data.productId);
    return bookingId;
  } catch (error) {
    console.error(
      '❌ Booking creation failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function approveBooking() {
  try {
    console.log('✅ Approving booking...');
    const response = await axios.post(
      `${BASE_URL}/products/booking/${bookingId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${partnerToken}` },
      },
    );
    console.log('✅ Booking approved');
    console.log(
      'Booking status after approval:',
      response.data.data.bookingStatus,
    );
    console.log(
      'Payment status after approval:',
      response.data.data.paymentStatus,
    );
    return response.data;
  } catch (error) {
    console.error(
      '❌ Booking approval failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function updatePaymentStatus(status, transactionId = null) {
  try {
    console.log(`💰 Updating payment status to: ${status}`);
    const payload = {
      paymentStatus: status,
    };

    if (transactionId) {
      payload.transactionId = transactionId;
    }

    const response = await axios.put(
      `${BASE_URL}/products/booking/${bookingId}/payment-status`,
      payload,
      {
        headers: { Authorization: `Bearer ${partnerToken}` },
      },
    );
    console.log('✅ Payment status updated');
    console.log(
      'New payment status:',
      response.data.data.booking.paymentStatus,
    );
    console.log(
      'New booking status:',
      response.data.data.booking.bookingStatus,
    );
    return response.data.data;
  } catch (error) {
    console.error(
      '❌ Payment status update failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function checkUnavailability() {
  try {
    console.log('🔍 Checking unavailability for product...');
    console.log('Product ID:', productId);
    console.log('Product Type: jetski');

    const response = await axios.get(
      `${BASE_URL}/products/jetski/${productId}/unavailability`,
      {
        headers: { Authorization: `Bearer ${partnerToken}` },
      },
    );
    console.log('✅ Unavailability check successful');
    console.log('Unavailability records:', response.data.data);
    console.log('Number of records:', response.data.data.length);

    if (response.data.data.length > 0) {
      response.data.data.forEach((record, index) => {
        console.log(`Record ${index + 1}:`, {
          id: record._id,
          productId: record.productId,
          productType: record.productType,
          unavailabilityType: record.unavailabilityType,
          startTime: record.startTime,
          endTime: record.endTime,
          consumerId: record.consumerId,
        });
      });
    }

    return response.data.data;
  } catch (error) {
    console.error(
      '❌ Unavailability check failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function checkBookingDetails() {
  try {
    console.log('📋 Checking booking details...');
    const response = await axios.get(
      `${BASE_URL}/products/booking/${bookingId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    console.log('✅ Booking details retrieved');
    console.log('Booking:', {
      id: response.data.data._id,
      productId: response.data.data.productId,
      productType: response.data.data.productType,
      bookingStatus: response.data.data.bookingStatus,
      paymentStatus: response.data.data.paymentStatus,
      startTime: response.data.data.startTime,
      endTime: response.data.data.endTime,
      consumerId: response.data.data.consumerId,
      partnerId: response.data.data.partnerId,
    });
    return response.data.data;
  } catch (error) {
    console.error(
      '❌ Booking details check failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function debugUnavailabilityFlow() {
  try {
    console.log('🚀 Starting Unavailability Debug Flow...\n');

    // Step 1: Login as user and partner
    await loginUser();
    await loginPartner();

    // Step 2: Create booking
    await createBooking();

    // Step 3: Check unavailability before approval (should be empty)
    console.log('\n--- Step 3: Check unavailability before approval ---');
    await checkUnavailability();

    // Step 4: Approve booking
    console.log('\n--- Step 4: Approve booking ---');
    await approveBooking();

    // Step 5: Check unavailability after approval (should have 1 record)
    console.log('\n--- Step 5: Check unavailability after approval ---');
    await checkUnavailability();

    // Step 6: Check booking details
    console.log('\n--- Step 6: Check booking details ---');
    await checkBookingDetails();

    // Step 7: Update payment status to PAID
    console.log('\n--- Step 7: Update payment to PAID ---');
    await updatePaymentStatus('paid', 'txn_123456789');

    // Step 8: Check unavailability after payment (should still have 1 record)
    console.log('\n--- Step 8: Check unavailability after payment ---');
    await checkUnavailability();

    console.log('\n🎉 Unavailability Debug Flow Completed!');
  } catch (error) {
    console.error('\n💥 Unavailability Debug Flow Failed:', error.message);
  }
}

// Run the debug
debugUnavailabilityFlow();
