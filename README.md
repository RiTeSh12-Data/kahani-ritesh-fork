# LegacyScribe - Story Preservation Service

A production-ready e-commerce platform for preserving family stories through WhatsApp-based question delivery.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Razorpay account (for payment processing)
- Meta WhatsApp Business account (for messaging)

### Installation

```bash
# Dependencies are already installed via Replit
npm install

# Start the application
npm run dev
```

### Environment Variables

Add these to Replit Secrets or `.env`:

```bash
# WhatsApp Cloud API (Required for messaging)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_NUMBER_E164=919876543210

# Payment Gateway (Required for production)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Application
APP_BASE_URL=https://your-domain.replit.app
SESSION_SECRET=your_session_secret
```

## 📚 Documentation

- **[PAYMENT_WEBHOOK_SETUP.md](./PAYMENT_WEBHOOK_SETUP.md)** - Complete setup guide with production checklist
- **[LegacyScribe_Postman_Collection.json](./LegacyScribe_Postman_Collection.json)** - API testing collection
- **[replit.md](./replit.md)** - Project architecture and technical details

## ✨ Features

### E-commerce
- 📱 Mobile-first responsive design
- 🛒 Shopping cart with multi-item support
- 📦 6 curated question pack categories
- 💳 Phone-only checkout (minimal friction)
- ✅ Order confirmation with unique codes

### Payment Integration
- 🔐 Production-ready Razorpay webhook system
- ✓ HMAC SHA-256 signature verification
- ✓ Event-specific idempotency (handles payment.authorized → payment.captured)
- ✓ Amount validation (paise to rupees conversion)
- ✓ Automatic retry with exponential backoff

### WhatsApp Integration
- 📲 Automated order confirmations
- 🔗 Forwardable invitation links for elders
- 🎟️ Token-based tracking (90-day expiration)
- ♻️ Retry logic for API rate limits
- ✅ E.164 phone number validation

### Additional Features
- ⭐ Customer feedback system with star ratings
- 📝 Testimonial collection with consent
- 🆓 Free trial signup
- 📖 Story viewer (basic structure)

## 🏗️ Architecture

### Frontend
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Shadcn UI**
- **TanStack Query** for server state
- **React Hook Form** + **Zod** validation

### Backend
- **Express.js** + **Node.js**
- **In-memory storage** (ready for PostgreSQL migration)
- **Meta WhatsApp Cloud API** (v22.0)
- **Razorpay** webhook integration

### Key Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/payment` | Razorpay payment webhook handler |
| GET | `/w/invite/:token` | Forwardable WhatsApp invite redirect |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/free-trial` | Free trial signup |
| POST | `/api/feedback` | Submit customer feedback |

## 🔒 Security

### Implemented
- ✅ HMAC SHA-256 webhook signature verification
- ✅ Type-safe Buffer handling for raw body capture
- ✅ Event-specific idempotency keys
- ✅ Amount validation with currency conversion
- ✅ Phone number normalization and E.164 validation
- ✅ Proper HTTP error codes (401, 400, 404, 500)

### Development Mode
When credentials are missing:
- Logs warnings but continues operation
- Signature verification skipped (with clear warnings)
- WhatsApp messages silently skipped
- Order processing continues normally

**⚠️ Never deploy without credentials in production**

## 🧪 Testing

### Using Postman
1. Import `LegacyScribe_Postman_Collection.json`
2. Update `base_url` variable
3. Run requests in sequence:
   - Create Order
   - Test Payment Webhook (Development)
   - Test Invite Redirect

### Manual Testing

```bash
# Create an order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerPhone": "9876543210",
    "items": [{"productId": "military-veterans", "productName": "Military & Veterans", "quantity": 1, "price": 999}],
    "total": 999
  }'

# Test payment webhook (development mode)
curl -X POST http://localhost:5000/webhooks/payment \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_test123",
          "order_id": "ORDER_ID_FROM_ABOVE",
          "amount": 99900,
          "status": "captured"
        }
      }
    }
  }'
```

## 📦 Database Schema

### Orders
```typescript
{
  id: string;
  uniqueCode: string;         // User-facing code (ORD-ABC123)
  customerPhone: string;
  customerPhoneE164?: string; // Normalized (919876543210)
  items: OrderItem[];
  total: number;              // Amount in rupees
  paymentId?: string;
  status: "pending" | "paid" | "failed";
  lastConfirmationSentAt?: string;
  createdAt: string;
}
```

### WhatsApp Tokens
```typescript
{
  id: string;
  orderId: string;
  token: string;              // UUID v4
  expiresAt: string;          // 90 days from creation
  consumedAt?: string;        // Timestamp when clicked
  createdAt: string;
}
```

### Webhook Events
```typescript
{
  idempotencyKey: string;     // "${payment_id}_${event}"
  processedAt: string;
}
```

## 📝 Production Checklist

Before deploying:

- [ ] Set all environment variables in Replit Secrets
- [ ] Migrate from in-memory storage to PostgreSQL
- [ ] Configure Razorpay webhook URL in dashboard
- [ ] Get WhatsApp template approved by Meta
- [ ] Test full payment flow with real Razorpay test payment
- [ ] Verify WhatsApp messages are received
- [ ] Test forwardable link flow end-to-end
- [ ] Set up monitoring/alerts for webhook failures
- [ ] Configure domain (optional)
- [ ] Test idempotency with duplicate webhooks

See [PAYMENT_WEBHOOK_SETUP.md](./PAYMENT_WEBHOOK_SETUP.md) for detailed checklist.

## 🔄 Razorpay Event Flow

```
1. payment.authorized → Acknowledged without processing
2. payment.captured   → Full processing:
   - Update order status to "paid"
   - Send WhatsApp confirmation template
   - Generate unique token (90-day expiry)
   - Send forwardable link via WhatsApp
   - Mark webhook as processed
3. payment.failed     → Mark as processed, no updates
```

## 📱 WhatsApp Message Flow

When payment is successful:

**Message 1: Order Confirmation** (Template)
```
Uses Meta's pre-approved "hello_world" template
```

**Message 2: Forwardable Link** (Text)
```
Thank you for your order! Please forward this link to your elder for direct chat: 
https://your-domain.replit.app/w/invite/{token}
```

**Elder clicks link →** Redirects to:
```
https://wa.me/919876543210?text=Hi,%20I'm%20contacting%20on%20behalf%20of%20order%20ORD-ABC123.%20Token:%20{token}
```

## 🛠️ Development

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utilities, API client
├── server/                # Express backend
│   ├── index.ts          # App setup, raw body capture
│   ├── routes.ts         # API routes, webhook handler
│   ├── whatsapp.ts       # WhatsApp service with retry
│   └── storage.ts        # Storage interface (in-memory)
├── shared/
│   └── schema.ts         # Zod schemas, types
└── PAYMENT_WEBHOOK_SETUP.md
```

### Adding a New Route

1. Define Zod schema in `shared/schema.ts`
2. Add storage methods in `server/storage.ts`
3. Create route handler in `server/routes.ts`
4. Add frontend page in `client/src/pages/`
5. Register route in `client/src/App.tsx`

## 🤝 Support

For issues or questions:
- Check [PAYMENT_WEBHOOK_SETUP.md](./PAYMENT_WEBHOOK_SETUP.md) troubleshooting section
- Review server logs in Replit console
- Verify environment variables are set correctly
- Check Razorpay webhook logs in dashboard
- Review Meta Business Manager for WhatsApp account status

## 📄 License

All rights reserved.

---

**Built with ❤️ for preserving family legacies**
