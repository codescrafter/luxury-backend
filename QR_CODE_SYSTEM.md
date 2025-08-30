# QR Code Booking Verification System

## Overview

The QR Code Booking Verification System provides a secure way to verify bookings at check-in time. Each confirmed booking automatically generates a unique QR code that can be scanned to verify the booking details and mark it as redeemed.

## Features

- **Automatic QR Generation**: QR codes are automatically generated when bookings are confirmed
- **Secure Token System**: QR codes contain only secure tokens, not sensitive booking data
- **One-time Use**: Each QR code can only be redeemed once
- **Automatic Expiration**: QR codes expire when the booking ends
- **Cloudinary Integration**: QR images are stored in Cloudinary for fast access
- **Comprehensive Validation**: Server-side validation ensures security

## Architecture

### Database Schema

#### BookingQr Entity
```typescript
{
  bookingId: ObjectId,        // Reference to the booking
  userId: ObjectId,           // Reference to the user (consumer)
  productId: ObjectId,        // Reference to the product
  productType: string,        // Type of product (jetski, kayak, yacht, etc.)
  startTime: Date,            // Booking start time
  endTime: Date,              // Booking end time
  token: string,              // Unique secure token (UUID)
  status: QrStatus,           // active | redeemed | expired
  expiresAt: Date,            // When QR expires (same as endTime)
  qrImageUrl: string,         // Cloudinary URL of QR image
  redeemedAt: Date,           // When QR was redeemed
  redeemedBy: ObjectId,       // Who redeemed the QR
  createdAt: Date,            // When QR was created
  updatedAt: Date             // When QR was last updated
}
```

### QR Status Flow

1. **ACTIVE**: QR code is generated and ready for use
2. **REDEEMED**: QR code has been successfully verified and redeemed
3. **EXPIRED**: QR code has passed its expiration date

## API Endpoints

### QR Code Management

#### Generate QR Code
```http
POST /qr/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": {
      "_id": "507f1f77bcf86cd799439012",
      "bookingId": "507f1f77bcf86cd799439011",
      "token": "550e8400-e29b-41d4-a716-446655440000",
      "qrImageUrl": "https://res.cloudinary.com/.../qr-550e8400-e29b-41d4-a716-446655440000.png",
      "status": "active",
      "expiresAt": "2024-12-25T18:00:00.000Z"
    },
    "qrImageUrl": "https://res.cloudinary.com/.../qr-550e8400-e29b-41d4-a716-446655440000.png",
    "token": "550e8400-e29b-41d4-a716-446655440000"
  },
  "message": "QR code generated successfully"
}
```

#### Verify QR Code (Public)
```http
POST /qr/verify
Content-Type: application/json

{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439011",
      "consumerId": "507f1f77bcf86cd799439013",
      "productId": "507f1f77bcf86cd799439014",
      "productType": "jetski",
      "startTime": "2024-12-25T10:00:00.000Z",
      "endTime": "2024-12-25T18:00:00.000Z",
      "totalPrice": 500,
      "bookingStatus": "confirmed"
    },
    "user": {
      "_id": "507f1f77bcf86cd799439013",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "product": {
      "_id": "507f1f77bcf86cd799439014",
      "titleEn": "Luxury Jet Ski",
      "titleAr": "جت سكي فاخر",
      "capacity": 2,
      "brand": "Yamaha"
    },
    "qrDetails": {
      "token": "550e8400-e29b-41d4-a716-446655440000",
      "status": "redeemed",
      "redeemedAt": "2024-12-25T10:30:00.000Z",
      "startTime": "2024-12-25T10:00:00.000Z",
      "endTime": "2024-12-25T18:00:00.000Z"
    }
  },
  "message": "QR code verified successfully"
}
```

#### Get QR Code for Booking
```http
GET /qr/booking/:bookingId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": {
      "_id": "507f1f77bcf86cd799439012",
      "bookingId": "507f1f77bcf86cd799439011",
      "token": "550e8400-e29b-41d4-a716-446655440000",
      "qrImageUrl": "https://res.cloudinary.com/.../qr-550e8400-e29b-41d4-a716-446655440000.png",
      "status": "active"
    },
    "qrImageUrl": "https://res.cloudinary.com/.../qr-550e8400-e29b-41d4-a716-446655440000.png",
    "token": "550e8400-e29b-41d4-a716-446655440000"
  },
  "message": "QR code retrieved successfully"
}
```

#### Get QR Code Image
```http
GET /qr/booking/:bookingId/image
Authorization: Bearer <token>
```

**Response:** Redirects to Cloudinary URL with QR image

### Admin Endpoints

#### Get QR Statistics
```http
GET /qr/statistics
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "active": 25,
    "redeemed": 150,
    "expired": 10,
    "total": 185
  },
  "message": "QR statistics retrieved successfully"
}
```

#### Cleanup Expired QR Codes
```http
POST /qr/cleanup
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cleanedCount": 5
  },
  "message": "Cleaned up 5 expired QR codes"
}
```

### Alternative Verification Endpoint

#### Verify QR via Products Controller
```http
POST /products/qr/verify
Content-Type: application/json

{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Security Features

### Token Security
- QR codes contain only UUID tokens, not sensitive booking data
- Tokens are cryptographically secure and unique
- No booking information is exposed in the QR code itself

### Validation Rules
- QR codes can only be redeemed once
- QR codes automatically expire when booking ends
- Server-side validation prevents tampering
- Only booking owners and partners can generate QR codes

### Access Control
- QR generation: Requires authentication (USER or PARTNER role)
- QR verification: Public endpoint (no authentication required)
- QR retrieval: Requires authentication (USER or PARTNER role)
- Admin functions: Requires ADMIN role

## Integration with Booking Flow

### Automatic QR Generation
When a booking is approved by a partner, the system automatically:

1. Changes booking status to `CONFIRMED`
2. Creates unavailability record
3. Generates QR code with unique token
4. Uploads QR image to Cloudinary
5. Stores QR record in database

### Manual QR Generation
QR codes can also be generated manually for confirmed bookings:

```javascript
// Example: Generate QR for existing confirmed booking
const qrData = await bookingQrService.generateQrForBooking(bookingId);
```

## Error Handling

### Common Error Responses

#### QR Code Not Found
```json
{
  "success": false,
  "message": "Failed to verify QR code",
  "error": "Invalid QR code"
}
```

#### QR Code Already Redeemed
```json
{
  "success": false,
  "message": "Failed to verify QR code",
  "error": "QR code has already been redeemed"
}
```

#### QR Code Expired
```json
{
  "success": false,
  "message": "Failed to verify QR code",
  "error": "QR code has expired"
}
```

#### Booking Not Confirmed
```json
{
  "success": false,
  "message": "Failed to generate QR code",
  "error": "QR code can only be generated for confirmed bookings"
}
```

## Usage Examples

### Frontend Integration

#### Display QR Code
```javascript
// Get QR code for booking
const response = await fetch(`/qr/booking/${bookingId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
const qrData = await response.json();

// Display QR image
const qrImage = document.getElementById('qr-image');
qrImage.src = qrData.data.qrImageUrl;
```

#### Verify QR Code (Scanner App)
```javascript
// Scan QR code and verify
const scannedToken = '550e8400-e29b-41d4-a716-446655440000';
const response = await fetch('/qr/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: scannedToken })
});

const result = await response.json();
if (result.success) {
  console.log('Booking verified:', result.data.booking);
  console.log('Customer:', result.data.user);
  console.log('Product:', result.data.product);
}
```

### Mobile App Integration

#### Generate QR for Customer
```javascript
// Partner generates QR for customer
const qrResponse = await fetch('/qr/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${partnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ bookingId: '507f1f77bcf86cd799439011' })
});

const qrData = await qrResponse.json();
// Send QR image URL to customer via email/SMS
```

## Testing

### Test Script
Run the provided test script to verify the QR system:

```bash
node test/test-qr-system.js
```

### Manual Testing
1. Create a booking
2. Approve the booking (QR should be auto-generated)
3. Retrieve the QR code
4. Verify the QR code
5. Try to verify the same QR again (should fail)

## Maintenance

### Cleanup Expired QR Codes
Set up a cron job to regularly clean up expired QR codes:

```javascript
// Run daily at 2 AM
0 2 * * * curl -X POST http://localhost:3000/qr/cleanup \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Monitoring
Monitor QR code statistics regularly:
- Active QR codes
- Redeemed QR codes
- Expired QR codes
- Failed verification attempts

## Dependencies

- `qrcode`: QR code generation
- `uuid`: Secure token generation
- `cloudinary`: Image storage
- `mongoose`: Database operations

## Environment Variables

Ensure these environment variables are set:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Future Enhancements

1. **QR Code Customization**: Allow custom colors and logos
2. **Batch Operations**: Generate multiple QR codes at once
3. **Analytics**: Track QR scan patterns and usage
4. **Offline Support**: Generate QR codes that work offline
5. **Push Notifications**: Notify when QR is scanned
6. **Multi-language Support**: QR codes with different languages
