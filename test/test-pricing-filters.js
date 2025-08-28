const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testPricingTypeFilters() {
  console.log('💰 Testing Pricing Type Filters...\n');

  const pricingTests = [
    {
      name: 'Default Price Filter (No pricingType)',
      url: '/products?minPrice=100&maxPrice=500',
      description: 'Should use default pricing for each product type',
    },
    {
      name: 'Per Hour Price Filter',
      url: '/products?minPrice=50&maxPrice=200&pricingType=perHour',
      description: 'Should filter by pricePerHour for all products',
    },
    {
      name: 'Per Day Price Filter',
      url: '/products?minPrice=500&maxPrice=2000&pricingType=perDay',
      description: 'Should filter by pricePerDay for non-resort products',
    },
    {
      name: 'Daily Price Filter (Resorts)',
      url: '/products?types=resort&minPrice=200&maxPrice=800&pricingType=daily',
      description: 'Should filter resorts by dailyPrice',
    },
    {
      name: 'Yearly Price Filter (Resorts)',
      url: '/products?types=resort&minPrice=50000&maxPrice=200000&pricingType=yearly',
      description: 'Should filter resorts by yearlyPrice',
    },
    {
      name: 'Per Hour + Product Type Filter',
      url: '/products?types=yacht,jetski&minPrice=100&maxPrice=300&pricingType=perHour',
      description: 'Should filter yachts and jetskis by pricePerHour',
    },
    {
      name: 'Per Day + Product Type Filter',
      url: '/products?types=yacht,speedboat&minPrice=800&maxPrice=3000&pricingType=perDay',
      description: 'Should filter yachts and speedboats by pricePerDay',
    },
    {
      name: 'Complex Pricing Filter',
      url: '/products?types=yacht,resort&minPrice=100&maxPrice=1000&pricingType=perHour&minCapacity=4&cities=Dubai',
      description: 'Complex filter with pricing type and other criteria',
    },
  ];

  for (const test of pricingTests) {
    try {
      console.log(`📤 Testing: ${test.name}`);
      console.log(`   Description: ${test.description}`);
      console.log(`   URL: ${test.url}`);

      const response = await axios.get(`${BASE_URL}${test.url}`);

      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📊 Results: ${response.data.data?.length || 0} products`);
      console.log(
        `   📄 Total: ${response.data.pagination?.total || 0} total products`,
      );

      if (response.data.filters) {
        console.log(`   🔍 Applied Filters:`, response.data.filters.applied);
      }

      // Show sample product if available
      if (response.data.data && response.data.data.length > 0) {
        const sample = response.data.data[0];
        console.log(`   📋 Sample Product:`, {
          id: sample._id,
          type: sample.type,
          title: sample.title || sample.titleEn,
          pricePerHour: sample.pricePerHour,
          pricePerDay: sample.pricePerDay,
          dailyPrice: sample.dailyPrice,
          yearlyPrice: sample.yearlyPrice,
          capacity: sample.capacity,
          city: sample.cityEn,
        });
      }

      console.log(''); // Empty line for readability
    } catch (error) {
      console.log(
        `   ❌ Error: ${error.response?.data?.message || error.message}`,
      );
      console.log('');
    }
  }
}

async function testPricingTypeValidation() {
  console.log('🧪 Testing Pricing Type Validation...\n');

  const validationTests = [
    {
      name: 'Invalid Pricing Type',
      url: '/products?minPrice=100&maxPrice=500&pricingType=invalid',
      expectedBehavior: 'Should handle gracefully (use default pricing)',
    },
    {
      name: 'Empty Pricing Type',
      url: '/products?minPrice=100&maxPrice=500&pricingType=',
      expectedBehavior: 'Should handle gracefully (use default pricing)',
    },
    {
      name: 'Pricing Type Without Price Range',
      url: '/products?pricingType=perHour',
      expectedBehavior: 'Should return all products (no price filter applied)',
    },
  ];

  for (const test of validationTests) {
    try {
      console.log(`📤 Testing: ${test.name}`);
      console.log(`   Expected: ${test.expectedBehavior}`);

      const response = await axios.get(`${BASE_URL}${test.url}`);

      console.log(`   ✅ Status: ${response.status} (Handled gracefully)`);
      console.log(`   📊 Results: ${response.data.data?.length || 0} products`);

      if (response.data.filters) {
        console.log(`   🔍 Applied Filters:`, response.data.filters.applied);
      }
    } catch (error) {
      console.log(
        `   ❌ Error: ${error.response?.data?.message || error.message}`,
      );
    }
    console.log('');
  }
}

async function testPricingTypePerformance() {
  console.log('⚡ Testing Pricing Type Performance...\n');

  const performanceTests = [
    {
      name: 'Per Hour Price Performance',
      url: '/products?minPrice=50&maxPrice=500&pricingType=perHour&limit=20',
      description: 'Test per hour price filtering performance',
    },
    {
      name: 'Per Day Price Performance',
      url: '/products?minPrice=500&maxPrice=5000&pricingType=perDay&limit=20',
      description: 'Test per day price filtering performance',
    },
    {
      name: 'Daily Price Performance (Resorts)',
      url: '/products?types=resort&minPrice=200&maxPrice=2000&pricingType=daily&limit=20',
      description: 'Test daily price filtering for resorts',
    },
    {
      name: 'Yearly Price Performance (Resorts)',
      url: '/products?types=resort&minPrice=50000&maxPrice=500000&pricingType=yearly&limit=20',
      description: 'Test yearly price filtering for resorts',
    },
  ];

  for (const test of performanceTests) {
    try {
      console.log(`📤 Testing: ${test.name}`);
      console.log(`   Description: ${test.description}`);

      const startTime = Date.now();
      const response = await axios.get(`${BASE_URL}${test.url}`);
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ⏱️  Duration: ${duration}ms`);
      console.log(`   📊 Results: ${response.data.data?.length || 0} products`);
      console.log(
        `   📄 Total: ${response.data.pagination?.total || 0} total products`,
      );

      if (duration > 1000) {
        console.log(`   ⚠️  Slow query detected (>1s)`);
      } else if (duration > 500) {
        console.log(`   ⚠️  Moderate query time (>500ms)`);
      } else {
        console.log(`   ✅ Fast query (<500ms)`);
      }
    } catch (error) {
      console.log(
        `   ❌ Error: ${error.response?.data?.message || error.message}`,
      );
    }
    console.log('');
  }
}

if (require.main === module) {
  testPricingTypeFilters()
    .then(() => testPricingTypeValidation())
    .then(() => testPricingTypePerformance())
    .then(() => {
      console.log('🎉 All Pricing Type Filter Tests Completed!');
    })
    .catch(console.error);
}

module.exports = {
  testPricingTypeFilters,
  testPricingTypeValidation,
  testPricingTypePerformance,
};
