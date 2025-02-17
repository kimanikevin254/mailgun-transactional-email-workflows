export type OrderStatus = "shipped" | "out_for_delivery" | "delivered";

export interface EmailTemplate {
    subject: string;
    html: string;
}

export interface NotificationJob {
    email: string;
    trackingNumber: string;
    status: OrderStatus;
    metadata?: Record<string, any>;
}