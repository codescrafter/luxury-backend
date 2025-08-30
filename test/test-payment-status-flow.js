const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let partnerToken = '';
let bookingId = '';

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
  productId: '507f1f77bcf86cd799439011', // Replace with actual product ID
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
    console.error('❌ User login failed:', error.response?.data || error.message);
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
    console.error('❌ Partner login failed:', error.response?.data || error.message);
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
    console.log('Booking status after approval:', response.data.data.bookingStatus);
    console.log('Payment status after approval:', response.data.data.paymentStatus);
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
    console.log('New payment status:', response.data.data.booking.paymentStatus);
    console.log('New booking status:', response.data.data.booking.bookingStatus);
    console.log('Changes:', response.data.data.changes);
    return response.data.data;
  } catch (error) {
    console.error(
      '❌ Payment status update failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function checkQrCode() {
  try {
    console.log('🔍 Checking QR code availability...');
    const response = await axios.get(
      `${BASE_URL}/qr/booking/${bookingId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    console.log('✅ QR code found');
    console.log('QR status:', response.data.data.qrCode.status);
    console.log('QR image URL:', response.data.data.qrImageUrl);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('❌ QR code not found (expected for unpaid bookings)');
      return null;
    }
    console.error('❌ QR code check failed:', error.response?.data || error.message);
    throw error;
  }
}

async function verifyQrCode(token) {
  try {
    console.log('🔍 Verifying QR code...');
    const response = await axios.post(`${BASE_URL}/qr/verify`, { token });
    console.log('✅ QR code verified successfully');
    return response.data.data;
  } catch (error) {
    console.error(
      '❌ QR verification failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function testPaymentStatusFlow() {
  try {
    console.log('🚀 Starting Payment Status Flow Test...\n');

    // Step 1: Login as user and partner
    await loginUser();
    await loginPartner();

    // Step 2: Create booking
    await createBooking();

    // Step 3: Check initial QR code (should not exist)
    console.log('\n--- Step 3: Check QR before payment ---');
    await checkQrCode();

    // Step 4: Approve booking (should not generate QR)
    console.log('\n--- Step 4: Approve booking ---');
    await approveBooking();
    
    // Step 5: Check QR after approval (should not exist)
    console.log('\n--- Step 5: Check QR after approval ---');
    await checkQrCode();

    // Step 6: Update payment status to PAID
    console.log('\n--- Step 6: Update payment to PAID ---');
    const paidResult = await updatePaymentStatus('paid', 'txn_123456789');
    
    // Step 7: Check QR after payment (should exist)
    console.log('\n--- Step 7: Check QR after payment ---');
    const qrData = await checkQrCode();
    
    if (qrData) {
      // Step 8: Verify QR code
      console.log('\n--- Step 8: Verify QR code ---');
      await verifyQrCode(qrData.token);
      
      // Step 9: Try to verify the same QR again (should fail)
      console.log('\n--- Step 9: Try to verify QR again ---');
      try {
        await verifyQrCode(qrData.token);
        console.log('❌ QR should not be redeemable twice');
      } catch (error) {
        console.log('✅ QR correctly rejected on second attempt');
      }
    }

    // Step 10: Test payment failure
    console.log('\n--- Step 10: Test payment failure ---');
    await updatePaymentStatus('failed');
    
    // Step 11: Check QR after payment failure (should not exist)
    console.log('\n--- Step 11: Check QR after payment failure ---');
    await checkQrCode();

    // Step 12: Test payment refund
    console.log('\n--- Step 12: Test payment refund ---');
    await updatePaymentStatus('refunded');
    
    // Step 13: Check QR after refund (should not exist)
    console.log('\n--- Step 13: Check QR after refund ---');
    await checkQrCode();

    console.log('\n🎉 Payment Status Flow Test Completed Successfully!');
  } catch (error) {
    console.error('\n💥 Payment Status Flow Test Failed:', error.message);
  }
}

// Run the test
testPaymentStatusFlow();
