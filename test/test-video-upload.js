const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:3000';
const PARTNER_TOKEN = process.env.PARTNER_TOKEN || 'YOUR_PARTNER_TOKEN';
const PRODUCT_ID = process.env.PRODUCT_ID || 'YOUR_PRODUCT_ID';
const PRODUCT_TYPE = process.env.PRODUCT_TYPE || 'yacht';
const OWNER_ID = process.env.OWNER_ID || 'YOUR_OWNER_ID';

async function testVideoUpload() {
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
      `🚀 Testing ${PRODUCT_TYPE.toUpperCase()} Update with Video...`,
    );

    // Create a simple test video data (you can replace this with actual file path)
    const testVideoData = Buffer.from('fake video data for testing');

    const formData = new FormData();

    // Add the video file
    formData.append('videos', testVideoData, {
      filename: 'test-video.mp4',
      contentType: 'video/mp4',
    });

    // Add product data
    const productData = {
      ownerId: OWNER_ID,
      titleEn: `Updated ${PRODUCT_TYPE} with Video - ${Date.now()}`,
      descriptionEn: 'Testing video upload',
    };

    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    console.log('📤 Uploading video with product data...');
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
      videos: response.data.data?.videos?.length || 0,
    });

    if (response.data.data?.status === 'pending') {
      console.log('🎉 SUCCESS: Video uploaded and status updated to pending!');

      if (response.data.data?.videos?.length > 0) {
        console.log('🎬 Videos in response:', response.data.data.videos);
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

async function testDifferentVideoFormats() {
  console.log('\n🧪 Testing Different Video Formats...');

  const formats = [
    { name: 'MP4', contentType: 'video/mp4', filename: 'test.mp4' },
    { name: 'MOV', contentType: 'video/mov', filename: 'test.mov' },
    { name: 'AVI', contentType: 'video/avi', filename: 'test.avi' },
    { name: 'WebM', contentType: 'video/webm', filename: 'test.webm' },
  ];

  for (const format of formats) {
    try {
      console.log(`\n📤 Testing ${format.name} format...`);

      const testVideoData = Buffer.from('fake video data for testing');

      const formData = new FormData();
      formData.append('videos', testVideoData, {
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

if (require.main === module) {
  testVideoUpload()
    .then(() => testDifferentVideoFormats())
    .catch(console.error);
}

module.exports = { testVideoUpload, testDifferentVideoFormats };
