import { storage } from "./storage";
import {
  sendTextMessageWithRetry,
  sendStorytellerOnboarding,
  sendReadinessCheck,
  sendVoiceNoteAcknowledgment,
  sendAlbumCompletionMessage,
  downloadVoiceNoteMedia,
  downloadMediaFile,
} from "./whatsapp";
import { uploadVoiceNoteToStorage } from "./supabase";

interface WhatsAppMessage {
  id: string;
  from: string;
  type: string;
  text?: { body: string };
  audio?: { id: string; mime_type: string };
  // Twilio-specific fields
  MediaUrl0?: string;
  MediaContentType0?: string;
  NumMedia?: string;
}

export async function handleIncomingMessage(
  fromNumber: string,
  message: WhatsAppMessage,
  messageType: string,
): Promise<void> {
  const messageText = message.text?.body || "";

  let trial = await storage.getFreeTrialByStorytellerPhone(fromNumber);

  if (!trial) {
    const orderIdMatch = messageText.match(/([a-f0-9-]{36})/i);
    if (orderIdMatch) {
      const trialId = orderIdMatch[1];
      trial = await storage.getFreeTrialDb(trialId);

      if (trial && !trial.storytellerPhone) {
        trial = await storage.updateFreeTrialDb(trial.id, {
          storytellerPhone: fromNumber,
        });
        console.log("Associated storyteller phone with trial:", {
          trialId: trial.id,
          storytellerPhone: fromNumber,
        });
      }
    }
  }

  if (!trial) {
    console.log(
      "No free trial found for phone:",
      fromNumber,
      "Message:",
      messageText,
    );

    // Send a helpful response when no trial is found
    await sendTextMessageWithRetry(
      fromNumber,
      "Hi! I'm Vaani from Kahani. It looks like you haven't started a story collection yet. To get started, please ask the person who wants to preserve your stories to create a free trial and share the link with you. Once you click that link, we can begin your storytelling journey!",
    );
    return;
  }

  console.log("Processing message for trial:", {
    trialId: trial.id,
    storytellerName: trial.storytellerName,
    conversationState: trial.conversationState,
    messageType,
  });

  switch (trial.conversationState) {
    case "awaiting_initial_contact":
      await handleInitialContact(trial, fromNumber);
      break;

    case "awaiting_readiness":
      if (messageType === "text") {
        await handleReadinessResponse(trial, fromNumber, messageText);
      }
      break;

    case "in_progress":
      if (messageType === "audio") {
        await handleVoiceNote(trial, fromNumber, message);
      } else if (messageType === "text") {
        await sendTextMessageWithRetry(
          fromNumber,
          "Please send a voice note to answer the question. I'll be waiting to hear your story!",
        );
      }
      break;

    case "completed":
      await sendTextMessageWithRetry(
        fromNumber,
        `Thank you ${trial.storytellerName}! You've completed all the questions. Your stories will be compiled into a beautiful book for your family.`,
      );
      break;

    default:
      console.log("Unknown conversation state:", trial.conversationState);
  }
}

async function handleInitialContact(
  trial: any,
  fromNumber: string,
): Promise<void> {
  await sendStorytellerOnboarding(
    fromNumber,
    trial.storytellerName,
    trial.buyerName,
  );

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await askReadiness(trial, fromNumber);

  await storage.updateFreeTrialDb(trial.id, {
    conversationState: "awaiting_readiness",
    welcomeSentAt: new Date(),
    readinessAskedAt: new Date(),
  });
}

async function askReadiness(trial: any, fromNumber: string): Promise<void> {
  await sendReadinessCheck(fromNumber, trial.storytellerName);
}

async function handleReadinessResponse(
  trial: any,
  fromNumber: string,
  response: string,
): Promise<void> {
  const normalizedResponse = response.toLowerCase().trim();

  const yesPatterns = ["yes", "yeah", "yep", "sure", "ready", "ok", "okay"];
  const maybePatterns = ["maybe", "not sure", "later", "wait"];

  const isYes = yesPatterns.some((pattern) =>
    normalizedResponse.includes(pattern),
  );
  const isMaybe = maybePatterns.some((pattern) =>
    normalizedResponse.includes(pattern),
  );

  if (isYes) {
    await storage.updateFreeTrialDb(trial.id, {
      conversationState: "in_progress",
      lastReadinessResponse: "yes",
      retryReadinessAt: null,
      retryCount: 0,
    });

    await sendFirstQuestion(trial, fromNumber);
  } else if (isMaybe) {
    const retryAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

    await storage.updateFreeTrialDb(trial.id, {
      lastReadinessResponse: "maybe",
      retryReadinessAt: retryAt,
    });

    await sendTextMessageWithRetry(
      fromNumber,
      "No problem! I'll check back with you in a few hours. Take your time.",
    );
  } else {
    await sendTextMessageWithRetry(
      fromNumber,
      "I didn't quite understand. Please reply with 'yes' if you're ready to start, or 'maybe' if you need more time.",
    );
  }
}

async function sendFirstQuestion(
  trial: any,
  fromNumber: string,
): Promise<void> {
  const questionIndex = 0;
  const question = await storage.getQuestionByIndex(
    trial.selectedAlbum,
    questionIndex,
  );

  if (!question) {
    console.error("No question found for album:", trial.selectedAlbum);
    return;
  }

  const questionMessage = `Here is the question we want you to talk about:

${question}

Take your time and reply with a voice note whenever you are ready.`;

  await sendTextMessageWithRetry(fromNumber, questionMessage);

  await storage.updateFreeTrialDb(trial.id, {
    currentQuestionIndex: questionIndex,
    lastQuestionSentAt: new Date(),
  });
}

async function handleVoiceNote(
  trial: any,
  fromNumber: string,
  message: WhatsAppMessage,
): Promise<void> {
  // Support both Meta format (audio.id) and Twilio format (MediaUrl0)
  const audioId = message.audio?.id || message.MediaUrl0;
  const mimeType = message.audio?.mime_type || message.MediaContentType0;

  if (!audioId) {
    console.error("Invalid voice note message - missing audio data");
    return;
  }

  const currentQuestion = await storage.getQuestionByIndex(
    trial.selectedAlbum,
    trial.currentQuestionIndex,
  );

  if (!currentQuestion) {
    console.error(
      "No current question found for question index:",
      trial.currentQuestionIndex,
    );
    return;
  }

  const existingVoiceNotes = await storage.getVoiceNotesByTrialId(trial.id);
  const alreadyAnswered = existingVoiceNotes.some(
    (note) => note.questionIndex === trial.currentQuestionIndex,
  );

  if (alreadyAnswered) {
    console.log(
      "Voice note already exists for this question, skipping duplicate insert",
    );
  } else {
    try {
      const voiceNote = await storage.createVoiceNote({
        freeTrialId: trial.id,
        questionIndex: trial.currentQuestionIndex,
        questionText: currentQuestion,
        mediaId: audioId,
        mimeType: mimeType || "audio/ogg",
        downloadStatus: "pending",
      });

      console.log("Saved voice note for trial:", {
        trialId: trial.id,
        questionIndex: trial.currentQuestionIndex,
        mediaId: audioId,
      });

      downloadAndStoreVoiceNote(
        voiceNote.id,
        audioId,
        mimeType || "audio/ogg",
      ).catch(console.error);
    } catch (error) {
      console.error("Error saving voice note (may be duplicate):", error);
      return;
    }
  }

  await sendVoiceNoteAcknowledgment(fromNumber);

  const totalQuestions = await storage.getTotalQuestionsForAlbum(
    trial.selectedAlbum,
  );
  const nextQuestionIndex = trial.currentQuestionIndex + 1;

  if (nextQuestionIndex >= totalQuestions) {
    await storage.updateFreeTrialDb(trial.id, {
      conversationState: "completed",
      nextQuestionScheduledFor: null,
      reminderSentAt: null,
    });

    const appUrl = process.env.APP_BASE_URL
      ? `${process.env.APP_BASE_URL.split(",")[0]}`
      : "http://localhost:3000";
    const playlistAlbumLink = `${appUrl}/playlist-albums/${trial.id}`;
    const vinylAlbumLink = `${appUrl}/vinyl-albums/${trial.id}`;

    await sendAlbumCompletionMessage(fromNumber, playlistAlbumLink, vinylAlbumLink);

    if (trial.customerPhone) {
      await sendAlbumCompletionMessage(trial.customerPhone, playlistAlbumLink, vinylAlbumLink);
    }
  } else {
    const now = new Date();
    const nextQuestionScheduledFor = new Date(now.getTime() + 2000);

    await storage.updateFreeTrialDb(trial.id, {
      currentQuestionIndex: nextQuestionIndex,
      nextQuestionScheduledFor,
      reminderSentAt: null,
    });
  }
}

async function downloadAndStoreVoiceNote(
  voiceNoteId: string,
  mediaId: string,
  mimeType: string,
): Promise<void> {
  try {
    // For Twilio: mediaId is already a direct URL (MediaUrl0)
    // For Meta: we need to get media info first, then download
    let mediaUrl: string;
    let finalMimeType: string;
    let fileSize: number = 0;
    let sha256: string = "";

    // Check if mediaId is a Twilio URL (contains api.twilio.com) or Meta media ID
    if (mediaId.startsWith("http")) {
      // Twilio: Direct URL, get info and download
      const mediaInfo = await downloadVoiceNoteMedia(mediaId);
      if (!mediaInfo) {
        console.error("Failed to get media info for voice note:", voiceNoteId);
        await storage.updateVoiceNote(voiceNoteId, {
          downloadStatus: "failed",
        });
        return;
      }
      mediaUrl = mediaInfo.url;
      finalMimeType = mediaInfo.mimeType || mimeType || "audio/ogg";
      fileSize = mediaInfo.fileSize;
      sha256 = mediaInfo.sha256;
    } else {
      // Meta: Two-step process (get info, then download)
      const mediaInfo = await downloadVoiceNoteMedia(mediaId);
      if (!mediaInfo) {
        console.error("Failed to get media info for voice note:", voiceNoteId);
        await storage.updateVoiceNote(voiceNoteId, {
          downloadStatus: "failed",
        });
        return;
      }
      mediaUrl = mediaInfo.url;
      finalMimeType = mediaInfo.mimeType || mimeType || "audio/ogg";
      fileSize = mediaInfo.fileSize;
      sha256 = mediaInfo.sha256;
    }

    // Download the actual file
    const fileBuffer = await downloadMediaFile(mediaUrl);

    if (!fileBuffer) {
      console.error(
        "Failed to download media file for voice note:",
        voiceNoteId,
      );
      await storage.updateVoiceNote(voiceNoteId, {
        downloadStatus: "failed",
      });
      return;
    }

    // Step 4: Upload to Supabase Storage
    const supabaseUrl = await uploadVoiceNoteToStorage(
      fileBuffer,
      voiceNoteId,
      finalMimeType,
    );

    if (!supabaseUrl) {
      console.error(
        "Failed to upload voice note to Supabase Storage:",
        voiceNoteId,
      );
      // Still save the media URL as fallback
      await storage.updateVoiceNote(voiceNoteId, {
        mediaUrl: mediaUrl,
        mediaSha256: sha256,
        sizeBytes: fileSize,
        downloadStatus: "failed", // Mark as failed since Supabase upload failed
      });
      return;
    }

    // Step 5: Update database with Supabase URL and metadata
    const fileExtension = finalMimeType.includes("ogg")
      ? "ogg"
      : finalMimeType.includes("mp3")
        ? "mp3"
        : finalMimeType.includes("m4a")
          ? "m4a"
          : "ogg";

    await storage.updateVoiceNote(voiceNoteId, {
      mediaUrl: supabaseUrl, // Store Supabase URL instead of temporary media URL
      localFilePath: `${voiceNoteId}.${fileExtension}`, // Store file path
      mimeType: finalMimeType, // Update with accurate mimeType
      mediaSha256: sha256,
      sizeBytes: fileSize,
      downloadStatus: "completed",
    });

    console.log("Voice note downloaded and uploaded to Supabase:", {
      voiceNoteId,
      mediaId,
      supabaseUrl,
      sizeBytes: fileSize,
    });
  } catch (error) {
    console.error("Error downloading and storing voice note:", error);
    await storage.updateVoiceNote(voiceNoteId, {
      downloadStatus: "failed",
    });
  }
}

export async function processRetryReminders(): Promise<void> {
  const trialsNeedingRetry = await storage.getFreeTrialsNeedingRetry();

  for (const trial of trialsNeedingRetry) {
    if (!trial.storytellerPhone) {
      continue;
    }

    const currentRetryCount = trial.retryCount || 0;

    if (currentRetryCount >= 3) {
      console.log("Max retries already reached, skipping trial:", trial.id);
      continue;
    }

    const nextRetryCount = currentRetryCount + 1;

    await askReadiness(trial, trial.storytellerPhone);

    if (nextRetryCount >= 3) {
      await storage.updateFreeTrialDb(trial.id, {
        conversationState: "completed",
        retryReadinessAt: null,
        retryCount: nextRetryCount,
        readinessAskedAt: new Date(),
      });

      console.log("Sent 3rd retry - closing flow:", trial.id);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await sendTextMessageWithRetry(
        trial.storytellerPhone,
        `Hi ${trial.storytellerName}, it seems this might not be the right time. We're here whenever you're ready. Feel free to reach out anytime!`,
      );

      continue;
    }

    const nextRetryAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

    await storage.updateFreeTrialDb(trial.id, {
      readinessAskedAt: new Date(),
      retryCount: nextRetryCount,
      retryReadinessAt: nextRetryAt,
    });

    console.log("Retry reminder sent:", {
      trialId: trial.id,
      retryCount: nextRetryCount,
      nextRetryAt,
    });
  }
}
