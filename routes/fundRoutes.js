import express from "express";
import {
  createFund,
  getMyFunds,
  getAllFunds
} from "../controllers/fundController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Donor donates money
router.post("/", protect, authorize("donor"), createFund);

// Donor sees their donations
router.get("/my", protect, authorize("donor"), getMyFunds);

// Admin sees ALL donations
router.get("/", protect, authorize("admin"), getAllFunds);

export default router;
