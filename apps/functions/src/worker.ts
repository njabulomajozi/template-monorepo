import { SQSEvent, SQSHandler } from 'aws-lambda';
import { logger } from './utils/logger';

export const handler: SQSHandler = async (event: SQSEvent) => {
  logger.info('Worker processing messages', { messageCount: event.Records.length });

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      logger.info('Processing message', { messageId: record.messageId, messageType: message.type });

      // Example: Process different message types
      switch (message.type) {
        case 'email':
          await processEmailMessage(message);
          break;
        case 'notification':
          await processNotificationMessage(message);
          break;
        default:
          logger.warn('Unknown message type', { messageType: message.type, messageId: record.messageId });
      }

      logger.info('Message processed successfully', { messageId: record.messageId });
    } catch (error) {
      logger.error('Error processing message', {
        messageId: record.messageId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      // In a real application, you might want to send to a dead letter queue
      throw error;
    }
  }
};

interface EmailMessage {
  type: 'email';
  to: string;
  subject: string;
  body: string;
}

interface NotificationMessage {
  type: 'notification';
  userId: string;
  title: string;
  message: string;
}

async function processEmailMessage(message: EmailMessage): Promise<void> {
  logger.info('Processing email message', { to: message.to, subject: message.subject });
  // Implement email sending logic here
  // Example: Use SES, SendGrid, etc.
}

async function processNotificationMessage(message: NotificationMessage): Promise<void> {
  logger.info('Processing notification message', { userId: message.userId, title: message.title });
  // Implement notification logic here
  // Example: Push notifications, SMS, etc.
}