const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let bookingId = '';

// Test data
const testUser = {
  email: 'test@example.com',
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

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = response.data.data.token;
    console.log('✅ Login successful');
    return authToken;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
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
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    console.log('✅ Booking approved');
    return response.data;
  } catch (error) {
    console.error(
      '❌ Booking approval failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function generateQr() {
  try {
    console.log('🔲 Generating QR code...');
    const response = await axios.post(
      `${BASE_URL}/qr/generate`,
      { bookingId },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    console.log('✅ QR code generated');
    console.log('QR Image URL:', response.data.data.qrImageUrl);
    console.log('QR Token:', response.data.data.token);
    return response.data.data;
  } catch (error) {
    console.error(
      '❌ QR generation failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function verifyQr(token) {
  try {
    console.log('🔍 Verifying QR code...');
    const response = await axios.post(`${BASE_URL}/qr/verify`, { token });
    console.log('✅ QR code verified successfully');
    console.log('Booking details:', response.data.data.booking);
    console.log('User details:', response.data.data.user);
    console.log('Product details:', response.data.data.product);
    return response.data.data;
  } catch (error) {
    console.error(
      '❌ QR verification failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function getQrForBooking() {
  try {
    console.log('📱 Getting QR code for booking...');
    const response = await axios.get(`${BASE_URL}/qr/booking/${bookingId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('✅ QR code retrieved');
    console.log('QR Image URL:', response.data.data.qrImageUrl);
    return response.data.data;
  } catch (error) {
    console.error('❌ Get QR failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testQrSystem() {
  try {
    console.log('🚀 Starting QR System Test...\n');

    // Step 1: Login
    await login();

    // Step 2: Create booking
    await createBooking();

    // Step 3: Approve booking (this should automatically generate QR)
    await approveBooking();

    // Step 4: Generate QR code manually (optional, should already exist)
    const qrData = await generateQr();

    // Step 5: Get QR code for booking
    await getQrForBooking();

    // Step 6: Verify QR code
    await verifyQr(qrData.token);

    // Step 7: Try to verify the same QR code again (should fail)
    try {
      await verifyQr(qrData.token);
      console.log('❌ QR should not be redeemable twice');
    } catch (error) {
      console.log('✅ QR correctly rejected on second attempt');
    }

    console.log('\n🎉 QR System Test Completed Successfully!');
  } catch (error) {
    console.error('\n💥 QR System Test Failed:', error.message);
  }
}

// Run the test
testQrSystem();
