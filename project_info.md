# LegacyScribe (Kahani) - Story Preservation Service

## 🎯 Project Overview

LegacyScribe is a full-stack story preservation platform that helps families record and preserve life stories of their elders through WhatsApp. The service delivers structured questions via WhatsApp, collects voice note responses, and compiles them into memory books.

### Core Business Model
- **Free Trial**: Users get 1 album (15 questions) with automated WhatsApp delivery
- **Paid Service**: Purchase multiple albums with custom story books
- **Question Delivery**: One question every 2 days, with 36-hour reminders if unanswered
- **Voice Collection**: Storytellers respond via WhatsApp voice notes

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 18.3 + TypeScript 5.6
- **Build Tool**: Vite 5.4
- **Routing**: Wouter 3.3 (lightweight client-side routing)
- **State Management**: TanStack Query v5 (data fetching & caching)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Shadcn UI + Radix UI primitives
- **Styling**: Tailwind CSS 3.4 + Custom theming
- **Animations**: Framer Motion, PageFlip library

### Backend Stack
- **Runtime**: Node.js 20.19 + Express.js 4.21
- **Language**: TypeScript (tsx for execution)
- **Database**: PostgreSQL (Supabase) via Drizzle ORM 0.39
- **Session Store**: PostgreSQL sessions (connect-pg-simple)
- **API Client**: Axios 1.13 (WhatsApp integration)
- **Validation**: Zod schemas

### Database Schema (Drizzle ORM)

**Tables:**

1. **`free_trials`** - Trial records and conversation state
   ```sql
   - id (varchar, UUID primary key)
   - customer_phone (varchar, E.164 format)
   - buyer_name (varchar)
   - storyteller_name (varchar)
   - selected_album (varchar)
   - storyteller_phone (varchar, nullable)
   - conversation_state (varchar: awaiting_initial_contact|awaiting_readiness|ready|in_progress|completed)
   - current_question_index (integer, default 0)
   - retry_readiness_at (timestamp, nullable)
   - retry_count (integer, default 0)
   - last_readiness_response (varchar, nullable)
   - welcome_sent_at (timestamp, nullable)
   - readiness_asked_at (timestamp, nullable)
   - last_question_sent_at (timestamp, nullable)
   - reminder_sent_at (timestamp, nullable)
   - next_question_scheduled_for (timestamp, nullable)
   - created_at (timestamp, default now())
   
   INDEXES:
   - conversation_state_idx (for scheduler queries)
   - retry_readiness_at_idx (for retry logic)
   - next_question_scheduled_idx (for question scheduling)
   ```

2. **`voice_notes`** - Voice note metadata
   ```sql
   - id (varchar, UUID primary key)
   - free_trial_id (varchar, FK to free_trials)
   - question_index (integer)
   - question_text (text)
   - media_id (varchar)
   - media_url (text, nullable)
   - local_file_path (text, nullable)
   - mime_type (varchar, nullable)
   - media_sha256 (varchar, nullable)
   - download_status (varchar, default 'pending')
   - size_bytes (integer, nullable)
   - received_at (timestamp, default now())
   
   CONSTRAINTS:
   - UNIQUE (free_trial_id, question_index) - prevents duplicate answers
   - FK free_trial_id ON DELETE CASCADE
   
   INDEXES:
   - free_trial_id_idx
   ```

### WhatsApp Integration Architecture

**Message Flow:**
1. **Free Trial Signup** → Two messages sent to buyer:
   - Order confirmation
   - Shareable WhatsApp link for storyteller
   
2. **Storyteller Activation** → Storyteller clicks link:
   - System receives first message with trial ID
   - Sends welcome + readiness question
   - State: `awaiting_initial_contact` → `awaiting_readiness`

3. **Readiness Response**:
   - "yes" → Send first question immediately, state: `ready` → `in_progress`
   - "maybe" → Schedule retry in 4 hours
   - "no" → Mark as not ready

4. **Question Progression**:
   - First question: Sent immediately after "yes"
   - Subsequent questions: Every 48 hours after receiving voice note
   - Reminders: 36 hours after question delivery if no voice note

5. **Voice Note Processing**:
   - Webhook receives voice message
   - Save metadata to database (idempotent by question_index)
   - Schedule next question for +48 hours

**API Endpoints:**
- `POST /webhook/whatsapp` - Receives incoming messages
- `GET /webhook/whatsapp` - Meta webhook verification

### Background Scheduler

**Implementation**: `setInterval` (hourly checks)
- **Production Note**: Replace with external cron job (Render Cron, Vercel Cron, etc.)

**Scheduled Jobs:**
1. `sendScheduledQuestions()` - Sends questions that are past their scheduled time
2. `sendPendingReminders()` - Sends 36-hour reminders for unanswered questions

---

## 📁 Project Structure

```
project-root/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ...
│   │   ├── pages/            # Page components (Wouter routes)
│   │   │   ├── Landing.tsx
│   │   │   ├── FreeTrial.tsx
│   │   │   ├── FreeTrialCheckout.tsx
│   │   │   ├── BookDemo.tsx
│   │   │   └── ...
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx           # Root component + routing
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles + theme variables
│   ├── public/               # Static assets
│   └── index.html
│
├── server/                    # Backend Node.js/Express
│   ├── scripts/              # Standalone CLI scripts (future)
│   ├── conversationHandler.ts # WhatsApp conversation logic
│   ├── db.ts                 # Database connection (Drizzle)
│   ├── index.ts              # Express server + routes
│   ├── routes.ts             # API route handlers
│   ├── scheduler.ts          # Background job scheduler
│   ├── storage.ts            # Database operations (IStorage interface)
│   ├── vite.ts               # Vite dev server integration
│   └── whatsapp.ts           # WhatsApp API client
│
├── shared/                    # Shared TypeScript code
│   ├── schema.ts             # Drizzle schema definitions
│   ├── albumQuestions.ts     # Question bank for 3 albums
│   └── demoBookData.ts       # Book demo content
│
├── migrations/                # Database migrations (Drizzle Kit)
├── attached_assets/           # Runtime images (@assets alias)
├── docs/
│   └── reference-images/     # Documentation screenshots
│
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS config
├── drizzle.config.ts         # Drizzle ORM config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

### Key Files

- **`shared/schema.ts`** - Single source of truth for database schema
- **`shared/albumQuestions.ts`** - 3 albums × 15 questions each
- **`server/conversationHandler.ts`** - State machine for WhatsApp conversations
- **`server/scheduler.ts`** - Background job logic (questions + reminders)
- **`client/src/App.tsx`** - Frontend routing configuration
- **`design_guidelines.md`** - UI/UX design system

---

## 🔧 Environment Variables

### Required (Core Functionality)

```bash
# Database (Supabase PostgreSQL)
SUPABASE_DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
# Format: postgresql://[user]:[password]@[host]:[port]/[database]
# Note: Use session pooler URL from Supabase dashboard

# WhatsApp Business API (Meta/Facebook)
WHATSAPP_ACCESS_TOKEN="EAAVQ..."  # From Meta Developer Console
WHATSAPP_PHONE_NUMBER_ID="123456789012345"  # Your WhatsApp Business Phone Number ID
WHATSAPP_BUSINESS_PHONE="1234567890"  # Your WhatsApp Business phone number
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your_secret_webhook_token_123"  # Custom token for webhook verification

# Session Secret
SESSION_SECRET="your-super-secret-session-key-change-in-production"  # For Express sessions

# Application Mode
NODE_ENV="development"  # or "production"
```

### Optional

```bash
# WhatsApp App Secret (for webhook signature verification)
WHATSAPP_APP_SECRET="your_app_secret_from_meta"  # Optional, not currently used

# Fallback Database (Replit built-in)
DATABASE_URL="postgresql://..."  # Used by drizzle.config.ts for CLI commands only
```

### Environment Variable Details

#### WhatsApp Configuration

**Where to get WhatsApp credentials:**

1. **Meta for Developers Dashboard**: https://developers.facebook.com/
2. Create/Select your WhatsApp Business App
3. Navigate to **WhatsApp > API Setup**

**Getting each credential:**

- **`WHATSAPP_ACCESS_TOKEN`**:
  - Click "Generate Access Token" in API Setup
  - **Temporary tokens expire every 24 hours**
  - For production: Create System User token in Meta Business Settings (doesn't expire)
  
- **`WHATSAPP_PHONE_NUMBER_ID`**:
  - Found in API Setup under "Phone Number ID"
  - Format: 15-digit number
  
- **`WHATSAPP_BUSINESS_PHONE`**:
  - Your WhatsApp Business phone number
  - Format: E.164 (e.g., `1234567890` for US, `919876543210` for India)
  
- **`WHATSAPP_WEBHOOK_VERIFY_TOKEN`**:
  - Create your own random string (e.g., `my_secure_token_12345`)
  - Set this in Meta webhook configuration
  - Must match exactly between Meta dashboard and your `.env`

**Webhook Setup in Meta Dashboard:**
1. Go to WhatsApp > Configuration
2. Edit Webhook:
   - Callback URL: `https://your-domain.com/webhook/whatsapp`
   - Verify Token: (same as `WHATSAPP_WEBHOOK_VERIFY_TOKEN`)
3. Subscribe to fields: `messages`

#### Database Configuration

**Supabase Setup:**
1. Create project at https://supabase.com
2. Go to Project Settings > Database
3. Toggle "Use connection pooling" → **ON**
4. Select "Session" mode
5. Copy the connection string
6. **Important**: URL encode special characters in password (@ becomes %40)

**Database Note:**
- Runtime app uses `SUPABASE_DATABASE_URL`
- Drizzle CLI uses `DATABASE_URL` (cannot modify `drizzle.config.ts`)
- For schema changes: Generate SQL with `npx drizzle-kit generate`, then apply manually to Supabase

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js**: v20.19+ (LTS)
- **npm**: v10+
- **PostgreSQL**: Supabase account (or local PostgreSQL 14+)
- **WhatsApp Business Account**: Meta for Developers access

### Step-by-Step Installation

#### 1. Clone Repository

```bash
git clone <repository-url>
cd legacyscribe
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy template
cp .env.example .env  # If template exists

# Or create manually:
touch .env
```

Add all required environment variables (see section above).

#### 4. Database Setup

**Option A: Using Supabase (Recommended)**

```bash
# 1. Get your Supabase connection string (from dashboard)
# 2. Add to .env as SUPABASE_DATABASE_URL
# 3. Push schema to database

npm run db:push
```

**Option B: Local PostgreSQL**

```bash
# 1. Create database
createdb legacyscribe

# 2. Update .env
SUPABASE_DATABASE_URL="postgresql://postgres:password@localhost:5432/legacyscribe"

# 3. Push schema
npm run db:push
```

**Manual Migration (if needed):**

```bash
# Generate SQL migration
npx drizzle-kit generate

# Apply to Supabase manually using SQL editor
# Or create custom script (see docs/migration-example.js)
```

#### 5. Verify Installation

```bash
# Type check
npm run check

# Should show no errors
```

#### 6. Start Development Server

```bash
npm run dev
```

This starts:
- **Express server**: `http://localhost:5000`
- **Vite dev server**: Integrated with Express
- **Background scheduler**: Hourly job for questions/reminders

#### 7. Test WhatsApp Integration

**Webhook Testing (requires public URL):**

For local development, use ngrok or similar:

```bash
# Install ngrok
npm install -g ngrok

# Expose port 5000
ngrok http 5000

# Update Meta webhook URL with ngrok URL:
# https://abc123.ngrok.io/webhook/whatsapp
```

**Test Flow:**
1. Go to `http://localhost:5000`
2. Click "Start Free Trial"
3. Fill form and submit
4. Check WhatsApp for messages
5. Reply to activate storyteller flow

---

## 🧪 Testing

### Manual Testing Checklist

**Frontend:**
- [ ] Landing page loads with all 6 sections
- [ ] Album selection (free trial checkout) works
- [ ] Free trial form submission
- [ ] Book demo page flip animation

**Backend:**
- [ ] Free trial API creates record in database
- [ ] WhatsApp messages sent successfully
- [ ] Webhook receives and processes messages
- [ ] Scheduler runs and sends questions

**Database:**
- [ ] Check free_trials table: `SELECT * FROM free_trials;`
- [ ] Check voice_notes table: `SELECT * FROM voice_notes;`

### Test WhatsApp Locally

```bash
# Send test message using curl
curl -X POST http://localhost:5000/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "id": "test-msg-123",
            "from": "1234567890",
            "type": "text",
            "text": {"body": "yes"}
          }]
        }
      }]
    }]
  }'
```

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

This creates:
- `dist/public/` - Frontend static files
- `dist/index.js` - Backend bundle

### Start Production Server

```bash
npm start
```

### Environment-Specific Notes

**Development:**
- Hot reload enabled
- WhatsApp sends custom text messages
- Logs verbose output

**Production:**
- WhatsApp uses approved templates (`kahani_free_trial_confirmation`)
- External cron job required for scheduler (not `setInterval`)
- Set `NODE_ENV=production`

---

## 🔌 API Routes

### Public Endpoints

**Free Trial:**
```
POST /api/free-trial
Body: {
  customerPhone: string,
  buyerName: string,
  storytellerName: string,
  selectedAlbum: string
}
Response: { id, buyerName, storytellerName, ... }
```

**WhatsApp Webhook:**
```
POST /webhook/whatsapp
Headers: { Content-Type: application/json }
Body: WhatsApp webhook payload (from Meta)

GET /webhook/whatsapp?hub.mode=subscribe&hub.challenge=123&hub.verify_token=...
Response: hub.challenge (for Meta verification)
```

### Frontend Routes (Wouter)

- `/` - Landing page
- `/checkout` - Regular album selection
- `/free-trial-checkout` - Free trial album selection
- `/free-trial` - Trial signup form
- `/book-demo?book={id}` - Interactive book preview
- `/thank-you` - Order confirmation
- `/blogs` - Blog listing
- `/contact-us` - Contact form
- `/privacy-policy` - Privacy policy
- `/terms-of-service` - Terms of service

---

## 🎨 Design System

**Theme Variables (index.css):**
```css
:root {
  --primary: 210 100% 50%;     /* Primary Blue */
  --accent: 45 100% 51%;       /* Gold Accent */
  --background: 0 0% 100%;     /* White */
  --foreground: 222 47% 11%;   /* Dark Text */
  /* ... see client/src/index.css for full list */
}
```

**Typography:**
- Font: Inter (Google Fonts)
- Headings: 700 weight
- Body: 400 weight

**Components:**
- All UI components in `client/src/components/ui/`
- Custom theme via Tailwind + Shadcn

---

## 🐛 Troubleshooting

### Common Issues

**1. "Error: password authentication failed for user 'postgres'"**
- Check `SUPABASE_DATABASE_URL` is correct
- Verify password is URL-encoded (@ → %40)
- Ensure using session pooler URL (not direct connection)

**2. "WhatsApp access token expired"**
- Temporary tokens expire every 24 hours
- Generate new token from Meta dashboard
- For production: Set up System User token

**3. "Port 5000 already in use"**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change port in server/index.ts
```

**4. "Database relation does not exist"**
```bash
# Push schema to database
npm run db:push

# Or manually apply migration
npx drizzle-kit generate
# Then apply SQL from migrations/ folder
```

**5. Scheduler not running**
- Check logs for "Starting background scheduler"
- Verify database connection is active
- For production: Replace with external cron job

### Debug Tips

**Check Database Connection:**
```bash
# Using psql
psql $SUPABASE_DATABASE_URL -c "SELECT NOW();"
```

**View Logs:**
```bash
# Server logs
npm run dev

# Database queries (add to server/db.ts)
export const db = drizzle(pool, { schema, logger: true });
```

**Test WhatsApp API:**
```bash
curl -X POST "https://graph.facebook.com/v22.0/${PHONE_ID}/messages" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "1234567890",
    "type": "text",
    "text": {"body": "Test message"}
  }'
```

---

## 📚 Additional Resources

**Documentation:**
- `replit.md` - Detailed feature documentation
- `design_guidelines.md` - UI/UX design system
- `PAYMENT_WEBHOOK_SETUP.md` - Payment integration guide

**External Docs:**
- WhatsApp Business API: https://developers.facebook.com/docs/whatsapp
- Drizzle ORM: https://orm.drizzle.team/docs/overview
- Shadcn UI: https://ui.shadcn.com/docs
- TanStack Query: https://tanstack.com/query/latest/docs/react/overview

---

## 🤖 Cursor AI Prompt

Use this prompt when working with Cursor AI on this project:

\`\`\`
You are working on LegacyScribe (Kahani), a story preservation platform built with:
- Frontend: React 18 + TypeScript + Vite + Wouter routing + TanStack Query + Shadcn UI
- Backend: Node.js + Express + TypeScript + Drizzle ORM (PostgreSQL)
- Integration: WhatsApp Business API (Meta Graph API v22)

ARCHITECTURE RULES:
1. Database schema is in shared/schema.ts (single source of truth)
2. Use Drizzle ORM for all database operations (no raw SQL except debugging)
3. WhatsApp conversation state machine in server/conversationHandler.ts
4. Background jobs in server/scheduler.ts (hourly interval, needs external cron for production)
5. All images imported via @assets alias (points to attached_assets/)
6. Use IStorage interface in server/storage.ts for database operations

KEY FEATURES:
- Free trial: 1 album (15 questions), automated WhatsApp delivery
- Question cadence: Every 2 days (48 hours) after voice note received
- Reminders: 36 hours after question delivery if no response
- Conversation states: awaiting_initial_contact → awaiting_readiness → ready → in_progress → completed
- Idempotency: Webhook messages tracked by ID, voice notes by (trial_id, question_index)

TECH PATTERNS:
- Forms: React Hook Form + Zod validation + zodResolver
- API calls: TanStack Query with apiRequest() from @lib/queryClient
- Routing: Wouter (<Link>, useLocation)
- Components: Shadcn UI (import from @/components/ui/*)
- Styling: Tailwind CSS + custom theme in index.css

DATABASE:
- Primary: Supabase PostgreSQL (SUPABASE_DATABASE_URL)
- Tables: free_trials, voice_notes
- Migrations: Generate with drizzle-kit, apply manually to Supabase

WHATSAPP INTEGRATION:
- Two-message flow: (1) buyer confirmation, (2) shareable storyteller link
- Webhook: POST /webhook/whatsapp (receives incoming messages)
- API: server/whatsapp.ts (sendTextMessage, sendTemplateMessage)
- E.164 phone format: Auto-converts 10-digit Indian numbers to 91XXXXXXXXXX

IMPORTANT CONSTRAINTS:
- Cannot modify: vite.config.ts, drizzle.config.ts (forbidden files)
- @assets alias must remain pointed to attached_assets/
- Temporary WhatsApp tokens expire every 24 hours (use System User for prod)

WHEN MAKING CHANGES:
1. Update shared/schema.ts first for data model changes
2. Use npm run db:push to sync schema (or manual migration for Supabase)
3. Follow existing patterns in codebase
4. Test WhatsApp flow end-to-end (webhook + scheduler)
5. Check conversation state transitions are correct

FILE LOCATIONS:
- Frontend pages: client/src/pages/*.tsx
- API routes: server/routes.ts
- Database ops: server/storage.ts
- WhatsApp logic: server/conversationHandler.ts
- Scheduling: server/scheduler.ts
- Schema: shared/schema.ts
- Questions: shared/albumQuestions.ts

For any questions about implementation details, refer to replit.md or design_guidelines.md.
\`\`\`

---

## 📄 License

MIT

---

## 👥 Contributing

This is a proprietary project. For questions or issues, contact the development team.

---

**Last Updated**: November 9, 2025
**Version**: 1.0.0
