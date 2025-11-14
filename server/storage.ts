import {
  type Product,
  type Order,
  type FreeTrial,
  type Feedback,
  type InsertOrder,
  type InsertFreeTrial,
  type InsertFeedback,
  type WhatsappToken,
  type InsertWhatsappToken,
  type WebhookEvent,
  type FreeTrialRow,
  type InsertFreeTrialRow,
  type VoiceNoteRow,
  type InsertVoiceNoteRow,
  type AlbumRow,
  freeTrials,
  voiceNotes,
  albums,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, lte } from "drizzle-orm";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  createFreeTrial(trial: InsertFreeTrial): Promise<FreeTrial>;
  getFreeTrial(id: string): Promise<FreeTrial | undefined>;

  createFreeTrialDb(trial: InsertFreeTrialRow): Promise<FreeTrialRow>;
  getFreeTrialDb(id: string): Promise<FreeTrialRow | undefined>;
  getFreeTrialByStorytellerPhone(
    phone: string,
  ): Promise<FreeTrialRow | undefined>;
  updateFreeTrialDb(
    id: string,
    updates: Partial<FreeTrialRow>,
  ): Promise<FreeTrialRow>;
  getFreeTrialsNeedingRetry(): Promise<FreeTrialRow[]>;
  getScheduledQuestionsDue(): Promise<FreeTrialRow[]>;
  getPendingReminders(): Promise<FreeTrialRow[]>;

  createVoiceNote(voiceNote: InsertVoiceNoteRow): Promise<VoiceNoteRow>;
  getVoiceNotesByTrialId(freeTrialId: string): Promise<VoiceNoteRow[]>;
  updateVoiceNote(
    id: string,
    updates: Partial<VoiceNoteRow>,
  ): Promise<VoiceNoteRow>;

  getStories(uniqueCode: string): Promise<any>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbackByOrderCode(orderCode: string): Promise<Feedback | undefined>;

  createWhatsappToken(token: InsertWhatsappToken): Promise<WhatsappToken>;
  getWhatsappToken(token: string): Promise<WhatsappToken | undefined>;
  consumeWhatsappToken(token: string): Promise<WhatsappToken | undefined>;

  isWebhookProcessed(idempotencyKey: string): Promise<boolean>;
  markWebhookProcessed(idempotencyKey: string): Promise<WebhookEvent>;

  getAllAlbums(): Promise<AlbumRow[]>;
  getAlbumByTitle(title: string): Promise<AlbumRow | undefined>;
  getAlbumById(id: string): Promise<AlbumRow | undefined>;
  getQuestionByIndex(
    albumId: string,
    index: number,
  ): Promise<string | undefined>;
  getTotalQuestionsForAlbum(albumId: string): Promise<number>;
}

const initialProducts: Product[] = [
  {
    id: "military-veterans",
    name: "Military & Veterans",
    category: "Service Stories",
    price: 999,
    questionCount: 50,
    durationDays: 50,
    description:
      "Honor their service and sacrifice. Capture combat experiences, camaraderie, and life-changing moments.",
    image:
      "https://images.unsplash.com/photo-1562141292-a10cc3b8f8f7?w=800&h=600&fit=crop",
    features: [
      "50 thoughtfully crafted questions",
      "Daily WhatsApp delivery over 50 days",
      "Voice and text response options",
      "Professionally formatted digital memoir",
      "Unlimited family sharing link",
      "Priority email support",
    ],
    sampleQuestions: [
      "What motivated you to join the military?",
      "Describe your most challenging deployment experience.",
      "Who was your most influential commanding officer and why?",
      "What values did military service instill in you?",
      "How did your service change your perspective on life?",
    ],
  },
  {
    id: "grandparent-chronicles",
    name: "Grandparent Chronicles",
    category: "Family Legacy",
    price: 799,
    questionCount: 30,
    durationDays: 30,
    description:
      "Preserve generational wisdom, childhood memories, family traditions, and life lessons.",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
    features: [
      "30 heartwarming questions",
      "Daily WhatsApp delivery over 30 days",
      "Voice and text response options",
      "Beautiful digital memoir",
      "Shareable family link",
      "Email support",
    ],
    sampleQuestions: [
      "What is your earliest childhood memory?",
      "Tell me about your parents and grandparents.",
      "What family traditions do you cherish most?",
      "What was life like when you were growing up?",
      "What advice would you give to future generations?",
    ],
  },
  {
    id: "career-life-lessons",
    name: "Career & Life Lessons",
    category: "Professional Journey",
    price: 1099,
    questionCount: 40,
    durationDays: 40,
    description:
      "Document professional achievements, career pivots, leadership experiences, and hard-earned wisdom.",
    image:
      "https://images.unsplash.com/photo-1560439513-74b037a25d84?w=800&h=600&fit=crop",
    features: [
      "40 career-focused questions",
      "Daily WhatsApp delivery over 40 days",
      "Voice and text response options",
      "Professional digital memoir",
      "Family sharing enabled",
      "Priority support",
    ],
    sampleQuestions: [
      "What was your first job and what did you learn?",
      "Describe a career-defining moment.",
      "What was your biggest professional challenge?",
      "Who mentored you and how did they impact your career?",
      "What would you tell your younger professional self?",
    ],
  },
  {
    id: "immigration-culture",
    name: "Immigration & Culture",
    category: "Cultural Heritage",
    price: 999,
    questionCount: 35,
    durationDays: 35,
    description:
      "Preserve immigration journeys, cultural heritage, adaptation stories, and traditions passed through generations.",
    image:
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=600&fit=crop",
    features: [
      "35 culturally sensitive questions",
      "Flexible delivery schedule",
      "Multilingual response support",
      "Cultural heritage memoir",
      "Unlimited family access",
      "Dedicated support team",
    ],
    sampleQuestions: [
      "What was life like in your homeland?",
      "Why did you decide to immigrate?",
      "What was your biggest challenge adapting to a new country?",
      "What traditions have you kept from your culture?",
      "How has your cultural identity evolved?",
    ],
  },
  {
    id: "healthcare-heroes",
    name: "Healthcare Heroes",
    category: "Medical Stories",
    price: 1199,
    questionCount: 45,
    durationDays: 45,
    description:
      "Capture compassionate care stories, patient connections, medical breakthroughs, and career highlights.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    features: [
      "45 healthcare-focused questions",
      "Flexible scheduling for busy professionals",
      "HIPAA-compliant story collection",
      "Professional memoir format",
      "Private family sharing",
      "Priority support",
    ],
    sampleQuestions: [
      "Why did you choose a career in healthcare?",
      "Describe a patient who changed your perspective.",
      "What was your most challenging medical case?",
      "How has healthcare evolved during your career?",
      "What brings you the most fulfillment in your work?",
    ],
  },
  {
    id: "entrepreneur-legacy",
    name: "Entrepreneur Legacy",
    category: "Business Journey",
    price: 1299,
    questionCount: 50,
    durationDays: 50,
    description:
      "Document business ventures, entrepreneurial challenges, successes, failures, and insights.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
    features: [
      "50 business-focused questions",
      "Flexible delivery schedule",
      "Voice and text responses",
      "Premium digital memoir",
      "Business insights documentation",
      "Dedicated account manager",
    ],
    sampleQuestions: [
      "What inspired you to start your first business?",
      "Describe your biggest business failure and what you learned.",
      "Who were your key mentors and advisors?",
      "What was your most pivotal business decision?",
      "What advice would you give aspiring entrepreneurs?",
    ],
  },
];

export class DatabaseStorage implements IStorage {
  private products: Map<string, Product>;
  private orders: Map<string, Order> = new Map();
  private freeTrialsLegacy: Map<string, FreeTrial> = new Map();
  private feedbacks: Map<string, Feedback> = new Map();
  private whatsappTokens: Map<string, WhatsappToken> = new Map();
  private webhookEvents: Map<string, WebhookEvent> = new Map();

  constructor() {
    this.products = new Map(initialProducts.map((p) => [p.id, p]));
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const uniqueCode = randomUUID().substring(0, 8);
    const order: Order = {
      ...insertOrder,
      id,
      uniqueCode,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    const updatedOrder: Order = {
      ...order,
      ...updates,
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async createFreeTrial(insertTrial: InsertFreeTrial): Promise<FreeTrial> {
    const id = randomUUID();
    const trial: FreeTrial = {
      ...insertTrial,
      id,
      createdAt: new Date().toISOString(),
      conversationState: "awaiting_initial_contact",
      currentQuestionIndex: 0,
    };
    this.freeTrialsLegacy.set(id, trial);
    return trial;
  }

  async getFreeTrial(id: string): Promise<FreeTrial | undefined> {
    return this.freeTrialsLegacy.get(id);
  }

  async createFreeTrialDb(
    insertTrial: InsertFreeTrialRow,
  ): Promise<FreeTrialRow> {
    const [trial] = await db.insert(freeTrials).values(insertTrial).returning();
    return trial;
  }

  async getFreeTrialDb(id: string): Promise<FreeTrialRow | undefined> {
    const [trial] = await db
      .select()
      .from(freeTrials)
      .where(eq(freeTrials.id, id));
    return trial;
  }

  async getFreeTrialByStorytellerPhone(
    phone: string,
  ): Promise<FreeTrialRow | undefined> {
    const [trial] = await db
      .select()
      .from(freeTrials)
      .where(eq(freeTrials.storytellerPhone, phone));
    return trial;
  }

  async updateFreeTrialDb(
    id: string,
    updates: Partial<FreeTrialRow>,
  ): Promise<FreeTrialRow> {
    const [updatedTrial] = await db
      .update(freeTrials)
      .set(updates)
      .where(eq(freeTrials.id, id))
      .returning();

    if (!updatedTrial) {
      throw new Error(`Free trial with id ${id} not found`);
    }

    return updatedTrial;
  }

  async getFreeTrialsNeedingRetry(): Promise<FreeTrialRow[]> {
    const now = new Date();
    const trials = await db
      .select()
      .from(freeTrials)
      .where(
        and(
          eq(freeTrials.conversationState, "awaiting_readiness"),
          lte(freeTrials.retryReadinessAt, now),
        ),
      );
    return trials;
  }

  async getScheduledQuestionsDue(): Promise<FreeTrialRow[]> {
    const now = new Date();
    const trials = await db
      .select()
      .from(freeTrials)
      .where(
        and(
          eq(freeTrials.conversationState, "in_progress"),
          lte(freeTrials.nextQuestionScheduledFor, now),
        ),
      );
    return trials;
  }

  async getPendingReminders(): Promise<FreeTrialRow[]> {
    const now = new Date();
    const reminderThreshold = new Date(now.getTime() - 36 * 60 * 60 * 1000);
    const trials = await db
      .select()
      .from(freeTrials)
      .where(
        and(
          eq(freeTrials.conversationState, "in_progress"),
          lte(freeTrials.lastQuestionSentAt, reminderThreshold),
        ),
      );
    return trials.filter((trial) => {
      if (trial.reminderSentAt) return false;
      if (!trial.nextQuestionScheduledFor) return true;
      return trial.nextQuestionScheduledFor <= now;
    });
  }

  async createVoiceNote(
    insertVoiceNote: InsertVoiceNoteRow,
  ): Promise<VoiceNoteRow> {
    const [voiceNote] = await db
      .insert(voiceNotes)
      .values(insertVoiceNote)
      .returning();
    return voiceNote;
  }

  async getVoiceNotesByTrialId(freeTrialId: string): Promise<VoiceNoteRow[]> {
    const notes = await db
      .select()
      .from(voiceNotes)
      .where(eq(voiceNotes.freeTrialId, freeTrialId));
    return notes;
  }

  async updateVoiceNote(
    id: string,
    updates: Partial<VoiceNoteRow>,
  ): Promise<VoiceNoteRow> {
    const [updatedNote] = await db
      .update(voiceNotes)
      .set(updates)
      .where(eq(voiceNotes.id, id))
      .returning();

    if (!updatedNote) {
      throw new Error(`Voice note with id ${id} not found`);
    }

    return updatedNote;
  }

  async getStories(uniqueCode: string): Promise<any> {
    const order = Array.from(this.orders.values()).find(
      (o) => o.uniqueCode === uniqueCode,
    );

    if (!order) {
      return null;
    }

    const allProducts = await this.getAllProducts();

    let totalQuestions = 0;
    let primaryCategory = "Stories";

    for (const item of order.items) {
      const product = allProducts.find((p) => p.id === item.productId);
      if (product) {
        totalQuestions += product.questionCount * item.quantity;
        if (!primaryCategory || primaryCategory === "Stories") {
          primaryCategory = product.category;
        }
      }
    }

    return {
      elderName: "Your Loved One",
      category: primaryCategory,
      totalQuestions,
      responses: [],
    };
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      createdAt: new Date().toISOString(),
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async getFeedbackByOrderCode(
    orderCode: string,
  ): Promise<Feedback | undefined> {
    return Array.from(this.feedbacks.values()).find(
      (f) => f.orderCode === orderCode,
    );
  }

  async createWhatsappToken(
    insertToken: InsertWhatsappToken,
  ): Promise<WhatsappToken> {
    const id = randomUUID();
    const token: WhatsappToken = {
      ...insertToken,
      id,
      createdAt: new Date().toISOString(),
    };
    this.whatsappTokens.set(token.token, token);
    return token;
  }

  async getWhatsappToken(token: string): Promise<WhatsappToken | undefined> {
    return this.whatsappTokens.get(token);
  }

  async consumeWhatsappToken(
    token: string,
  ): Promise<WhatsappToken | undefined> {
    const whatsappToken = this.whatsappTokens.get(token);
    if (!whatsappToken) {
      return undefined;
    }
    const consumedToken: WhatsappToken = {
      ...whatsappToken,
      consumedAt: new Date().toISOString(),
    };
    this.whatsappTokens.set(token, consumedToken);
    return consumedToken;
  }

  async isWebhookProcessed(idempotencyKey: string): Promise<boolean> {
    return this.webhookEvents.has(idempotencyKey);
  }

  async markWebhookProcessed(idempotencyKey: string): Promise<WebhookEvent> {
    const event: WebhookEvent = {
      idempotencyKey,
      processedAt: new Date().toISOString(),
    };
    this.webhookEvents.set(idempotencyKey, event);
    return event;
  }

  async getAllAlbums(): Promise<AlbumRow[]> {
    try {
      const allAlbums = await db
        .select()
        .from(albums)
        .where(eq(albums.isActive, true));
      return allAlbums;
    } catch (error: any) {
      // If table doesn't exist, return empty array with helpful error message
      if (
        error?.message?.includes("does not exist") ||
        error?.code === "42P01"
      ) {
        console.error(
          "Albums table does not exist. Please run the migration: npm run db:push or apply migrations/0001_add_albums.sql manually",
        );
        throw new Error(
          "Albums table not found. Please run database migration first.",
        );
      }
      throw error;
    }
  }

  async getAlbumByTitle(title: string): Promise<AlbumRow | undefined> {
    const [album] = await db
      .select()
      .from(albums)
      .where(and(eq(albums.title, title), eq(albums.isActive, true)));
    return album;
  }

  async getAlbumById(id: string): Promise<AlbumRow | undefined> {
    const [album] = await db
      .select()
      .from(albums)
      .where(and(eq(albums.id, id), eq(albums.isActive, true)));
    return album;
  }

  async getQuestionByIndex(
    albumTitleOrId: string,
    index: number,
  ): Promise<string | undefined> {
    // Try to find by title first (for backward compatibility)
    let album = await this.getAlbumByTitle(albumTitleOrId);
    // If not found by title, try by ID
    if (!album) {
      album = await this.getAlbumById(albumTitleOrId);
    }
    if (!album || !album.questions) {
      return undefined;
    }
    return album.questions[index];
  }

  async getTotalQuestionsForAlbum(albumTitleOrId: string): Promise<number> {
    // Try to find by title first (for backward compatibility)
    let album = await this.getAlbumByTitle(albumTitleOrId);
    // If not found by title, try by ID
    if (!album) {
      album = await this.getAlbumById(albumTitleOrId);
    }
    if (!album || !album.questions) {
      return 0;
    }
    return album.questions.length;
  }
}

export const storage = new DatabaseStorage();
