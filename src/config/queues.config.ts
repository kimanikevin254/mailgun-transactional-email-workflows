import { Queue } from "bullmq";
import { redisConfig } from "./redis.config";

export const QUEUE_NAMES = {
    SHIPPING_NOTICATIONS: 'shipping-notifications',
};

export const JOB_NAMES = {
    SEND_NOTIFICATION: 'send-notification',
};

export const SHIPPING_NOTICATIONS_QUEUE = new Queue(QUEUE_NAMES.SHIPPING_NOTICATIONS, {
    connection: redisConfig
});