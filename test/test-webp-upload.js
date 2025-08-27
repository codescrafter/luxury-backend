const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:3000';
const PARTNER_TOKEN = process.env.PARTNER_TOKEN || 'YOUR_PARTNER_TOKEN';
const PRODUCT_ID = process.env.PRODUCT_ID || 'YOUR_PRODUCT_ID';
const PRODUCT_TYPE = process.env.PRODUCT_TYPE || 'yacht'; // jetski, kayak, yacht, speedboat, resort
const OWNER_ID = process.env.OWNER_ID || 'YOUR_OWNER_ID';

async function testWebpUpload() {
  if (
    PARTNER_TOKEN === 'YOUR_PARTNER_TOKEN' ||
    PRODUCT_ID === 'YOUR_PRODUCT_ID' ||
    OWNER_ID === 'YOUR_OWNER_ID'
  ) {
    console.log('❌ Please set environment variables:');
    console.log('export PARTNER_TOKEN="your_jwt_token"');
    console.log('export PRODUCT_ID="product_id_to_test"');
    console.log(
      'export PRODUCT_TYPE="yacht" (or jetski, kayak, speedboat, resort)',
    );
    console.log('export OWNER_ID="owner_id_from_jwt"');
    return;
  }

  try {
    console.log(
      `🚀 Testing ${PRODUCT_TYPE.toUpperCase()} Update with WebP Image...`,
    );

    // Create a simple test image data (you can replace this with actual file path)
    const testImageData = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64',
    );

    // Create form data
    const formData = new FormData();

    // Add the image file
    formData.append('images', testImageData, {
      filename: 'test-image.webp',
      contentType: 'image/webp',
    });

    // Add product data
    const productData = {
      ownerId: OWNER_ID,
      titleEn: `Updated ${PRODUCT_TYPE} with WebP - ${Date.now()}`,
      descriptionEn: 'Testing WebP image upload',
    };

    // Add all product data as form fields
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    console.log('📤 Uploading WebP image with product data...');
    console.log('Product data:', productData);

    const response = await axios.put(
      `${BASE_URL}/products/${PRODUCT_TYPE}/${PRODUCT_ID}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${PARTNER_TOKEN}`,
          ...formData.getHeaders(),
        },
      },
    );

    console.log('✅ Response:', {
      success: response.data.success,
      status: response.data.data?.status,
      titleEn: response.data.data?.titleEn,
      images: response.data.data?.images?.length || 0,
    });

    if (response.data.data?.status === 'pending') {
      console.log(
        '🎉 SUCCESS: WebP image uploaded and status updated to pending!',
      );

      if (response.data.data?.images?.length > 0) {
        console.log('📸 Images in response:', response.data.data.images);
      }
    } else {
      console.log('❌ FAILED: Status not updated to pending');
    }
  } catch (error) {
    console.error('❌ Error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}

async function testDifferentImageFormats() {
  console.log('\n🧪 Testing Different Image Formats...');

  const formats = [
    { name: 'JPEG', contentType: 'image/jpeg', filename: 'test.jpg' },
    { name: 'PNG', contentType: 'image/png', filename: 'test.png' },
    { name: 'WebP', contentType: 'image/webp', filename: 'test.webp' },
  ];

  for (const format of formats) {
    try {
      console.log(`\n📤 Testing ${format.name} format...`);

      const testImageData = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64',
      );

      const formData = new FormData();
      formData.append('images', testImageData, {
        filename: format.filename,
        contentType: format.contentType,
      });

      const productData = {
        ownerId: OWNER_ID,
        titleEn: `Test ${format.name} - ${Date.now()}`,
      };

      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.put(
        `${BASE_URL}/products/${PRODUCT_TYPE}/${PRODUCT_ID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${PARTNER_TOKEN}`,
            ...formData.getHeaders(),
          },
        },
      );

      console.log(`✅ ${format.name}: SUCCESS`);
    } catch (error) {
      console.log(
        `❌ ${format.name}: FAILED - ${error.response?.data?.message || error.message}`,
      );
    }
  }
}

// Run the tests
if (require.main === module) {
  testWebpUpload()
    .then(() => testDifferentImageFormats())
    .catch(console.error);
}

module.exports = { testWebpUpload, testDifferentImageFormats };
