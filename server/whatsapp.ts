import twilio from "twilio";
import axios from "axios";

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

function getConfig(): TwilioConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !whatsappNumber) {
    console.warn(
      "Twilio credentials not configured. Skipping WhatsApp message.",
    );
    return null;
  }

  return { accountSid, authToken, whatsappNumber };
}

function getTwilioClient(): twilio.Twilio | null {
  const config = getConfig();
  if (!config) return null;

  return twilio(config.accountSid, config.authToken);
}

export async function sendTemplateMessage(
  recipientNumber: string,
  templateName: string = "hello_world",
  languageCode: string = "en_US",
): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) return false;

  const config = getConfig();
  if (!config) return false;

  // Format phone numbers for Twilio (whatsapp:+countrycode+number)
  const fromNumber = `whatsapp:${config.whatsappNumber.replace(/^\+/, "")}`;
  const toNumber = `whatsapp:${recipientNumber.startsWith("+") ? recipientNumber : `+${recipientNumber}`}`;

  try {
    // TEXT MESSAGE VERSION (ACTIVE)
    // For now, send as text message since templates need approval in Twilio
    const message = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: `Hello! This is a message from Kahani. (Template: ${templateName})`,
    });

    console.log("Twilio WhatsApp message sent:", {
      to: recipientNumber,
      messageId: message.sid,
      template: templateName,
    });

    return true;

    // TEMPLATE MESSAGE VERSION (COMMENTED - FOR FUTURE USE)
    // Uncomment and configure once templates are approved in Twilio Console
    /*
    const message = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      contentSid: templateName, // Twilio Content Template SID
      contentVariables: JSON.stringify({}), // Template variables if needed
    });

    console.log("Twilio WhatsApp template message sent:", {
      to: recipientNumber,
      messageId: message.sid,
      template: templateName,
    });

    return true;
    */
  } catch (error: any) {
    console.error("Failed to send Twilio WhatsApp message:", {
      error: error.message || error,
      to: recipientNumber,
      template: templateName,
      code: error.code,
      status: error.status,
    });
    return false;
  }
}

export async function sendTextMessage(
  recipientNumber: string,
  messageText: string,
): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) return false;

  const config = getConfig();
  if (!config) return false;

  // Format phone numbers for Twilio (whatsapp:+countrycode+number)
  const fromNumber = `whatsapp:${config.whatsappNumber.replace(/^\+/, "")}`;
  const toNumber = `whatsapp:${recipientNumber.startsWith("+") ? recipientNumber : `+${recipientNumber}`}`;

  try {
    const message = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: messageText,
    });

    console.log("Twilio WhatsApp text message sent:", {
      to: recipientNumber,
      messageId: message.sid,
    });

    return true;
  } catch (error: any) {
    console.error("Failed to send Twilio WhatsApp text message:", {
      error: error.message || error,
      to: recipientNumber,
      code: error.code,
      status: error.status,
    });
    return false;
  }
}

export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned;
  }

  if (cleaned.length === 10) {
    return "91" + cleaned;
  }

  return cleaned;
}

export function validateE164(phone: string): boolean {
  const e164Regex = /^\d{10,15}$/;
  return e164Regex.test(phone);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000,
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error.status || error.code;

      // Twilio rate limit errors: 429 or 20003 (Too Many Requests)
      // Retry on rate limits or 5xx errors
      if (
        status === 429 ||
        error.code === 20003 ||
        (status >= 500 && status < 600)
      ) {
        if (attempt < maxRetries) {
          const delayMs = initialDelayMs * Math.pow(2, attempt);
          console.log(
            `Retry attempt ${attempt + 1}/${maxRetries} after ${delayMs}ms`,
          );
          await sleep(delayMs);
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError;
}

export async function sendTemplateMessageWithRetry(
  recipientNumber: string,
  templateName: string,
  templateParams: any[] = [],
): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) return false;

  if (!validateE164(recipientNumber)) {
    console.error("Invalid E.164 phone number:", recipientNumber);
    return false;
  }

  const config = getConfig();
  if (!config) return false;

  // Format phone numbers for Twilio
  const fromNumber = `whatsapp:${config.whatsappNumber.replace(/^\+/, "")}`;
  const toNumber = `whatsapp:${recipientNumber.startsWith("+") ? recipientNumber : `+${recipientNumber}`}`;

  try {
    // TEXT MESSAGE VERSION (ACTIVE)
    // Convert template params to text message
    let messageBody = `Hello! This is a message from Kahani. (Template: ${templateName})`;
    if (templateParams.length > 0) {
      const paramTexts = templateParams
        .map((p) => (p.text || p.type === "text" ? p.text : ""))
        .filter(Boolean)
        .join(", ");
      if (paramTexts) {
        messageBody += `\n\nDetails: ${paramTexts}`;
      }
    }

    const message = await retryWithBackoff(async () => {
      return await client.messages.create({
        from: fromNumber,
        to: toNumber,
        body: messageBody,
      });
    });

    console.log("Twilio WhatsApp template message sent:", {
      to: recipientNumber,
      messageId: message.sid,
      status: message.status,
      template: templateName,
    });

    return true;

    // TEMPLATE MESSAGE VERSION (COMMENTED - FOR FUTURE USE)
    // Uncomment once templates are approved in Twilio Console
    /*
    // Build content variables for Twilio template
    const contentVariables: Record<string, string> = {};
    templateParams.forEach((param, index) => {
      if (param.type === "text" && param.text) {
        contentVariables[`${index + 1}`] = param.text;
      }
    });

    const message = await retryWithBackoff(async () => {
      return await client.messages.create({
        from: fromNumber,
        to: toNumber,
        contentSid: templateName, // Twilio Content Template SID
        contentVariables: JSON.stringify(contentVariables),
      });
    });

    console.log("Twilio WhatsApp template message sent:", {
      to: recipientNumber,
      messageId: message.sid,
      status: message.status,
      template: templateName,
    });

    return true;
    */
  } catch (error: any) {
    const errorDetails = error.message || error;
    console.error("Failed to send Twilio WhatsApp template message after retries:", {
      error: errorDetails,
      to: recipientNumber,
      template: templateName,
      code: error.code,
      status: error.status,
    });

    return false;
  }
}

export async function sendTextMessageWithRetry(
  recipientNumber: string,
  messageText: string,
): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) return false;

  if (!validateE164(recipientNumber)) {
    console.error("Invalid E.164 phone number:", recipientNumber);
    return false;
  }

  const config = getConfig();
  if (!config) return false;

  // Format phone numbers for Twilio
  const fromNumber = `whatsapp:${config.whatsappNumber.replace(/^\+/, "")}`;
  const toNumber = `whatsapp:${recipientNumber.startsWith("+") ? recipientNumber : `+${recipientNumber}`}`;

  try {
    const message = await retryWithBackoff(async () => {
      return await client.messages.create({
        from: fromNumber,
        to: toNumber,
        body: messageText,
      });
    });

    console.log("Twilio WhatsApp text message sent:", {
      to: recipientNumber,
      messageId: message.sid,
      status: message.status,
    });

    return true;
  } catch (error: any) {
    const errorDetails = error.message || error;
    console.error("Failed to send Twilio WhatsApp text message after retries:", {
      error: errorDetails,
      to: recipientNumber,
      code: error.code,
      status: error.status,
    });

    return false;
  }
}

export async function sendFreeTrialConfirmation(
  recipientNumber: string,
  customerName: string,
  relation: string,
  albumName: string,
): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // TEXT MESSAGE VERSION (ACTIVE)
    const message = `Hi ${customerName}, Thank you for choosing Kahani. You and ${relation} are about to start something truly special. Their Kahani will soon always stay with you. To confirm, you would like a mini album on "${albumName}" for ${relation}, right? If this looks different, please reply and let us know. To get started, you will get a short message to forward to your ${relation}. They just need to click the link and send the pre-filled message - that's it.`;
    return sendTextMessageWithRetry(recipientNumber, message);

    // TEMPLATE MESSAGE VERSION (COMMENTED - FOR FUTURE USE)
    /*
    const templateParams = [
      { type: "text", text: customerName },
      { type: "text", text: relation },
      { type: "text", text: albumName },
      { type: "text", text: relation },
      { type: "text", text: relation },
    ];

    return sendTemplateMessageWithRetry(
      recipientNumber,
      "1c1_en", // Replace with Twilio Content Template SID
      templateParams,
    );
    */
  } else {
    const message = `Hi ${customerName}, Thank you for choosing Kahani. You and ${relation} are about to start something truly special. Their Kahani will soon always stay with you. To confirm, you would like a mini album on "${albumName}" for ${relation}, right? If this looks different, please reply and let us know. To get started, you will get a short message to forward to your ${relation}. They just need to click the link and send the pre-filled message - that's it.`;

    return sendTextMessageWithRetry(recipientNumber, message);
  }
}

export async function sendStorytellerOnboarding(
  recipientNumber: string,
  relation: string,
  customerName: string,
): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // TEXT MESSAGE VERSION (ACTIVE)
    const message = `Hi ${relation}, I am Vaani from Kahani. ${customerName} has asked me to record your stories in your own voice. Every day, I'll send you one simple question. You can reply with a voice note whenever you wish. Your stories will become a beautiful book your family can keep forever. Please pin this chat for us to get started on this journey!`;
    return sendTextMessageWithRetry(recipientNumber, message);

    // TEMPLATE MESSAGE VERSION (COMMENTED - FOR FUTURE USE)
    /*
    const templateParams = [
      { type: "text", text: relation },
      { type: "text", text: customerName },
    ];

    return sendTemplateMessageWithRetry(
      recipientNumber,
      "1s1_en", // Replace with Twilio Content Template SID
      templateParams,
    );
    */
  } else {
    const message = `Hi ${relation}, I am Vaani from Kahani. ${customerName} has asked me to record your stories in your own voice. Every day, I'll send you one simple question. You can reply with a voice note whenever you wish. Your stories will become a beautiful book your family can keep forever. Please pin this chat for us to get started on this journey!`;

    return sendTextMessageWithRetry(recipientNumber, message);
  }
}

export async function sendShareableLink(
  recipientNumber: string,
  storytellerName: string,
  buyerName: string,
  orderId: string,
): Promise<boolean> {
  const businessPhone =
    process.env.WHATSAPP_BUSINESS_NUMBER_E164 ||
    process.env.TWILIO_WHATSAPP_NUMBER?.replace(/^\+/, "") ||
    "919876543210";

  const prefilledMessage = `Hi, ${buyerName} has placed an order ${orderId} for me.`;

  const whatsappLink = `https://wa.me/${businessPhone}?text=${encodeURIComponent(prefilledMessage)}`;

  const message = `Please share this link with *${storytellerName}*:

${whatsappLink}

When ${storytellerName} opens this link, they'll be able to start chatting with us directly on WhatsApp!`;

  return sendTextMessageWithRetry(recipientNumber, message);
}

export async function sendReadinessCheck(
  recipientNumber: string,
  relation: string,
): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // TEXT MESSAGE VERSION (ACTIVE)
    const message = `Hi ${relation}, are you ready to share your Kahani?`;
    return sendTextMessageWithRetry(recipientNumber, message);

    // TEMPLATE MESSAGE VERSION (COMMENTED - FOR FUTURE USE)
    /*
    const templateParams = [{ type: "text", text: relation }];

    return sendTemplateMessageWithRetry(
      recipientNumber,
      "2s1_en", // Replace with Twilio Content Template SID
      templateParams,
    );
    */
  } else {
    const message = `Hi ${relation}, are you ready to share your Kahani?`;

    return sendTextMessageWithRetry(recipientNumber, message);
  }
}

export async function sendVoiceNoteAcknowledgment(
  recipientNumber: string,
): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // TEXT MESSAGE VERSION (ACTIVE)
    const message = `Thank you for sharing your story! It's been saved and recorded safely. We will send you the next question very soon.`;
    return sendTextMessageWithRetry(recipientNumber, message);

    // TEMPLATE MESSAGE VERSION (COMMENTED - FOR FUTURE USE)
    /*
    return sendTemplateMessageWithRetry(
      recipientNumber,
      "2s4_en", // Replace with Twilio Content Template SID
      [],
    );
    */
  } else {
    const message = `Thank you for sharing your story! It's been saved and recorded safely. We will send you the next question very soon.`;

    return sendTextMessageWithRetry(recipientNumber, message);
  }
}

export async function sendAlbumCompletionMessage(
  recipientNumber: string,
  playlistAlbumLink: string,
  vinylAlbumLink: string,
): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // TEXT MESSAGE VERSION (ACTIVE)
    const message = `Here's your mini album:\n\nPlaylist Album: ${playlistAlbumLink}\n\nVinyl Album: ${vinylAlbumLink}\n\nA short glimpse of the memories you've shared so far.`;
    return sendTextMessageWithRetry(recipientNumber, message);

    // TEMPLATE MESSAGE VERSION (COMMENTED - FOR FUTURE USE)
    /*
    // Combine both links in a single message for the template
    const combinedLinks = `Playlist Album: ${playlistAlbumLink}\n\nVinyl Album: ${vinylAlbumLink}`;
    const templateParams = [{ type: "text", text: combinedLinks }];

    return sendTemplateMessageWithRetry(
      recipientNumber,
      "2c1_en", // Replace with Twilio Content Template SID
      templateParams,
    );
    */
  } else {
    const message = `Here's your mini album:\n\nPlaylist Album: ${playlistAlbumLink}\n\nVinyl Album: ${vinylAlbumLink}\n\nA short glimpse of the memories you've shared so far.`;

    return sendTextMessageWithRetry(recipientNumber, message);
  }
}

export async function downloadVoiceNoteMedia(mediaUrl: string): Promise<{
  url: string;
  mimeType: string;
  sha256: string;
  fileSize: number;
} | null> {
  // Twilio provides media URLs directly in webhook (MediaUrl0)
  // Format: https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages/{MessageSid}/Media/{MediaSid}
  // This URL can be downloaded directly with basic auth (AccountSid:AuthToken)
  try {
    const config = getConfig();
    if (!config) return null;

    const client = getTwilioClient();
    if (!client) return null;

    // Extract Media SID and Message SID from URL
    // Format: https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages/{MessageSid}/Media/{MediaSid}
    const mediaSidMatch = mediaUrl.match(/\/Media\/([^\/\?]+)/);
    const messageSidMatch = mediaUrl.match(/\/Messages\/([^\/]+)\//);
    
    if (!mediaSidMatch || !messageSidMatch) {
      // If URL format doesn't match, return as-is (might be a direct URL)
      console.warn("Unexpected media URL format:", mediaUrl);
      return {
        url: mediaUrl,
        mimeType: "audio/ogg", // Default, will be updated when downloading
        sha256: "",
        fileSize: 0,
      };
    }

    const mediaSid = mediaSidMatch[1];
    const messageSid = messageSidMatch[1];

    // Fetch media metadata from Twilio API to get content type and size
    try {
      const media = await client.messages(messageSid).media(mediaSid).fetch();

      console.log("Retrieved media info from Twilio:", {
        mediaUrl,
        mediaSid,
        messageSid,
        contentType: media.contentType,
        contentLength: media.contentLength,
      });

      return {
        url: mediaUrl, // Use the original URL for direct download
        mimeType: media.contentType || "audio/ogg",
        sha256: "", // Twilio doesn't provide SHA256
        fileSize: parseInt(media.contentLength || "0", 10),
      };
    } catch (fetchError: any) {
      console.warn("Failed to fetch media metadata, using defaults:", {
        error: fetchError.message || fetchError,
        mediaUrl,
      });
      // Fallback: return URL with defaults
      return {
        url: mediaUrl,
        mimeType: "audio/ogg",
        sha256: "",
        fileSize: 0,
      };
    }
  } catch (error: any) {
    console.error("Failed to get media info from Twilio:", {
      error: error.message || error,
      mediaUrl,
    });
    // Fallback: return the URL as-is
    return {
      url: mediaUrl,
      mimeType: "audio/ogg",
      sha256: "",
      fileSize: 0,
    };
  }
}

export async function downloadMediaFile(
  mediaUrl: string,
  accessToken?: string, // Not used for Twilio, kept for compatibility
): Promise<Buffer | null> {
  try {
    // Twilio media URLs can be downloaded directly with basic auth
    // Format: https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages/{MessageSid}/Media/{MediaSid}
    // Auth: Basic auth with AccountSid:AuthToken (same as curl -u)
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.error("Twilio credentials not configured for media download");
      return null;
    }

    // Download directly from the media URL with basic auth
    // This matches the curl command: curl -u "AccountSid:AuthToken" "MediaUrl"
    const response = await axios.get(mediaUrl, {
      responseType: "arraybuffer",
      auth: {
        username: accountSid,
        password: authToken,
      },
      // Set timeout for large files (30 seconds)
      timeout: 30000,
    });

    const buffer = Buffer.from(response.data);
    
    console.log("Downloaded media file from Twilio:", {
      mediaUrl,
      sizeBytes: buffer.length,
      contentType: response.headers["content-type"],
    });

    return buffer;
  } catch (error: any) {
    console.error("Failed to download media file from Twilio:", {
      error: error.message || error,
      mediaUrl,
      statusCode: error.response?.status,
      statusText: error.response?.statusText,
    });
    return null;
  }
}
