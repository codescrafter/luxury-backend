const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:8080';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjQ5OGUzMzAyNTc1ZTMzMjAzNzMxMiIsImlhdCI6MTc1MTUwNDM5MywiZXhwIjoxNzUyMTA5MTkzfQ.Dpl3qCIPbR6rvhU9Ka36h7WdSaCapHaeWGM_6ONpyJU';
const OWNER_ID = '686498e3302575e332037312'; // Use your test user id

const PRODUCT_TYPES = ['jetski', 'kayak', 'yacht', 'speedboat', 'resort'];
const createdProducts = {};

function createTestImage() {
  const testImagePath = path.join(__dirname, 'test-image.png');
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xCF, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  fs.writeFileSync(testImagePath, pngBuffer);
  return testImagePath;
}

function getTestData(type) {
  if (type === 'jetski') return {
    title: 'Test Jet Ski',
    description: 'A fast and fun jetski.',
    pricePerHour: 50,
    pricePerDay: 300,
    securityDeposit: 100,
    fuelIncluded: true,
    insuranceIncluded: true,
    licenseRequired: false,
    ageRequirement: 18,
    cancellationPolicy: ['No refunds', 'Reschedule allowed'],
    termsAndConditions: ['Wear safety gear', 'No alcohol'],
    tags: ['fast', 'fun', 'family'],
    engineType: '4-stroke',
    enginePower: '180 HP',
    maxSpeed: 90,
    capacity: 2,
    brand: 'Yamaha',
    modelYear: 2022,
    jetskiType: 'Recreational',
    color: 'Blue',
    lifeJacketsIncluded: true,
    minimumHours: 2,
    maintenanceNotes: 'Regularly maintained every month',
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    address: 'Clifton Beach, Karachi',
    isFeatured: true
  };
  if (type === 'kayak') return {
    title: 'Ocean Explorer Kayak',
    description: 'Sturdy and safe kayak for all sea adventures.',
    pricePerHour: 25,
    pricePerDay: 150,
    securityDeposit: 50,
    fuelIncluded: false,
    insuranceIncluded: true,
    licenseRequired: false,
    ageRequirement: 16,
    cancellationPolicy: ['24hr notice', 'Partial refund'],
    termsAndConditions: ['Wear vest', 'No rough waters'],
    tags: ['eco-friendly', 'single', 'seaworthy'],
    kayakType: 'Sea',
    capacity: 1,
    modelYear: 2021,
    color: 'Yellow',
    lifeJacketsIncluded: true,
    minimumHours: 1,
    maintenanceNotes: 'Inspected monthly',
    ownerId: OWNER_ID,
    lat: 24.8615,
    lng: 67.0099,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    address: 'Sandspit Beach, Karachi',
    isFeatured: true
  };
  if (type === 'yacht') return {
    title: 'Luxury Ocean Pearl',
    description: 'Experience ultimate luxury on the water with this premium yacht.',
    pricePerHour: 500,
    pricePerDay: 3500,
    securityDeposit: 1000,
    fuelIncluded: true,
    insuranceIncluded: true,
    licenseRequired: false,
    ageRequirement: 21,
    cancellationPolicy: ['72hr notice', '50% refund'],
    termsAndConditions: ['No pets', 'No smoking on deck'],
    tags: ['luxury', 'party', 'family'],
    yachtType: 'Motor Yacht',
    lengthInFeet: 120,
    capacity: 20,
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    address: 'Harbor Marina',
    crewIncluded: true,
    captainIncluded: true,
    numberOfCabins: 8,
    numberOfBathrooms: 6,
    modelYear: 2022,
    brand: 'OceanMaster',
    color: 'white',
    luxuryFeaturesIncluded: true,
    minimumHours: 4,
    maintenanceNotes: 'Serviced quarterly, always clean',
    isFeatured: true
  };
  if (type === 'speedboat') return {
    title: 'Speedy Wave',
    description: 'A fast and comfortable speedboat for thrilling rides.',
    pricePerHour: 150.5,
    pricePerDay: 1000,
    securityDeposit: 200,
    fuelIncluded: true,
    insuranceIncluded: false,
    licenseRequired: true,
    ageRequirement: 18,
    cancellationPolicy: ['48hr notice', 'full refund'],
    termsAndConditions: ['No smoking', 'No loud music'],
    tags: ['fast', 'luxury', 'fun'],
    engineType: 'V8',
    enginePower: '450 HP',
    maxSpeed: 85.5,
    capacity: 8,
    modelYear: 2021,
    brand: 'WaveMaster',
    color: 'red',
    lifeJacketsIncluded: true,
    minimumHours: 2,
    maintenanceNotes: 'Regular servicing every 6 months',
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    address: 'Beachfront Marina',
    isFeatured: true
  };
  if (type === 'resort') return {
    name: 'Sunset Paradise Resort',
    description: 'A tropical getaway with all the amenities you could dream of.',
    isAnnualResort: true,
    isDailyResort: true,
    canHostEvent: false,
    amenities: ['pool', 'spa', 'bar', 'restaurant'],
    numberOfRooms: 120,
    numberOfBathrooms: 120,
    totalAreaInSqFt: 50000,
    starRating: 4.8,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    capacity: 240,
    petFriendly: true,
    smokingAllowed: false,
    parkingAvailable: true,
    wifiAvailable: true,
    cancellationPolicy: ['72hr notice', '50% refund'],
    termsAndConditions: ['No loud music after 10pm', 'Respect wildlife'],
    safetyFeatures: ['lifeguard', 'first-aid', 'kid-zone'],
    insuranceProvided: true,
    ownerId: OWNER_ID,
    lat: 24.8607,
    lng: 67.0011,
    city: 'Karachi',
    region: 'Sindh',
    country: 'Pakistan',
    address: 'Clifton Beach Road',
    isFeatured: true,
    averageRating: 4.6,
    reviewCount: 85
  };
  return {};
}

async function testAPI(endpoint, method = 'GET', data = null, params = null, requireAuth = false, isFormData = false, extraHeaders = {}) {
  if (isFormData && method === 'POST' && endpoint.startsWith('/products/')) {
    // Use dynamic import for node-fetch (ESM)
    const fetch = (await import('node-fetch')).default;
    const url = BASE_URL + endpoint;
    const headers = { ...extraHeaders, ...data.getHeaders() };
    if (requireAuth && API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;
    if (params) {
      const usp = new URLSearchParams(params);
      endpoint += '?' + usp.toString();
    }
    console.log(`\n🔍 ${method} ${endpoint}${requireAuth ? ' (Auth)' : ''}`);
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: data
    });
    const json = await res.json();
    console.log(`✅ Status: ${res.status}`);
    if (json) console.log(`📊 Response:`, JSON.stringify(json, null, 2));
    return json;
  }
  // Fallback to axios for all other requests
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: { ...extraHeaders },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    };
    if (requireAuth && API_TOKEN) config.headers['Authorization'] = `Bearer ${API_TOKEN}`;
    if (isFormData) {
      config.data = data;
      Object.assign(config.headers, data.getHeaders());
    } else {
      config.headers['Content-Type'] = 'application/json';
      if (data) config.data = data;
    }
    if (params) config.params = params;
    console.log(`\n🔍 ${method} ${endpoint}${requireAuth ? ' (Auth)' : ''}`);
    const response = await axios(config);
    console.log(`✅ Status: ${response.status}`);
    if (response.data) console.log(`📊 Response:`, JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status || error.code}`);
    if (error.response?.data) console.log(`📊 Error:`, JSON.stringify(error.response.data, null, 2));
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Full Products API Flow Test\n');
  const testImagePath = createTestImage();

  // 1. CREATE PRODUCTS
  for (const type of PRODUCT_TYPES) {
    const form = new FormData();
    form.append('images', fs.createReadStream(testImagePath));
    const data = getTestData(type);
    for (const key in data) {
      if (Array.isArray(data[key])) form.append(key, JSON.stringify(data[key]));
      else if (typeof data[key] === 'boolean' || typeof data[key] === 'number') form.append(key, String(data[key]));
      else form.append(key, data[key]);
    }
    const res = await testAPI(`/products/${type}`, 'POST', form, null, true, true);
    if (res?.success && res.data?._id) {
      createdProducts[type] = res.data._id;
      console.log(`✅ Created ${type}: ${res.data._id}`);
    }
  }

  // // 2. APPROVE PRODUCTS
  for (const type of PRODUCT_TYPES) {
    if (createdProducts[type]) {
   const res=   await testAPI(`/products/${type}/${createdProducts[type]}/approve`, 'PUT', null, null, true);
      if (res?.success) {
        console.log(`✅ Approved ${type}: ${createdProducts[type]}`);
      } else {
        console.log(`❌ Failed to approve ${type}: ${createdProducts[type]}`);
      }
    }
  }

  // // 3. SET AVAILABILITY (unavailable and booked)
  for (const type of PRODUCT_TYPES) {
    if (createdProducts[type]) {
      await testAPI(`/products/${createdProducts[type]}/availability`, 'POST', {
        productId: createdProducts[type],
        date: '2024-06-01',
        status: 'unavailable'
      }, null, true);
      await testAPI(`/products/${createdProducts[type]}/availability`, 'POST', {
        productId: createdProducts[type],
        date: '2024-06-02',
        status: 'booked'
      }, null, true);
    }
  }

  // // 4. GET AVAILABILITY
  for (const type of PRODUCT_TYPES) {
    if (createdProducts[type]) {
      await testAPI(`/products/${createdProducts[type]}/availability`, 'GET', null, null, true);
    }
  }

  // // 5. GET ALL PRODUCTS (unified endpoint, various filters)
  await testAPI('/products', 'GET', null, { productType: 'jetski' });
  await testAPI('/products', 'GET', null, { city: 'Miami', isFeatured: false });
  await testAPI('/products', 'GET', null, { startDate: '2024-06-01', endDate: '2024-06-03' });
  await testAPI('/products', 'GET', null, { tags: ['test'] });
  await testAPI('/products', 'GET', null, { status: 'approved' });
  await testAPI('/products', 'GET', null, { ownerId: OWNER_ID });

  // 6. GET BY ID
  for (const type of PRODUCT_TYPES) {
    if (createdProducts[type]) {
      await testAPI(`/products/${type}/${createdProducts[type]}`, 'GET', null, null, true);
    }
  }

  // 7. UPDATE PRODUCT
  for (const type of PRODUCT_TYPES) {
    if (createdProducts[type]) {
      await testAPI(`/products/${type}/${createdProducts[type]}`, 'PUT', { title: `Updated ${type} Title` }, null, true);
    }
  }

  // 8. ADMIN/PENDING
  await testAPI('/products/pending', 'GET', null, null, true);

  // 9. ERROR CASES
  await testAPI('/products', 'GET', null, { productType: 'invalid_type' });
  await testAPI('/products/jetski/nonexistent_id', 'GET', null, null, true);

  // Clean up
  try { fs.unlinkSync(testImagePath); } catch {}
  console.log('\n📝 Created Product IDs:', createdProducts);
  console.log('\n🎉 All tests completed!');
}

runTests().catch(console.error); 