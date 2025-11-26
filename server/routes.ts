import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertOrderSchema,
  insertFreeTrialSchema,
  insertFeedbackSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/albums", async (req, res) => {
    try {
      const allAlbums = await storage.getAllAlbums();
      // Transform to match frontend expectations
      const albumsResponse = allAlbums.map((album) => ({
        id: album.id,
        title: album.title,
        description: album.description,
        cover_image: album.coverImage,
        questions: album.questions,
      }));
      res.json(albumsResponse);
    } catch (error: any) {
      console.error("Error fetching albums:", error);
      // Provide more detailed error information
      const errorMessage = error?.message || "Unknown error";
      const errorStack =
        process.env.NODE_ENV === "development" ? error?.stack : undefined;
      res.status(500).json({
        error: "Failed to fetch albums",
        message: errorMessage,
        ...(errorStack && { stack: errorStack }),
      });
    }
  });

  app.post("/api/free-trial", async (req, res) => {
    try {
      const validatedData = insertFreeTrialSchema.parse(req.body);

      const { normalizePhoneNumber } = await import("./whatsapp");
      const normalizedPhone = normalizePhoneNumber(validatedData.customerPhone);

      const trial = await storage.createFreeTrialDb({
        customerPhone: normalizedPhone,
        buyerName: validatedData.buyerName,
        storytellerName: validatedData.storytellerName,
        selectedAlbum: validatedData.selectedAlbum,
      });

      const { sendFreeTrialConfirmation, sendShareableLink } = await import(
        "./whatsapp"
      );

      const confirmationSent = await sendFreeTrialConfirmation(
        normalizedPhone,
        validatedData.buyerName,
        validatedData.storytellerName,
        validatedData.selectedAlbum,
      );

      if (!confirmationSent) {
        console.warn(
          "WhatsApp confirmation message failed for trial:",
          trial.id,
        );
      }

      let shareableLinkSent = false;
      if (confirmationSent) {
        shareableLinkSent = await sendShareableLink(
          normalizedPhone,
          validatedData.storytellerName,
          validatedData.buyerName,
          trial.id,
        );

        if (!shareableLinkSent) {
          console.warn(
            "WhatsApp shareable link message failed for trial:",
            trial.id,
          );
        }
      }

      console.log("Free trial created:", {
        id: trial.id,
        buyerName: trial.buyerName,
        storytellerName: trial.storytellerName,
        selectedAlbum: trial.selectedAlbum,
        customerPhone: normalizedPhone,
        confirmationSent,
        shareableLinkSent,
      });

      res.json({ ...trial, confirmationSent, shareableLinkSent });
    } catch (error: any) {
      console.error("Error creating free trial:", error);
      if (error.name === "ZodError") {
        return res
          .status(400)
          .json({ error: "Invalid input", details: error.errors });
      }
      // Provide more detailed error information
      const errorMessage = error?.message || "Unknown error";
      const errorStack =
        process.env.NODE_ENV === "development" ? error?.stack : undefined;
      res.status(500).json({
        error: "Failed to create free trial",
        message: errorMessage,
        ...(errorStack && { stack: errorStack }),
      });
    }
  });

  app.get("/api/albums/:trialId", async (req, res) => {
    try {
      const { trialId } = req.params;

      const trial = await storage.getFreeTrialDb(trialId);
      if (!trial) {
        return res.status(404).json({ error: "Album not found" });
      }

      const voiceNotes = await storage.getVoiceNotesByTrialId(trialId);

      const totalQuestions = await storage.getTotalQuestionsForAlbum(
        trial.selectedAlbum,
      );

      const tracks = await Promise.all(
        Array.from({ length: totalQuestions }, async (_, index) => {
          const questionText = await storage.getQuestionByIndex(
            trial.selectedAlbum,
            index,
          );
          const voiceNote = voiceNotes.find(
            (note) => note.questionIndex === index,
          );

          return {
            questionIndex: index,
            questionText,
            voiceNoteId: voiceNote?.id || null,
            answeredAt: voiceNote?.receivedAt || null,
            mediaUrl: voiceNote?.mediaUrl || null,
            mediaId: voiceNote?.mediaId || null,
          };
        }),
      );

      // Fetch album metadata
      let album = await storage.getAlbumByTitle(trial.selectedAlbum);
      if (!album) {
        // Try to get by ID if selectedAlbum is an ID
        album = await storage.getAlbumById(trial.selectedAlbum);
      }

      // Fallback values if album metadata is missing
      const albumDescription = album?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
      const albumCoverImage = album?.coverImage || "/attached_assets/Generated Image November 08, 2025 - 8_27PM_1762623023120.png";

      res.json({
        trial: {
          id: trial.id,
          storytellerName: trial.storytellerName,
          buyerName: trial.buyerName,
          selectedAlbum: trial.selectedAlbum,
        },
        album: {
          description: albumDescription,
          coverImage: albumCoverImage,
        },
        tracks,
      });
    } catch (error) {
      console.error("Error fetching album:", error);
      res.status(500).json({ error: "Failed to fetch album" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);

      const { sendTemplateMessage, normalizePhoneNumber } = await import(
        "./whatsapp"
      );
      const normalizedPhone = normalizePhoneNumber(validatedData.customerPhone);
      const whatsappSent = await sendTemplateMessage(
        normalizedPhone,
        "hello_world",
        "en_US",
      );

      if (!whatsappSent) {
        console.warn(
          "WhatsApp confirmation message failed for order:",
          order.id,
        );
      }

      console.log("Order created:", {
        id: order.id,
        uniqueCode: order.uniqueCode,
        customerPhone: normalizedPhone,
        items: order.items,
        whatsappSent,
      });

      res.json({ ...order, whatsappSent });
    } catch (error: any) {
      console.error("Error creating order:", error);
      if (error.name === "ZodError") {
        return res
          .status(400)
          .json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/stories/:uniqueCode", async (req, res) => {
    try {
      const stories = await storage.getStories(req.params.uniqueCode);
      if (!stories) {
        return res.status(404).json({ error: "Stories not found" });
      }
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  app.get("/api/feedback/check/:orderCode", async (req, res) => {
    try {
      const feedback = await storage.getFeedbackByOrderCode(
        req.params.orderCode,
      );
      res.json({
        submitted: !!feedback,
        feedbackId: feedback?.id || null,
      });
    } catch (error) {
      console.error("Error checking feedback:", error);
      res.status(500).json({ error: "Failed to check feedback" });
    }
  });

  app.post("/api/feedback/submit", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);

      const existingFeedback = await storage.getFeedbackByOrderCode(
        validatedData.orderCode,
      );
      if (existingFeedback) {
        return res
          .status(400)
          .json({ error: "Feedback already submitted for this order" });
      }

      const feedback = await storage.createFeedback(validatedData);

      console.log("Feedback submitted:", {
        id: feedback.id,
        orderCode: feedback.orderCode,
        rating: feedback.overallRating,
      });

      res.json(feedback);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      if (error.name === "ZodError") {
        return res
          .status(400)
          .json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  app.post("/webhooks/payment", async (req, res) => {
    try {
      // Razorpay signature verification (required in production)
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const razorpaySignature = req.headers["x-razorpay-signature"] as string;

      if (webhookSecret) {
        // Production mode: Verify signature using raw request body
        if (!razorpaySignature) {
          console.error("Missing Razorpay signature header");
          return res.status(401).json({ error: "Missing signature" });
        }

        if (!req.rawBody || !Buffer.isBuffer(req.rawBody)) {
          console.error("Raw body not available for signature verification");
          return res.status(500).json({ error: "Server misconfiguration" });
        }

        const crypto = await import("crypto");
        const rawBodyString = req.rawBody.toString("utf8");
        const expectedSignature = crypto
          .createHmac("sha256", webhookSecret)
          .update(rawBodyString)
          .digest("hex");

        if (razorpaySignature !== expectedSignature) {
          console.error("Invalid Razorpay signature");
          return res.status(401).json({ error: "Invalid signature" });
        }

        console.log("Razorpay signature verified successfully");
      } else {
        // Development mode: Log warning
        console.warn(
          "⚠️  DEVELOPMENT MODE: RAZORPAY_WEBHOOK_SECRET not set - skipping signature verification",
        );
        console.warn(
          "⚠️  DO NOT USE IN PRODUCTION WITHOUT SIGNATURE VERIFICATION",
        );
      }

      // Parse Razorpay webhook payload structure
      // Razorpay sends: { event: "payment.captured", payload: { payment: { entity: { ... } } } }
      // Extract the relevant fields from the nested structure
      const event = req.body.event;
      const paymentEntity = req.body.payload?.payment?.entity;

      if (!paymentEntity) {
        console.error("Invalid webhook payload structure:", req.body);
        return res.status(400).json({ error: "Invalid payload" });
      }

      const payment_id = paymentEntity.id;
      const order_id = paymentEntity.order_id;
      const amount = paymentEntity.amount;
      const status = paymentEntity.status;

      // Map Razorpay event to internal status
      // payment.captured → payment_succeeded
      // payment.failed → payment_failed
      const internalStatus =
        event === "payment.captured"
          ? "payment_succeeded"
          : event === "payment.failed"
            ? "payment_failed"
            : status;

      // Use event-specific idempotency key since Razorpay sends multiple events per payment
      // (e.g., payment.authorized, then payment.captured for the same payment.id)
      const idempotencyKey = `${payment_id}_${event}`;

      const alreadyProcessed = await storage.isWebhookProcessed(idempotencyKey);
      if (alreadyProcessed) {
        console.log("Webhook already processed:", idempotencyKey);
        return res.status(200).json({ message: "Already processed" });
      }

      // Only process terminal events (payment.captured or payment.failed)
      if (internalStatus !== "payment_succeeded") {
        // For non-success terminal events, mark as processed
        if (event === "payment.failed") {
          await storage.markWebhookProcessed(idempotencyKey);
        }
        // For non-terminal events (e.g., payment.authorized), just acknowledge without processing
        return res.status(200).json({ message: "Event acknowledged", event });
      }

      const order = await storage.getOrder(order_id);
      if (!order) {
        console.error("Order not found:", order_id);
        return res.status(404).json({ error: "Order not found" });
      }

      // Validate payment amount matches order total
      // Razorpay sends amount in paise (smallest currency unit), order.total is in rupees
      if (amount !== undefined && amount !== null) {
        if (typeof amount !== "number" || !Number.isFinite(amount)) {
          console.error("Invalid amount type:", {
            orderId: order_id,
            amount,
            type: typeof amount,
          });
          return res.status(400).json({ error: "Invalid amount" });
        }

        const amountInRupees = amount / 100;
        if (amountInRupees !== order.total) {
          console.error("Payment amount mismatch:", {
            orderId: order_id,
            expectedRupees: order.total,
            receivedPaise: amount,
            receivedRupees: amountInRupees,
          });
          return res.status(400).json({ error: "Amount mismatch" });
        }
      }

      if (order.lastConfirmationSentAt) {
        console.log("Confirmation already sent for order:", order_id);
        await storage.markWebhookProcessed(idempotencyKey);
        return res.status(200).json({ message: "Already sent" });
      }

      const {
        normalizePhoneNumber,
        validateE164,
        sendTemplateMessageWithRetry,
        sendTextMessageWithRetry,
      } = await import("./whatsapp");
      const customerPhoneE164 = normalizePhoneNumber(order.customerPhone);

      if (!validateE164(customerPhoneE164)) {
        console.error("Invalid phone number:", customerPhoneE164);
        return res.status(400).json({ error: "Invalid phone number" });
      }

      await storage.updateOrder(order_id, {
        paymentId: payment_id,
        status: "paid",
        customerPhoneE164,
      });

      const orderConfirmationSent = await sendTemplateMessageWithRetry(
        customerPhoneE164,
        "hello_world",
        [],
      );

      if (!orderConfirmationSent) {
        console.warn("Failed to send order confirmation for:", order_id);
      }

      const { randomUUID } = await import("crypto");
      const token = randomUUID();
      const expiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      ).toISOString();

      await storage.createWhatsappToken({
        orderId: order_id,
        token,
        expiresAt,
      });

      const whatsappBusinessNumber =
        process.env.WHATSAPP_BUSINESS_NUMBER_E164 || customerPhoneE164;
      const appBaseUrl =
        process.env.APP_BASE_URL || "https://your-domain.replit.app";
      const inviteLink = `${appBaseUrl}/w/invite/${token}`;
      const waLink = `https://wa.me/${whatsappBusinessNumber}?text=${encodeURIComponent(
        `Hi, I'm contacting on behalf of order ${order.uniqueCode}. Token: ${token}`,
      )}`;

      const linkMessage = `Thank you for your order! Please forward this link to your elder for direct chat: ${inviteLink}`;

      const linkMessageSent = await sendTextMessageWithRetry(
        customerPhoneE164,
        linkMessage,
      );

      if (!linkMessageSent) {
        console.warn("Failed to send invite link for:", order_id);
      }

      await storage.updateOrder(order_id, {
        lastConfirmationSentAt: new Date().toISOString(),
      });

      await storage.markWebhookProcessed(idempotencyKey);

      res.status(200).json({
        message: "Payment processed successfully",
        confirmationSent: orderConfirmationSent,
        inviteLinkSent: linkMessageSent,
      });
    } catch (error: any) {
      console.error("Error processing payment webhook:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/w/invite/:token", async (req, res) => {
    try {
      const { token } = req.params;

      const whatsappToken = await storage.getWhatsappToken(token);

      if (!whatsappToken) {
        return res.status(404).send("Invalid or expired invitation link");
      }

      const now = new Date();
      const expiresAt = new Date(whatsappToken.expiresAt);

      if (now > expiresAt) {
        return res.status(410).send("This invitation link has expired");
      }

      await storage.consumeWhatsappToken(token);

      const order = await storage.getOrder(whatsappToken.orderId);
      if (!order) {
        return res.status(404).send("Order not found");
      }

      const whatsappBusinessNumber =
        process.env.WHATSAPP_BUSINESS_NUMBER_E164 || "919876543210";
      const waLink = `https://wa.me/${whatsappBusinessNumber}?text=${encodeURIComponent(
        `Hi, I'm contacting on behalf of order ${order.uniqueCode}. Token: ${token}`,
      )}`;

      console.log("Token consumed, redirecting to WhatsApp:", {
        token,
        orderId: order.id,
        orderCode: order.uniqueCode,
      });

      res.redirect(302, waLink);
    } catch (error: any) {
      console.error("Error processing invite link:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.get("/webhook/whatsapp", async (req, res) => {
    try {
      // Twilio webhook verification (optional - can use signature verification on POST instead)
      // For GET requests, Twilio may send a simple verification
      // Return 200 OK to confirm webhook URL is accessible
      console.log("Twilio webhook GET request received");
      console.log("Twilio webhook GET request received", res);
      res.status(200).send("OK");
    } catch (error: any) {
      console.error("Error verifying Twilio webhook:", error);
      res.status(500).send("Internal server error");
    }
  });

  app.get("/webhook/whatsapp/test", async (req, res) => {
    try {
      const protocol = req.protocol || "https";
      const host = req.get("host") || "unknown";
      const webhookUrl = `${protocol}://${host}/webhook/whatsapp`;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

      // Get ngrok URL if available
      let ngrokUrl = null;
      try {
        const ngrokResponse = await fetch("http://localhost:4040/api/tunnels");
        if (ngrokResponse.ok) {
          const ngrokData = await ngrokResponse.json();
          if (ngrokData.tunnels && ngrokData.tunnels.length > 0) {
            ngrokUrl = ngrokData.tunnels[0].public_url;
          }
        }
      } catch (error) {
        // ngrok not running or not accessible
      }

      const testInfo = {
        status: "Webhook Test Endpoint",
        currentUrl: webhookUrl,
        ngrokUrl: ngrokUrl || "Not detected (ngrok may not be running)",
        configuration: {
          twilioAuthToken: authToken ? "✅ Configured" : "❌ Missing (TWILIO_AUTH_TOKEN)",
          twilioAccountSid: accountSid ? "✅ Configured" : "❌ Missing (TWILIO_ACCOUNT_SID)",
          twilioWhatsappNumber: whatsappNumber ? "✅ Configured" : "❌ Missing (TWILIO_WHATSAPP_NUMBER)",
        },
        instructions: {
          step1: "Ensure your ngrok URL matches the one configured in Twilio Console",
          step2: "Configure webhook URL in Twilio: " + (ngrokUrl ? `${ngrokUrl}/webhook/whatsapp` : webhookUrl),
          step3: "Set 'When a message comes in' to POST method",
          step4: "Set 'Status callback URL' to GET method (optional)",
          step5: "Send a test message from WhatsApp to verify",
        },
        troubleshooting: {
          invalidSignature: "If you see 'Invalid Twilio signature' error:",
          check1: "1. Verify TWILIO_AUTH_TOKEN matches your Twilio Console Auth Token",
          check2: "2. Ensure the webhook URL in Twilio exactly matches: " + (ngrokUrl ? `${ngrokUrl}/webhook/whatsapp` : webhookUrl),
          check3: "3. Check server logs for detailed validation debug info",
          check4: "4. Make sure ngrok is running and URL hasn't changed",
        },
      };

      res.status(200).json(testInfo);
    } catch (error: any) {
      console.error("Error in webhook test endpoint:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error?.message || "Unknown error",
      });
    }
  });

  app.post("/webhook/whatsapp", async (req, res) => {
    try {
      // Verify Twilio signature (recommended for production)
      const twilioSignature = req.headers["x-twilio-signature"] as string;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      
      // Construct URL exactly as Twilio expects it
      // Use req.originalUrl to preserve the exact path (including query params if any)
      // Ensure no trailing slash issues
      const protocol = req.protocol || "https";
      const host = req.get("host") || "";
      const path = req.originalUrl || req.url;
      const url = `${protocol}://${host}${path}`;

      // Debug logging for signature validation
      console.log("Twilio webhook signature validation:", {
        hasAuthToken: !!authToken,
        hasSignature: !!twilioSignature,
        url: url,
        protocol: req.protocol,
        host: req.get("host"),
        originalUrl: req.originalUrl,
        bodyKeys: Object.keys(req.body || {}),
        contentType: req.get("content-type"),
      });

      if (authToken && twilioSignature) {
        // Twilio signature validation
        // Note: For ESM, we use the webhook utility from twilio
        const twilioModule = await import("twilio");
        const twilio = twilioModule.default || twilioModule;
        
        // Use Twilio's validateRequest function
        // This validates the X-Twilio-Signature header
        // Twilio sends form-encoded data, so req.body should contain the form params
        let isValid = false;
        try {
          // Twilio's validateRequest signature: (authToken, signature, url, params)
          // The params should be the form-encoded body as an object
          isValid = twilio.validateRequest(
            authToken,
            twilioSignature,
            url,
            req.body,
          );
          
          console.log("Twilio signature validation result:", isValid);
        } catch (error: any) {
          console.error("Error validating Twilio signature:", {
            error: error?.message || error,
            stack: error?.stack,
          });
          isValid = false;
        }

        if (!isValid) {
          console.error("Invalid Twilio signature - Request details:", {
            url: url,
            urlInTwilio: "Check Twilio Console webhook URL",
            authTokenPresent: !!authToken,
            signaturePresent: !!twilioSignature,
            bodyParamCount: Object.keys(req.body || {}).length,
            bodyParamKeys: Object.keys(req.body || {}),
            // Log first few body values (non-sensitive) for debugging
            sampleBodyValues: Object.entries(req.body || {})
              .slice(0, 3)
              .reduce((acc, [key, value]) => {
                acc[key] = typeof value === "string" && value.length > 50 
                  ? value.substring(0, 50) + "..." 
                  : value;
                return acc;
              }, {} as Record<string, any>),
          });
          
          // In development, allow the request through but log the issue
          // In production, block invalid signatures
          if (process.env.NODE_ENV === "production") {
            return res.status(403).send("Forbidden");
          } else {
            console.warn("⚠️  DEVELOPMENT MODE: Allowing request despite invalid signature");
          }
        } else {
          console.log("✅ Twilio signature verified successfully");
        }
      } else {
        // Development mode: log warning if signature verification not available
        if (!authToken) {
          console.warn("⚠️  TWILIO_AUTH_TOKEN not configured - skipping signature verification");
        }
        if (!twilioSignature) {
          console.warn("⚠️  X-Twilio-Signature header missing - skipping signature verification");
        }
        if (process.env.NODE_ENV === "production") {
          console.warn(
            "⚠️  PRODUCTION MODE: Twilio signature verification not configured",
          );
        }
      }

      // Respond immediately to Twilio
      res.status(200).json({ status: "received" });

      const body = req.body;

      // Twilio webhook format: From, To, Body, MediaUrl0, MediaContentType0, etc.
      const fromNumber = body.From;
      const numMedia = parseInt(body.NumMedia || "0", 10);
      
      console.log("========== Twilio WhatsApp Webhook Received ==========");
      console.log("From:", fromNumber);
      console.log("MessageSid:", body.MessageSid);
      console.log("NumMedia:", numMedia);
      console.log("MessageType:", body.MessageType || "text");
      
      if (numMedia > 0) {
        console.log("📎 Media detected in message!");
        for (let i = 0; i < numMedia; i++) {
          const mediaUrl = body[`MediaUrl${i}`];
          const contentType = body[`MediaContentType${i}`];
          console.log(`  Media ${i}:`, {
            url: mediaUrl,
            contentType: contentType,
          });
        }
      } else {
        console.log("📝 Text message (no media)");
        if (body.Body) {
          console.log("Body:", body.Body);
        }
      }
      console.log("Full payload:", JSON.stringify(body, null, 2));
      console.log("=====================================================");
      
      if (!fromNumber) {
        console.log("❌ No From number in Twilio webhook payload");
        return;
      }

      // Extract phone number (remove whatsapp: prefix if present)
      const cleanFromNumber = fromNumber.replace(/^whatsapp:/, "").replace(/^\+/, "");

      // Determine message type
      let messageType = "text";
      if (body.MediaUrl0) {
        messageType = "audio"; // Assuming audio for voice notes
      }

      // Build message object compatible with conversationHandler
      const message = {
        id: body.MessageSid || body.SmsSid || `twilio_${Date.now()}`,
        from: cleanFromNumber,
        type: messageType,
        text: body.Body ? { body: body.Body } : undefined,
        audio: body.MediaUrl0
          ? {
              id: body.MediaUrl0, // Use MediaUrl0 as the media identifier
              mime_type: body.MediaContentType0 || "audio/ogg",
            }
          : undefined,
        // Store Twilio-specific fields for media download
        MediaUrl0: body.MediaUrl0,
        MediaContentType0: body.MediaContentType0,
        NumMedia: body.NumMedia || "0",
      };

      console.log("Received Twilio WhatsApp message:", {
        from: cleanFromNumber,
        type: messageType,
        messageId: message.id,
        hasMedia: !!body.MediaUrl0,
      });

      const messageIdempotencyKey = `whatsapp_msg_${message.id}`;
      const alreadyProcessed = await storage.isWebhookProcessed(
        messageIdempotencyKey,
      );

      if (alreadyProcessed) {
        console.log(
          "WhatsApp message already processed:",
          messageIdempotencyKey,
        );
        return;
      }

      const { handleIncomingMessage } = await import("./conversationHandler");
      await handleIncomingMessage(cleanFromNumber, message, messageType);

      await storage.markWebhookProcessed(messageIdempotencyKey);
    } catch (error: any) {
      console.error("Error processing Twilio WhatsApp webhook:", error);
    }
  });

  // Test endpoint for media download functionality
  app.post("/api/test/download-media", async (req, res) => {
    try {
      const { mediaUrl } = req.body;

      if (!mediaUrl) {
        return res.status(400).json({
          error: "Missing mediaUrl in request body",
          example: {
            mediaUrl:
              "https://api.twilio.com/2010-04-01/Accounts/ACxxx/Messages/MMxxx/Media/MExxx",
          },
        });
      }

      console.log("Testing media download with URL:", mediaUrl);

      const {
        downloadVoiceNoteMedia,
        downloadMediaFile,
      } = await import("./whatsapp");

      // Step 1: Get media info
      console.log("Step 1: Fetching media info...");
      const mediaInfo = await downloadVoiceNoteMedia(mediaUrl);

      if (!mediaInfo) {
        return res.status(500).json({
          error: "Failed to get media info",
          step: "downloadVoiceNoteMedia",
        });
      }

      console.log("Media info retrieved:", mediaInfo);

      // Step 2: Download the file
      console.log("Step 2: Downloading media file...");
      const fileBuffer = await downloadMediaFile(mediaInfo.url);

      if (!fileBuffer) {
        return res.status(500).json({
          error: "Failed to download media file",
          step: "downloadMediaFile",
          mediaInfo,
        });
      }

      console.log("File downloaded successfully:", {
        sizeBytes: fileBuffer.length,
        mimeType: mediaInfo.mimeType,
      });

      // Step 3: Test Supabase upload (optional)
      let supabaseUrl = null;
      let uploadError = null;
      try {
        const { uploadVoiceNoteToStorage } = await import("./supabase");
        const testFileName = `test-${Date.now()}`;
        console.log("Step 3: Testing Supabase upload...");
        supabaseUrl = await uploadVoiceNoteToStorage(
          fileBuffer,
          testFileName,
          mediaInfo.mimeType,
        );
        if (supabaseUrl) {
          console.log("Upload to Supabase successful:", supabaseUrl);
        }
      } catch (error: any) {
        uploadError = error.message || error;
        console.error("Supabase upload test failed:", uploadError);
      }

      res.json({
        success: true,
        results: {
          mediaInfo: {
            url: mediaInfo.url,
            mimeType: mediaInfo.mimeType,
            fileSize: mediaInfo.fileSize,
            sha256: mediaInfo.sha256,
          },
          download: {
            success: true,
            sizeBytes: fileBuffer.length,
            bufferType: fileBuffer.constructor.name,
          },
          upload: {
            success: !!supabaseUrl,
            supabaseUrl: supabaseUrl,
            error: uploadError,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Error testing media download:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error.message || error,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });

  // Optional: Endpoint for Render Cron Jobs or external schedulers
  app.post("/api/internal/process-scheduled", async (req, res) => {
    // Optional: Add auth check
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers["authorization"] !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { processScheduledTasks } = await import("./scheduler");
      await processScheduledTasks();
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        message: "Scheduled tasks processed",
      });
    } catch (error) {
      console.error("Error in scheduled tasks endpoint:", error);
      res.status(500).json({ error: "Failed to process scheduled tasks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
