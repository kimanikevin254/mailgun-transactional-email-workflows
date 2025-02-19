import { AppDataSource } from "./data-source";
import { Order } from "./entity/order.entity";
import { User } from "./entity/user.entity";

const userInfo = {
    name: '<YOUR-NAME>',
    email: '<YOUR-EMAIL-ADDRESS>'
} as User;

const orderInfo = {
    trackingNumber: 'TRACK12345',
    status: 'shipped',
} as Order;

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected!");

        // Create a sample user
        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOneBy({ email: userInfo.email });

        if (!user) {
            user = userRepository.create({
                name: userInfo.name,
                email: userInfo.email,
            });

            await userRepository.save(user);
            console.log("✅ User seeded:", user);
        }

        // Create a sample order
        const orderRepository = AppDataSource.getRepository(Order);
        const orderExists = await orderRepository.findOneBy({ trackingNumber: orderInfo.trackingNumber });

        if (!orderExists) {
            const order = orderRepository.create({
                trackingNumber: orderInfo.trackingNumber,
                status: orderInfo.status, // Initial order status
                user: user, // Link order to the user
            });

            await orderRepository.save(order);
            console.log("✅ Order seeded:", order);
        }

        console.log("🌱 Seeding complete!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await AppDataSource.destroy();
        console.log("🔌 Database connection closed.");
        process.exit();
    }
}

seed()