const { runDualLanguageTests } = require('./test-dual-language');
const {
  testDualLanguage,
  testProductTypeRetrieval,
  testLanguageSwitching,
} = require('./get-products');
const { testBookingDualLanguage } = require('./booking-api');
const { runMigrationTests } = require('./test-dual-language-migration');

async function runAllDualLanguageTests() {
  console.log('🚀 Elite Models Backend - Dual-Language Test Suite');
  console.log('==================================================');
  console.log('');

  const testResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  function logTestResult(testName, passed, details = '') {
    const status = passed ? '✅' : '❌';
    const result = { name: testName, passed, details };
    testResults.tests.push(result);

    if (passed) {
      testResults.passed++;
    } else {
      testResults.failed++;
    }

    console.log(`${status} ${testName}${details ? ` - ${details}` : ''}`);
  }

  try {
    // Test 1: Core Dual-Language Functionality
    console.log('🌐 Test 1: Core Dual-Language Functionality');
    console.log('===========================================');
    try {
      await runDualLanguageTests();
      logTestResult('Core dual-language functionality', true);
    } catch (error) {
      logTestResult('Core dual-language functionality', false, error.message);
    }
    console.log('');

    // Test 2: Product Retrieval in Different Languages
    console.log('📝 Test 2: Product Retrieval in Different Languages');
    console.log('==================================================');
    try {
      await testDualLanguage();
      logTestResult('Product retrieval dual-language', true);
    } catch (error) {
      logTestResult('Product retrieval dual-language', false, error.message);
    }
    console.log('');

    // Test 3: Product Type-Specific Retrieval
    console.log('🏷️  Test 3: Product Type-Specific Retrieval');
    console.log('===========================================');
    try {
      await testProductTypeRetrieval();
      logTestResult('Product type-specific retrieval', true);
    } catch (error) {
      logTestResult('Product type-specific retrieval', false, error.message);
    }
    console.log('');

    // Test 4: Language Switching with Authentication
    console.log('🔄 Test 4: Language Switching with Authentication');
    console.log('=================================================');
    try {
      await testLanguageSwitching();
      logTestResult('Language switching with authentication', true);
    } catch (error) {
      logTestResult(
        'Language switching with authentication',
        false,
        error.message,
      );
    }
    console.log('');

    // Test 5: Booking Dual-Language Functionality
    console.log('📅 Test 5: Booking Dual-Language Functionality');
    console.log('==============================================');
    try {
      await testBookingDualLanguage();
      logTestResult('Booking dual-language functionality', true);
    } catch (error) {
      logTestResult(
        'Booking dual-language functionality',
        false,
        error.message,
      );
    }
    console.log('');

    // Test 6: Migration Validation
    console.log('🔄 Test 6: Migration Validation');
    console.log('===============================');
    try {
      await runMigrationTests();
      logTestResult('Migration validation', true);
    } catch (error) {
      logTestResult('Migration validation', false, error.message);
    }
    console.log('');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    testResults.failed++;
  }

  // Print summary
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️  Skipped: ${testResults.skipped}`);
  console.log(
    `📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`,
  );
  console.log('');

  if (testResults.failed > 0) {
    console.log('❌ Failed Tests:');
    testResults.tests
      .filter((t) => !t.passed)
      .forEach((test) => {
        console.log(`   - ${test.name}: ${test.details}`);
      });
    console.log('');
  }

  if (testResults.passed === testResults.tests.length) {
    console.log('🎉 All dual-language tests passed!');
    console.log('✅ The dual-language feature is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }

  console.log('');
  console.log('💡 Next Steps:');
  console.log('   - Check the DUAL_LANGUAGE_FEATURE.md file for documentation');
  console.log(
    '   - Run the migration script if needed: node migrate-to-dual-language.js',
  );
  console.log('   - Test the frontend integration with the dual-language API');
  console.log(
    '   - Verify that all product types support dual-language fields',
  );

  return testResults;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllDualLanguageTests().catch(console.error);
}

module.exports = {
  runAllDualLanguageTests,
};
