const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testProductFilters() {
  console.log('🚀 Testing Product Filters API...\n');

  const tests = [
    {
      name: 'Basic Products (No Filters)',
      url: '/products',
      description: 'Get all approved products without any filters',
    },
    {
      name: 'Filter by Product Type - Yachts Only',
      url: '/products?types=yacht',
      description: 'Get only yacht products',
    },
    {
      name: 'Filter by Multiple Product Types',
      url: '/products?types=yacht,jetski',
      description: 'Get yacht and jetski products only',
    },
    {
      name: 'Filter by Price Range (Default)',
      url: '/products?minPrice=100&maxPrice=500',
      description: 'Get products with price between 100-500 (default pricing)',
    },
    {
      name: 'Filter by Per Hour Price',
      url: '/products?minPrice=50&maxPrice=200&pricingType=perHour',
      description: 'Get products with per hour price between 50-200',
    },
    {
      name: 'Filter by Per Day Price',
      url: '/products?minPrice=500&maxPrice=2000&pricingType=perDay',
      description: 'Get products with per day price between 500-2000',
    },
    {
      name: 'Filter by Daily Price (Resorts)',
      url: '/products?types=resort&minPrice=200&maxPrice=800&pricingType=daily',
      description: 'Get resorts with daily price between 200-800',
    },
    {
      name: 'Filter by Yearly Price (Resorts)',
      url: '/products?types=resort&minPrice=50000&maxPrice=200000&pricingType=yearly',
      description: 'Get resorts with yearly price between 50000-200000',
    },
    {
      name: 'Filter by Capacity Range',
      url: '/products?minCapacity=4&maxCapacity=8',
      description: 'Get products with capacity between 4-8 people',
    },
    {
      name: 'Filter by Brand',
      url: '/products?brands=Yamaha,Sea Ray',
      description: 'Get products from specific brands',
    },
    {
      name: 'Filter by City',
      url: '/products?cities=Dubai,Abu Dhabi',
      description: 'Get products from specific cities',
    },
    {
      name: 'Filter by Yacht Type',
      url: '/products?types=yacht&yachtTypes=motor,sailing',
      description: 'Get motor and sailing yachts',
    },
    {
      name: 'Filter by Resort Type',
      url: '/products?types=resort&resortTypes=daily,annual',
      description: 'Get daily and annual resorts',
    },
    {
      name: 'Filter by Daily Resorts (Boolean)',
      url: '/products?types=resort&isDailyResort=true',
      description: 'Get resorts that offer daily rentals',
    },
    {
      name: 'Filter by Annual Resorts (Boolean)',
      url: '/products?types=resort&isAnnualResort=true',
      description: 'Get resorts that offer annual rentals',
    },
    {
      name: 'Filter by Event Hosting Resorts',
      url: '/products?types=resort&canHostEvent=true',
      description: 'Get resorts that can host events',
    },
    {
      name: 'Filter by Non-Daily Resorts',
      url: '/products?types=resort&isDailyResort=false',
      description: 'Get resorts that do not offer daily rentals',
    },
    {
      name: 'Filter by Star Rating',
      url: '/products?types=resort&starRating=4',
      description: 'Get resorts with 4+ star rating',
    },
    {
      name: 'Filter by Amenities',
      url: '/products?types=resort&amenities=WiFi,Parking',
      description: 'Get resorts with WiFi and Parking',
    },
    {
      name: 'Filter by Tags',
      url: '/products?tags=luxury,family',
      description: 'Get products with luxury and family tags',
    },
    {
      name: 'Search by Text',
      url: '/products?search=luxury',
      description: 'Search for products containing "luxury"',
    },
    {
      name: 'Combined Filters',
      url: '/products?types=yacht&minPrice=200&maxPrice=1000&minCapacity=6&cities=Dubai&yachtTypes=motor',
      description: 'Complex filter combining multiple criteria',
    },
    {
      name: 'Combined Filters with Pricing Type',
      url: '/products?types=yacht,jetski&minPrice=100&maxPrice=500&pricingType=perHour&minCapacity=4&brands=Yamaha&cities=Dubai',
      description: 'Complex filter with specific pricing type (per hour)',
    },
    {
      name: 'Complex Resort Boolean Filters',
      url: '/products?types=resort&isDailyResort=true&isAnnualResort=false&canHostEvent=true&starRating=4&minPrice=200&maxPrice=1000&pricingType=daily',
      description:
        'Complex resort filter combining boolean fields with other criteria',
    },
    {
      name: 'Pagination with Filters',
      url: '/products?types=yacht&page=1&limit=5',
      description: 'Get first 5 yacht products',
    },
    {
      name: 'Language Filter',
      url: '/products?types=yacht&lang=ar',
      description: 'Get yacht products in Arabic',
    },
  ];

  for (const test of tests) {
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
          price: sample.pricePerHour || sample.dailyPrice,
          capacity: sample.capacity,
          brand: sample.brand,
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

async function testFilterValidation() {
  console.log('🧪 Testing Filter Validation...\n');

  const validationTests = [
    {
      name: 'Invalid Product Type',
      url: '/products?types=invalid_type',
      expectedError: 'Should handle invalid product type gracefully',
    },
    {
      name: 'Invalid Price Range (min > max)',
      url: '/products?minPrice=1000&maxPrice=100',
      expectedError: 'Should handle invalid price range',
    },
    {
      name: 'Invalid Capacity Range (min > max)',
      url: '/products?minCapacity=10&maxCapacity=5',
      expectedError: 'Should handle invalid capacity range',
    },
    {
      name: 'Invalid Star Rating',
      url: '/products?starRating=6',
      expectedError: 'Should handle invalid star rating',
    },
    {
      name: 'Empty Search Term',
      url: '/products?search=',
      expectedError: 'Should handle empty search term',
    },
  ];

  for (const test of validationTests) {
    try {
      console.log(`📤 Testing: ${test.name}`);
      console.log(`   Expected: ${test.expectedError}`);

      const response = await axios.get(`${BASE_URL}${test.url}`);

      console.log(`   ✅ Status: ${response.status} (Handled gracefully)`);
      console.log(`   📊 Results: ${response.data.data?.length || 0} products`);
    } catch (error) {
      console.log(
        `   ❌ Error: ${error.response?.data?.message || error.message}`,
      );
    }
    console.log('');
  }
}

async function testPerformance() {
  console.log('⚡ Testing Performance...\n');

  const performanceTests = [
    {
      name: 'Large Result Set',
      url: '/products?limit=50',
      description: 'Test with large limit',
    },
    {
      name: 'Complex Filter',
      url: '/products?types=yacht,jetski,resort&minPrice=50&maxPrice=2000&minCapacity=2&maxCapacity=10&cities=Dubai,Abu Dhabi&search=luxury',
      description: 'Test with complex filter combination',
    },
    {
      name: 'Search Performance',
      url: '/products?search=the',
      description: 'Test search performance with common word',
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
  testProductFilters()
    .then(() => testFilterValidation())
    .then(() => testPerformance())
    .then(() => {
      console.log('🎉 All Product Filter Tests Completed!');
    })
    .catch(console.error);
}

module.exports = { testProductFilters, testFilterValidation, testPerformance };
