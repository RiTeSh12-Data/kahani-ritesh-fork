import { z } from "zod";
import { pgTable, varchar, text, integer, timestamp, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  questionCount: z.number(),
  durationDays: z.number(),
  description: z.string(),
  sampleQuestions: z.array(z.string()),
  image: z.string(),
  features: z.array(z.string()),
});

export type Product = z.infer<typeof productSchema>;

export const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const insertOrderSchema = z.object({
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  total: z.number(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;

export const orderSchema = insertOrderSchema.extend({
  id: z.string(),
  uniqueCode: z.string(),
  paymentId: z.string().optional(),
  status: z.enum(["pending", "paid", "failed"]).default("pending"),
  customerPhoneE164: z.string().optional(),
  lastConfirmationSentAt: z.string().optional(),
  createdAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

export const whatsappTokenSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  consumedAt: z.string().optional(),
  createdAt: z.string(),
});

export type WhatsappToken = z.infer<typeof whatsappTokenSchema>;

export const insertWhatsappTokenSchema = z.object({
  orderId: z.string(),
  token: z.string(),
  expiresAt: z.string(),
});

export type InsertWhatsappToken = z.infer<typeof insertWhatsappTokenSchema>;

export const webhookEventSchema = z.object({
  idempotencyKey: z.string(),
  processedAt: z.string(),
});

export type WebhookEvent = z.infer<typeof webhookEventSchema>;

export const insertFreeTrialSchema = z.object({
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  buyerName: z.string().min(2, "Name must be at least 2 characters"),
  storytellerName: z.string().min(2, "Storyteller name must be at least 2 characters"),
  selectedAlbum: z.string().min(2, "Album selection is required"),
});

export type InsertFreeTrial = z.infer<typeof insertFreeTrialSchema>;

export const freeTrialSchema = insertFreeTrialSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  storytellerPhone: z.string().optional(),
  conversationState: z.enum(["awaiting_initial_contact", "awaiting_readiness", "ready", "in_progress", "completed"]).default("awaiting_initial_contact"),
  currentQuestionIndex: z.number().default(0),
  retryReadinessAt: z.string().optional(),
  retryCount: z.number().default(0),
  lastReadinessResponse: z.string().optional(),
  welcomeSentAt: z.string().optional(),
  readinessAskedAt: z.string().optional(),
  lastQuestionSentAt: z.string().optional(),
  reminderSentAt: z.string().optional(),
  nextQuestionScheduledFor: z.string().optional(),
});

export type FreeTrial = z.infer<typeof freeTrialSchema>;

export const voiceNoteSchema = z.object({
  id: z.string(),
  freeTrialId: z.string(),
  questionIndex: z.number(),
  questionText: z.string(),
  mediaId: z.string(),
  mediaUrl: z.string().optional(),
  localFilePath: z.string().optional(),
  mimeType: z.string().optional(),
  receivedAt: z.string(),
});

export type VoiceNote = z.infer<typeof voiceNoteSchema>;

export const insertVoiceNoteSchema = z.object({
  freeTrialId: z.string(),
  questionIndex: z.number(),
  questionText: z.string(),
  mediaId: z.string(),
  mediaUrl: z.string().optional(),
  localFilePath: z.string().optional(),
  mimeType: z.string().optional(),
});

export type InsertVoiceNote = z.infer<typeof insertVoiceNoteSchema>;

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;

const baseFeedbackSchema = z.object({
  orderCode: z.string().min(1, "Order code is required"),
  overallRating: z.number().min(1, "Overall rating is required").max(5),
  whatsappEase: z.enum([
    "very-easy",
    "easy",
    "neutral",
    "difficult",
    "very-difficult",
  ]),
  storyQuality: z.enum([
    "very-satisfied",
    "satisfied",
    "neutral",
    "dissatisfied",
    "very-dissatisfied",
  ]),
  wouldRecommend: z.enum([
    "definitely-yes",
    "probably-yes",
    "not-sure",
    "probably-not",
    "definitely-not",
  ]),
  writtenFeedback: z.string().max(500).optional(),
  allowTestimonial: z.boolean().default(false),
  testimonialName: z.string().optional(),
  testimonialRelationship: z.string().optional(),
  testimonialPhoto: z.string().optional(),
  allowFollowUp: z.boolean().default(false),
  followUpEmail: z.string().optional(),
  followUpPhone: z.string().optional(),
});

export const insertFeedbackSchema = baseFeedbackSchema.superRefine((data, ctx) => {
  if (data.allowTestimonial) {
    if (!data.testimonialName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required when allowing testimonial usage",
        path: ["testimonialName"],
      });
    }
    if (!data.testimonialRelationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Relationship is required when allowing testimonial usage",
        path: ["testimonialRelationship"],
      });
    }
  }
  if (data.allowFollowUp && !data.followUpEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Email is required when allowing follow-up",
      path: ["followUpEmail"],
    });
  }
  if (data.allowFollowUp && data.followUpEmail && !z.string().email().safeParse(data.followUpEmail).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid email address",
      path: ["followUpEmail"],
    });
  }
});

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export const feedbackSchema = baseFeedbackSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});

export type Feedback = z.infer<typeof feedbackSchema>;

export const freeTrials = pgTable("free_trials", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  buyerName: varchar("buyer_name", { length: 255 }).notNull(),
  storytellerName: varchar("storyteller_name", { length: 255 }).notNull(),
  selectedAlbum: varchar("selected_album", { length: 255 }).notNull(),
  storytellerPhone: varchar("storyteller_phone", { length: 20 }),
  conversationState: varchar("conversation_state", { length: 50 })
    .notNull()
    .default("awaiting_initial_contact"),
  currentQuestionIndex: integer("current_question_index").notNull().default(0),
  retryReadinessAt: timestamp("retry_readiness_at", { withTimezone: true }),
  retryCount: integer("retry_count").notNull().default(0),
  lastReadinessResponse: varchar("last_readiness_response", { length: 50 }),
  welcomeSentAt: timestamp("welcome_sent_at", { withTimezone: true }),
  readinessAskedAt: timestamp("readiness_asked_at", { withTimezone: true }),
  lastQuestionSentAt: timestamp("last_question_sent_at", { withTimezone: true }),
  reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
  nextQuestionScheduledFor: timestamp("next_question_scheduled_for", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  conversationStateIdx: index("free_trials_conversation_state_idx").on(table.conversationState),
  retryReadinessIdx: index("free_trials_retry_readiness_at_idx").on(table.retryReadinessAt),
  nextQuestionScheduledIdx: index("free_trials_next_question_scheduled_idx").on(table.nextQuestionScheduledFor),
}));

export type FreeTrialRow = typeof freeTrials.$inferSelect;
export type InsertFreeTrialRow = typeof freeTrials.$inferInsert;

export const voiceNotes = pgTable("voice_notes", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  freeTrialId: varchar("free_trial_id", { length: 255 })
    .notNull()
    .references(() => freeTrials.id, { onDelete: "cascade" }),
  questionIndex: integer("question_index").notNull(),
  questionText: text("question_text").notNull(),
  mediaId: varchar("media_id", { length: 255 }).notNull(),
  mediaUrl: text("media_url"),
  localFilePath: text("local_file_path"),
  mimeType: varchar("mime_type", { length: 100 }),
  mediaSha256: varchar("media_sha256", { length: 64 }),
  downloadStatus: varchar("download_status", { length: 20 }).notNull().default("pending"),
  sizeBytes: integer("size_bytes"),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  freeTrialIdIdx: index("voice_notes_free_trial_id_idx").on(table.freeTrialId),
  uniqueQuestionIdx: uniqueIndex("voice_notes_trial_question_idx").on(
    table.freeTrialId,
    table.questionIndex
  ),
}));

export type VoiceNoteRow = typeof voiceNotes.$inferSelect;
export type InsertVoiceNoteRow = typeof voiceNotes.$inferInsert;
