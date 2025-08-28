const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testResortBooleanFilters() {
  console.log('🏨 Testing Resort Boolean Filters...\n');

  const resortBooleanTests = [
    {
      name: 'Daily Resorts Only',
      url: '/products?types=resort&isDailyResort=true',
      description: 'Get resorts that offer daily rentals',
    },
    {
      name: 'Annual Resorts Only',
      url: '/products?types=resort&isAnnualResort=true',
      description: 'Get resorts that offer annual rentals',
    },
    {
      name: 'Event Hosting Resorts Only',
      url: '/products?types=resort&canHostEvent=true',
      description: 'Get resorts that can host events',
    },
    {
      name: 'Non-Daily Resorts',
      url: '/products?types=resort&isDailyResort=false',
      description: 'Get resorts that do not offer daily rentals',
    },
    {
      name: 'Non-Annual Resorts',
      url: '/products?types=resort&isAnnualResort=false',
      description: 'Get resorts that do not offer annual rentals',
    },
    {
      name: 'Non-Event Hosting Resorts',
      url: '/products?types=resort&canHostEvent=false',
      description: 'Get resorts that cannot host events',
    },
    {
      name: 'Daily + Annual Resorts',
      url: '/products?types=resort&isDailyResort=true&isAnnualResort=true',
      description: 'Get resorts that offer both daily and annual rentals',
    },
    {
      name: 'Daily + Event Hosting Resorts',
      url: '/products?types=resort&isDailyResort=true&canHostEvent=true',
      description: 'Get resorts that offer daily rentals and can host events',
    },
    {
      name: 'Annual + Event Hosting Resorts',
      url: '/products?types=resort&isAnnualResort=true&canHostEvent=true',
      description: 'Get resorts that offer annual rentals and can host events',
    },
    {
      name: 'All Three Boolean Filters',
      url: '/products?types=resort&isDailyResort=true&isAnnualResort=true&canHostEvent=true',
      description: 'Get resorts that offer daily, annual rentals and can host events',
    },
  ];

  for (const test of resortBooleanTests) {
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

      // Show sample resort if available
      if (response.data.data && response.data.data.length > 0) {
        const sample = response.data.data[0];
        console.log(`   📋 Sample Resort:`, {
          id: sample._id,
          title: sample.title || sample.titleEn,
          isDailyResort: sample.isDailyResort,
          isAnnualResort: sample.isAnnualResort,
          canHostEvent: sample.canHostEvent,
          dailyPrice: sample.dailyPrice,
          yearlyPrice: sample.yearlyPrice,
          starRating: sample.starRating,
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

async function testResortBooleanWithOtherFilters() {
  console.log('🔗 Testing Resort Boolean Filters with Other Criteria...\n');

  const combinedTests = [
    {
      name: 'Daily Resorts with Star Rating',
      url: '/products?types=resort&isDailyResort=true&starRating=4',
      description: 'Get 4+ star resorts that offer daily rentals',
    },
    {
      name: 'Annual Resorts with Price Range',
      url: '/products?types=resort&isAnnualResort=true&minPrice=50000&maxPrice=200000&pricingType=yearly',
      description: 'Get annual resorts with yearly price between 50k-200k',
    },
    {
      name: 'Event Hosting Resorts with Amenities',
      url: '/products?types=resort&canHostEvent=true&amenities=WiFi,Parking',
      description: 'Get event hosting resorts with WiFi and Parking',
    },
    {
      name: 'Daily + Event Hosting + Star Rating + Price',
      url: '/products?types=resort&isDailyResort=true&canHostEvent=true&starRating=5&minPrice=300&maxPrice=1000&pricingType=daily',
      description: 'Get 5-star daily resorts that can host events with daily price 300-1000',
    },
    {
      name: 'Complex Resort Filter',
      url: '/products?types=resort&isDailyResort=true&isAnnualResort=false&canHostEvent=true&starRating=4&minPrice=200&maxPrice=800&pricingType=daily&cities=Dubai,Abu Dhabi&amenities=WiFi,Pool',
      description: 'Complex filter combining all resort boolean filters with other criteria',
    },
  ];

  for (const test of combinedTests) {
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

      // Show sample resort if available
      if (response.data.data && response.data.data.length > 0) {
        const sample = response.data.data[0];
        console.log(`   📋 Sample Resort:`, {
          id: sample._id,
          title: sample.title || sample.titleEn,
          isDailyResort: sample.isDailyResort,
          isAnnualResort: sample.isAnnualResort,
          canHostEvent: sample.canHostEvent,
          starRating: sample.starRating,
          dailyPrice: sample.dailyPrice,
          yearlyPrice: sample.yearlyPrice,
          city: sample.cityEn,
          amenities: sample.amenitiesEn,
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

async function testResortBooleanValidation() {
  console.log('🧪 Testing Resort Boolean Filter Validation...\n');

  const validationTests = [
    {
      name: 'Invalid Boolean Value',
      url: '/products?types=resort&isDailyResort=invalid',
      expectedBehavior: 'Should handle gracefully (ignore invalid boolean)',
    },
    {
      name: 'Empty Boolean Value',
      url: '/products?types=resort&isDailyResort=',
      expectedBehavior: 'Should handle gracefully (ignore empty value)',
    },
    {
      name: 'Boolean Filter for Non-Resort Products',
      url: '/products?types=yacht&isDailyResort=true',
      expectedBehavior: 'Should return yachts (boolean filter ignored for non-resorts)',
    },
    {
      name: 'Multiple Boolean Values',
      url: '/products?types=resort&isDailyResort=true&isDailyResort=false',
      expectedBehavior: 'Should use last value (false)',
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

if (require.main === module) {
  testResortBooleanFilters()
    .then(() => testResortBooleanWithOtherFilters())
    .then(() => testResortBooleanValidation())
    .then(() => {
      console.log('🎉 All Resort Boolean Filter Tests Completed!');
    })
    .catch(console.error);
}

module.exports = {
  testResortBooleanFilters,
  testResortBooleanWithOtherFilters,
  testResortBooleanValidation,
};
