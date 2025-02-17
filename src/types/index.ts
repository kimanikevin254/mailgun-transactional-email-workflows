export type OrderStatus = "shipped" | "out_for_delivery" | "delivered";

export interface EmailTemplate {
    subject: string;
    html: string;
}