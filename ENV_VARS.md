# Environment Variables Used in This Project

## Required Environment Variables

### Database
- **`SUPABASE_DATABASE_URL`** (Primary)
  - Location: `server/db.ts`
  - Description: PostgreSQL connection string for Supabase (with connection pooling)
  - Format: `postgresql://[user]:[password]@[host]:[port]/[database]`
  - Fallback: Falls back to `DATABASE_URL` if not set

- **`DATABASE_URL`** (Fallback/CLI)
  - Location: `server/db.ts`, `drizzle.config.ts`
  - Description: Alternative database URL (used by Drizzle CLI for migrations)
  - Note: Required by `drizzle.config.ts` for schema generation

### Supabase Storage (Voice Notes)
- **`SUPABASE_URL`**
  - Location: `server/supabase.ts`
  - Description: Supabase project URL for Storage API
  - Format: `https://[project-ref].supabase.co`
  - Source: Supabase Dashboard → Settings → API → Project URL
  - Note: Required for voice note file storage

- **`SUPABASE_SERVICE_ROLE_KEY`**
  - Location: `server/supabase.ts`
  - Description: Supabase service role key (bypasses RLS) for server-side uploads
  - Format: Long JWT token
  - Source: Supabase Dashboard → Settings → API → Service Role Key (secret)
  - **⚠️ Security Warning:** Never expose this key in client-side code. It has admin privileges.
  - Note: Required for voice note file storage

### WhatsApp Business API
- **`WHATSAPP_ACCESS_TOKEN`**
  - Location: `server/whatsapp.ts`
  - Description: Meta/Facebook WhatsApp Business API access token
  - Source: Meta Developer Console → WhatsApp → API Setup

- **`WHATSAPP_PHONE_NUMBER_ID`**
  - Location: `server/whatsapp.ts`
  - Description: WhatsApp Business Phone Number ID (15-digit number)
  - Source: Meta Developer Console → WhatsApp → API Setup

- **`WHATSAPP_BUSINESS_NUMBER_E164`**
  - Location: `server/routes.ts` (lines 375, 432)
  - Description: WhatsApp Business phone number in E.164 format
  - Default: Falls back to customer phone number or `'919876543210'`
  - Example: `919876543210` (India), `1234567890` (US)

- **`WHATSAPP_WEBHOOK_VERIFY_TOKEN`**
  - Location: `server/routes.ts` (line 457)
  - Description: Custom token for webhook verification from Meta
  - Used in: `/webhook/whatsapp` GET endpoint for webhook setup

- **`WHATSAPP_BUSINESS_PHONE`**
  - Location: `server/whatsapp.ts` (line 339)
  - Description: WhatsApp Business phone number (fallback)
  - Default: `'919876543210'`

### Payment Gateway
- **`RAZORPAY_WEBHOOK_SECRET`**
  - Location: `server/routes.ts` (line 233)
  - Description: Secret key for verifying Razorpay webhook signatures
  - Used in: `/webhooks/payment` POST endpoint
  - Note: Optional but required for production webhook verification

### Application Configuration
- **`APP_BASE_URL`**
  - Location: `server/routes.ts` (line 376)
  - Description: Base URL of the application for generating invite links
  - Default: `'https://your-domain.replit.app'`
  - Used in: Order confirmation WhatsApp messages with invite links

- **`PORT`**
  - Location: `server/index.ts` (line 76)
  - Description: Port number for the Express server
  - Default: `'5000'`
  - Note: Only this port is not firewalled in Replit

- **`NODE_ENV`**
  - Location: `server/whatsapp.ts` (multiple), `vite.config.ts` (line 10)
  - Description: Environment mode (`'development'` or `'production'`)
  - Used for: Conditional logic in WhatsApp functions and Vite configuration

## Optional Environment Variables

### Replit-Specific
- **`REPLIT_DOMAINS`**
  - Location: `server/conversationHandler.ts` (line 228)
  - Description: Comma-separated list of Replit domain names
  - Used for: Generating album links in trial signups
  - Format: `domain1.replit.app,domain2.replit.app`
  - Fallback: `'http://localhost:5000'` if not set

- **`REPL_ID`**
  - Location: `vite.config.ts` (line 11)
  - Description: Replit project ID
  - Used for: Enabling Replit-specific Vite plugins (cartographer, dev-banner)
  - Note: Only used in development mode

## Documented but Not Used in Code

The following environment variables are mentioned in documentation but **not actually used** in the codebase:

- **`SESSION_SECRET`**
  - Mentioned in: `README.md`, `project_info.md`, `PAYMENT_WEBHOOK_SETUP.md`
  - Status: Not found in actual code
  - Note: May have been removed or is planned for future use

## Summary by File

### `server/db.ts`
- `SUPABASE_DATABASE_URL` (primary)
- `DATABASE_URL` (fallback)

### `server/index.ts`
- `PORT`

### `server/routes.ts`
- `RAZORPAY_WEBHOOK_SECRET`
- `WHATSAPP_BUSINESS_NUMBER_E164`
- `APP_BASE_URL`
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

### `server/whatsapp.ts`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `NODE_ENV` (multiple checks)
- `WHATSAPP_BUSINESS_PHONE`

### `server/conversationHandler.ts`
- `REPLIT_DOMAINS`
- `WHATSAPP_ACCESS_TOKEN` (for downloading voice note files)

### `server/supabase.ts`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### `vite.config.ts`
- `NODE_ENV`
- `REPL_ID`

### `drizzle.config.ts`
- `DATABASE_URL`

