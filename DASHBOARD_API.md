# Dashboard Summary API

## 🎯 **Overview**

The Dashboard Summary API provides comprehensive statistics and analytics for both admin and partner roles. It's optimized for performance using MongoDB aggregation pipelines and supports optional date filtering and additional data inclusion.

## 📍 **Endpoint**

```
GET /products/dashboard/summary
```

## 🔐 **Authentication**

- **Required**: JWT Token
- **Roles**: `ADMIN`, `PARTNER`
- **Header**: `Authorization: Bearer <token>`

## 📋 **Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | No | Start date filter (YYYY-MM-DD format) |
| `endDate` | string | No | End date filter (YYYY-MM-DD format) |
| `includeProductStats` | boolean | No | Include product statistics (default: false) |
| `includeRevenueBreakdown` | boolean | No | Include revenue breakdown by status (default: false) |

## 📊 **Response Structure**

### **Success Response (200)**

```json
{
  "success": true,
  "data": {
    // Booking Statistics
    "bookingsCount": 150,
    "todayBookings": 5,
    "pendingApprovals": 12,
    "confirmedBookings": 120,
    "cancelledBookings": 8,
    "completedBookings": 10,

    // Revenue Statistics
    "revenueTotal": 45000.00,
    "todayRevenue": 1500.00,
    "averageBookingValue": 300.00,
    "revenueByStatus": {
      "paid": 40000.00,
      "pending": 3000.00,
      "failed": 1500.00,
      "refunded": 500.00
    },

    // Product Statistics (if requested)
    "productStats": {
      "totalProducts": 45,
      "activeProducts": 38,
      "pendingProducts": 7,
      "productsByType": {
        "jetski": 12,
        "kayak": 8,
        "yacht": 15,
        "speedboat": 6,
        "resort": 4
      }
    },

    // User Statistics (admin only)
    "userStats": {
      "totalUsers": 250,
      "totalPartners": 45,
      "newUsersThisMonth": 25,
      "newPartnersThisMonth": 5
    },

    // Recent Activity
    "recentBookings": [
      {
        "_id": "booking-id",
        "productType": "yacht",
        "totalPrice": 500.00,
        "bookingStatus": "confirmed",
        "paymentStatus": "paid",
        "startTime": "2024-12-25T10:00:00.000Z",
        "endTime": "2024-12-25T18:00:00.000Z",
        "consumerName": "John Doe",
        "partnerName": "Luxury Yachts"
      }
    ],

    // Date Range
    "dateRange": {
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.999Z",
      "isFiltered": true
    }
  },
  "message": "Dashboard summary retrieved successfully"
}
```

### **Error Response (400/401/403/500)**

```json
{
  "success": false,
  "message": "Failed to get dashboard summary",
  "error": "Error details"
}
```

## 🔄 **Role-Based Behavior**

### **Admin Role**
- **Access**: All data across the platform
- **Statistics**: Complete overview including user statistics
- **Scope**: Global platform metrics

### **Partner Role**
- **Access**: Only their own data
- **Statistics**: Limited to their products and bookings
- **Scope**: Partner-specific metrics

## 📈 **Performance Optimizations**

### **1. Aggregation Pipelines**
- Uses MongoDB aggregation for efficient data processing
- Parallel execution of multiple queries
- Optimized grouping and filtering

### **2. Conditional Data Loading**
- Product statistics only loaded when requested
- Revenue breakdown only calculated when needed
- User statistics only for admin role

### **3. Indexed Queries**
- Leverages existing database indexes
- Efficient date range filtering
- Optimized role-based filtering

## 🧪 **Usage Examples**

### **1. Basic Dashboard Summary**

```bash
curl -X GET "http://localhost:8080/products/dashboard/summary" \
  -H "Authorization: Bearer <token>"
```

### **2. Dashboard with Date Filter**

```bash
curl -X GET "http://localhost:8080/products/dashboard/summary?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <token>"
```

### **3. Dashboard with Product Statistics**

```bash
curl -X GET "http://localhost:8080/products/dashboard/summary?includeProductStats=true" \
  -H "Authorization: Bearer <token>"
```

### **4. Complete Dashboard with All Options**

```bash
curl -X GET "http://localhost:8080/products/dashboard/summary?startDate=2024-01-01&endDate=2024-12-31&includeProductStats=true&includeRevenueBreakdown=true" \
  -H "Authorization: Bearer <token>"
```

## 📊 **Data Categories**

### **Booking Statistics**
- **Total Bookings**: All-time booking count
- **Today's Bookings**: Bookings created today
- **Pending Approvals**: Bookings awaiting partner approval
- **Confirmed Bookings**: Approved and confirmed bookings
- **Cancelled Bookings**: Cancelled bookings
- **Completed Bookings**: Finished bookings

### **Revenue Statistics**
- **Total Revenue**: Sum of all booking values
- **Today's Revenue**: Revenue from today's bookings
- **Average Booking Value**: Mean booking amount
- **Revenue by Status**: Breakdown by payment status

### **Product Statistics** (Optional)
- **Total Products**: Count of all products
- **Active Products**: Approved and active products
- **Pending Products**: Products awaiting approval
- **Products by Type**: Breakdown by product category

### **User Statistics** (Admin Only)
- **Total Users**: Platform user count
- **Total Partners**: Partner count
- **New Users This Month**: Recent user registrations
- **New Partners This Month**: Recent partner registrations

### **Recent Activity**
- **Recent Bookings**: Last 10 bookings with details
- **User Information**: Consumer and partner names
- **Booking Details**: Status, pricing, timing

## 🔧 **Technical Implementation**

### **Database Queries**
```javascript
// Parallel aggregation queries for optimal performance
const [bookingStats, todayBookingStats, revenueStats, recentBookings] = await Promise.all([
  // Overall booking statistics
  this.bookingModel.aggregate([...]),
  
  // Today's booking statistics
  this.bookingModel.aggregate([...]),
  
  // Revenue breakdown by payment status
  this.bookingModel.aggregate([...]),
  
  // Recent bookings with user lookup
  this.bookingModel.aggregate([...])
]);
```

### **Role-Based Filtering**
```javascript
// Build booking filter based on user role
const bookingFilter = { ...dateFilter };
if (userRole.includes('PARTNER') && !userRole.includes('ADMIN')) {
  bookingFilter.partnerId = new Types.ObjectId(userId);
}
```

### **Performance Monitoring**
```javascript
const startTime = Date.now();
// ... aggregation queries ...
const endTime = Date.now();
console.log(`Dashboard summary query completed in ${endTime - startTime}ms`);
```

## 🚀 **Frontend Integration**

### **React Hook Example**
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const useDashboardSummary = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(params);
        const response = await axios.get(
          `/products/dashboard/summary?${queryParams}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [params]);

  return { data, loading, error };
};
```

### **Dashboard Component Example**
```javascript
const Dashboard = () => {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    includeProductStats: true,
    includeRevenueBreakdown: true
  });

  const { data, loading, error } = useDashboardSummary(filters);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard Summary</h1>
      
      {/* Booking Statistics */}
      <div className="stats-grid">
        <StatCard title="Total Bookings" value={data.bookingsCount} />
        <StatCard title="Today's Bookings" value={data.todayBookings} />
        <StatCard title="Pending Approvals" value={data.pendingApprovals} />
        <StatCard title="Total Revenue" value={`$${data.revenueTotal}`} />
      </div>

      {/* Product Statistics */}
      {data.productStats && (
        <ProductStatsChart data={data.productStats} />
      )}

      {/* Revenue Breakdown */}
      {data.revenueByStatus && (
        <RevenueBreakdownChart data={data.revenueByStatus} />
      )}
    </div>
  );
};
```

## 🔒 **Security Considerations**

### **Authorization**
- JWT token validation required
- Role-based access control
- Partner data isolation

### **Data Privacy**
- Partners can only see their own data
- Admin has access to all platform data
- No sensitive user information exposed

### **Rate Limiting**
- Consider implementing rate limiting for dashboard queries
- Cache frequently requested data
- Monitor query performance

## 📈 **Monitoring & Analytics**

### **Performance Metrics**
- Query execution time logging
- Response size monitoring
- Error rate tracking

### **Usage Analytics**
- Most requested data categories
- Popular date ranges
- Role-based usage patterns

## 🔄 **Future Enhancements**

### **Caching Strategy**
- Redis caching for dashboard data
- Cache invalidation on data updates
- Time-based cache expiration

### **Real-time Updates**
- WebSocket integration for live updates
- Real-time booking notifications
- Live revenue tracking

### **Advanced Analytics**
- Trend analysis and forecasting
- Comparative period analysis
- Custom metric calculations

## ✅ **Testing**

### **Test Script**
Run the comprehensive test suite:
```bash
node test/test-dashboard-api.js
```

### **Test Coverage**
- ✅ Admin role functionality
- ✅ Partner role functionality
- ✅ Date filtering
- ✅ Optional data inclusion
- ✅ Error handling
- ✅ Performance validation

## 📝 **API Versioning**

Current version: `v1`
- Base URL: `/products/dashboard/summary`
- Future versions: `/v2/products/dashboard/summary`

## 🤝 **Support**

For API support and questions:
- Check the test scripts for usage examples
- Review the error responses for troubleshooting
- Monitor the performance logs for optimization opportunities
