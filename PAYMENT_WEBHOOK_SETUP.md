# Payment Webhook Setup Guide

Complete guide for setting up the production-ready WhatsApp order confirmation and forwardable invitation link system.

## Architecture Overview

```
Payment Gateway (Razorpay)
    ↓ webhook: payment.captured
POST /webhooks/payment
    ↓
1. Verify HMAC SHA-256 signature
2. Check idempotency (event-specific)
3. Validate payment amount (paise → rupees)
4. Update order status → PAID
5. Send WhatsApp confirmation (template)
6. Generate unique token (90-day expiry)
7. Send forwardable WhatsApp link
8. Mark webhook as processed
    ↓
Customer receives 2 WhatsApp messages:
    1. Order confirmation
    2. Forwardable link for elder
```

## Environment Variables

Add these to your `.env` file or Replit Secrets:

```bash
# WhatsApp Cloud API (Meta)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here
WHATSAPP_BUSINESS_NUMBER_E164=919876543210  # No + prefix

# Application
APP_BASE_URL=https://your-domain.replit.app

# Payment Gateway
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Session (already configured)
SESSION_SECRET=your_session_secret_here
```

### Getting WhatsApp Credentials

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create/select your WhatsApp Business App
3. Navigate to WhatsApp → API Setup
4. Get:
   - **Phone Number ID**: Found under "Phone number ID"
   - **Access Token**: Generate a permanent token (not temporary)
   - **Business Number**: Your WhatsApp Business number in E.164 format (e.g., 919876543210)

### Getting Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → Webhooks
3. Create a new webhook pointing to: `https://your-domain.replit.app/webhooks/payment`
4. Copy the **Webhook Secret** shown after creation
5. Select events to receive:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`

## Database Schema

### Orders Table
```typescript
{
  id: string;                      // Unique order ID
  uniqueCode: string;              // User-facing order code (e.g., ORD-123456)
  customerPhone: string;           // Original phone number from checkout
  customerPhoneE164?: string;      // Normalized E.164 format (91XXXXXXXXXX)
  items: OrderItem[];              // Cart items with productId, quantity, price
  total: number;                   // Total amount in rupees
  paymentId?: string;              // Razorpay payment_id
  status: "pending" | "paid" | "failed";
  lastConfirmationSentAt?: string; // ISO timestamp
  createdAt: string;               // ISO timestamp
}
```

### WhatsApp Tokens Table
```typescript
{
  id: string;                      // UUID
  orderId: string;                 // Foreign key → orders.id
  token: string;                   // UUID v4 (unique)
  expiresAt: string;               // ISO timestamp (now + 90 days)
  consumedAt?: string;             // ISO timestamp when clicked
  createdAt: string;               // ISO timestamp
}
```

### Webhook Events Table (Idempotency)
```typescript
{
  idempotencyKey: string;          // Primary key: "${payment_id}_${event}"
  processedAt: string;             // ISO timestamp
}
```

## API Endpoints

### POST /webhooks/payment

**Purpose:** Receives Razorpay payment webhooks and triggers WhatsApp order confirmations

**Authentication:** HMAC SHA-256 signature verification

**Razorpay Payload Structure:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_XXXXXXXXXXXXX",
        "order_id": "order_XXXXXXXXXX",
        "amount": 99900,
        "status": "captured"
      }
    }
  }
}
```

**Request Headers:**
```
X-Razorpay-Signature: <hmac_sha256_signature>
Content-Type: application/json
```

**Event Flow:**

1. **payment.authorized** → Acknowledged without processing
2. **payment.captured** → Full processing:
   - Update order status to "paid"
   - Send WhatsApp confirmation template
   - Generate unique token
   - Send forwardable link via WhatsApp
   - Mark webhook as processed
3. **payment.failed** → Mark as processed, no WhatsApp sent

**Response Codes:**
- `200` - Success (event processed or acknowledged)
- `401` - Invalid signature
- `400` - Invalid payload/amount mismatch
- `404` - Order not found
- `500` - Internal server error

**Success Response:**
```json
{
  "message": "Payment processed successfully",
  "confirmationSent": true,
  "inviteLinkSent": true
}
```

### GET /w/invite/:token

**Purpose:** Forwardable short link that redirects to WhatsApp with prefilled message

**URL:** `https://your-domain.replit.app/w/invite/550e8400-e29b-41d4-a716-446655440000`

**Behavior:**
1. Validates token exists
2. Checks expiration (90 days from creation)
3. Marks token as consumed
4. Redirects (302) to: `https://wa.me/919876543210?text=Hi%2C%20I'm%20contacting%20on%20behalf%20of%20order%20ORD-123456.%20Token%3A%20550e8400...`

**Response Codes:**
- `302` - Redirect to WhatsApp
- `404` - Invalid token
- `410` - Token expired
- `500` - Internal server error

## WhatsApp Message Flow

### Message 1: Order Confirmation (Template)

**Template:** `hello_world` (pre-approved by Meta)

**Recipient:** Customer's phone number

**Content:** Standard hello_world template message confirming order receipt

### Message 2: Forwardable Invitation Link (Text)

**Recipient:** Customer's phone number

**Message Format:**
```
Thank you for your order! Please forward this link to your elder for direct chat: https://your-domain.replit.app/w/invite/{token}
```

**Features:**
- `preview_url: true` - Shows link preview in WhatsApp
- Forwardable - Customer can forward to elder
- Token-based tracking - Maps elder's chat back to original order

## Testing with Postman

### 1. Test Payment Webhook (Development Mode)

**Endpoint:** `POST http://localhost:5000/webhooks/payment`

**Headers:**
```
Content-Type: application/json
```

**Note:** In development mode (without `RAZORPAY_WEBHOOK_SECRET`), signature verification is skipped with a warning.

**Body (payment.captured):**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_test123",
        "order_id": "ORD-123456",
        "amount": 99900,
        "status": "captured"
      }
    }
  }
}
```

**Expected Response:**
```json
{
  "message": "Payment processed successfully",
  "confirmationSent": true,
  "inviteLinkSent": true
}
```

### 2. Test Payment Webhook (Production Mode)

**Prerequisites:**
1. Create an order first: `POST /api/orders`
2. Note the order `id` returned
3. Calculate signature:

```javascript
// Node.js example
const crypto = require('crypto');
const payload = JSON.stringify({
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_test123",
        order_id: "your_order_id_here",
        amount: 99900,
        status: "captured"
      }
    }
  }
});

const signature = crypto
  .createHmac('sha256', 'your_webhook_secret')
  .update(payload)
  .digest('hex');

console.log('X-Razorpay-Signature:', signature);
```

**Headers:**
```
Content-Type: application/json
X-Razorpay-Signature: <calculated_signature>
```

**Body:** Same as development mode, but use real order ID

### 3. Test Invite Redirect

**Endpoint:** `GET http://localhost:5000/w/invite/{token}`

**Method:** GET (open in browser or use Postman with "Automatically follow redirects" disabled)

**Expected Response:**
```
HTTP/1.1 302 Found
Location: https://wa.me/919876543210?text=Hi%2C%20I'm%20contacting%20on%20behalf%20of%20order%20ORD-123456.%20Token%3A%20550e8400...
```

### 4. Create Test Order

**Endpoint:** `POST http://localhost:5000/api/orders`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "customerPhone": "9876543210",
  "items": [
    {
      "productId": "military-veterans",
      "productName": "Military & Veterans",
      "quantity": 1,
      "price": 999
    }
  ],
  "total": 999
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "uniqueCode": "ORD-ABC123",
  "customerPhone": "9876543210",
  "items": [...],
  "total": 999,
  "status": "pending",
  "createdAt": "2025-11-08T10:30:00.000Z"
}
```

## Security Features

### 1. Signature Verification

**Method:** HMAC SHA-256

**Process:**
1. Razorpay sends raw request body + signature in header
2. Server captures raw body before JSON parsing
3. Calculates HMAC using raw body + webhook secret
4. Compares calculated signature with header signature
5. Rejects request if mismatch (401 Unauthorized)

**Code Reference:** `server/index.ts` (raw body capture) + `server/routes.ts` (verification)

### 2. Idempotency

**Key Format:** `${payment_id}_${event}`

**Prevents:**
- Duplicate webhook processing
- Multiple WhatsApp message sends
- Race conditions from Razorpay retries

**Implementation:**
- Event-specific keys allow multi-event flows (authorized → captured)
- Terminal events (captured/failed) marked as processed
- Non-terminal events acknowledged without marking

### 3. Amount Validation

**Checks:**
1. Amount is a valid number
2. Amount in paise converts correctly to rupees
3. Converted amount matches order total

**Razorpay sends:** `99900` paise  
**Order expects:** `999` rupees  
**Validation:** `99900 / 100 === 999` ✓

### 4. Phone Number Validation

**Format:** E.164 (without + prefix)

**Normalization:**
- `9876543210` → `919876543210` (adds India code)
- `919876543210` → `919876543210` (already normalized)

**Validation:** 10-15 digits, numeric only

## Retry Logic

### WhatsApp API Retries

**Retry Conditions:**
- `429 Too Many Requests` (rate limiting)
- `5xx Server Errors` (Meta API issues)

**Backoff Strategy:** Exponential
- Attempt 1: Immediate
- Attempt 2: +1 second
- Attempt 3: +2 seconds
- Attempt 4: +4 seconds

**Max Retries:** 3 attempts (4 total including initial)

**Code Reference:** `server/whatsapp.ts` → `retryWithBackoff()`

## Error Handling

### Graceful Degradation

**Development Mode (no credentials):**
```
⚠️  DEVELOPMENT MODE: WHATSAPP_PHONE_NUMBER_ID not configured
⚠️  Skipping WhatsApp message
```
- Order still created
- Payment still processed
- WhatsApp silently skipped with warning logs

**WhatsApp Send Failures:**
- Order marked as paid regardless
- Logs warning but returns 200 to Razorpay
- Prevents webhook retries from Razorpay

### Error Logging

All errors logged with context:
```javascript
console.error('Failed to send WhatsApp message:', {
  error: error.response?.data || error.message,
  to: recipientNumber,
  template: templateName
});
```

## Production Checklist

- [ ] Set `RAZORPAY_WEBHOOK_SECRET` in Replit Secrets
- [ ] Set `WHATSAPP_PHONE_NUMBER_ID` in Replit Secrets
- [ ] Set `WHATSAPP_ACCESS_TOKEN` in Replit Secrets (permanent token)
- [ ] Set `WHATSAPP_BUSINESS_NUMBER_E164` in Replit Secrets
- [ ] Set `APP_BASE_URL` to production domain
- [ ] Configure Razorpay webhook URL in dashboard
- [ ] Get `hello_world` template approved by Meta (pre-approved)
- [ ] Test full flow with real Razorpay test payment
- [ ] Verify WhatsApp messages received
- [ ] Test invite link forwarding and redirect
- [ ] Migrate from in-memory storage to PostgreSQL database
- [ ] Set up monitoring/alerts for webhook failures
- [ ] Test idempotency with duplicate webhook sends
- [ ] Verify amount validation with different currencies

## Troubleshooting

### Webhook Not Received

1. Check Razorpay webhook configuration
2. Verify URL is publicly accessible
3. Check webhook logs in Razorpay dashboard
4. Ensure port 5000 is accessible

### Signature Verification Failing

1. Verify `RAZORPAY_WEBHOOK_SECRET` matches dashboard
2. Check raw body is captured correctly
3. Ensure no middleware modifying request body
4. Test with Razorpay webhook simulator

### WhatsApp Messages Not Sending

1. Verify credentials are correct
2. Check phone number is E.164 format
3. Ensure template is approved by Meta
4. Check 24-hour message window (for text messages)
5. Review Meta Business Manager for account status
6. Check rate limits haven't been exceeded

### Token Redirect Not Working

1. Verify token exists in database
2. Check token hasn't expired (90 days)
3. Ensure `WHATSAPP_BUSINESS_NUMBER_E164` is set
4. Test redirect URL manually in browser

## Code Structure

```
server/
├── index.ts           # Express app, raw body capture
├── routes.ts          # POST /webhooks/payment, GET /w/invite/:token
├── whatsapp.ts        # WhatsApp service with retry logic
└── storage.ts         # IStorage interface, CRUD operations

shared/
└── schema.ts          # Zod schemas for orders, tokens, webhooks

Database Models:
- orders              # Order records with payment status
- whatsapp_tokens     # Forwardable invitation tokens
- webhook_events      # Idempotency tracking
```

## Future Enhancements

1. **Custom Templates:** Replace `hello_world` with branded order confirmation template
2. **Database Migration:** Move from in-memory to PostgreSQL for persistence
3. **Admin Dashboard:** View webhook events, token usage, message delivery status
4. **Analytics:** Track token click rates, elder response rates
5. **Multi-language:** Support regional languages in WhatsApp messages
6. **Email Fallback:** Send email if WhatsApp fails
7. **Webhook Retry Queue:** Handle failed WhatsApp sends with job queue
8. **Rate Limit Monitoring:** Alert when approaching WhatsApp limits

## Support

For issues or questions:
- Check logs in Replit console
- Review Meta Business Manager for WhatsApp account status
- Verify Razorpay webhook logs in dashboard
- Contact Meta support for WhatsApp API issues
- Contact Razorpay support for payment webhook issues
