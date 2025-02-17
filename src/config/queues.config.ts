import { Queue } from "bullmq";
import { redisConfig } from "./redis.config";

export const QUEUE_NAMES = {
    SHIPPING_NOTICATIONS: 'shipping-notifications',
};

export const ShippingNotificationsQueue = new Queue(QUEUE_NAMES.SHIPPING_NOTICATIONS, {
    connection: redisConfig
});