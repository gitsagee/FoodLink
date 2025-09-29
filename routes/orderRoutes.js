// routes/orderRoutes.js

import express from "express";

import { placeOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController.js"; 
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/", protect, getMyOrders); 
router.patch("/:id/status", protect, updateOrderStatus);

export default router;