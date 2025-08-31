const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
let adminToken = '';
let partnerToken = '';

// Test data
const adminUser = {
  email: 'admin@example.com',
  password: 'password123',
};

const partnerUser = {
  email: 'partner@example.com',
  password: 'password123',
};

async function loginAdmin() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/auth/login`, adminUser);
    adminToken = response.data.data.token;
    console.log('✅ Admin login successful');
    return adminToken;
  } catch (error) {
    console.error(
      '❌ Admin login failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function loginPartner() {
  try {
    console.log('🔐 Logging in as partner...');
    const response = await axios.post(`${BASE_URL}/auth/login`, partnerUser);
    partnerToken = response.data.data.token;
    console.log('✅ Partner login successful');
    return partnerToken;
  } catch (error) {
    console.error(
      '❌ Partner login failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function testDashboardSummary(token, role, params = {}) {
  try {
    console.log(`\n📊 Testing Dashboard Summary (${role})...`);

    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.includeProductStats)
      queryParams.append('includeProductStats', params.includeProductStats);
    if (params.includeRevenueBreakdown)
      queryParams.append(
        'includeRevenueBreakdown',
        params.includeRevenueBreakdown,
      );

    const url = `${BASE_URL}/products/dashboard/summary${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('✅ Dashboard summary retrieved successfully');
    console.log('📈 Summary Data:');

    const data = response.data.data;

    // Booking Statistics
    console.log('\n📋 Booking Statistics:');
    console.log(`  • Total Bookings: ${data.bookingsCount}`);
    console.log(`  • Today's Bookings: ${data.todayBookings}`);
    console.log(`  • Pending Approvals: ${data.pendingApprovals}`);
    console.log(`  • Confirmed Bookings: ${data.confirmedBookings}`);
    console.log(`  • Cancelled Bookings: ${data.cancelledBookings}`);
    console.log(`  • Completed Bookings: ${data.completedBookings}`);

    // Revenue Statistics
    console.log('\n💰 Revenue Statistics:');
    console.log(`  • Total Revenue: $${data.revenueTotal}`);
    console.log(`  • Today's Revenue: $${data.todayRevenue}`);
    console.log(`  • Average Booking Value: $${data.averageBookingValue}`);

    if (data.revenueByStatus) {
      console.log('\n📊 Revenue by Status:');
      console.log(`  • Paid: $${data.revenueByStatus.paid || 0}`);
      console.log(`  • Pending: $${data.revenueByStatus.pending || 0}`);
      console.log(`  • Failed: $${data.revenueByStatus.failed || 0}`);
      console.log(`  • Refunded: $${data.revenueByStatus.refunded || 0}`);
    }

    // Product Statistics
    if (data.productStats) {
      console.log('\n🏢 Product Statistics:');
      console.log(`  • Total Products: ${data.productStats.totalProducts}`);
      console.log(`  • Active Products: ${data.productStats.activeProducts}`);
      console.log(`  • Pending Products: ${data.productStats.pendingProducts}`);

      console.log('\n📦 Products by Type:');
      console.log(`  • Jetskis: ${data.productStats.productsByType.jetski}`);
      console.log(`  • Kayaks: ${data.productStats.productsByType.kayak}`);
      console.log(`  • Yachts: ${data.productStats.productsByType.yacht}`);
      console.log(
        `  • Speedboats: ${data.productStats.productsByType.speedboat}`,
      );
      console.log(`  • Resorts: ${data.productStats.productsByType.resort}`);
    }

    // User Statistics (admin only)
    if (data.userStats) {
      console.log('\n👥 User Statistics:');
      console.log(`  • Total Users: ${data.userStats.totalUsers}`);
      console.log(`  • Total Partners: ${data.userStats.totalPartners}`);
      console.log(
        `  • New Users This Month: ${data.userStats.newUsersThisMonth}`,
      );
      console.log(
        `  • New Partners This Month: ${data.userStats.newPartnersThisMonth}`,
      );
    }

    // Recent Bookings
    if (data.recentBookings && data.recentBookings.length > 0) {
      console.log('\n🕒 Recent Bookings:');
      data.recentBookings.slice(0, 3).forEach((booking, index) => {
        console.log(
          `  ${index + 1}. ${booking.productType} - $${booking.totalPrice} (${booking.bookingStatus})`,
        );
      });
    }

    // Date Range
    console.log('\n📅 Date Range:');
    console.log(`  • Filtered: ${data.dateRange.isFiltered ? 'Yes' : 'No'}`);
    if (data.dateRange.startDate) {
      console.log(
        `  • Start Date: ${new Date(data.dateRange.startDate).toLocaleDateString()}`,
      );
    }
    if (data.dateRange.endDate) {
      console.log(
        `  • End Date: ${new Date(data.dateRange.endDate).toLocaleDateString()}`,
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      `❌ Dashboard summary test failed (${role}):`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function testDashboardWithDateFilter(token, role) {
  try {
    console.log(`\n📅 Testing Dashboard with Date Filter (${role})...`);

    const startDate = '2024-01-01';
    const endDate = '2024-12-31';

    await testDashboardSummary(token, role, {
      startDate,
      endDate,
      includeProductStats: true,
      includeRevenueBreakdown: true,
    });
  } catch (error) {
    console.error(
      `❌ Date filter test failed (${role}):`,
      error.response?.data || error.message,
    );
  }
}

async function testDashboardWithProductStats(token, role) {
  try {
    console.log(`\n🏢 Testing Dashboard with Product Stats (${role})...`);

    await testDashboardSummary(token, role, {
      includeProductStats: true,
    });
  } catch (error) {
    console.error(
      `❌ Product stats test failed (${role}):`,
      error.response?.data || error.message,
    );
  }
}

async function testDashboardWithRevenueBreakdown(token, role) {
  try {
    console.log(`\n💰 Testing Dashboard with Revenue Breakdown (${role})...`);

    await testDashboardSummary(token, role, {
      includeRevenueBreakdown: true,
    });
  } catch (error) {
    console.error(
      `❌ Revenue breakdown test failed (${role}):`,
      error.response?.data || error.message,
    );
  }
}

async function runDashboardTests() {
  try {
    console.log('🚀 Starting Dashboard API Tests...\n');

    // Login as admin and partner
    await loginAdmin();
    await loginPartner();

    // Test 1: Basic dashboard summary (admin)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 1: Basic Dashboard Summary (Admin)');
    console.log('='.repeat(60));
    await testDashboardSummary(adminToken, 'Admin');

    // Test 2: Basic dashboard summary (partner)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: Basic Dashboard Summary (Partner)');
    console.log('='.repeat(60));
    await testDashboardSummary(partnerToken, 'Partner');

    // Test 3: Dashboard with date filter (admin)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 3: Dashboard with Date Filter (Admin)');
    console.log('='.repeat(60));
    await testDashboardWithDateFilter(adminToken, 'Admin');

    // Test 4: Dashboard with product stats (partner)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 4: Dashboard with Product Stats (Partner)');
    console.log('='.repeat(60));
    await testDashboardWithProductStats(partnerToken, 'Partner');

    // Test 5: Dashboard with revenue breakdown (admin)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 5: Dashboard with Revenue Breakdown (Admin)');
    console.log('='.repeat(60));
    await testDashboardWithRevenueBreakdown(adminToken, 'Admin');

    // Test 6: Complete dashboard with all options (admin)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 6: Complete Dashboard (Admin)');
    console.log('='.repeat(60));
    await testDashboardSummary(adminToken, 'Admin', {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      includeProductStats: true,
      includeRevenueBreakdown: true,
    });

    console.log('\n🎉 All Dashboard API Tests Completed Successfully!');
  } catch (error) {
    console.error('\n💥 Dashboard API Tests Failed:', error.message);
  }
}

// Run the tests
runDashboardTests();
