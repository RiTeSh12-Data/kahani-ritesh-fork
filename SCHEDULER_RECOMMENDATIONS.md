# Scheduler Architecture Recommendations

## Current Issues
- Using `setInterval` which runs in-process
- No persistence if server crashes
- Polling every 10 seconds is inefficient
- Tasks can overlap if processing takes too long

## Recommended Solutions

### Option 1: Queue System (Bull/BullMQ) - **RECOMMENDED** ⭐

**Best for:** Production, reliability, scalability

**Pros:**
- ✅ Persistent jobs (survives server restarts)
- ✅ Built-in retry logic
- ✅ Job prioritization
- ✅ Rate limiting support
- ✅ Can scale workers separately
- ✅ Job status tracking

**Cons:**
- ❌ Requires Redis
- ❌ More complex setup

**Installation:**
```bash
npm install bullmq ioredis
npm install --save-dev @types/ioredis
```

**Implementation:**
```typescript
// server/queue.ts
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const messageQueue = new Queue('whatsapp-messages', { connection });

export const messageWorker = new Worker(
  'whatsapp-messages',
  async (job) => {
    const { trialId, messageType, ...data } = job.data;
    
    if (messageType === 'question') {
      await sendScheduledQuestion(trialId);
    } else if (messageType === 'reminder') {
      await sendReminder(trialId);
    }
  },
  { connection }
);

// When scheduling a message:
await messageQueue.add(
  'send-question',
  { trialId, messageType: 'question' },
  { delay: 2000 } // 2 seconds delay
);
```

---

### Option 2: Job Scheduler (node-cron) - **SIMPLE**

**Best for:** Development, simple use cases

**Pros:**
- ✅ Simple to implement
- ✅ No external dependencies
- ✅ Good for fixed schedules

**Cons:**
- ❌ Still in-process (lost on restart)
- ❌ Not ideal for dynamic scheduling
- ❌ No built-in retry logic

**Installation:**
```bash
npm install node-cron
npm install --save-dev @types/node-cron
```

**Implementation:**
```typescript
// server/scheduler.ts
import cron from 'node-cron';

// Run every 10 seconds
cron.schedule('*/10 * * * * *', async () => {
  await processScheduledTasks();
});
```

---

### Option 3: Hybrid Approach - **BEST BALANCE** ⭐⭐

**Use database for persistence + queue for execution**

Since you already store `nextQuestionScheduledFor` in the database:

1. **Keep database as source of truth** (you already do this)
2. **Use a lightweight queue** for immediate execution
3. **Use cron/interval** to check database periodically for missed jobs

**Implementation:**
```typescript
// server/scheduler.ts
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
export const messageQueue = new Queue('whatsapp-messages', { connection });

// When scheduling (in conversationHandler.ts):
export async function scheduleNextQuestion(trialId: string, delayMs: number) {
  const scheduledTime = new Date(Date.now() + delayMs);
  
  // Store in DB (source of truth)
  await storage.updateFreeTrialDb(trialId, {
    nextQuestionScheduledFor: scheduledTime,
  });
  
  // Add to queue for immediate execution
  await messageQueue.add(
    `question-${trialId}`,
    { trialId, type: 'question' },
    { 
      delay: delayMs,
      jobId: `question-${trialId}`, // Prevent duplicates
    }
  );
}

// Periodic check for missed jobs (runs every minute)
setInterval(async () => {
  const dueTrials = await storage.getScheduledQuestionsDue();
  for (const trial of dueTrials) {
    // Re-queue if not already processing
    await messageQueue.add(
      `question-${trial.id}`,
      { trialId: trial.id, type: 'question' },
      { jobId: `question-${trial.id}` }
    );
  }
}, 60 * 1000);
```

---

### Option 4: External Cron (Production)

**Best for:** Production environments (Render, Vercel, etc.)

**Implementation:**
1. Create an endpoint: `POST /api/cron/process-scheduled`
2. Use external cron service to call it:
   - Render Cron Jobs
   - Vercel Cron
   - GitHub Actions
   - AWS EventBridge

```typescript
// server/routes.ts
app.post('/api/cron/process-scheduled', async (req, res) => {
  // Verify cron secret
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  await processScheduledTasks();
  res.json({ success: true });
});
```

---

## My Recommendation

**For your use case (WhatsApp messages with 2-10 second delays):**

Use **Option 3 (Hybrid)** because:
1. You already have database persistence ✅
2. You need immediate execution for short delays (2-10 seconds)
3. You need reliability (database as backup)
4. Queue handles immediate execution efficiently
5. Periodic check catches any missed jobs

**Migration Path:**
1. Install BullMQ + Redis
2. Replace `setInterval` with queue-based scheduling
3. Keep database queries as backup/recovery mechanism
4. Add worker to process queue jobs

Would you like me to implement the hybrid approach?

