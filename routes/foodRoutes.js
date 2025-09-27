import express from "express";
import {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Donor adds food
router.post("/", protect, authorize("donor"), createFood);

// Anyone can view list
router.get("/", getFoods);
router.get("/:id", getFoodById);

// Donor/Admin can update or delete
router.put("/:id", protect, updateFood);
router.delete("/:id", protect, deleteFood);

export default router;
