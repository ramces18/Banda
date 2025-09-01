
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { adminDb, adminMessaging } from '@/lib/firebase-admin';

const SendNotificationSchema = z.object({
  title: z.string().describe('The title of the notification.'),
  body: z.string().describe('The body content of the notification.'),
  announcementId: z.string().describe('The ID of the announcement to link to.'),
});

export async function sendNotificationFlow(input: z.infer<typeof SendNotificationSchema>) {
  return sendNotification(input);
}

const sendNotification = ai.defineFlow(
  {
    name: 'sendNotificationFlow',
    inputSchema: SendNotificationSchema,
    outputSchema: z.object({
      successCount: z.number(),
      failureCount: z.number(),
    }),
  },
  async ({ title, body, announcementId }) => {
    if (!adminDb || !adminMessaging) {
        console.error("Admin SDK not initialized. Skipping notification.");
        return { successCount: 0, failureCount: 0 };
    }

    const usersSnapshot = await adminDb.collection('users').get();
    const tokens: string[] = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmTokens && Array.isArray(data.fcmTokens)) {
        tokens.push(...data.fcmTokens);
      }
    });

    if (tokens.length === 0) {
      console.log('No FCM tokens found. No notifications to send.');
      return { successCount: 0, failureCount: 0 };
    }
    
    // The web push notification payload
    const message = {
        notification: {
            title,
            body,
        },
        webpush: {
            notification: {
                icon: '/icon-192x192.png',
            },
            fcm_options: {
                link: `/dashboard/announcements/${announcementId}`
            }
        },
        tokens: tokens,
    };

    try {
      const response = await adminMessaging.sendEachForMulticast(message);
      console.log(`${response.successCount} messages were sent successfully`);
      console.log(`${response.failureCount} messages failed`);
      
      // Optional: Clean up invalid tokens
      const tokensToRemove: Promise<any>[] = [];
      response.responses.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending notification to', tokens[index], error);
          if (
            error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered'
          ) {
            // Logic to find the user and remove the token
          }
        }
      });
      await Promise.all(tokensToRemove);

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error('Error sending notifications:', error);
      return { successCount: 0, failureCount: tokens.length };
    }
  }
);
