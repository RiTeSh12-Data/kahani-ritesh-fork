import cron from 'node-cron';
import { storage } from "./storage";
import { sendTextMessageWithRetry } from "./whatsapp";
import { getQuestionByIndex } from "@shared/albumQuestions";
import { processRetryReminders } from "./conversationHandler";

let isProcessing = false;

export async function sendScheduledQuestions(): Promise<void> {
  const trials = await storage.getScheduledQuestionsDue();
  
  console.log(`Found ${trials.length} trials with questions due`);
  
  for (const trial of trials) {
    if (!trial.storytellerPhone) {
      console.log('Skipping trial without storyteller phone:', trial.id);
      continue;
    }
    
    const question = getQuestionByIndex(trial.selectedAlbum, trial.currentQuestionIndex);
    
    if (!question) {
      console.error('No question found for trial:', trial.id, 'index:', trial.currentQuestionIndex);
      continue;
    }
    
    const questionMessage = `Here is your next question:

${question}

Take your time and reply with a voice note whenever you are ready.`;
    
    try {
      await sendTextMessageWithRetry(trial.storytellerPhone, questionMessage);
      
      await storage.updateFreeTrialDb(trial.id, {
        lastQuestionSentAt: new Date(),
        nextQuestionScheduledFor: null,
        reminderSentAt: null,
      });
      
      console.log('Sent scheduled question to trial:', trial.id);
    } catch (error) {
      console.error('Error sending scheduled question to trial:', trial.id, error);
      
      const retryTime = new Date(Date.now() + 60 * 60 * 1000);
      
      await storage.updateFreeTrialDb(trial.id, {
        nextQuestionScheduledFor: retryTime,
      });
      
      console.log('Rescheduled failed question send to:', retryTime);
    }
  }
}

export async function sendPendingReminders(): Promise<void> {
  const trials = await storage.getPendingReminders();
  
  console.log(`Found ${trials.length} trials needing reminders`);
  
  for (const trial of trials) {
    if (!trial.storytellerPhone) {
      console.log('Skipping trial without storyteller phone:', trial.id);
      continue;
    }
    
    const voiceNotes = await storage.getVoiceNotesByTrialId(trial.id);
    const hasAnsweredCurrentQuestion = voiceNotes.some(
      note => note.questionIndex === trial.currentQuestionIndex
    );
    
    if (hasAnsweredCurrentQuestion) {
      console.log('Trial already answered current question, skipping reminder:', trial.id);
      continue;
    }
    
    const question = getQuestionByIndex(trial.selectedAlbum, trial.currentQuestionIndex);
    
    if (!question) {
      console.error('No question found for trial:', trial.id, 'index:', trial.currentQuestionIndex);
      continue;
    }
    
    const reminderMessage = `Hi ${trial.storytellerName}, just a gentle reminder about the question I sent earlier:

${question}

Whenever you're ready, please share your story with a voice note. Take your time.`;
    
    try {
      await sendTextMessageWithRetry(trial.storytellerPhone, reminderMessage);
      
      await storage.updateFreeTrialDb(trial.id, {
        reminderSentAt: new Date(),
      });
      
      console.log('Sent reminder to trial:', trial.id);
    } catch (error) {
      console.error('Error sending reminder to trial:', trial.id, error);
    }
  }
}

export async function processScheduledTasks(): Promise<void> {
  if (isProcessing) {
    console.log('Scheduler already running, skipping this run');
    return;
  }
  
  isProcessing = true;
  
  try {
    console.log('Running scheduled tasks...');
    
    await sendScheduledQuestions();
    
    await sendPendingReminders();
    
    await processRetryReminders();
    
    console.log('Scheduled tasks completed');
  } catch (error) {
    console.error('Error processing scheduled tasks:', error);
  } finally {
    isProcessing = false;
  }
}

export function startScheduler(): void {
  console.log('Starting background scheduler');
  console.log('Scheduled tasks run every 5 minutes');
  console.log('NOTE: For production, consider using Render Cron Jobs for better reliability');
  
  // Run every 5 minutes
  // Cron format: minute hour day month weekday
  // '*/5 * * * *' = every 5 minutes
  cron.schedule('*/1 * * * *', async () => {
    await processScheduledTasks().catch(console.error);
  });
  
  // Run immediately on startup to catch any overdue messages
  processScheduledTasks().catch(console.error);
}
