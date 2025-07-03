#!/bin/bash

echo "🚀 Products API Test Runner"
echo "=========================="

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
    echo "   Or update the BASE_URL in the test file if your server runs on a different port."
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🧪 Running Products API Tests..."
echo ""

# Run the comprehensive test
node test-products-api.js

echo ""
echo "✅ Test completed!"
echo ""
echo "💡 Tips:"
echo "   - The test file automatically handles authentication where needed"
echo "   - Update the BASE_URL in test-products-api.js if your server runs on a different port"
echo "   - Update the API_TOKEN in test-products-api.js if you need a different JWT token" 