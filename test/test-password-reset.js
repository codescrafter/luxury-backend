const axios = require('axios');

const BASE_URL = 'http://localhost:3000/auth';

async function testPasswordReset() {
  console.log('🧪 Testing Password Reset Functionality\n');

  try {
    // Test 1: Request Password Reset Code with Email
    console.log('1. Testing password reset code request with email...');
    const requestCodeResponse = await axios.post(`${BASE_URL}/reset-password`, {
      emailOrPhone: 'test@example.com',
    });

    if (requestCodeResponse.data.success) {
      console.log('✅ Password reset code request successful');
      console.log('Response:', requestCodeResponse.data.data);
    } else {
      console.log(
        '❌ Password reset code request failed:',
        requestCodeResponse.data.message,
      );
    }

    // Test 2: Reset Password with Code
    console.log('\n2. Testing password reset with verification code...');
    const resetPasswordResponse = await axios.post(
      `${BASE_URL}/reset-password`,
      {
        emailOrPhone: 'test@example.com',
        verificationCode: '123456', // This would be the actual code sent
        password: 'newpassword123',
      },
    );

    if (resetPasswordResponse.data.success) {
      console.log('✅ Password reset successful');
      console.log('Response:', resetPasswordResponse.data.data);
    } else {
      console.log(
        '❌ Password reset failed:',
        resetPasswordResponse.data.message,
      );
    }

    // Test 3: Request Password Reset Code with Phone
    console.log('\n3. Testing password reset code request with phone...');
    const requestCodePhoneResponse = await axios.post(
      `${BASE_URL}/reset-password`,
      {
        emailOrPhone: '+1234567890',
      },
    );

    if (requestCodePhoneResponse.data.success) {
      console.log('✅ Password reset code request with phone successful');
      console.log('Response:', requestCodePhoneResponse.data.data);
    } else {
      console.log(
        '❌ Password reset code request with phone failed:',
        requestCodePhoneResponse.data.message,
      );
    }

    // Test 4: Test with non-existent user
    console.log('\n4. Testing with non-existent user...');
    try {
      const nonExistentResponse = await axios.post(
        `${BASE_URL}/reset-password`,
        {
          emailOrPhone: 'nonexistent@example.com',
        },
      );
      console.log('Response:', nonExistentResponse.data);
    } catch (error) {
      if (error.response) {
        console.log('✅ Correctly handled non-existent user');
        console.log('Error:', error.response.data);
      }
    }

    // Test 5: Test with invalid verification code
    console.log('\n5. Testing with invalid verification code...');
    try {
      const invalidCodeResponse = await axios.post(
        `${BASE_URL}/reset-password`,
        {
          emailOrPhone: 'test@example.com',
          verificationCode: '000000', // Invalid code
          password: 'newpassword123',
        },
      );
      console.log('Response:', invalidCodeResponse.data);
    } catch (error) {
      if (error.response) {
        console.log('✅ Correctly handled invalid verification code');
        console.log('Error:', error.response.data);
      }
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testPasswordReset().catch(console.error);
}

module.exports = {
  testPasswordReset,
};
