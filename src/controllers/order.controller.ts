import { Request, Response } from "express";
import { Order } from "../database/entity/order.entity";
import { AppDataSource } from "../database/data-source";
import { OrderStatus } from "../types";
import { Repository } from "typeorm";

export class OrderController {
    private orderRepository: Repository<Order>;

    constructor() {
        this.orderRepository = AppDataSource.getRepository(Order);
    }

    index = async (req: Request, res: Response) => {
        const orders = await this.orderRepository.find({ 
            select: {
                id: true,
                status: true,
                user: {
                    name: true,
                    email: true,
                },
            },
            relations: ['user'] 
        });
        res.render('admin', { orders })
    }

    updateOrderStatus = async (req: Request, res: Response) => {
        try {
            const { status }: { status: OrderStatus } = req.body;
            const orderId = Number(req.params.id);


            if (!orderId || !status) {
                res.status(400).json({ success: false, message: 'Missing required properties' });
                return;
            }

            // Validate the status
            const validStatuses: OrderStatus[] = ["shipped", "out_for_delivery", "delivered"];
            if (!validStatuses.includes(status)) {
                res.status(400).json({ message: `Invalid status: ${status}` });
                return;
            }

            // Make sure order exists
            const order = await this.orderRepository.findOne({ 
                where: { id: orderId },
                select: {
                    id: true,
                    trackingNumber: true,
                    status: true,
                    user: {
                        name: true,
                        email: true,
                    }
                },
                relations: ['user'], 
            });

            if (!order) {
                res.status(404).json({ success: false, message: 'Invalid order ID' });
                return;
            }

            // If order status has not changed, don't update and send notification
            if (order.status === status) {
                res.status(400).json({ success: false, message: 'Order status is already up-to-date' });
                return;
            }

            // Update order status in DB
            order.setStatus(status);
            await this.orderRepository.save(order);

            res.status(200).json({ success: true, updatedStatus: status, message: 'Order status updated successfully' })
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Something went wrong' });
        }
    }
}