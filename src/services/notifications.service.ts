import { Job, Queue, Worker } from "bullmq";
import { QUEUE_NAMES, ShippingNotificationsQueue } from "../config/queues.config";
import { redisConfig } from "../config/redis.config";
import { mgClient } from "../config/mailgun.config";
import { IMailgunClient } from "mailgun.js/Interfaces";
import { OrderStatus } from "../types";
import { EmailTemplateManager } from "../email-templates";
import { MailgunMessageData } from "mailgun.js";

export interface NotificationJob {
    email: string;
    trackingNumber: string;
    status: OrderStatus;
    metadata?: Record<string, any>;
}

export class NotificationService {
    private queue: Queue;
    private mailgunClient: IMailgunClient;
    private templateManager: EmailTemplateManager;
    
    constructor() {
        this.queue = ShippingNotificationsQueue;
        this.mailgunClient = mgClient;
        this.templateManager = new EmailTemplateManager();
        this.setupWorker();
    }

    private setupWorker() {
        const worker = new Worker(
            QUEUE_NAMES.SHIPPING_NOTICATIONS,
            async (job) => {
                console.log(`Processing job: ${job.id}`);
                await this.processNotification(job);
            },
            { 
                connection: redisConfig
            },
        );

        worker.on('completed', job => {
            console.log(`Job ${job.id} completed successfully`);
        });

        worker.on('failed', (job, error) => {
            console.log(`Job ${job?.id} failed`, error);
        });
    }

    private async processNotification(job: Job<NotificationJob>) {
        const { email, trackingNumber, status, metadata } = job.data;

        try {
            const template = this.templateManager.getTemplate(status);
            const emailData: MailgunMessageData = {
                from: process.env.MAIL_FROM,
                to: email,
                subject: template.subject,
                html: this.templateManager.renderTemplate(template.html, {
                    trackingNumber, ...metadata
                }),
            };

            await this.mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, emailData);
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }

    async queueNotification(data: NotificationJob) {
        await this.queue.add('send-notification', data, {
            // attempts: 5, // number of retry attempts before failing permanently
            // backoff: {
            //     type: 'exponential', // Retry using exponential backoff
            //     delay: 5000, // Delay in ms before retrying
            // }
        });
        console.log('Job queued successfully');
    }
}