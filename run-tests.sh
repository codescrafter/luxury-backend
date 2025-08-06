#!/bin/bash

echo "🚀 Elite Models Backend Test Runner"
echo "==================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if axios is installed
if ! node -e "require('axios')" &> /dev/null; then
    echo "📦 Installing axios..."
    npm install axios
fi

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Server is running on http://localhost:8080"
else
    echo "⚠️  Server doesn't seem to be running on http://localhost:8080"
    echo "   Make sure your NestJS server is started with: npm run start:dev"
    echo "   Or update the BASE_URL in the test files if your server runs on a different port."
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🧪 Available Test Suites:"
echo "1. Dual-Language Feature Tests"
echo "2. Product Status Flow Tests"
echo "3. Booking API Tests"
echo "4. Migration Validation Tests"
echo "5. Comprehensive Dual-Language Test Suite"
echo "6. All Tests"
echo ""

read -p "Select test suite (1-6): " -n 1 -r
echo

case $REPLY in
    1)
        echo ""
        echo "🌐 Running Dual-Language Feature Tests..."
        echo "========================================"
        node test/test-dual-language.js
        ;;
    2)
        echo ""
        echo "🔄 Running Product Status Flow Tests..."
        echo "======================================"
        node test/e2e-product-status-flow.js
        ;;
    3)
        echo ""
        echo "📅 Running Booking API Tests..."
        echo "==============================="
        node test/booking-api.js
        ;;
    4)
        echo ""
        echo "🔄 Running Migration Validation Tests..."
        echo "======================================="
        node test/test-dual-language-migration.js
        ;;
    5)
        echo ""
        echo "🚀 Running Comprehensive Dual-Language Test Suite..."
        echo "=================================================="
        node test/run-dual-language-tests.js
        ;;
    6)
        echo ""
        echo "🚀 Running All Tests..."
        echo "======================"
        
        echo ""
        echo "🌐 1. Dual-Language Feature Tests"
        echo "================================="
        node test/test-dual-language.js
        
        echo ""
        echo "🔄 2. Product Status Flow Tests"
        echo "==============================="
        node test/e2e-product-status-flow.js
        
        echo ""
        echo "📅 3. Booking API Tests"
        echo "======================="
        node test/booking-api.js
        
        echo ""
        echo "🔄 4. Migration Validation Tests"
        echo "==============================="
        node test/test-dual-language-migration.js
        
        echo ""
        echo "🎉 All tests completed!"
        ;;
    *)
        echo "❌ Invalid selection. Please run the script again and select 1-6."
        exit 1
        ;;
esac

echo ""
echo "✅ Test suite completed!"
echo ""
echo "💡 Tips:"
echo "   - Update the BASE_URL in test/config.js if your server runs on a different port"
echo "   - Update the tokens in test/config.js if you need different JWT tokens"
echo "   - Check the DUAL_LANGUAGE_FEATURE.md file for detailed feature documentation"
echo "   - Run the migration script (migrate-to-dual-language.js) before testing if needed" 