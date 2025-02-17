import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { OrderStatus } from "../../types";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    trackingNumber: string;

    @Column()
    status: OrderStatus;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

    setStatus(newStatus: string) {
        const validStatuses: OrderStatus[] = ["shipped", "out_for_delivery", "delivered"];

        if (!validStatuses.includes(newStatus as OrderStatus)) {
            throw new Error(`Invalid order status: ${newStatus}`);
        }

        this.status = newStatus as OrderStatus;
    }
}