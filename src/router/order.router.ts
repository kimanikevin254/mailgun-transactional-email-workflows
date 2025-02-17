import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();

router.get('/', orderController.index);
router.patch('/orders/:id', orderController.updateOrderStatus);

export default router;