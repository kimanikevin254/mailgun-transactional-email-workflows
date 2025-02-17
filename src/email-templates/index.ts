import { readFileSync } from "fs";
import { EmailTemplate, OrderStatus } from "../types";
import ejs from 'ejs';

export class EmailTemplateManager {
    private templates: Map<OrderStatus, EmailTemplate>

    constructor() {
        this.templates = new Map();
        this.loadTemplates()
    }

    private loadTemplates() {
        // Load each template for different statuses
        const statuses: OrderStatus[] = ["shipped", "out_for_delivery", "delivered"];
        const subjects: Record<OrderStatus, string> = {
            shipped: "Your Order is on the Way! 🚚",
            out_for_delivery: "Your Order is Arriving Today! 🎯",
            delivered: "Delivered! We Hope You Love It 💝"
        };

        statuses.forEach((status) => {
            const htmlTemplate = readFileSync(`src/email-templates/html/${status}.html`, 'utf-8');

            this.templates.set(status, {
                subject: subjects[status],
                html: htmlTemplate,
            })
        })
    }

    getTemplate(status: OrderStatus): EmailTemplate {
        const template = this.templates.get(status);
        if (!template) {
            throw new Error(`No template found for status: ${status}`);
        }
        return template;
    }

    // Method to render HTML and Text templates using EJS
    renderTemplate(templateString: string, data: Record<string, any>): string {
        return ejs.render(templateString, data); // Render the template with the provided data
    }
}