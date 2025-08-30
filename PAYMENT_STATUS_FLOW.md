# Payment Status Update Flow

## Overview

The Payment Status Update Flow provides partners with the ability to update payment status for bookings and automatically manages QR code generation based on payment confirmation. This ensures that QR codes are only available for paid bookings.

## Flow Analysis

### Current Booking Flow

1. **Booking Creation** → User creates booking (`paymentStatus: PENDING`, `bookingStatus: PENDING`)
2. **Booking Approval** → Partner approves booking (`bookingStatus: CONFIRMED`, `paymentStatus: PENDING`)
3. **Payment Confirmation** → Partner updates payment status (`paymentStatus: PAID`)
4. **QR Generation** → QR code automatically generated when payment is confirmed

### Payment Status Types

- `PENDING` - Payment is pending
- `PAID` - Payment has been confirmed
- `FAILED` - Payment has failed
- `REFUNDED` - Payment has been refunded

## API Endpoints

### Update Payment Status

```http
PUT /products/booking/:id/payment-status
Authorization: Bearer <partner_token>
Content-Type: application/json

{
  "paymentStatus": "paid",
  "transactionId": "txn_123456789",
  "notes": "Payment received via credit card"
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
      "partnerId": "507f1f77bcf86cd799439015",
      "startTime": "2024-12-25T10:00:00.000Z",
      "endTime": "2024-12-25T18:00:00.000Z",
      "totalPrice": 500,
      "currency": "USD",
      "paymentStatus": "paid",
      "bookingStatus": "confirmed",
      "transactionId": "txn_123456789",
      "paymentMethod": "credit_card"
    },
    "changes": {
      "paymentStatus": {
        "from": "pending",
        "to": "paid"
      },
      "bookingStatus": {
        "from": "confirmed",
        "to": "confirmed"
      }
    }
  },
  "message": "Payment status updated successfully"
}
```

## Payment Status Flow Logic

### Payment Status: PAID

**Actions:**
- Updates `paymentStatus` to `PAID`
- Updates `bookingStatus` to `CONFIRMED` (if not cancelled)
- Generates QR code automatically
- Creates unavailability record
- Stores transaction ID (if provided)

**QR Code Behavior:**
- ✅ QR code is generated
- ✅ QR code is available for verification
- ✅ Unavailability is created

### Payment Status: FAILED

**Actions:**
- Updates `paymentStatus` to `FAILED`
- Reverts `bookingStatus` to `PENDING` (if was confirmed)
- Removes QR code (if existed)
- Removes unavailability record

**QR Code Behavior:**
- ❌ QR code is removed/expired
- ❌ QR code is not available for verification
- ❌ Unavailability is removed

### Payment Status: REFUNDED

**Actions:**
- Updates `paymentStatus` to `REFUNDED`
- Updates `bookingStatus` to `CANCELLED`
- Removes QR code
- Removes unavailability record

**QR Code Behavior:**
- ❌ QR code is removed/expired
- ❌ QR code is not available for verification
- ❌ Unavailability is removed

### Payment Status: PENDING

**Actions:**
- Updates `paymentStatus` to `PENDING`
- No changes to booking status
- No QR code generation/removal

**QR Code Behavior:**
- ❌ No QR code changes
- ❌ QR code remains unavailable

## Integration with QR Code System

### QR Code Generation Trigger

QR codes are automatically generated when:
1. Payment status changes from any status to `PAID`
2. Booking status is `CONFIRMED` or will be set to `CONFIRMED`

### QR Code Removal Trigger

QR codes are automatically removed when:
1. Payment status changes from `PAID` to `FAILED`
2. Payment status changes from `PAID` to `REFUNDED`

### QR Code Status Management

- **ACTIVE**: QR code is available for verification
- **REDEEMED**: QR code has been used for check-in
- **EXPIRED**: QR code has been removed due to payment issues

## Security Features

### Authorization
- Only partners can update payment status for their bookings
- Partners can only update bookings where they are the `partnerId`

### Validation
- Payment status must be a valid enum value
- Transaction ID is optional but stored when provided
- Notes field is optional for additional context

### Audit Trail
- Previous and new status values are returned in response
- All changes are logged with timestamps
- QR code generation/removal is logged

## Error Handling

### Common Error Responses

#### Booking Not Found
```json
{
  "success": false,
  "message": "Failed to update payment status",
  "error": "Booking not found or unauthorized"
}
```

#### Invalid Payment Status
```json
{
  "success": false,
  "message": "Failed to update payment status",
  "error": "paymentStatus must be one of the following values: pending, paid, failed, refunded"
}
```

#### Unauthorized Access
```json
{
  "success": false,
  "message": "Failed to update payment status",
  "error": "Forbidden"
}
```

## Usage Examples

### Frontend Integration

#### Update Payment to Paid
```javascript
// Partner marks payment as received
const response = await fetch(`/products/booking/${bookingId}/payment-status`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${partnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    paymentStatus: 'paid',
    transactionId: 'txn_123456789',
    notes: 'Payment received via PayPal'
  })
});

const result = await response.json();
if (result.success) {
  console.log('Payment confirmed, QR code generated');
  // QR code is now available for the customer
}
```

#### Mark Payment as Failed
```javascript
// Partner marks payment as failed
const response = await fetch(`/products/booking/${bookingId}/payment-status`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${partnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    paymentStatus: 'failed',
    notes: 'Payment declined by bank'
  })
});

const result = await response.json();
if (result.success) {
  console.log('Payment failed, QR code removed');
  // QR code is no longer available
}
```

#### Process Refund
```javascript
// Partner processes refund
const response = await fetch(`/products/booking/${bookingId}/payment-status`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${partnerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    paymentStatus: 'refunded',
    notes: 'Full refund processed due to cancellation'
  })
});

const result = await response.json();
if (result.success) {
  console.log('Refund processed, booking cancelled');
  // Booking is cancelled and QR code removed
}
```

### Mobile App Integration

#### Partner Dashboard
```javascript
// Partner can see all bookings with payment status
const bookings = await fetch('/products/partner/bookings', {
  headers: { 'Authorization': `Bearer ${partnerToken}` }
});

// Partner can update payment status for each booking
bookings.forEach(booking => {
  if (booking.paymentStatus === 'pending') {
    // Show "Mark as Paid" button
    showMarkAsPaidButton(booking.id);
  } else if (booking.paymentStatus === 'paid') {
    // Show "Process Refund" button
    showRefundButton(booking.id);
  }
});
```

## Testing

### Test Script
Run the provided test script to verify the payment status flow:

```bash
node test/test-payment-status-flow.js
```

### Manual Testing Steps
1. Create a booking (payment status: PENDING)
2. Approve the booking (booking status: CONFIRMED, payment status: PENDING)
3. Check QR code availability (should not exist)
4. Update payment status to PAID
5. Check QR code availability (should exist)
6. Verify QR code works
7. Update payment status to FAILED
8. Check QR code availability (should not exist)
9. Update payment status to REFUNDED
10. Verify booking is cancelled

## Business Logic

### Payment Confirmation Flow
1. Customer makes booking
2. Partner approves booking
3. Customer makes payment
4. Partner confirms payment received
5. QR code is automatically generated
6. Customer can use QR code for check-in

### Payment Failure Flow
1. Customer makes booking
2. Partner approves booking
3. Customer payment fails
4. Partner marks payment as failed
5. QR code is automatically removed
6. Booking remains pending until payment is resolved

### Refund Flow
1. Customer has paid booking with QR code
2. Customer requests refund
3. Partner processes refund
4. Partner marks payment as refunded
5. QR code is automatically removed
6. Booking is cancelled

## Monitoring and Analytics

### Key Metrics to Track
- Payment success rate
- Time from booking to payment confirmation
- QR code generation rate
- Payment failure reasons
- Refund rate

### Logging
All payment status changes are logged with:
- Booking ID
- Previous status
- New status
- Partner ID
- Timestamp
- Transaction ID (if provided)
- Notes (if provided)

## Future Enhancements

1. **Payment Gateway Integration**: Direct integration with payment processors
2. **Automatic Payment Verification**: Verify payments automatically
3. **Payment Reminders**: Send reminders for pending payments
4. **Partial Refunds**: Support for partial payment refunds
5. **Payment History**: Track all payment status changes
6. **Webhook Support**: Notify external systems of payment changes
7. **Multi-currency Support**: Handle different currencies properly
8. **Payment Analytics**: Detailed payment analytics dashboard
